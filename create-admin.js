
require('./models/config');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Username: admin');
      console.log('Password: admin123');
      process.exit(0);
    }
    
    // Create new admin user
    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@example.com',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      phone: '123456789',
      country: 'Saudi Arabia'
    });
    
    await adminUser.save();
    
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
