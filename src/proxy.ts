import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  // Not logged in
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    // Admin only routes
    if (
      pathname.startsWith("/admin") &&
      !decoded.isAdmin
    ) {
      return NextResponse.redirect(
        new URL("/profile", request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );

    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/admin/:path*",
  ],
};
