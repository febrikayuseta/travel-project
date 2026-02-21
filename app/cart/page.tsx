"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { parseApiData } from "@/lib/utils"
import type { Cart } from "@/types"

async function getCarts(): Promise<Cart[]> {
  const res = await fetch("/api/proxy/carts", { cache: "no-store" })
  const json = await res.json()
  return parseApiData<Cart[]>(json)
}

export default function CartPage() {
  const queryClient = useQueryClient()
  const cartsQuery = useQuery({ queryKey: ["carts"], queryFn: getCarts })

  const updateMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      await fetch(`/api/proxy/update-cart/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carts"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/proxy/delete-cart/${id}`, { method: "DELETE" })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carts"] }),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>My cart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
              <Button variant="destructive" onClick={() => deleteMutation.mutate(cart.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

