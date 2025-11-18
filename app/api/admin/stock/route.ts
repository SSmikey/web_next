import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Stock, { IStock } from '@/models/Stock';

// GET all stock data
export async function GET() {
  try {
    await connectToDatabase();
    
    const stockData = await Stock.find({});
    
    // If no stock data exists, initialize with default values
    if (stockData.length === 0) {
      const defaultStockTypes = ['ปกติ', 'ขาวดำ', 'พิเศษ'];
      const defaultSizes = {
        SSS: 10, SS: 12, S: 8, M: 7, L: 5, XL: 4, '2XL': 6, '3XL': 9,
        '4XL': 11, '5XL': 7, '6XL': 3, '7XL': 2, '8XL': 3, '9XL': 6, '10XL': 8
      };
      
      const initialStock = await Promise.all(
        defaultStockTypes.map(type => 
          new Stock({
            type,
            sizes: type === 'ขาวดำ' 
              ? { ...defaultSizes, SSS: 14, SS: 15, S: 13, M: 12, L: 10, XL: 9, '2XL': 8, '3XL': 10, '4XL': 12, '5XL': 11, '6XL': 7, '7XL': 5, '8XL': 4, '9XL': 2, '10XL': 2 }
              : type === 'พิเศษ'
              ? { ...defaultSizes, SSS: 6, SS: 7, S: 5, M: 4, L: 4, XL: 3, '2XL': 6, '3XL': 8, '4XL': 9, '5XL': 6, '6XL': 4, '7XL': 3, '8XL': 2, '9XL': 5, '10XL': 6 }
              : defaultSizes
          }).save()
        )
      );
      
      return NextResponse.json({
        success: true,
        data: initialStock,
        message: 'Stock data initialized successfully'
      });
    }
    
    return NextResponse.json({
      success: true,
      data: stockData,
      message: 'Stock data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}

// UPDATE stock data
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { stockUpdates } = body;
    
    if (!stockUpdates || !Array.isArray(stockUpdates)) {
      return NextResponse.json(
        { success: false, message: 'Invalid stock data format' },
        { status: 400 }
      );
    }
    
    const updatedStock = await Promise.all(
      stockUpdates.map(async (update) => {
        const { type, sizes } = update;
        
        if (!type || !sizes) {
          throw new Error(`Invalid stock update data for type: ${type}`);
        }
        
        return await Stock.findOneAndUpdate(
          { type },
          { sizes },
          { new: true, upsert: true }
        );
      })
    );
    
    return NextResponse.json({
      success: true,
      data: updatedStock,
      message: 'Stock data updated successfully'
    });
  } catch (error) {
    console.error('Error updating stock data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update stock data' },
      { status: 500 }
    );
  }
}