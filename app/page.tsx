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

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function HomePage() {
  const [banners, promos, categories, activities] = await Promise.all([
    getPublicData<Banner>("/api/v1/banners"),
    getPublicData<Promo>("/api/v1/promos"),
    getPublicData<Category>("/api/v1/categories"),
    getPublicData<Activity>("/api/v1/activities"),
  ])

  return (
    <main className="space-y-8">
      <section className="reveal relative overflow-hidden rounded-3xl border border-sky-200/60 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 p-6 text-white shadow-[0_18px_60px_rgba(14,165,233,0.35)] md:p-8">
        <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-14 h-40 w-40 rounded-full bg-cyan-200/30 blur-2xl" />
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">Travel Dashboard</p>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">Plan Better Trips, Faster</h1>
        <p className="mt-3 max-w-2xl text-sm text-cyan-50 md:text-base">
          Explore curated promos, categories, and activities with a cleaner booking flow for users and admins.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:max-w-xl md:grid-cols-4">
          <div className="rounded-xl border border-white/25 bg-white/15 p-3 backdrop-blur">
            <p className="text-2xl font-bold">{banners.length}</p>
            <p className="text-xs text-cyan-100">Banners</p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/15 p-3 backdrop-blur">
            <p className="text-2xl font-bold">{promos.length}</p>
            <p className="text-xs text-cyan-100">Promos</p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/15 p-3 backdrop-blur">
            <p className="text-2xl font-bold">{categories.length}</p>
            <p className="text-xs text-cyan-100">Categories</p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/15 p-3 backdrop-blur">
            <p className="text-2xl font-bold">{activities.length}</p>
            <p className="text-xs text-cyan-100">Activities</p>
          </div>
        </div>
      </section>

      <section className="reveal">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Banners</h2>
          <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-500">
            Live from API
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {banners.map((banner) => (
            <Card key={banner.id} className="group overflow-hidden p-0">
              <CardContent className="p-0">
                <img
                  src={banner.imageUrl}
                  alt={banner.name}
                  className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="p-4">
                  <p className="line-clamp-1 font-semibold text-slate-900">{banner.name}</p>
                  <Link
                    href={`/banners/${banner.id}`}
                    className="mt-2 inline-block text-sm text-sky-700 hover:text-sky-900"
                  >
                    View banner details
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="reveal">
        <h2 className="mb-4 text-2xl font-semibold">Best Promos</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {promos.slice(0, 6).map((promo) => (
            <Card key={promo.id} className="group border-sky-100/80">
              <CardHeader className="mb-2">
                <p className="mb-2 inline-flex w-fit rounded-full bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
                  Save {formatRupiah(promo.promo_discount_price)}
                </p>
                <CardTitle className="line-clamp-2 text-xl group-hover:text-sky-700">{promo.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-xs text-slate-500">Min. spend {formatRupiah(promo.minimum_claim_price)}</p>
                <Link
                  href={`/promos/${promo.id}`}
                  className="inline-flex rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700"
                >
                  View details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="reveal">
        <h2 className="mb-4 text-2xl font-semibold">Explore Categories</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <Card key={category.id} className="group">
              <CardContent>
                <p className="font-semibold text-slate-900">{category.name}</p>
                <Link
                  href={`/categories/${category.id}`}
                  className="mt-2 inline-block text-sm text-sky-700 hover:text-sky-900"
                >
                  Browse category &rarr;
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="reveal">
        <h2 className="mb-4 text-2xl font-semibold">Popular Activities</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {activities.slice(0, 6).map((activity) => (
            <Card key={activity.id} className="group">
              <CardContent>
                <p className="line-clamp-1 font-semibold text-slate-900">{activity.title}</p>
                <p className="mt-1 text-sm text-slate-500">City: {activity.city}</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{formatRupiah(activity.price)}</p>
                <Link
                  href={`/activities/${activity.id}`}
                  className="mt-2 inline-block text-sm text-sky-700 hover:text-sky-900"
                >
                  View activity &rarr;
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
