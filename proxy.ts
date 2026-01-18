// proxy.ts at project root
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_EMAILS } from "./lib/admin"

export function proxy(request: NextRequest) {
  // Only protect admin paths
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Example: check for admin email in query string for now (temporary)
    const userEmail = request.cookies.get("sb-email")?.value

    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// This tells Next.js which paths the proxy should run on
export const config = {
  matcher: ["/admin/:path*"],
}

