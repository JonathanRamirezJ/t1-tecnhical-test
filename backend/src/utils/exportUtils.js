const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

// Create exports directory if it doesn't exist
const exportsDir = path.join(__dirname, '../../exports');
try {
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }
} catch (error) {
  console.error('Error creando directorio de exports:', error);
}

const generateCSV = async (data, filename = 'export') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const csvPath = path.join(exportsDir, `${filename}_${timestamp}.csv`);

  if (!data || data.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  // Define headers based on first object
  const headers = Object.keys(data[0]).map(key => ({
    id: key,
    title:
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
  }));

  const csvWriter = createCsvWriter({
    path: csvPath,
    header: headers,
    encoding: 'utf8',
  });

  await csvWriter.writeRecords(data);
  return csvPath;
};

const generateJSON = async (data, filename = 'export') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = path.join(exportsDir, `${filename}_${timestamp}.json`);

  const exportData = {
    exportDate: new Date().toISOString(),
    totalRecords: data.length,
    data: data,
  };

  fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2), 'utf8');
  return jsonPath;
};

const flattenTrackingData = trackingData => {
  return trackingData.map(item => ({
    id: item._id,
    componentName: item.componentName,
    variant: item.variant,
    action: item.action,
    timestamp: item.timestamp,
    sessionId: item.sessionId || '',
    userId: item.userId || '',
    userAgent: item.metadata?.userAgent || '',
    screenWidth: item.metadata?.screenResolution?.width || '',
    screenHeight: item.metadata?.screenResolution?.height || '',
    viewportWidth: item.metadata?.viewport?.width || '',
    viewportHeight: item.metadata?.viewport?.height || '',
    url: item.metadata?.url || '',
    referrer: item.metadata?.referrer || '',
    loadTime: item.performance?.loadTime || '',
    renderTime: item.performance?.renderTime || '',
    interactionTime: item.performance?.interactionTime || '',
    country: item.location?.country || '',
    region: item.location?.region || '',
    city: item.location?.city || '',
    timezone: item.location?.timezone || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
};

const cleanupOldExports = (daysToKeep = 7) => {
  try {
    const files = fs.readdirSync(exportsDir);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    files.forEach(file => {
      const filePath = path.join(exportsDir, file);
      const stats = fs.statSync(filePath);

      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.error('Error limpiando exports antiguos:', error);
  }
};

// Function to get file size in readable format
const getFileSize = filePath => {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

  if (fileSizeInMegabytes < 1) {
    return `${(fileSizeInBytes / 1024).toFixed(2)} KB`;
  }
  return `${fileSizeInMegabytes.toFixed(2)} MB`;
};

module.exports = {
  generateCSV,
  generateJSON,
  flattenTrackingData,
  cleanupOldExports,
  getFileSize,
  exportsDir,
};
