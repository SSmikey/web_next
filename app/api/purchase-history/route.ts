import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Order, { IOrder } from "@/models/Order";

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
    const search = searchParams.get("search") || "";
    const timeFilter = searchParams.get("timeFilter") || "";
    const sortBy = searchParams.get("sortBy") || "date-desc";

    await connectToDatabase();
    
    // Build query
    const query: any = {};
    
    // If user is logged in, show their orders
    if (session.user?.id) {
      query.userId = session.user.id;
    }
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "items.productName": { $regex: search, $options: "i" } }
      ];
    }
    
    if (timeFilter) {
      const days = parseInt(timeFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      query.orderDate = { $gte: cutoffDate };
    }

    // Build sort options
    let sortOptions: any = { orderDate: -1 }; // Default: newest first
    
    switch (sortBy) {
      case "date-asc":
        sortOptions = { orderDate: 1 };
        break;
      case "total-desc":
        sortOptions = { totalAmount: -1 };
        break;
      case "total-asc":
        sortOptions = { totalAmount: 1 };
        break;
      case "status":
        sortOptions = { status: 1 };
        break;
      default:
        sortOptions = { orderDate: -1 };
    }

    // Get total count
    const total = await Order.countDocuments(query);
    
    // Get orders with pagination
    const orders = await Order.find(query)
      .sort(sortOptions)
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
      totalAmount: order.totalAmount,
      shippingCost: order.shippingCost,
      shippingMethod: order.shippingMethod,
      customerInfo: order.customerInfo,
      items: order.items.map((item: any) => ({
        id: item._id || Math.random().toString(),
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
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
    console.error("Error fetching purchase history:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase history" },
      { status: 500 }
    );
  }
}

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
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    if (!customerInfo) {
      return NextResponse.json(
        { error: "Customer information is required" },
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
      order: {
        id: newOrder._id.toString(),
        orderNumber: newOrder.orderNumber,
        status: newOrder.status,
        totalAmount: newOrder.totalAmount + newOrder.shippingCost,
        items: newOrder.items
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