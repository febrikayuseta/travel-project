"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ConfirmModal } from "@/components/confirm-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { parseApiData } from "@/lib/utils"

type CrudField = {
  name: string
  label: string
  multiline?: boolean
  required?: boolean
}

type AdminCrudPageProps<TItem extends { id: string }> = {
  title: string
  queryKey: string
  listEndpoint: string
  createEndpoint: string
  updateEndpoint: (id: string) => string
  deleteEndpoint: (id: string) => string
  fields: CrudField[]
  mapInitial?: (item?: TItem) => Record<string, string>
  renderItem?: (item: TItem) => React.ReactNode
  transformPayload?: (payload: Record<string, string>) => unknown
}

export function AdminCrudPage<TItem extends { id: string }>({
  title,
  queryKey,
  listEndpoint,
  createEndpoint,
  updateEndpoint,
  deleteEndpoint,
  fields,
  mapInitial,
  renderItem,
  transformPayload,
}: AdminCrudPageProps<TItem>) {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const initial = useMemo(() => mapInitial?.() ?? Object.fromEntries(fields.map((f) => [f.name, ""])), [fields, mapInitial])
  const [form, setForm] = useState<Record<string, string>>(initial)

  const listQuery = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const res = await fetch(`/api/proxy/${listEndpoint}`, { cache: "no-store" })
      const json = await res.json()
      return parseApiData<TItem[]>(json)
    },
  })

  const createMutation = useMutation({
    mutationFn: async (payload: unknown) => {
      const res = await fetch(`/api/proxy/${createEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Create failed")
      return res.json()
    },
    onSuccess: () => {
      setForm(initial)
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; body: unknown }) => {
      const res = await fetch(`/api/proxy/${updateEndpoint(payload.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.body),
      })
      if (!res.ok) throw new Error("Update failed")
      return res.json()
    },
    onSuccess: () => {
      setEditingId(null)
      setForm(initial)
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/proxy/${deleteEndpoint(id)}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      return res.json()
    },
    onSuccess: () => {
      setDeletingId(null)
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    },
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (editingId) {
                updateMutation.mutate({ id: editingId, body: transformPayload ? transformPayload(form) : form })
              } else {
                createMutation.mutate(transformPayload ? transformPayload(form) : form)
              }
            }}
          >
            {fields.map((field) =>
              field.multiline ? (
                <div key={field.name}>
                  <label className="mb-1 block text-sm">{field.label}</label>
                  <Textarea
                    required={field.required}
                    value={form[field.name] ?? ""}
                    onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                  />
                </div>
              ) : (
                <div key={field.name}>
                  <label className="mb-1 block text-sm">{field.label}</label>
                  <Input
                    required={field.required}
                    value={form[field.name] ?? ""}
                    onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                  />
                </div>
              ),
            )}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update" : "Create"}
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null)
                    setForm(initial)
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {listQuery.data?.map((item) => (
          <Card key={item.id}>
            <CardContent>
              {renderItem ? renderItem(item) : <pre className="text-xs">{JSON.stringify(item, null, 2)}</pre>}
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEditingId(item.id)
                    setForm(mapInitial?.(item) ?? (item as Record<string, string>))
                  }}
                >
                  Edit
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => setDeletingId(item.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(deletingId)}
        title="Confirm delete"
        description="This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteMutation.mutate(deletingId)
        }}
      />
    </div>
  )
}
