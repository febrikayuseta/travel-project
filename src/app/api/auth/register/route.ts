import { NextResponse } from "next/server"
import client from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"

type RegisterApiResponse = {
  token?: string
  accessToken?: string
  data?: {
    token?: string
    accessToken?: string
    message?: string
  }
  message?: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Body from Register.tsx might be different from what the mock/backend API uses.
    // Ensure we map it or pass it nicely
    
    // Mapping format to backend expectation if needed
    const payload = {
      email: body.email,
      name: body.fullname || body.name,
      password: body.password,
      passwordRepeat: body.confirm_password || body.passwordRepeat,
      phoneNumber: body.phone,
      role: 'user'
    }

    const res = await client.post<RegisterApiResponse>(endpoints.auth.register, payload)

    return NextResponse.json({ ok: true, data: res.data })
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || 'Registration failed'
    return NextResponse.json({ ok: false, message: errorMsg }, { status: 401 })
  }
}
