import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { getGlobalPaymentSettings, updateGlobalPaymentSettings } from '../payment-settings';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import connectToDatabase from '@/lib/mongodb';
import PaymentSettings from '@/models/PaymentSettings';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Try to get payment settings from database first
    let paymentSettings = await PaymentSettings.findOne();
    
    // If no settings in database, fall back to global settings
    if (!paymentSettings) {
      paymentSettings = getGlobalPaymentSettings();
    }

    return NextResponse.json(paymentSettings);
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    return NextResponse.json({ error: 'Failed to fetch payment settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type');
    let bankName = '';
    let accountName = '';
    let accountNumber = '';
    let qrCodeImage = '';

    if (contentType?.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      bankName = formData.get('bankName') as string;
      accountName = formData.get('accountName') as string;
      accountNumber = formData.get('accountNumber') as string;
      const qrCodeFile = formData.get('qrCodeImage') as File;

      // Validate input
      if (!bankName || !accountName || !accountNumber) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // Handle QR code image upload
      if (qrCodeFile && qrCodeFile.size > 0) {
        const bytes = await qrCodeFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create unique filename
        const timestamp = Date.now();
        const filename = `qr-code-${timestamp}-${qrCodeFile.name}`;
        const filepath = join(process.cwd(), 'public', 'uploads', 'qr-codes', filename);
        
        // Ensure directory exists
        const fs = require('fs');
        const dir = join(process.cwd(), 'public', 'uploads', 'qr-codes');
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Write file
        await writeFile(filepath, buffer);
        qrCodeImage = `/uploads/qr-codes/${filename}`;
      }
    } else {
      // Handle JSON request (for backward compatibility)
      const body = await request.json();
      bankName = body.bankName;
      accountName = body.accountName;
      accountNumber = body.accountNumber;
      qrCodeImage = body.qrCodeImage || '';

      // Validate input
      if (!bankName || !accountName || !accountNumber) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
    }

    await connectToDatabase();
    
    // Update payment settings in database
    const newSettings = {
      bankName,
      accountName,
      accountNumber,
      qrCodeImage
    };

    // Use findOneAndUpdate with upsert to create or update
    const updatedSettings = await PaymentSettings.findOneAndUpdate(
      {}, // Empty filter to match any document
      newSettings,
      {
        new: true, // Return the updated document
        upsert: true // Create if doesn't exist
      }
    );

    // Also update global settings for backward compatibility
    updateGlobalPaymentSettings(newSettings);

    console.log('Payment settings updated in database:', updatedSettings);

    return NextResponse.json({
      message: 'Payment settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating payment settings:', error);
    return NextResponse.json({ error: 'Failed to update payment settings' }, { status: 500 });
  }
}