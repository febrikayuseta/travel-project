"use client"

import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Notification } from "@/components/ui/notification"

type ApiMessageResponse = {
  message?: string
}

function getMessage(value: unknown, fallback: string) {
  if (value && typeof value === "object" && "message" in value) {
    const message = (value as ApiMessageResponse).message
    if (typeof message === "string" && message.trim().length > 0) {
      return message
    }
  }
  return fallback
}

export function AddToCartButton({ activityId }: { activityId: string }) {
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/proxy/add-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId }),
      })

      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(getMessage(payload, "Failed to add cart"))
      }
      return payload
    },
    onSuccess: (data) => {
      setNotice({
        type: "success",
        message: getMessage(data, "Added to cart"),
      })
    },
    onError: (error) => {
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to add cart",
      })
    },
  })

  return (
    <div className="space-y-2">
      <Button
        onClick={() => {
          setNotice(null)
          mutation.mutate()
        }}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Adding..." : "Add to cart"}
      </Button>
      {notice ? (
        <Notification
          message={notice.message}
          variant={notice.type === "success" ? "success" : "error"}
        />
      ) : null}
    </div>
  )
}
