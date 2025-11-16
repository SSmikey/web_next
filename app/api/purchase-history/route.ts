import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";

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
    const query: any = { userId: session.user?.id };
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "items.name": { $regex: search, $options: "i" } }
      ];
    }
    
    if (timeFilter) {
      const days = parseInt(timeFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      query.orderDate = { $gte: cutoffDate };
    }

    // For now, return mock data since we don't have a proper database schema
    // In a real implementation, you would query the database here
    const mockOrders = [
      {
        id: "ORD-2023-001",
        orderNumber: "ORD-2023-001",
        date: "2023-11-10",
        status: "delivered",
        total: 2590,
        items: [
          {
            id: 1,
            name: "โปรแกรมออกแบบกราฟิก Professional",
            price: 1990,
            quantity: 1,
            image: "🎨"
          },
          {
            id: 2,
            name: "เทมเพลตการนำเสนอธุรกิจ",
            price: 600,
            quantity: 1,
            image: "📊"
          }
        ]
      },
      {
        id: "ORD-2023-002",
        orderNumber: "ORD-2023-002",
        date: "2023-11-05",
        status: "shipped",
        total: 1290,
        items: [
          {
            id: 3,
            name: "ชุดฟอนต์ไทยสำหรับนักออกแบบ",
            price: 1290,
            quantity: 1,
            image: "🔤"
          }
        ]
      },
      {
        id: "ORD-2023-003",
        orderNumber: "ORD-2023-003",
        date: "2023-10-28",
        status: "processing",
        total: 3500,
        items: [
          {
            id: 4,
            name: "คอร์สเรียนการใช้โปรแกรมตัดต่อวิดีโอ",
            price: 2500,
            quantity: 1,
            image: "🎬"
          },
          {
            id: 5,
            name: "อุปกรณ์เสริมสำหรับการถ่ายวิดีโอ",
            price: 1000,
            quantity: 1,
            image: "📹"
          }
        ]
      },
      {
        id: "ORD-2023-004",
        orderNumber: "ORD-2023-004",
        date: "2023-10-15",
        status: "pending",
        total: 890,
        items: [
          {
            id: 6,
            name: "eBook การเขียนโปรแกรมสำหรับผู้เริ่มต้น",
            price: 890,
            quantity: 1,
            image: "📚"
          }
        ]
      },
      {
        id: "ORD-2023-005",
        orderNumber: "ORD-2023-005",
        date: "2023-09-30",
        status: "cancelled",
        total: 1500,
        items: [
          {
            id: 7,
            name: "สมาชิกพรีเมียม 1 เดือน",
            price: 1500,
            quantity: 1,
            image: "⭐"
          }
        ]
      }
    ];

    // Apply filters to mock data
    let filteredOrders = mockOrders;
    
    if (status && status !== "all") {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    if (search) {
      filteredOrders = filteredOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (timeFilter) {
      const days = parseInt(timeFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filteredOrders = filteredOrders.filter(order => new Date(order.date) >= cutoffDate);
    }

    // Apply sorting
    switch (sortBy) {
      case "date-desc":
        filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "date-asc":
        filteredOrders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "total-desc":
        filteredOrders.sort((a, b) => b.total - a.total);
        break;
      case "total-asc":
        filteredOrders.sort((a, b) => a.total - b.total);
        break;
      case "status":
        filteredOrders.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const total = filteredOrders.length;
    const orders = filteredOrders.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      orders,
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
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { items, totalAmount, shippingAddress } = await request.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Generate order number
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
    
    // Create new order
    const newOrder = {
      orderNumber,
      userId: session.user?.id,
      items,
      totalAmount,
      shippingAddress,
      status: "pending",
      orderDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real implementation, you would save to the database here
    // For now, we'll just return the order object
    const result = {
      insertedId: new Date().getTime().toString()
    };
    
    return NextResponse.json({
      success: true,
      order: {
        ...newOrder,
        _id: result.insertedId
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