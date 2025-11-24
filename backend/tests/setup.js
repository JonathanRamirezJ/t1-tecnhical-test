const mongoose = require('mongoose');

// Configuración global para tests
beforeAll(async () => {
  // Configurar variables de entorno para tests
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/t1-tracking-test';
});

afterAll(async () => {
  // Cerrar conexión de MongoDB después de todos los tests
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

// Limpiar base de datos antes de cada test
beforeEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});
