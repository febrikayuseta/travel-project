import { NextResponse } from "next/server"
import client from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

type LoginApiResponse = {
  token?: string
  accessToken?: string
  data?: {
    token?: string
    accessToken?: string
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await client.post<LoginApiResponse>(endpoints.auth.login, body)

    const token =
      res.data?.token ??
      res.data?.accessToken ??
      res.data?.data?.token ??
      res.data?.data?.accessToken

    if (!token) {
      return NextResponse.json({ ok: false, message: "Token was not returned by backend" }, { status: 400 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Login failed" }, { status: 401 })
  }
}
