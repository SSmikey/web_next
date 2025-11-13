import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

// Mock user database - in production, this would be a real database
const users: any[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Demo User",
    email: "user@example.com",
    role: "user",
  },
]

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

    // Find and update user
    const userIndex = users.findIndex(user => user.id === userId)
    if (userIndex === -1) {
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

    users[userIndex].role = newRole

    return NextResponse.json({
      message: "User role updated successfully",
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email,
        role: users[userIndex].role,
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

    // Return all users (without passwords)
    const usersWithoutPasswords = users.map(({ password, ...user }) => user)

    return NextResponse.json({
      users: usersWithoutPasswords
    })

  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}