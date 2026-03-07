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
      (res.data as any)?.data?.token ??
      (res.data as any)?.data?.accessToken

    if (!token) {
      return NextResponse.json({ ok: false, message: 'Token was not returned by backend' }, { status: 400 })
    }

    // Extract user info if available in response
    const userData = (res.data as any)?.data || {}
    const userInfo = {
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'user',
      avatar: userData.profilePictureUrl || ''
    }

    const response = NextResponse.json({ ok: true, user: userInfo })
    
    // Set Auth Token Cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Set User Info Cookie (Non-HttpOnly so client can read it)
    response.cookies.set('user_info', JSON.stringify(userInfo), {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Login failed" }, { status: 401 })
  }
}
