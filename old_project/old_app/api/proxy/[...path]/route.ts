import { NextRequest, NextResponse } from "next/server"
import { getTokenFromCookies } from "@/lib/auth/helpers"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

async function forward(req: NextRequest, pathSegments: string[]) {
  if (!API_BASE || !API_KEY) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_API_KEY missing" },
      { status: 500 },
    )
  }

  const token = await getTokenFromCookies()
  const search = req.nextUrl.search
  const targetUrl = `${API_BASE}/api/v1/${pathSegments.join("/")}${search}`

  const headers: HeadersInit = {
    apiKey: API_KEY,
  }

  const contentType = req.headers.get("content-type")
  if (contentType) {
    headers["Content-Type"] = contentType
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
    cache: "no-store",
  })

  const text = await response.text()
  return new NextResponse(text, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
    },
  })
}

export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  return forward(req, ctx.params.path)
}

export async function POST(req: NextRequest, ctx: { params: { path: string[] } }) {
  return forward(req, ctx.params.path)
}

export async function DELETE(req: NextRequest, ctx: { params: { path: string[] } }) {
  return forward(req, ctx.params.path)
}
