import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Cache the connection to avoid reconnecting on every request
let connection: typeof mongoose | null = null;

async function connectToDatabase() {
  if (connection) {
    return connection;
  }

  try {
    connection = await mongoose.connect(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    return connection;
  } catch (error) {
    connection = null;
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectToDatabase;