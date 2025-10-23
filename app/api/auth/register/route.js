import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      return NextResponse.json(
        { success: true, message: "User registered successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid user data" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
