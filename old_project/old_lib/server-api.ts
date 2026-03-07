import { getTokenFromCookies } from "@/lib/auth/helpers"
import { parseApiData } from "@/lib/utils"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function serverGet<T>(path: string): Promise<T | null> {
  if (!API_BASE || !API_KEY) return null
  const token = await getTokenFromCookies()
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      apiKey: API_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  })
  if (!res.ok) return null
  return parseApiData<T>(await res.json())
}

