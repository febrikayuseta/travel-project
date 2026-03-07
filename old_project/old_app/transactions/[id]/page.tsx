"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Notification } from "@/components/ui/notification"
import { parseApiData } from "@/lib/utils"
import type { Transaction } from "@/types"

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

function getImageUrl(value: unknown) {
  if (!value || typeof value !== "object") return null
  const record = value as Record<string, unknown>
  const data = record.data
  if (typeof record.url === "string") return record.url
  if (typeof record.imageUrl === "string") return record.imageUrl
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>
    if (typeof nested.url === "string") return nested.url
    if (typeof nested.imageUrl === "string") return nested.imageUrl
  }
  return null
}

async function getTransaction(id: string): Promise<Transaction> {
  const res = await fetch(`/api/proxy/transaction/${id}`, { cache: "no-store" })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(getMessage(json, "Transaction not found"))
  return parseApiData<Transaction>(json)
}

export default function TransactionDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const transactionId = useMemo(() => params?.id ?? "", [params])
  const [notice, setNotice] = useState<Notice | null>(null)
  const [proofPaymentUrl, setProofPaymentUrl] = useState("")

  const transactionQuery = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => getTransaction(transactionId),
    enabled: Boolean(transactionId),
  })

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/proxy/cancel-transaction/${transactionId}`, { method: "POST" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(getMessage(json, "Failed to cancel transaction"))
      return json
    },
    onSuccess: (json) => {
      setNotice({ type: "success", message: getMessage(json, "Transaction cancelled") })
      transactionQuery.refetch()
    },
    onError: (error) =>
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to cancel transaction",
      }),
  })

  const proofMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/proxy/update-transaction-proof-payment/${transactionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proofPaymentUrl }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(getMessage(json, "Failed to update proof"))
      return json
    },
    onSuccess: (json) => {
      setNotice({ type: "success", message: getMessage(json, "Proof payment updated") })
      transactionQuery.refetch()
    },
    onError: (error) =>
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update proof",
      }),
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("image", file)
      const res = await fetch("/api/proxy/upload-image", {
        method: "POST",
        body: formData,
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(getMessage(json, "Upload image failed"))
      return json
    },
    onSuccess: (json) => {
      const imageUrl = getImageUrl(json)
      if (imageUrl) {
        setProofPaymentUrl(imageUrl)
        setNotice({ type: "success", message: "Image uploaded. Proof URL is filled." })
      } else {
        setNotice({ type: "error", message: "Image uploaded but URL was not found in response." })
      }
    },
    onError: (error) =>
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Upload image failed",
      }),
  })

  if (transactionQuery.isLoading) {
    return <p className="text-sm text-slate-500">Loading transaction...</p>
  }

  if (transactionQuery.isError || !transactionQuery.data) {
    return <p>Transaction not found.</p>
  }

  const transaction = transactionQuery.data

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction detail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notice ? (
          <Notification
            message={notice.message}
            variant={notice.type === "success" ? "success" : "error"}
          />
        ) : null}

        <p>ID: {transaction.id}</p>
        <p>Status: {transaction.status}</p>
        <p>Payment method ID: {transaction.paymentMethodId ?? "-"}</p>
        <p>Proof payment URL: {transaction.proofPaymentUrl ?? "-"}</p>

        <div className="rounded-xl border p-3 space-y-2">
          <p className="text-sm font-medium">Upload proof payment image</p>
          <Input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              setNotice(null)
              uploadMutation.mutate(file)
            }}
          />
          <p className="text-xs text-slate-500">After upload, click Update proof payment.</p>
        </div>

        <div className="rounded-xl border p-3 space-y-2">
          <p className="text-sm font-medium">Submit proof payment URL</p>
          <Input
            placeholder="https://..."
            value={proofPaymentUrl}
            onChange={(event) => setProofPaymentUrl(event.target.value)}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setNotice(null)
                proofMutation.mutate()
              }}
              disabled={!proofPaymentUrl || proofMutation.isPending}
            >
              {proofMutation.isPending ? "Updating..." : "Update proof payment"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/transactions")}>
              Back to transactions
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="destructive"
            onClick={() => {
              setNotice(null)
              cancelMutation.mutate()
            }}
            disabled={cancelMutation.isPending || transaction.status === "cancelled"}
          >
            {cancelMutation.isPending ? "Cancelling..." : "Cancel transaction"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
