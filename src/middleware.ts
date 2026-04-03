import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip paths that don't need authentication (like login) OR non-API paths
  if (pathname === "/api/auth/login" || !pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 2. Extract the token from the Authorization header or cookie
  let token = "";
  const authHeader = request.headers.get("Authorization");
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    // Fallback to cookie for Server Components / initial page load
    token = request.cookies.get("token")?.value || "";
  }
  
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authentication token missing" },
      { status: 401 }
    );
  }

  try {
    // 3. Verify the token using jose (Edge-compatible)
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // 4. Inject the user context into custom headers for getAuthUser
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", (payload.userId as string) || "");
    requestHeaders.set("x-user-role", (payload.role as string) || "");
    requestHeaders.set("x-user-email", (payload.email as string) || "");

    // Proceed with the validated credentials in headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired session" },
      { status: 401 }
    );
  }
}

// Ensure the middleware only runs for API routes
export const config = {
  matcher: "/api/:path*",
};
