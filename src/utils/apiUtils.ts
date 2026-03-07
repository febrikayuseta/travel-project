export function parseApiData<T>(value: unknown): T {
  if (value && typeof value === 'object' && 'data' in (value as Record<string, unknown>)) {
    return (value as { data: T }).data
  }
  return value as T
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value)
}
