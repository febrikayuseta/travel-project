import { NextResponse } from "next/server"
import client from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import { getTokenFromCookies } from "@/lib/auth/helpers"

export async function POST(req: Request) {
  const token = await getTokenFromCookies()

  if (token) {
    try {
      await client.get(endpoints.auth.logout, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch {
      // Cookie will still be cleared even if backend logout fails.
    }
  }

  const response = NextResponse.redirect(new URL("/login", req.url))
  
  const cookieOptions = {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  }

  response.cookies.set("token", "", cookieOptions)
  response.cookies.set("user_info", "", { ...cookieOptions, httpOnly: false })
  
  return response
}
