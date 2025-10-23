import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(request) {
  try {
    const serialized = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: -1, // Expire the cookie immediately
      path: "/",
    });

    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200, headers: { "Set-Cookie": serialized } }
    );
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
