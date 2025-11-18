import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    const { 
      customerInfo, 
      items, 
      totalAmount, 
      shippingCost, 
      shippingMethod 
    } = await request.json();
    
    // Validate required fields
    if (!customerInfo || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: customerInfo and items are required" },
        { status: 400 }
      );
    }

    // Validate customer info
    const { firstName, lastName, email, phone, address } = customerInfo;
    if (!firstName || !lastName || !email || !phone || !address) {
      return NextResponse.json(
        { error: "Missing required customer information fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate shipping method
    if (!shippingMethod || !['mail', 'pickup'].includes(shippingMethod)) {
      return NextResponse.json(
        { error: "Invalid shipping method" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Create new order
    const newOrder = new Order({
      userId: session?.user?.id || undefined,
      customerInfo,
      items,
      totalAmount,
      shippingCost,
      shippingMethod,
      status: "pending",
      orderDate: new Date(),
    });
    
    await newOrder.save();
    
    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: {
        id: newOrder._id.toString(),
        orderNumber: newOrder.orderNumber,
        status: newOrder.status,
        totalAmount: newOrder.totalAmount + newOrder.shippingCost,
        items: newOrder.items,
        customerInfo: {
          firstName: newOrder.customerInfo.firstName,
          lastName: newOrder.customerInfo.lastName,
          email: newOrder.customerInfo.email,
        }
      }
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "";

    await connectToDatabase();
    
    // Build query
    const query: any = { userId: session.user?.id };
    
    if (status && status !== "all") {
      query.status = status;
    }

    // Get total count
    const total = await Order.countDocuments(query);
    
    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Transform orders to match expected format
    const transformedOrders = orders.map((order: any) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      date: order.orderDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      status: order.status,
      total: order.totalAmount + order.shippingCost,
      items: order.items.map((item: any) => ({
        id: item._id || Math.random().toString(),
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.imageUrl || "👕"
      }))
    }));

    return NextResponse.json({
      orders: transformedOrders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}