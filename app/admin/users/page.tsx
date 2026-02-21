"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseApiData } from "@/lib/utils"
import type { User } from "@/types"

async function getUsers(): Promise<User[]> {
  const res = await fetch("/api/proxy/all-user", { cache: "no-store" })
  const json = await res.json()
  return parseApiData<User[]>(json)
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const usersQuery = useQuery({ queryKey: ["admin-users"], queryFn: getUsers })

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: "user" | "admin" }) => {
      const res = await fetch(`/api/proxy/update-user-role/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error("Failed")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {usersQuery.data?.map((user) => (
          <div key={user.id} className="flex items-center justify-between rounded border p-3">
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-slate-600">Role: {user.role}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => roleMutation.mutate({ id: user.id, role: "user" })}>
                Set user
              </Button>
              <Button onClick={() => roleMutation.mutate({ id: user.id, role: "admin" })}>Set admin</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

