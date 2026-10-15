import type { HealthVertical, LandingPackagePreview } from '@/data/landing-nav-data'

/** Standalone tests for mega-menu quick-link previews (rates aligned with rate list). */
const SYNTHETIC_BY_LINK: Record<string, LandingPackagePreview> = {
  CBC: {
    id: 'ql-cbc',
    name: 'Complete Blood Count (CBC)',
    tests: 1,
    reportIn: '6 hrs',
    price: 150,
    mrp: 350,
    tag: 'Popular',
  },
  'Vitamin D & B12': {
    id: 'ql-vitd-b12',
    name: 'Vitamin D & B12',
    tests: 2,
    reportIn: '24 hrs',
    price: 899,
    mrp: 1800,
  },
}

/** Jump to another sidebar vertical’s packages when the link names a panel. */
const VERTICAL_ID_BY_LINK: Record<string, string> = {
  'Thyroid Profile': 'thyroid',
  TSH: 'thyroid',
  'T3 T4': 'thyroid',
  'Lipid Profile': 'heart',
  'Cardiac Risk': 'heart',
  ECG: 'heart',
  HbA1c: 'diabetes',
  'Fasting Glucose': 'diabetes',
  'Diabetes Panel': 'diabetes',
  'CA 125': 'cancer',
  PSA: 'cancer',
  CEA: 'cancer',
  'Beta hCG': 'pregnancy',
  'Antenatal Panel': 'pregnancy',
  NIPT: 'pregnancy',
  'LH FSH': 'hormone',
  Prolactin: 'hormone',
  Testosterone: 'hormone',
}

function nameMatchesLink(name: string, link: string) {
  const n = name.toLowerCase()
  const l = link.toLowerCase()
  if (n.includes(l) || l.includes(n)) return true
  return l.split(/\s+/).every((word) => word.length > 2 && n.includes(word))
}

export function packagesForQuickLink(
  active: HealthVertical,
  link: string,
  verticals: HealthVertical[],
): LandingPackagePreview[] {
  const synthetic = SYNTHETIC_BY_LINK[link]
  if (synthetic) return [synthetic]

  const inActive = active.packages.filter((p) => nameMatchesLink(p.name, link))
  if (inActive.length) return inActive

  const aliasId = VERTICAL_ID_BY_LINK[link]
  if (aliasId) {
    const vertical = verticals.find((v) => v.id === aliasId)
    if (vertical?.packages.length) return vertical.packages
  }

  const byQuickLink = verticals.find((v) => v.quickLinks.some((q) => q.toLowerCase() === link.toLowerCase()))
  if (byQuickLink && byQuickLink.id !== active.id) return byQuickLink.packages

  const byLabel = verticals.find(
    (v) => v.label.toLowerCase() === link.toLowerCase() || link.toLowerCase().includes(v.label.toLowerCase()),
  )
  if (byLabel && byLabel.id !== active.id) return byLabel.packages

  const byPackageName = verticals.flatMap((v) => v.packages).filter((p) => nameMatchesLink(p.name, link))
  if (byPackageName.length) return byPackageName.slice(0, 3)

  return active.packages
}

export function browseTabForQuickLink(
  active: HealthVertical,
  link: string,
  verticals: HealthVertical[],
): string {
  const aliasId = VERTICAL_ID_BY_LINK[link]
  if (aliasId && verticals.some((v) => v.id === aliasId)) return aliasId

  const pkgs = packagesForQuickLink(active, link, verticals)
  const owner = verticals.find((v) => pkgs.every((p) => v.packages.some((vp) => vp.id === p.id)))
  return owner?.id ?? active.id
}
