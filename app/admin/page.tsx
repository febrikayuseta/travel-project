import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const links = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/promos", label: "Promos" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/activities", label: "Activities" },
  { href: "/admin/transactions", label: "Transactions" },
  { href: "/admin/payment-methods", label: "Payment methods" },
]

export default function AdminPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="rounded border p-3 hover:bg-slate-50">
              {item.label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

