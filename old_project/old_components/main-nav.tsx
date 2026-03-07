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
    <header className="mb-6 rounded-2xl border border-white/60 bg-white/70 p-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md md:p-4">
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <Link
          href="/"
          className="mr-1 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-3 py-2 text-lg font-bold text-white"
        >
          Travel
        </Link>
        <Link href="/admin" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
          Admin
        </Link>
        <Link href="/account" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
          Account
        </Link>
        <Link href="/cart" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
          Cart
        </Link>
        <Link
          href="/transactions"
          className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Transactions
        </Link>
        <div className="ml-auto">
          {loggedIn ? (
            <form action="/api/auth/logout" method="post">
              <Button variant="outline" type="submit" className="rounded-xl border-slate-300 bg-white/80">
                Logout
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/register" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                Register
              </Link>
              <Link href="/login" className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
