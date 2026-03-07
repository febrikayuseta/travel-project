import type { Metadata } from "next"
import { Manrope, Sora } from "next/font/google"
import "./globals.css"
import Providers from "@/app/providers"
import MainNav from "@/components/main-nav"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Travel",
  description: "Travel booking and admin dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body>
        <Providers>
          <div className="mx-auto max-w-6xl px-4 pb-8 pt-5 md:px-6">
            <MainNav />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
