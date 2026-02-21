import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { serverGet } from "@/lib/server-api"
import type { User } from "@/types"

export default async function AccountPage() {
  const user = await serverGet<User>("/api/v1/user")
  if (!user) return <p>Unable to load account.</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>My account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Name: {user.name ?? "-"}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Phone: {user.phoneNumber ?? "-"}</p>
      </CardContent>
    </Card>
  )
}

