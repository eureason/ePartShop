import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

// Debugging: Ensure this file is recompiled
export async function POST(request) {
  try {
    console.log("Login API: Starting request processing.");
    await connectDB();
    console.log("Login API: Connected to DB.");
    const { email, password } = await request.json();
    console.log("Login API: Received credentials - Email:", email);

    const user = await User.findOne({ email });
    console.log("Login API: User found:", user);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await user.matchPassword(password);
    console.log("Login API: Password matched:", isMatch);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("User ID for JWT:", user._id);
    console.log("Generated JWT:", token);

    const serialized = serialize("token", token, {
      httpOnly: true,
      secure: false, // Always false for development
      sameSite: "lax", // More permissive for development
      maxAge: 60 * 60 * 1, // 1 hour
      path: "/",
    });

    console.log("Serialized cookie string:", serialized);
    return NextResponse.json(
      { success: true, message: "Logged in successfully" },
      { status: 200, headers: { "Set-Cookie": serialized } }
    );
  } catch (error) {
    console.error("Error during user login:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
