import { cn } from "@/lib/utils"

type NotificationVariant = "success" | "error" | "info"

const variantClasses: Record<NotificationVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-sky-200 bg-sky-50 text-sky-800",
}

export function Notification({
  message,
  variant = "info",
  className,
}: {
  message: string
  variant?: NotificationVariant
  className?: string
}) {
  return (
    <p className={cn("rounded-md border px-3 py-2 text-sm", variantClasses[variant], className)}>
      {message}
    </p>
  )
}
