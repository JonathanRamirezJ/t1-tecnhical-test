const request = require('supertest');
const app = require('./testServer');
const ComponentTracking = require('../src/models/ComponentTracking');
const {
  createTestUser,
  createTestAdmin,
  createTestTracking,
  createMultipleTrackingRecords,
  validTrackingData,
} = require('./helpers/testHelpers');

describe('Component Tracking Endpoints', () => {
  describe('POST /api/components/track', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
      const { user, token } = await createTestUser();
      testUser = user;
      authToken = token;
    });

    it('should track component interaction successfully', async () => {
      const response = await request(app)
        .post('/api/components/track')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validTrackingData)
        .expect(201);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.message).toContain('registrada');
      expect(response.body.data.tracking).toHaveProperty(
        'componentName',
        validTrackingData.componentName
      );
      expect(response.body.data.tracking).toHaveProperty(
        'variant',
        validTrackingData.variant
      );
      expect(response.body.data.tracking).toHaveProperty(
        'action',
        validTrackingData.action
      );
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .post('/api/components/track')
        .send(validTrackingData)
        .expect(401);

      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Token');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        componentName: '', // Empty name
        variant: 'primary',
        action: 'invalid-action', // Invalid action
      };

      const response = await request(app)
        .post('/api/components/track')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body).toHaveProperty('validationErrors');
    });
  });

  describe('GET /api/components/stats', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
      const { user, token } = await createTestUser();
      testUser = user;
      authToken = token;

      // Create some test tracking data
      await createMultipleTrackingRecords(5, user._id);
    });

    it('should get statistics successfully', async () => {
      const response = await request(app)
        .get('/api/components/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('summary');
      expect(response.body.data).toHaveProperty('basicStats');
      expect(response.body.data).toHaveProperty('dailyStats');
      expect(response.body.data).toHaveProperty('topComponents');
      expect(response.body.data).toHaveProperty('topActions');
      expect(response.body.data).toHaveProperty('recentInteractions');
      expect(response.body.data.summary.totalInteractions).toBeGreaterThan(0);
    });

    it('should filter statistics by component name', async () => {
      const response = await request(app)
        .get('/api/components/stats?componentName=Button')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data.summary.totalInteractions).toBeGreaterThan(0);
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/api/components/stats')
        .expect(401);

      expect(response.body).toHaveProperty('status', 'fail');
    });
  });

  describe('GET /api/components/stats/realtime', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
      const { user, token } = await createTestUser();
      testUser = user;
      authToken = token;

      // Create recent tracking data
      await createMultipleTrackingRecords(3, user._id);
    });

    it('should get real-time statistics successfully', async () => {
      const response = await request(app)
        .get('/api/components/stats/realtime')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('realTime');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data.realTime).toHaveProperty('lastHour');
      expect(response.body.data.realTime).toHaveProperty('lastDay');
      expect(response.body.data.realTime).toHaveProperty('minutelyActivity');
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/api/components/stats/realtime')
        .expect(401);

      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should include correct data structure', async () => {
      const response = await request(app)
        .get('/api/components/stats/realtime')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const { lastHour, lastDay } = response.body.data.realTime;

      expect(lastHour).toHaveProperty('totalInteractions');
      expect(lastHour).toHaveProperty('uniqueComponents');
      expect(lastHour).toHaveProperty('uniqueSessions');

      expect(lastDay).toHaveProperty('totalInteractions');
      expect(lastDay).toHaveProperty('uniqueComponents');
      expect(lastDay).toHaveProperty('uniqueSessions');
    });
  });

  describe('GET /api/components/:componentName/details', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
      const { user, token } = await createTestUser();
      testUser = user;
      authToken = token;

      // Create tracking data for specific component
      await createMultipleTrackingRecords(3, user._id);
    });

    it('should get component details successfully', async () => {
      const response = await request(app)
        .get('/api/components/Button/details')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('componentName', 'Button');
      expect(response.body.data).toHaveProperty('variants');
      expect(response.body.data).toHaveProperty('dailyUsage');
    });

    it('should filter by date range', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date();

      const response = await request(app)
        .get(
          `/api/components/Button/details?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        )
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('componentName', 'Button');
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/api/components/Button/details')
        .expect(401);

      expect(response.body).toHaveProperty('status', 'fail');
    });
  });

  describe('GET /api/components/export', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
      const { user, token } = await createTestUser();
      testUser = user;
      authToken = token;

      // Create tracking data for export
      await createMultipleTrackingRecords(5, user._id);
    });

    it('should export data as CSV successfully', async () => {
      const response = await request(app)
        .get('/api/components/export?format=csv')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('attachment');
    });

    it('should export data as JSON successfully', async () => {
      const response = await request(app)
        .get('/api/components/export?format=json')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('application/json');
      expect(response.headers['content-disposition']).toContain('attachment');
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/api/components/export')
        .expect(401);

      expect(response.body).toHaveProperty('status', 'fail');
    });

    it('should return error when no data to export', async () => {
      // Clear all tracking data
      await ComponentTracking.deleteMany({});

      const response = await request(app)
        .get('/api/components/export')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('datos');
    });

    it('should filter export by component name', async () => {
      const response = await request(app)
        .get('/api/components/export?format=json&componentName=Button')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('application/json');
    });

    it('should filter export by date range', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date();

      const response = await request(app)
        .get(
          `/api/components/export?format=json&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        )
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('application/json');
    });
  });
});
