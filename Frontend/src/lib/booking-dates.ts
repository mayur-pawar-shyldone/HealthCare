export type CollectionDate = { id: string; iso: string; label: string }

export function isBookingDateIso(value: string | null | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}

export function resolveBookingDateIso(value: string | null | undefined): string | null {
  if (isBookingDateIso(value)) return value
  if (!value) return null
  return upcomingCollectionDates(14).find((d) => d.id === value)?.iso ?? null
}

export function upcomingCollectionDates(count = 7): CollectionDate[] {
  const out: CollectionDate[] = []
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  for (let i = 0; i < count; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    out.push({
      id: iso,
      iso,
      label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    })
  }
  return out
}
