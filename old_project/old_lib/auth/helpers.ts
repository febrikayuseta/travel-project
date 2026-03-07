import { cookies } from "next/headers"
import { api } from "@/lib/api/endpoints"
import { setClientToken } from "@/lib/api/client"

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("token")?.value ?? null
}

export async function requireAuth(): Promise<string> {
  const token = await getTokenFromCookies()
  if (!token) {
    throw new Error("Unauthorized")
  }
  return token
}

export async function requireAdmin(): Promise<void> {
  const token = await requireAuth()
  setClientToken(token)
  const currentUser = await api.users.me()
  if (currentUser.role !== "admin") {
    throw new Error("Forbidden")
  }
}
