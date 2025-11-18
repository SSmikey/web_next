import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PaymentSettings from '@/models/PaymentSettings';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get payment settings from database
    let paymentSettings = await PaymentSettings.findOne();
    
    // If no settings in database, return default values
    if (!paymentSettings) {
      paymentSettings = {
        bankName: "ธนาคารกสิกรไทย",
        accountName: "สมชาย ใจดี",
        accountNumber: "123-456-7890",
        qrCodeImage: "/images/QR code for ordering.png"
      };
    }

    return NextResponse.json(paymentSettings);
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    return NextResponse.json({ error: 'Failed to fetch payment settings' }, { status: 500 });
  }
}