"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseApiData } from "@/lib/utils"
import type { Transaction } from "@/types"

async function getAllTransactions(): Promise<Transaction[]> {
  const res = await fetch("/api/proxy/all-transactions", { cache: "no-store" })
  const json = await res.json()
  return parseApiData<Transaction[]>(json)
}

export default function AdminTransactionsPage() {
  const queryClient = useQueryClient()
  const transactionsQuery = useQuery({ queryKey: ["admin-transactions"], queryFn: getAllTransactions })

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "success" | "failed" }) => {
      const res = await fetch(`/api/proxy/update-transaction-status/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Update status failed")
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-transactions"] }),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>All transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactionsQuery.data?.map((transaction) => (
          <div key={transaction.id} className="rounded border p-3">
            <p className="font-medium">{transaction.id}</p>
            <p className="text-sm">Status: {transaction.status}</p>
            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                onClick={() => statusMutation.mutate({ id: transaction.id, status: "failed" })}
              >
                Mark failed
              </Button>
              <Button onClick={() => statusMutation.mutate({ id: transaction.id, status: "success" })}>
                Mark success
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

