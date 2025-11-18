import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { getGlobalPaymentSettings, updateGlobalPaymentSettings } from '../payment-settings';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(getGlobalPaymentSettings());
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

    const body = await request.json();
    const { bankName, accountName, accountNumber, qrCodeUrl } = body;

    // Validate input
    if (!bankName || !accountName || !accountNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update global payment settings
    const newSettings = {
      bankName,
      accountName,
      accountNumber,
      qrCodeUrl: qrCodeUrl || ''
    };

    updateGlobalPaymentSettings(newSettings);

    // In production, you would save this to database
    // For now, we'll store it in memory
    console.log('Payment settings updated:', newSettings);

    return NextResponse.json({
      message: 'Payment settings updated successfully',
      settings: newSettings
    });
  } catch (error) {
    console.error('Error updating payment settings:', error);
    return NextResponse.json({ error: 'Failed to update payment settings' }, { status: 500 });
  }
}