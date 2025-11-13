import { NextRequest, NextResponse } from "next/server";

// In a real application, you would save this to a database
// For demo purposes, we'll just simulate a successful registration
const users: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // In a real app, you would hash the password before saving
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed
      role: "user", // Default role for new registrations
    };

    users.push(newUser);

    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser.id, name, email, role: newUser.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}