import { NextResponse, NextRequest } from "next/server";
import { verifyAuthToken } from "./lib/privy";

export const config = {
  matcher: "/api/:function*",
};

export async function middleware(req: NextRequest) {
  if (req.url.includes("/api/public/")) {
    // If the request is for a public endpoint, continue processing the request
    return NextResponse.next();
  }

  if (req.url.includes("/api/users") && req.method === "POST") {
    // If the request is for the user creation endpoint, continue processing the request
    return NextResponse.next();
  }

  // Get the Privy token from the headers
  const authToken = req.headers.get("Authorization");

  if (!authToken) {
    return NextResponse.json(
      { success: false, message: "Missing auth token" },
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const token = authToken.replace("Bearer ", "");
    const { isValid, user } = await verifyAuthToken(token);
    if (!isValid) {
      // Respond with JSON indicating an error message
      return NextResponse.json(
        { success: false, message: "Authentication failed" },
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // If authentication is successful, continue processing the request
    const response = NextResponse.next();
    // privy embedded wallet address
    const address = user?.wallet?.address.toLowerCase();
    response.headers.set("x-address", address!);
    return response;
  } catch (error) {
    // Handle errors related to token verification or other issues
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
      },
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
