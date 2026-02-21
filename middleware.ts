import { NextRequest, NextResponse } from "next/server"

const USER_ROUTES = ["/account", "/cart", "/transactions"]
const ADMIN_ROUTES = [
  "/admin",
  "/admin/users",
  "/admin/banners",
  "/admin/promos",
  "/admin/categories",
  "/admin/activities",
  "/admin/transactions",
  "/admin/payment-methods",
]
const AUTH_PAGES = ["/login", "/register"]

type JwtPayload = {
  role?: string
  user?: {
    role?: string
  }
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(atob(base64)) as JwtPayload
    return payload
  } catch {
    return null
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const pathname = req.nextUrl.pathname

  const isUserRoute = USER_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
  const isAuthPage = AUTH_PAGES.includes(pathname)

  if ((isUserRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAdminRoute && token) {
    const decoded = decodeJwtPayload(token)
    const role = decoded?.role ?? decoded?.user?.role
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/register", "/account/:path*", "/cart/:path*", "/transactions/:path*", "/admin/:path*"],
}
