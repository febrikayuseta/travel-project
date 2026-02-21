import * as React from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "default" | "secondary" | "destructive" | "outline"

const variants: Record<ButtonVariant, string> = {
  default: "bg-sky-600 text-white hover:bg-sky-700",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
  destructive: "bg-rose-600 text-white hover:bg-rose-700",
  outline: "border border-slate-300 bg-white hover:bg-slate-100 text-slate-900",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition",
          "disabled:pointer-events-none disabled:opacity-60",
          variants[variant],
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"

