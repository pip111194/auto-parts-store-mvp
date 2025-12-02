const User = require('../models/User');

/**
 * Create default admin user if not exists
 */
const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      const adminData = {
        name: process.env.DEFAULT_ADMIN_NAME || 'Admin User',
        email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@autoparts.com',
        password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
        role: 'admin',
        isActive: true
      };

      await User.create(adminData);
      console.log('✅ Default admin user created successfully');
      console.log(`📧 Email: ${adminData.email}`);
      console.log(`🔑 Password: ${adminData.password}`);
      console.log('⚠️  Please change the password after first login!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

module.exports = seedAdmin;
