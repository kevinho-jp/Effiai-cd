import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export function middleware(request: any) {
  // Protège toutes les routes sous /admin
  return withAuth(request, {
    pages: {
      signIn: "/admin/login",
    },
  })
}

export const config = {
  matcher: ["/admin/:path*"],
}
