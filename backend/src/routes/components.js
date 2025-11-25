const express = require('express');
const {
  trackComponent,
  getStats,
  getRealTimeStats,
  exportData,
  getComponentDetails,
} = require('../controllers/componentController');
const { auth, optionalAuth } = require('../middleware/auth');
const {
  validateComponentTracking,
  validateStatsQuery,
  validateExportQuery,
} = require('../middleware/validation');

const router = express.Router();

// Public routes (no authentication required)
router.post('/track', validateComponentTracking, trackComponent);
router.get('/stats', validateStatsQuery, getStats);
router.get('/stats/realtime', getRealTimeStats);

// Protected routes (require authentication)
router.get('/:componentName/details', auth, getComponentDetails);
router.get('/export', auth, validateExportQuery, exportData);

module.exports = router;
