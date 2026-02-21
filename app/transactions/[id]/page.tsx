import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { serverGet } from "@/lib/server-api"
import type { Transaction } from "@/types"

export default async function TransactionDetailPage({ params }: { params: { id: string } }) {
  const transaction = await serverGet<Transaction>(`/api/v1/transaction/${params.id}`)
  if (!transaction) return <p>Transaction not found.</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction detail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>ID: {transaction.id}</p>
        <p>Status: {transaction.status}</p>
        <p>Payment method ID: {transaction.paymentMethodId ?? "-"}</p>
      </CardContent>
    </Card>
  )
}

