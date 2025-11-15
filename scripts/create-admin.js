const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
async function connectToDatabase() {
  if (mongoose.connections[0].readyState) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  await mongoose.connect(mongoUri, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log('Connected to MongoDB');
}

// User Schema with password hashing
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdminUser() {
  try {
    await connectToDatabase();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      console.log('Email:', adminEmail);
      console.log('Note: Use the password you set during creation');
      return;
    }

    // Create admin user (password will be hashed automatically)
    const adminUser = new User({
      name: 'Admin User',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('✓ Admin user created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: ' + adminEmail);
    console.log('Password: ' + adminPassword);
    console.log('\n⚠️  Password is hashed in database for security');
    console.log('Only use these credentials to login. Do not share the plain text password.');

  } catch (error) {
    console.error('✗ Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser().then(() => {
  console.log('\n✓ Script completed successfully');
  process.exit(0);
}).catch((error) => {
  console.error('✗ Script failed:', error);
  process.exit(1);
});