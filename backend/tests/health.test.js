const request = require('supertest');
const app = require('./testServer');

describe('Health Check Endpoint', () => {
  describe('GET /api/health', () => {
    it('should return health status successfully', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');

      // Validate timestamp format
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);

      // Validate uptime is a number
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);

      // Validate environment
      expect(response.body.environment).toBe('test');
    });

    it('should return consistent response structure', async () => {
      const response1 = await request(app).get('/api/health');
      const response2 = await request(app).get('/api/health');

      // Both responses should have the same structure
      expect(Object.keys(response1.body)).toEqual(Object.keys(response2.body));

      // Uptime should increase between calls
      expect(response2.body.uptime).toBeGreaterThanOrEqual(
        response1.body.uptime
      );
    });

    it('should be accessible without authentication', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
    });
  });

  describe('GET /api/nonexistent', () => {
    it('should return 404 for non-existent endpoints', async () => {
      const response = await request(app).get('/api/nonexistent').expect(404);

      expect(response.body).toHaveProperty('error', 'Endpoint no encontrado');
      expect(response.body).toHaveProperty('path', '/api/nonexistent');
      expect(response.body).toHaveProperty('method', 'GET');
    });

    it('should return 404 for non-existent POST endpoints', async () => {
      const response = await request(app)
        .post('/api/invalid-endpoint')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Endpoint no encontrado');
      expect(response.body).toHaveProperty('path', '/api/invalid-endpoint');
      expect(response.body).toHaveProperty('method', 'POST');
    });

    it('should return 404 for root path', async () => {
      const response = await request(app).get('/').expect(404);

      expect(response.body).toHaveProperty('error', 'Endpoint no encontrado');
      expect(response.body).toHaveProperty('path', '/');
      expect(response.body).toHaveProperty('method', 'GET');
    });
  });
});
