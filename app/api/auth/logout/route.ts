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
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  })
  return response
}
