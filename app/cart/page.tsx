"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Notification } from "@/components/ui/notification"
import { parseApiData } from "@/lib/utils"
import type { Cart, PaymentMethod } from "@/types"

async function getCarts(): Promise<Cart[]> {
  const res = await fetch("/api/proxy/carts", { cache: "no-store" })
  const json = await res.json()
  return parseApiData<Cart[]>(json)
}

async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const res = await fetch("/api/proxy/payment-methods", { cache: "no-store" })
  const json = await res.json()
  return parseApiData<PaymentMethod[]>(json)
}

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

function getTransactionId(value: unknown) {
  if (value && typeof value === "object" && "data" in value) {
    const data = (value as { data?: { id?: string } }).data
    if (data && typeof data.id === "string") return data.id
  }
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: string }).id
    if (typeof id === "string") return id
  }
  return null
}

export default function CartPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const cartsQuery = useQuery({ queryKey: ["carts"], queryFn: getCarts })
  const paymentMethodsQuery = useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
  })
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [paymentMethodId, setPaymentMethodId] = useState("")

  useEffect(() => {
    if (!paymentMethodId && paymentMethodsQuery.data?.length) {
      setPaymentMethodId(paymentMethodsQuery.data[0].id)
    }
  }, [paymentMethodId, paymentMethodsQuery.data])

  const updateMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const res = await fetch(`/api/proxy/update-cart/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(getMessage(payload, "Failed to update cart"))
      }
      return payload
    },
    onSuccess: (data) => {
      setNotice({ type: "success", message: getMessage(data, "Cart updated") })
      queryClient.invalidateQueries({ queryKey: ["carts"] })
    },
    onError: (error) =>
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update cart",
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/proxy/delete-cart/${id}`, { method: "DELETE" })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(getMessage(payload, "Failed to delete cart"))
      }
      return payload
    },
    onSuccess: (data) => {
      setNotice({ type: "success", message: getMessage(data, "Cart deleted") })
      queryClient.invalidateQueries({ queryKey: ["carts"] })
    },
    onError: (error) =>
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to delete cart",
      }),
  })

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const cartIds = cartsQuery.data?.map((cart) => cart.id) ?? []
      const res = await fetch("/api/proxy/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartIds, paymentMethodId }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(getMessage(payload, "Failed to create transaction"))
      }
      return payload
    },
    onSuccess: (data) => {
      setNotice({ type: "success", message: getMessage(data, "Transaction created") })
      queryClient.invalidateQueries({ queryKey: ["carts"] })
      const transactionId = getTransactionId(data)
      if (transactionId) {
        router.push(`/transactions/${transactionId}`)
      } else {
        router.push("/transactions")
      }
    },
    onError: (error) =>
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to create transaction",
      }),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>My cart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notice ? (
          <Notification
            message={notice.message}
            variant={notice.type === "success" ? "success" : "error"}
          />
        ) : null}
        {cartsQuery.data?.map((cart) => (
          <div key={cart.id} className="rounded border p-3">
            <p className="text-sm">Cart ID: {cart.id}</p>
            <div className="mt-2 flex gap-2">
              <Input
                defaultValue={cart.quantity}
                type="number"
                min={1}
                onBlur={(event) =>
                  updateMutation.mutate({ id: cart.id, quantity: Number(event.target.value || 1) })
                }
              />
              <Button
                variant="destructive"
                onClick={() => {
                  setNotice(null)
                  deleteMutation.mutate(cart.id)
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        <div className="rounded border p-3 space-y-3">
          <p className="text-sm font-medium">Payment method</p>
          <select
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            value={paymentMethodId}
            onChange={(event) => setPaymentMethodId(event.target.value)}
            disabled={paymentMethodsQuery.isLoading || !paymentMethodsQuery.data?.length}
          >
            {!paymentMethodsQuery.data?.length ? (
              <option value="">No payment methods available</option>
            ) : null}
            {paymentMethodsQuery.data?.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
          <Button
            onClick={() => {
              setNotice(null)
              checkoutMutation.mutate()
            }}
            disabled={
              checkoutMutation.isPending || !cartsQuery.data?.length || !paymentMethodId
            }
            className="w-full"
          >
            {checkoutMutation.isPending ? "Processing..." : "Proceed to payment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
