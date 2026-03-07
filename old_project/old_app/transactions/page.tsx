import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { serverGet } from "@/lib/server-api"
import type { Transaction } from "@/types"

export default async function TransactionsPage() {
  const transactions = (await serverGet<Transaction[]>("/api/v1/my-transactions")) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>My transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="rounded border p-3">
            <p>ID: {transaction.id}</p>
            <p>Status: {transaction.status}</p>
            <Link className="text-sm text-sky-700" href={`/transactions/${transaction.id}`}>
              View detail
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

