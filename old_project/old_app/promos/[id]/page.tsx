import { SafeHtml } from "@/components/safe-html"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseApiData } from "@/lib/utils"
import type { Promo } from "@/types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

async function getPromo(id: string): Promise<Promo | null> {
  if (!API_BASE || !API_KEY) return null
  const res = await fetch(`${API_BASE}/api/v1/promo/${id}`, {
    headers: { apiKey: API_KEY },
    cache: "no-store",
  })
  if (!res.ok) return null
  return parseApiData<Promo>(await res.json())
}

export default async function PromoDetailPage({ params }: { params: { id: string } }) {
  const promo = await getPromo(params.id)
  if (!promo) return <p>Promo not found.</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>{promo.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <img src={promo.imageUrl} alt={promo.title} className="h-56 w-full rounded object-cover" />
        <p>{promo.description}</p>
        <p className="text-sm text-slate-600">Code: {promo.promo_code}</p>
        <SafeHtml html={promo.terms_condition} className="rounded-md bg-slate-100 p-3 text-sm" />
      </CardContent>
    </Card>
  )
}

