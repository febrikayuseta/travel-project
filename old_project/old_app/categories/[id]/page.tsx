import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseApiData } from "@/lib/utils"
import type { Activity, Category } from "@/types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

async function getCategory(id: string): Promise<Category | null> {
  if (!API_BASE || !API_KEY) return null
  const res = await fetch(`${API_BASE}/api/v1/category/${id}`, {
    headers: { apiKey: API_KEY },
    cache: "no-store",
  })
  if (!res.ok) return null
  return parseApiData<Category>(await res.json())
}

async function getActivitiesByCategory(id: string): Promise<Activity[]> {
  if (!API_BASE || !API_KEY) return []
  const res = await fetch(`${API_BASE}/api/v1/activities-by-category/${id}`, {
    headers: { apiKey: API_KEY },
    cache: "no-store",
  })
  if (!res.ok) return []
  return parseApiData<Activity[]>(await res.json())
}

export default async function CategoryDetailPage({ params }: { params: { id: string } }) {
  const [category, activities] = await Promise.all([
    getCategory(params.id),
    getActivitiesByCategory(params.id),
  ])

  if (!category) return <p>Category not found.</p>

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{category.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={category.imageUrl} alt={category.name} className="h-64 w-full rounded object-cover" />
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Activities</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardContent>
                <p className="font-medium">{activity.title}</p>
                <Link href={`/activities/${activity.id}`} className="text-sm text-sky-700">
                  View details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

