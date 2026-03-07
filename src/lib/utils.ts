import classNames from "classnames"

export function cn(...inputs: Array<string | undefined | null | false>) {
  return classNames(inputs)
}

export function parseApiData<T>(value: unknown): T {
  if (value && typeof value === "object" && "data" in (value as Record<string, unknown>)) {
    return (value as { data: T }).data
  }
  return value as T
}

