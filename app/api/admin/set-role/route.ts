import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    // Check if the current user is an admin
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      )
    }

    const { userId, newRole } = await request.json()

    // Validate input
    if (!userId || !newRole) {
      return NextResponse.json(
        { error: "Missing required fields: userId and newRole" },
        { status: 400 }
      )
    }

    // Validate role
    if (!["admin", "user"].includes(newRole)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'admin' or 'user'" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Find and update user
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent admin from removing their own admin role
    if (session.user?.id === userId && newRole !== "admin") {
      return NextResponse.json(
        { error: "Cannot remove your own admin role" },
        { status: 400 }
      )
    }

    user.role = newRole
    await user.save()

    return NextResponse.json({
      message: "User role updated successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })

  } catch (error) {
    console.error("Set role error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if the current user is an admin
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admin role required." },
        { status: 403 }
      )
    }

    await connectToDatabase()

    // Return all users (without passwords)
    const users = await User.find({}).select('-password')

    return NextResponse.json({
      users: users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))
    })

  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}