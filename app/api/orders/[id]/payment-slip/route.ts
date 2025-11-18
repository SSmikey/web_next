import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;
    
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Find the order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    // Check if the order belongs to the current user
    if (order.userId && order.userId !== session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized to update this order" },
        { status: 403 }
      );
    }
    
    // Check if the order can be updated (only pending or waiting_payment orders)
    if (!['pending', 'waiting_payment'].includes(order.status)) {
      return NextResponse.json(
        { error: "Cannot upload payment slip for this order" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('paymentSlip') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "Payment slip file is required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'payment-slips');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `payment-slip-${orderId}-${timestamp}-${randomString}.${fileExtension}`;
    const filepath = path.join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Update order with payment slip information
    order.paymentSlip = {
      url: `/uploads/payment-slips/${filename}`,
      uploadedAt: new Date()
    };
    
    // Update order status to waiting_payment if it was pending
    if (order.status === 'pending') {
      order.status = 'waiting_payment';
    }
    
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: "Payment slip uploaded successfully",
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        status: order.status,
        paymentSlip: order.paymentSlip
      }
    });
  } catch (error) {
    console.error("Error uploading payment slip:", error);
    return NextResponse.json(
      { error: "Failed to upload payment slip" },
      { status: 500 }
    );
  }
}