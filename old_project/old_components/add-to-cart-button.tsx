"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Notification } from "@/components/ui/notification"
import { useRouter } from "next/navigation"

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
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/proxy/add-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId }),
      })

      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(getMessage(payload, "Failed to add to cart"))
      }
      return payload
    },
    onSuccess: (data) => {
      setNotice({
        type: "success",
        message: getMessage(data, "Activity added to cart"),
      })
      queryClient.invalidateQueries({ queryKey: ["carts"] })
    },
    onError: (error) => {
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to add to cart",
      })
    },
  })

  return (
    <div className="space-y-4 w-full">
      <Button
        onClick={() => {
          setNotice(null)
          mutation.mutate()
        }}
        disabled={mutation.isPending}
        className="w-full gap-3 rounded-xl h-14 text-base tracking-wide font-semibold shadow-lg shadow-sky-600/20 bg-sky-600 hover:bg-sky-700 transition-all active:scale-[0.98]"
      >
        {mutation.isPending ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
        {mutation.isPending ? "Adding securely..." : "Add to Cart"}
      </Button>

      {notice ? (
        <div className="flex flex-col gap-3">
          <Notification
            message={notice.message}
            variant={notice.type === "success" ? "success" : "error"}
            className="animate-in fade-in slide-in-from-top-2"
          />
          {notice.type === "success" && (
            <Button
              variant="outline"
              className="w-full rounded-xl border-sky-200 text-sky-700 hover:bg-sky-50 h-10"
              onClick={() => router.push("/cart")}
            >
              View Cart & Checkout
            </Button>
          )}
        </div>
      ) : null}
    </div>
  )
}
