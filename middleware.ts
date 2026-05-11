import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
    ?? request.headers.get("authorization")?.replace("Bearer ", "");

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/movimientos/:path*", "/categorias/:path*", "/reportes/:path*", "/metas/:path*", "/login"],
};