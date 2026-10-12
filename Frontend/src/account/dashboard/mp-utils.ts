export function dashboardGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function memberInitials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function memberShortName(name: string) {
  return name.split(/\s+/)[0] ?? name
}

export function ageFromDob(dob: string): number | null {
  const parsed = Date.parse(dob.replace(/(\d+)\s(\w+)\s(\d+)/, '$2 $1, $3'))
  if (Number.isNaN(parsed)) return null
  const years = Math.floor((Date.now() - parsed) / (365.25 * 24 * 60 * 60 * 1000))
  return years >= 0 && years < 120 ? years : null
}

export function formatValidTill(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
