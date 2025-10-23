import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";

// Debugging: Ensure this file is recompiled
export const protect = async (request) => {
  let token;

  if (request.cookies.has("token")) {
    token = request.cookies.get("token").value;
  }

  if (!token) {
    console.log("Auth Middleware: No token found.");
    return NextResponse.json(
      { success: false, message: "Not authorized, no token" },
      { status: 401 }
    );
  }

  try {
    console.log("Auth Middleware: Token received:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth Middleware: Decoded JWT:", decoded);
    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    console.log("Auth Middleware: User found:", user);

    if (!user) {
      console.log("Auth Middleware: User not found for decoded ID:", decoded.id);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Attach user to the request object (for API routes)
    request.user = user;
    return null; // Continue to the next middleware/route
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return NextResponse.json(
      { success: false, message: "Not authorized, token failed" },
      { status: 401 }
    );
  }
};
