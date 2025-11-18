import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

// GET featured products
export async function GET() {
  try {
    await connectToDatabase();
    
    // Find products that are in stock and limit to 6 items
    const featuredProducts = await Product.find({ inStock: true })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(6);
    
    return NextResponse.json({
      success: true,
      data: featuredProducts,
      message: 'Featured products retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
}