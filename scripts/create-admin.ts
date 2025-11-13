import connectToDatabase from '../lib/mongodb';
import User from '../models/User';

async function createAdminUser() {
  try {
    await connectToDatabase();
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // In production, this should be hashed
      role: 'admin',
    });
    
    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser().then(() => {
  console.log('Script completed');
}).catch((error) => {
  console.error('Script failed:', error);
});