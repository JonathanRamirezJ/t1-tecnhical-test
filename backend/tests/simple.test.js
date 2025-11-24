const request = require('supertest');
const {
  setupDatabase,
  cleanupDatabase,
  clearDatabase,
} = require('./setup-simple');
const app = require('./testServer');

describe('Simple Test', () => {
  beforeAll(async () => {
    await setupDatabase();
  }, 30000);

  afterAll(async () => {
    await cleanupDatabase();
  }, 30000);

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment', 'test');
    });

    it('should return 404 for non-existent endpoint', async () => {
      const response = await request(app).get('/api/nonexistent').expect(404);

      expect(response.body).toHaveProperty('error', 'Endpoint no encontrado');
    });
  });
});
