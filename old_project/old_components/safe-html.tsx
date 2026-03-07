"use client"

import DOMPurify from "dompurify"
import { useMemo } from "react"

type SafeHtmlProps = {
  html: string
  className?: string
  allowIframe?: boolean
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
const IFRAME_ATTR = [
  "src",
  "width",
  "height",
  "style",
  "allow",
  "allowfullscreen",
  "loading",
  "referrerpolicy",
] as const

export function SafeHtml({ html, className, allowIframe = false }: SafeHtmlProps) {
  const clean = useMemo(
    () =>
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS: allowIframe ? [...ALLOWED_TAGS, "iframe"] : [...ALLOWED_TAGS],
        ALLOWED_ATTR: allowIframe ? [...ALLOWED_ATTR, ...IFRAME_ATTR] : [...ALLOWED_ATTR],
      }),
    [allowIframe, html],
  )

  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}
