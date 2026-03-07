import axios from "axios"
import type { InternalAxiosRequestConfig } from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

let volatileToken: string | null = null

export function setClientToken(token: string | null) {
  volatileToken = token
}

async function getServerCookieToken() {
  if (typeof window !== "undefined") return null
  try {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    return cookieStore.get("token")?.value ?? null
  } catch {
    return null
  }
}

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  config.headers = config.headers ?? {}

  if (API_KEY) {
    config.headers.apiKey = API_KEY
  }

  const token = volatileToken ?? (await getServerCookieToken())
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default client
