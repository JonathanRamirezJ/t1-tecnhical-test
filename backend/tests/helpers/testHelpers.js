const User = require('../../src/models/User');
const ComponentTracking = require('../../src/models/ComponentTracking');
const { generateToken } = require('../../src/utils/jwt');

// Test user data
const testUserData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Test123456',
};

const testAdminData = {
  name: 'Test Admin',
  email: 'admin@example.com',
  password: 'Admin123456',
  role: 'admin',
};

// Create test user
const createTestUser = async (userData = testUserData) => {
  const user = await User.create(userData);
  const token = generateToken({ id: user._id });
  return { user, token };
};

// Create test admin
const createTestAdmin = async () => {
  const admin = await User.create(testAdminData);
  const token = generateToken({ id: admin._id });
  return { admin, token };
};

// Create test tracking data
const createTestTracking = async (userId = null) => {
  const trackingData = {
    componentName: 'Button',
    variant: 'primary',
    action: 'click',
    sessionId: 'test-session-123',
    metadata: {
      userAgent: 'Test Agent',
      url: 'https://test.com',
    },
  };

  if (userId) {
    trackingData.userId = userId;
  }

  return await ComponentTracking.create(trackingData);
};

// Create multiple tracking records
const createMultipleTrackingRecords = async (count = 5, userId = null) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const record = await createTestTracking(userId);
    records.push(record);
  }
  return records;
};

// Test data for component tracking
const validTrackingData = {
  componentName: 'Button',
  variant: 'primary',
  action: 'click',
  sessionId: 'test-session-456',
  metadata: {
    userAgent: 'Mozilla/5.0 Test Browser',
    screenResolution: {
      width: 1920,
      height: 1080,
    },
    viewport: {
      width: 1200,
      height: 800,
    },
    url: 'https://example.com/test',
    referrer: 'https://google.com',
    customData: {
      buttonText: 'Test Button',
      formId: 'test-form',
    },
  },
  performance: {
    loadTime: 150,
    renderTime: 25,
    interactionTime: 5,
  },
  location: {
    country: 'Mexico',
    region: 'CDMX',
    city: 'Ciudad de México',
    timezone: 'America/Mexico_City',
  },
};

module.exports = {
  testUserData,
  testAdminData,
  createTestUser,
  createTestAdmin,
  createTestTracking,
  createMultipleTrackingRecords,
  validTrackingData,
};
