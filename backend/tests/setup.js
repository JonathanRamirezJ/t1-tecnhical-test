const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Configure environment variables before any imports
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_for_testing';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NO_AUTO_START = 'true'; // Prevent server auto-start

// Global test configuration
beforeAll(async () => {
  try {
    // Disconnect from any existing connections
    await mongoose.disconnect();

    // Start in-memory MongoDB instance with custom database name
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 't1_technical_test',
      },
    });
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);

    console.log('✅ Test database "t1_technical_test" connected');
  } catch (error) {
    console.error('❌ Test database connection failed:', error);
    throw error;
  }
}, 60000);

afterAll(async () => {
  try {
    // Close MongoDB connection and stop server
    await mongoose.disconnect();

    if (mongoServer) {
      await mongoServer.stop();
    }

    console.log('✅ Test database "t1_technical_test" disconnected');
  } catch (error) {
    console.error('❌ Test cleanup failed:', error);
  }
}, 30000);

// Clean database before each test
beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});

// Clean up after each test
afterEach(async () => {
  // Clear any timers or async operations
  jest.clearAllTimers();
  jest.clearAllMocks();
});
