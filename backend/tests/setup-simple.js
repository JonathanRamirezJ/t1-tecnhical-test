const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Configure environment variables first
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_for_testing';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NO_AUTO_START = 'true';

// Setup database connection
const setupDatabase = async () => {
  // Close any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  // Start MongoDB Memory Server with custom database name
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 't1_technical_test',
    },
  });
  const mongoUri = mongoServer.getUri();

  // Set the URI for the app to use
  process.env.MONGODB_URI = mongoUri;

  // Connect mongoose
  await mongoose.connect(mongoUri);

  return mongoUri;
};

// Cleanup database
const cleanupDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
};

// Clear all collections
const clearDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
};

module.exports = {
  setupDatabase,
  cleanupDatabase,
  clearDatabase,
};
