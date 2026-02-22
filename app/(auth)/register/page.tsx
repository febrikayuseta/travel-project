"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    passwordRepeat: "",
    role: "user",
    profilePictureUrl: "",
    phoneNumber: "",
  })
  const [error, setError] = useState("")

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/proxy/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Register failed")
      return res.json()
    },
    onSuccess: () => router.push("/login"),
    onError: () => setError("Registration failed"),
  })

  return (
    <div className="mx-auto mt-10 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              setError("")
              registerMutation.mutate()
            }}
          >
            <Input
              placeholder="Email"
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <Input
              placeholder="Name"
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <Input
              placeholder="Password"
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
            <Input
              placeholder="Repeat password"
              type="password"
              required
              value={form.passwordRepeat}
              onChange={(event) => setForm((prev) => ({ ...prev, passwordRepeat: event.target.value }))}
            />
            <Input
              placeholder="Profile picture URL"
              value={form.profilePictureUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, profilePictureUrl: event.target.value }))}
            />
            <Input
              placeholder="Phone number"
              value={form.phoneNumber}
              onChange={(event) => setForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
            />
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <Button type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
