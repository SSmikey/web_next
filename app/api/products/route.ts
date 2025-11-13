import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';

// GET all products
export async function GET() {
  try {
    await connectToDatabase();
    
    const products = await Product.find({});
    
    return NextResponse.json({
      success: true,
      data: products,
      message: 'Products retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST a new product
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { name, description, price, category, imageUrl, inStock } = body;
    
    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new product
    const newProduct: IProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl: imageUrl || '',
      inStock: inStock !== undefined ? inStock : true,
    });
    
    await newProduct.save();
    
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}