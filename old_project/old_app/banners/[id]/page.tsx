import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseApiData } from "@/lib/utils"
import type { Banner } from "@/types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

async function getBanner(id: string): Promise<Banner | null> {
  if (!API_BASE || !API_KEY) return null
  const res = await fetch(`${API_BASE}/api/v1/banner/${id}`, {
    headers: { apiKey: API_KEY },
    cache: "no-store",
  })
  if (!res.ok) return null
  return parseApiData<Banner>(await res.json())
}

export default async function BannerDetailPage({ params }: { params: { id: string } }) {
  const banner = await getBanner(params.id)
  if (!banner) return <p>Banner not found.</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>{banner.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <img src={banner.imageUrl} alt={banner.name} className="w-full rounded-xl object-cover" />
        <p className="text-sm text-slate-600">Banner ID: {banner.id}</p>
      </CardContent>
    </Card>
  )
}
