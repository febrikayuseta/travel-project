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
import Link from "next/link"

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

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
      setNotice({ type: "success", message: getMessage(data, "Item removed from cart") })
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
      setNotice({ type: "success", message: getMessage(data, "Transaction created successfully") })
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

  const totalItems = cartsQuery.data?.reduce((acc, cart) => acc + cart.quantity, 0) || 0
  const totalPrice = cartsQuery.data?.reduce((acc, cart) => {
    const price = cart.activity?.price_discount || cart.activity?.price || 0
    return acc + price * cart.quantity
  }, 0) || 0
  const isEmpty = !cartsQuery.isLoading && (!cartsQuery.data || cartsQuery.data.length === 0)

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Checkout Card</h1>
        <p className="mt-2 text-sm text-slate-500">Review your chosen activities and complete your booking seamlessly.</p>
      </div>

      {notice && (
        <Notification
          message={notice.message}
          variant={notice.type === "success" ? "success" : "error"}
          className="animate-in fade-in slide-in-from-top-2"
        />
      )}

      {isEmpty ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-dashed border-2">
          <div className="rounded-full bg-slate-100 p-6 mb-4">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-slate-900">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">Looks like you haven&apos;t added any activities to your cart yet.</p>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-8 py-2 text-sm font-medium text-slate-50 transition-colors hover:bg-slate-900/90"
          >
            Explore Activities
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 space-y-4">
            {cartsQuery.isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse h-32 bg-slate-100 border-none" />
                ))}
              </div>
            ) : (
              cartsQuery.data?.map((cart) => {
                const price = cart.activity?.price_discount || cart.activity?.price || 0
                return (
                  <Card key={cart.id} className="overflow-hidden border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                      <div className="h-24 w-full sm:w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        {cart.activity?.imageUrls?.[0] ? (
                          <img
                            src={cart.activity.imageUrls[0]}
                            alt={cart.activity?.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400 p-2 text-xs text-center">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <Link href={cart.activityId ? `/activities/${cart.activityId}` : "#"} className="font-semibold text-lg text-slate-900 hover:text-sky-600 transition-colors line-clamp-1">
                          {cart.activity?.title || ("Cart Item " + cart.id)}
                        </Link>
                        {cart.activity && (
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {cart.activity.city}, {cart.activity.province}
                          </p>
                        )}
                        <div className="font-medium text-sky-700 mt-2">
                          {formatRupiah(price)} <span className="text-xs text-slate-400 font-normal">/ item</span>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                        <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1">
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-50"
                            onClick={() => updateMutation.mutate({ id: cart.id, quantity: Math.max(1, cart.quantity - 1) })}
                            disabled={cart.quantity <= 1 || updateMutation.isPending}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                          </button>
                          <div className="w-10 text-center text-sm font-medium">
                            {cart.quantity}
                          </div>
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors text-slate-600 disabled:opacity-50"
                            onClick={() => updateMutation.mutate({ id: cart.id, quantity: cart.quantity + 1 })}
                            disabled={updateMutation.isPending}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-3 rounded-md transition-colors flex items-center disabled:opacity-50"
                          onClick={() => {
                            setNotice(null)
                            deleteMutation.mutate(cart.id)
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Remove
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <Card className="border-slate-200 shadow-md">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Selected Items</span>
                    <span className="font-medium text-slate-900">{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Price</span>
                    <span className="font-medium text-slate-900">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <label className="text-sm font-semibold text-slate-900 block">Payment Method</label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-10 text-sm font-medium focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50 transition-shadow"
                      value={paymentMethodId}
                      onChange={(event) => setPaymentMethodId(event.target.value)}
                      disabled={paymentMethodsQuery.isLoading || !paymentMethodsQuery.data?.length}
                    >
                      {!paymentMethodsQuery.data?.length ? (
                        <option value="">No payment options</option>
                      ) : null}
                      {paymentMethodsQuery.data?.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-base font-semibold text-slate-900">Total Payment</span>
                    <span className="text-xl font-bold text-sky-600">{formatRupiah(totalPrice)}</span>
                  </div>

                  <Button
                    onClick={() => {
                      setNotice(null)
                      checkoutMutation.mutate()
                    }}
                    disabled={
                      checkoutMutation.isPending || !cartsQuery.data?.length || !paymentMethodId
                    }
                    className="w-full py-6 text-base font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-600/20 transition-all"
                  >
                    {checkoutMutation.isPending ? "Processing securely..." : "Checkout Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <p className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Secure and encrypted payment
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
