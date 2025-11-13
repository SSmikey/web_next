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
    connection = await mongoose.connect(MONGODB_URI);
    return connection;
  } catch (error) {
    connection = null;
    throw error;
  }
}

export default connectToDatabase;