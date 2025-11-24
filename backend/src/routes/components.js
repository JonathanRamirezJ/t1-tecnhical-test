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

// Protected routes (require authentication)
router.post('/track', auth, validateComponentTracking, trackComponent);
router.get('/stats', auth, validateStatsQuery, getStats);
router.get('/stats/realtime', auth, getRealTimeStats);
router.get('/:componentName/details', auth, getComponentDetails);
router.get('/export', auth, validateExportQuery, exportData);

module.exports = router;
