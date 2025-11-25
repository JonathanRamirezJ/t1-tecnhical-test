const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log(
        '⚠️  Ya existe un usuario administrador:',
        existingAdmin.email
      );
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'Administrador',
      email: 'admin@t1tracking.com',
      password: 'Admin123456',
      role: 'admin',
    };

    const admin = await User.create(adminData);
    console.log('✅ Usuario administrador creado exitosamente:');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Contraseña: Admin123456');
    console.log(
      '⚠️  IMPORTANTE: Cambia la contraseña después del primer login'
    );
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Execute if called directly
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser;
