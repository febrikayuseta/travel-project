"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseApiData } from "@/lib/utils"
import type { PaymentMethod } from "@/types"

async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const res = await fetch("/api/proxy/payment-methods", { cache: "no-store" })
  const json = await res.json()
  return parseApiData<PaymentMethod[]>(json)
}

export default function AdminPaymentMethodsPage() {
  const queryClient = useQueryClient()
  const methodsQuery = useQuery({ queryKey: ["payment-methods"], queryFn: getPaymentMethods })

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/proxy/generate-payment-methods", { method: "POST" })
      if (!res.ok) throw new Error("Generate failed")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payment-methods"] }),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
          {generateMutation.isPending ? "Generating..." : "Generate payment methods"}
        </Button>
        {methodsQuery.data?.map((method) => (
          <div key={method.id} className="rounded border p-3">
            <p className="font-medium">{method.name}</p>
            <p className="text-sm text-slate-600">{method.id}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

