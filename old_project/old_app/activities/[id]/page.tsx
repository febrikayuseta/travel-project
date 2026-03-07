import { SafeHtml } from "@/components/safe-html"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseApiData } from "@/lib/utils"
import type { Activity } from "@/types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

async function getActivity(id: string): Promise<Activity | null> {
  if (!API_BASE || !API_KEY) return null
  const res = await fetch(`${API_BASE}/api/v1/activity/${id}`, {
    headers: { apiKey: API_KEY },
    cache: "no-store",
  })
  if (!res.ok) return null
  return parseApiData<Activity>(await res.json())
}

export default async function ActivityDetailPage({ params }: { params: { id: string } }) {
  const activity = await getActivity(params.id)
  if (!activity) return <p>Activity not found.</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activity.imageUrls?.[0] ? (
          <img src={activity.imageUrls[0]} alt={activity.title} className="h-64 w-full rounded object-cover" />
        ) : null}
        <p>{activity.description}</p>
        <p className="text-sm">Price: {activity.price}</p>
        <SafeHtml html={activity.facilities} className="rounded-md bg-slate-100 p-3 text-sm" />
        <SafeHtml
          html={activity.location_maps}
          allowIframe
          className="rounded-md bg-slate-100 p-3 text-sm"
        />
        <AddToCartButton activityId={activity.id} />
      </CardContent>
    </Card>
  )
}
