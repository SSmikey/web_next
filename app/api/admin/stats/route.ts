import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Calculate total revenue (only from delivered orders)
    const revenueResult = await Order.aggregate([
      {
        $match: { status: "delivered" }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ["$totalAmount", "$shippingCost"] } }
        }
      }
    ]);
    
    // Get monthly revenue for the last 6 months
    const monthlyRevenue = await Order.aggregate([
      {
        $match: { 
          status: "delivered",
          orderDate: { 
            $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) 
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" }
          },
          revenue: { $sum: { $add: ["$totalAmount", "$shippingCost"] } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    // Get recent orders (last 5)
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(5)
      .select('orderNumber customerInfo status totalAmount shippingCost orderDate')
      .lean();
    
    // Format monthly revenue
    const formattedMonthlyRevenue = monthlyRevenue.map((item: any) => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'short' 
      }),
      revenue: item.revenue,
      count: item.count
    }));
    
    // Format recent orders
    const formattedRecentOrders = recentOrders.map((order: any) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
      status: order.status,
      total: order.totalAmount + order.shippingCost,
      date: order.orderDate.toISOString().split('T')[0]
    }));
    
    // Format orders by status
    const statusCounts = {
      pending: 0,
      waiting_payment: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    
    ordersByStatus.forEach((item: any) => {
      statusCounts[item._id as keyof typeof statusCounts] = item.count;
    });
    
    const stats = {
      totalUsers,
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      ordersByStatus: statusCounts,
      monthlyRevenue: formattedMonthlyRevenue,
      recentOrders: formattedRecentOrders
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}