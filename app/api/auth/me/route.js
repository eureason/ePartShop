import { NextResponse } from "next/server";
import { protect } from "@/lib/authMiddleware";

export async function GET(request) {
  try {
    const authResult = await protect(request);
    if (authResult) {
      return authResult; // Return unauthorized response if authentication fails
    }

    // If protect middleware passes, request.user will contain the user object
    const user = request.user;

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error getting user data:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
