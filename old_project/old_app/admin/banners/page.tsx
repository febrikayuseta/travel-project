"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { ConfirmModal } from "@/components/confirm-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Banner } from "@/types"
import { parseApiData } from "@/lib/utils"

type BannerForm = {
  name: string
  imageUrl: string
}

async function fetchBanners(): Promise<Banner[]> {
  const res = await fetch("/api/proxy/banners", { cache: "no-store" })
  const json = await res.json()
  return parseApiData<Banner[]>(json)
}

export default function AdminBannersPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<BannerForm>({ name: "", imageUrl: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const bannersQuery = useQuery({
    queryKey: ["admin-banners"],
    queryFn: fetchBanners,
  })

  const createMutation = useMutation({
    mutationFn: async (payload: BannerForm) => {
      const res = await fetch("/api/proxy/create-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Create failed")
      return res.json()
    },
    onSuccess: () => {
      setForm({ name: "", imageUrl: "" })
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; body: BannerForm }) => {
      const res = await fetch(`/api/proxy/update-banner/${payload.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.body),
      })
      if (!res.ok) throw new Error("Update failed")
      return res.json()
    },
    onSuccess: () => {
      setEditingId(null)
      setForm({ name: "", imageUrl: "" })
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/proxy/delete-banner/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      return res.json()
    },
    onSuccess: () => {
      setDeleteId(null)
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] })
    },
  })

  const submitLabel = editingId ? "Update banner" : "Create banner"

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin banners</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-3 md:grid-cols-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (!form.name || !form.imageUrl) return
              if (editingId) {
                updateMutation.mutate({ id: editingId, body: form })
              } else {
                createMutation.mutate(form)
              }
            }}
          >
            <Input
              placeholder="Banner name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <Input
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              required
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1"
              >
                {submitLabel}
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null)
                    setForm({ name: "", imageUrl: "" })
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {bannersQuery.data?.map((banner) => (
          <Card key={banner.id}>
            <CardContent>
              <img
                src={banner.imageUrl}
                alt={banner.name}
                className="h-40 w-full rounded object-cover"
              />
              <p className="mt-3 font-medium">{banner.name}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditingId(banner.id)
                    setForm({ name: banner.name, imageUrl: banner.imageUrl })
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setDeleteId(banner.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete banner?"
        description="This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId)
        }}
      />
    </div>
  )
}

