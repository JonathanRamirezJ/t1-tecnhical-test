const mongoose = require('mongoose');

const componentTrackingSchema = new mongoose.Schema(
  {
    componentName: {
      type: String,
      required: [true, 'El nombre del componente es requerido'],
      trim: true,
      maxlength: [
        100,
        'El nombre del componente no puede exceder 100 caracteres',
      ],
    },
    variant: {
      type: String,
      required: [true, 'La variante del componente es requerida'],
      trim: true,
      maxlength: [50, 'La variante no puede exceder 50 caracteres'],
    },
    action: {
      type: String,
      required: [true, 'La acción es requerida'],
      enum: [
        'click',
        'hover',
        'focus',
        'blur',
        'change',
        'submit',
        'load',
        'scroll',
        'resize',
        'custom',
      ],
      default: 'click',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    sessionId: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, 'El sessionId no puede exceder 100 caracteres'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    metadata: {
      userAgent: {
        type: String,
        maxlength: [500, 'El userAgent no puede exceder 500 caracteres'],
      },
      screenResolution: {
        width: Number,
        height: Number,
      },
      viewport: {
        width: Number,
        height: Number,
      },
      url: {
        type: String,
        maxlength: [500, 'La URL no puede exceder 500 caracteres'],
      },
      referrer: {
        type: String,
        maxlength: [500, 'El referrer no puede exceder 500 caracteres'],
      },
      customData: {
        type: mongoose.Schema.Types.Mixed,
        validate: {
          validator: function (v) {
            return JSON.stringify(v).length <= 1000;
          },
          message:
            'Los datos personalizados no pueden exceder 1000 caracteres cuando se serializan',
        },
      },
    },
    performance: {
      loadTime: Number,
      renderTime: Number,
      interactionTime: Number,
    },
    location: {
      country: String,
      region: String,
      city: String,
      timezone: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to optimize queries
componentTrackingSchema.index({ componentName: 1, timestamp: -1 });
componentTrackingSchema.index({ variant: 1, timestamp: -1 });
componentTrackingSchema.index({ action: 1, timestamp: -1 });
componentTrackingSchema.index({ timestamp: -1 });
componentTrackingSchema.index({ sessionId: 1 });
componentTrackingSchema.index({ userId: 1, timestamp: -1 });
componentTrackingSchema.index({
  componentName: 1,
  variant: 1,
  action: 1,
  timestamp: -1,
});

// Static method to get basic statistics
componentTrackingSchema.statics.getBasicStats = async function (filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: {
          componentName: '$componentName',
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
        _id: {
          componentName: '$_id.componentName',
          variant: '$_id.variant',
        },
        totalInteractions: { $sum: '$count' },
        actions: {
          $push: {
            action: '$_id.action',
            count: '$count',
          },
        },
        lastUsed: { $max: '$lastUsed' },
        firstUsed: { $min: '$firstUsed' },
      },
    },
    {
      $group: {
        _id: '$_id.componentName',
        totalInteractions: { $sum: '$totalInteractions' },
        variants: {
          $push: {
            variant: '$_id.variant',
            interactions: '$totalInteractions',
            actions: '$actions',
            lastUsed: '$lastUsed',
            firstUsed: '$firstUsed',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        componentName: '$_id',
        totalInteractions: 1,
        variants: 1,
      },
    },
    { $sort: { totalInteractions: -1 } },
  ];

  return this.aggregate(pipeline);
};

// Static method to get statistics by time period
componentTrackingSchema.statics.getStatsByPeriod = async function (
  period = 'day',
  limit = 30
) {
  const groupBy = {
    day: {
      year: { $year: '$timestamp' },
      month: { $month: '$timestamp' },
      day: { $dayOfMonth: '$timestamp' },
    },
    hour: {
      year: { $year: '$timestamp' },
      month: { $month: '$timestamp' },
      day: { $dayOfMonth: '$timestamp' },
      hour: { $hour: '$timestamp' },
    },
    month: {
      year: { $year: '$timestamp' },
      month: { $month: '$timestamp' },
    },
  };

  const pipeline = [
    { $sort: { timestamp: -1 } },
    { $limit: limit * 1000 }, // Limitar datos para evitar sobrecarga
    {
      $group: {
        _id: groupBy[period] || groupBy.day,
        count: { $sum: 1 },
        uniqueComponents: { $addToSet: '$componentName' },
        uniqueVariants: {
          $addToSet: { component: '$componentName', variant: '$variant' },
        },
      },
    },
    {
      $project: {
        _id: 0,
        period: '$_id',
        count: 1,
        uniqueComponentsCount: { $size: '$uniqueComponents' },
        uniqueVariantsCount: { $size: '$uniqueVariants' },
      },
    },
    {
      $sort: {
        'period.year': -1,
        'period.month': -1,
        'period.day': -1,
        'period.hour': -1,
      },
    },
    { $limit: limit },
  ];

  return this.aggregate(pipeline);
};

module.exports = mongoose.model('ComponentTracking', componentTrackingSchema);
