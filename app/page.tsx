import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { parseApiData } from "@/lib/utils"
import type { Activity, Banner, Category, Promo } from "@/types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

async function getPublicData<T>(path: string): Promise<T[]> {
  if (!API_BASE || !API_KEY) return []
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { apiKey: API_KEY },
    cache: "no-store",
  })
  if (!response.ok) return []
  const json = await response.json()
  return parseApiData<T[]>(json)
}

export default async function HomePage() {
  const [banners, promos, categories, activities] = await Promise.all([
    getPublicData<Banner>("/api/v1/banners"),
    getPublicData<Promo>("/api/v1/promos"),
    getPublicData<Category>("/api/v1/categories"),
    getPublicData<Activity>("/api/v1/activities"),
  ])

  return (
    <main className="space-y-6">
      <section className="rounded-xl border bg-gradient-to-r from-sky-600 to-cyan-500 p-6 text-white">
        <h1 className="text-3xl font-bold">Travel</h1>
        <p className="mt-2 text-sm opacity-95">Explore banners, promos, categories, and activities.</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Banners</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {banners.map((banner) => (
            <Card key={banner.id}>
              <CardContent>
                <img
                  src={banner.imageUrl}
                  alt={banner.name}
                  className="h-40 w-full rounded object-cover"
                />
                <p className="mt-2 font-medium">{banner.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Promos</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {promos.slice(0, 6).map((promo) => (
            <Card key={promo.id}>
              <CardHeader>
                <CardTitle>{promo.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/promos/${promo.id}`} className="text-sm text-sky-700 hover:text-sky-900">
                  View details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Categories</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <Card key={category.id}>
              <CardContent>
                <p className="font-medium">{category.name}</p>
                <Link
                  href={`/categories/${category.id}`}
                  className="mt-1 block text-sm text-sky-700 hover:text-sky-900"
                >
                  Browse category
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Activities</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {activities.slice(0, 6).map((activity) => (
            <Card key={activity.id}>
              <CardContent>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-slate-600">City: {activity.city}</p>
                <Link
                  href={`/activities/${activity.id}`}
                  className="mt-1 block text-sm text-sky-700 hover:text-sky-900"
                >
                  View activity
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
