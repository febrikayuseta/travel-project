"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Notification } from "@/components/ui/notification"
import { parseApiData } from "@/lib/utils"
import type { User } from "@/types"

type Notice = {
  type: "success" | "error"
  message: string
}

function getMessage(value: unknown, fallback: string) {
  if (value && typeof value === "object" && "message" in value) {
    const message = (value as { message?: string }).message
    if (typeof message === "string" && message.trim().length > 0) return message
  }
  return fallback
}

async function getMe(): Promise<User> {
  const res = await fetch("/api/proxy/user", { cache: "no-store" })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(getMessage(json, "Unable to load account"))
  return parseApiData<User>(json)
}

export default function AccountPage() {
  const [notice, setNotice] = useState<Notice | null>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    profilePictureUrl: "",
    phoneNumber: "",
  })

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  })

  useEffect(() => {
    if (meQuery.data) {
      setForm({
        name: meQuery.data.name ?? "",
        email: meQuery.data.email ?? "",
        profilePictureUrl: meQuery.data.profilePictureUrl ?? "",
        phoneNumber: meQuery.data.phoneNumber ?? "",
      })
    }
  }, [meQuery.data])

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        email: form.email,
        profilePictureUrl: form.profilePictureUrl || undefined,
        phoneNumber: form.phoneNumber || undefined,
      }
      const res = await fetch("/api/proxy/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(getMessage(json, "Failed to update profile"))
      return json
    },
    onSuccess: (json) => {
      setNotice({ type: "success", message: getMessage(json, "Profile updated") })
      meQuery.refetch()
    },
    onError: (error) => {
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update profile",
      })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>My account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notice ? (
          <Notification
            message={notice.message}
            variant={notice.type === "success" ? "success" : "error"}
          />
        ) : null}

        {meQuery.isLoading ? <p className="text-sm text-slate-500">Loading account...</p> : null}
        {meQuery.isError ? <p className="text-sm text-rose-600">Unable to load account.</p> : null}

        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            setNotice(null)
            updateProfileMutation.mutate()
          }}
        >
          <div className="space-y-1">
            <label className="text-sm">Name</label>
            <Input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Email</label>
            <Input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Profile picture URL</label>
            <Input
              value={form.profilePictureUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, profilePictureUrl: event.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Phone number</label>
            <Input
              value={form.phoneNumber}
              onChange={(event) => setForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Saving..." : "Save profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
