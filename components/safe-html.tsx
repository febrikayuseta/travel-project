"use client"

import DOMPurify from "dompurify"
import { useMemo } from "react"

type SafeHtmlProps = {
  html: string
  className?: string
}

const ALLOWED_TAGS = [
  "p",
  "br",
  "b",
  "strong",
  "i",
  "em",
  "ul",
  "ol",
  "li",
  "a",
  "span",
  "div",
] as const

const ALLOWED_ATTR = ["href", "target", "rel", "class"] as const

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const clean = useMemo(
    () =>
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [...ALLOWED_TAGS],
        ALLOWED_ATTR: [...ALLOWED_ATTR],
      }),
    [html],
  )

  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}

