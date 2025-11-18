import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

type ResponseData = {
  success: boolean;
  message: string;
  details?: Record<string, any>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    await connectToDatabase();

    // Delete existing admin user if exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      await User.deleteOne({ email: 'admin@example.com' });
      console.log('Deleted existing admin user');
    }

    // Create new admin user with hashed password
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    await adminUser.save();

    res.status(200).json({
      success: true,
      message: 'Admin user created successfully!',
      details: {
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        note: 'Password will be hashed automatically in database',
      },
    });
  } catch (error: any) {
    console.error('Setup admin error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create admin user',
    });
  }
}
