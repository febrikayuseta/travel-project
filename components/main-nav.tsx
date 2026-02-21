import Link from "next/link"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"

async function hasSession() {
  const cookieStore = await cookies()
  return Boolean(cookieStore.get("token")?.value)
}

export default async function MainNav() {
  const loggedIn = await hasSession()

  return (
    <header className="mb-6 rounded-xl border bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/" className="mr-2 text-xl font-bold text-sky-700">
          Travel
        </Link>
        <Link href="/admin" className="text-sm text-slate-700 hover:text-slate-950">
          Admin
        </Link>
        <Link href="/account" className="text-sm text-slate-700 hover:text-slate-950">
          Account
        </Link>
        <Link href="/cart" className="text-sm text-slate-700 hover:text-slate-950">
          Cart
        </Link>
        <Link href="/transactions" className="text-sm text-slate-700 hover:text-slate-950">
          Transactions
        </Link>
        <div className="ml-auto">
          {loggedIn ? (
            <form action="/api/auth/logout" method="post">
              <Button variant="outline" type="submit">
                Logout
              </Button>
            </form>
          ) : (
            <Link href="/login" className="text-sm text-slate-700 hover:text-slate-950">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

