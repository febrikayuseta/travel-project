import type { Metadata } from "next"
import "./globals.css"
import Providers from "@/app/providers"
import MainNav from "@/components/main-nav"

export const metadata: Metadata = {
  title: "Travel",
  description: "Travel booking and admin dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="mx-auto max-w-6xl p-4">
            <MainNav />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
