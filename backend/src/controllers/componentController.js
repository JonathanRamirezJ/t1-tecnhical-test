const ComponentTracking = require('../models/ComponentTracking');
const { AppError } = require('../utils/appError');
const {
  generateCSV,
  generateJSON,
  flattenTrackingData,
  getFileSize,
} = require('../utils/exportUtils');
const logger = require('../utils/logger');
const fs = require('fs');

const trackComponent = async (req, res, next) => {
  try {
    const {
      componentName,
      variant,
      action = 'click',
      sessionId,
      metadata = {},
      performance = {},
      location = {},
    } = req.body;

    // Agregar userId si el usuario está autenticado (opcional para endpoints públicos)
    const trackingData = {
      componentName,
      variant,
      action,
      sessionId,
      metadata,
      performance,
      location,
    };

    // Solo agregar userId si el usuario está autenticado
    if (req.user && req.user._id) {
      trackingData.userId = req.user._id;
    }

    const tracking = await ComponentTracking.create(trackingData);

    logger.info(`Componente trackeado: ${componentName}/${variant}`, {
      trackingId: tracking._id,
      userId: req.user?._id,
      sessionId,
    });

    res.status(201).json({
      status: 'success',
      message: 'Interacción registrada exitosamente',
      data: {
        tracking: {
          id: tracking._id,
          componentName: tracking.componentName,
          variant: tracking.variant,
          action: tracking.action,
          timestamp: tracking.timestamp,
        },
      },
    });
  } catch (error) {
    logger.error('Error registrando tracking:', {
      error: error.message,
      componentName: req.body.componentName,
      userId: req.user?._id,
    });
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      componentName,
      variant,
      action,
      limit = 100,
      page = 1,
    } = req.query;

    // Construir filtros
    const filters = {};

    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp.$gte = new Date(startDate);
      if (endDate) filters.timestamp.$lte = new Date(endDate);
    }

    if (componentName) filters.componentName = componentName;
    if (variant) filters.variant = variant;
    if (action) filters.action = action;

    // Obtener estadísticas básicas
    const basicStats = await ComponentTracking.getBasicStats(filters);

    // Obtener estadísticas por período
    const dailyStats = await ComponentTracking.getStatsByPeriod('day', 30);

    // Obtener conteo total
    const totalInteractions = await ComponentTracking.countDocuments(filters);

    // Obtener interacciones recientes con paginación
    const skip = (page - 1) * limit;
    const recentInteractions = await ComponentTracking.find(filters)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('componentName variant action timestamp sessionId metadata.url')
      .lean();

    // Estadísticas adicionales
    const topComponents = await ComponentTracking.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$componentName',
          count: { $sum: 1 },
          lastUsed: { $max: '$timestamp' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const topActions = await ComponentTracking.aggregate([
      { $match: filters },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    logger.info('Estadísticas consultadas', {
      filters,
      totalResults: totalInteractions,
      userId: req.user?._id,
    });

    res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalInteractions,
          totalPages: Math.ceil(totalInteractions / limit),
          currentPage: parseInt(page),
          resultsPerPage: parseInt(limit),
        },
        basicStats,
        dailyStats,
        topComponents,
        topActions,
        recentInteractions,
      },
    });
  } catch (error) {
    logger.error('Error obteniendo estadísticas:', {
      error: error.message,
      userId: req.user?._id,
    });
    next(error);
  }
};

const getRealTimeStats = async (req, res, next) => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Estadísticas de la última hora
    const lastHourStats = await ComponentTracking.aggregate([
      { $match: { timestamp: { $gte: oneHourAgo } } },
      {
        $group: {
          _id: null,
          totalInteractions: { $sum: 1 },
          uniqueComponents: { $addToSet: '$componentName' },
          uniqueSessions: { $addToSet: '$sessionId' },
        },
      },
    ]);

    // Estadísticas del último día
    const lastDayStats = await ComponentTracking.aggregate([
      { $match: { timestamp: { $gte: oneDayAgo } } },
      {
        $group: {
          _id: null,
          totalInteractions: { $sum: 1 },
          uniqueComponents: { $addToSet: '$componentName' },
          uniqueSessions: { $addToSet: '$sessionId' },
        },
      },
    ]);

    // Actividad por minuto en la última hora
    const minutelyActivity = await ComponentTracking.aggregate([
      { $match: { timestamp: { $gte: oneHourAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
            hour: { $hour: '$timestamp' },
            minute: { $minute: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
          '_id.hour': 1,
          '_id.minute': 1,
        },
      },
    ]);

    const hourStats = lastHourStats[0] || {
      totalInteractions: 0,
      uniqueComponents: [],
      uniqueSessions: [],
    };
    const dayStats = lastDayStats[0] || {
      totalInteractions: 0,
      uniqueComponents: [],
      uniqueSessions: [],
    };

    res.status(200).json({
      status: 'success',
      data: {
        realTime: {
          lastHour: {
            totalInteractions: hourStats.totalInteractions,
            uniqueComponents: hourStats.uniqueComponents.length,
            uniqueSessions: hourStats.uniqueSessions.filter(s => s).length,
          },
          lastDay: {
            totalInteractions: dayStats.totalInteractions,
            uniqueComponents: dayStats.uniqueComponents.length,
            uniqueSessions: dayStats.uniqueSessions.filter(s => s).length,
          },
          minutelyActivity,
        },
        timestamp: now,
      },
    });
  } catch (error) {
    logger.error('Error obteniendo estadísticas en tiempo real:', {
      error: error.message,
    });
    next(error);
  }
};

const exportData = async (req, res, next) => {
  try {
    const {
      format = 'csv',
      startDate,
      endDate,
      componentName,
      variant,
      action,
    } = req.query;

    // Construir filtros
    const filters = {};

    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp.$gte = new Date(startDate);
      if (endDate) filters.timestamp.$lte = new Date(endDate);
    }

    if (componentName) filters.componentName = componentName;
    if (variant) filters.variant = variant;
    if (action) filters.action = action;

    // Obtener datos con límite para evitar sobrecarga
    const limit = 10000; // Máximo 10k registros por exportación
    const trackingData = await ComponentTracking.find(filters)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    if (!trackingData || trackingData.length === 0) {
      return next(
        new AppError(
          'No hay datos para exportar con los filtros especificados',
          404
        )
      );
    }

    // Aplanar datos para exportación
    const flattenedData = flattenTrackingData(trackingData);

    let filePath;
    let mimeType;
    let fileName;

    if (format === 'csv') {
      filePath = await generateCSV(flattenedData, 'component_tracking');
      mimeType = 'text/csv';
      fileName = `component_tracking_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      filePath = await generateJSON(trackingData, 'component_tracking');
      mimeType = 'application/json';
      fileName = `component_tracking_${new Date().toISOString().split('T')[0]}.json`;
    }

    const fileSize = getFileSize(filePath);

    logger.info(`Datos exportados: ${format.toUpperCase()}`, {
      userId: req.user._id,
      recordCount: trackingData.length,
      fileSize,
      filters,
    });

    // Configurar headers para descarga
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', mimeType);

    // Enviar archivo
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Limpiar archivo después de enviarlo
    fileStream.on('end', () => {
      setTimeout(() => {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          logger.error('Error eliminando archivo temporal:', {
            error: error.message,
          });
        }
      }, 5000); // Esperar 5 segundos antes de eliminar
    });
  } catch (error) {
    logger.error('Error exportando datos:', {
      error: error.message,
      userId: req.user?._id,
      format: req.query.format,
    });
    next(error);
  }
};

const getComponentDetails = async (req, res, next) => {
  try {
    const { componentName } = req.params;
    const { startDate, endDate } = req.query;

    const filters = { componentName };

    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp.$gte = new Date(startDate);
      if (endDate) filters.timestamp.$lte = new Date(endDate);
    }

    // Estadísticas detalladas del componente
    const componentStats = await ComponentTracking.aggregate([
      { $match: filters },
      {
        $group: {
          _id: {
            variant: '$variant',
            action: '$action',
          },
          count: { $sum: 1 },
          lastUsed: { $max: '$timestamp' },
          firstUsed: { $min: '$timestamp' },
        },
      },
      {
        $group: {
          _id: '$_id.variant',
          totalInteractions: { $sum: '$count' },
          actions: {
            $push: {
              action: '$_id.action',
              count: '$count',
              lastUsed: '$lastUsed',
              firstUsed: '$firstUsed',
            },
          },
        },
      },
      { $sort: { totalInteractions: -1 } },
    ]);

    // Uso por día
    const dailyUsage = await ComponentTracking.aggregate([
      { $match: filters },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      { $limit: 30 },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        componentName,
        variants: componentStats,
        dailyUsage,
      },
    });
  } catch (error) {
    logger.error('Error obteniendo detalles del componente:', {
      error: error.message,
      componentName: req.params.componentName,
    });
    next(error);
  }
};

module.exports = {
  trackComponent,
  getStats,
  getRealTimeStats,
  exportData,
  getComponentDetails,
};
