import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orderId = params.id;
    
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
        { error: "Unauthorized to cancel this order" },
        { status: 403 }
      );
    }
    
    // Check if the order can be cancelled (only pending orders)
    if (order.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending orders can be cancelled" },
        { status: 400 }
      );
    }
    
    // Update order status to cancelled
    order.status = "cancelled";
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        status: order.status
      }
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orderId = params.id;
    
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
        { error: "Unauthorized to view this order" },
        { status: 403 }
      );
    }
    
    // Transform order to match expected format
    const transformedOrder = {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      date: order.orderDate.toISOString().split('T')[0],
      status: order.status,
      total: order.totalAmount + order.shippingCost,
      items: order.items.map((item: any) => ({
        id: item._id || Math.random().toString(),
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.imageUrl || "👕"
      })),
      customerInfo: order.customerInfo,
      shippingCost: order.shippingCost,
      totalAmount: order.totalAmount,
      shippingMethod: order.shippingMethod
    };
    
    return NextResponse.json({
      order: transformedOrder
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}