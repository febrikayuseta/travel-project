"use client"

import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"

export function AddToCartButton({ activityId }: { activityId: string }) {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/proxy/add-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId }),
      })
      if (!res.ok) throw new Error("Failed to add cart")
      return res.json()
    },
  })

  return (
    <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      {mutation.isPending ? "Adding..." : "Add to cart"}
    </Button>
  )
}

