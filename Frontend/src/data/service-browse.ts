import type { ShowcasePackage } from '@/data/landing-showcase'
import {
  AYURVEDA_VERTICALS,
  DOCTOR_VERTICALS,
  HEALTH_VERTICALS,
  PHARMACY_VERTICALS,
  RADIOLOGY_GROUPS,
  type HealthVertical,
  type LandingPackagePreview,
  type RadiologyGroup,
  type RadiologyItem,
} from '@/data/landing-nav-data'

export type BrowseCategoryId =
  | 'blood-test'
  | 'radiology'
  | 'ecg'
  | 'doctor'
  | 'ayurveda'
  | 'pharmacy'

export type BrowseTab = { id: string; label: string }

export type BrowseCategoryMeta = {
  id: BrowseCategoryId
  title: string
  subtitle: string
}

const ECG_VERTICALS = HEALTH_VERTICALS.filter((v) => v.id === 'heart')

export const BROWSE_CATEGORY_META: Record<BrowseCategoryId, BrowseCategoryMeta> = {
  'blood-test': {
    id: 'blood-test',
    title: 'Blood tests',
    subtitle: 'NABL labs · home collection · member rates on every panel',
  },
  radiology: {
    id: 'radiology',
    title: 'Radiology',
    subtitle: 'X-ray, ultrasound, CT & MRI at partner imaging centres',
  },
  ecg: {
    id: 'ecg',
    title: 'ECG & heart checks',
    subtitle: '12-lead ECG and cardiac panels with fast reports',
  },
  doctor: {
    id: 'doctor',
    title: 'Doctor consultation',
    subtitle: 'GP and specialist video consults on HealthID',
  },
  ayurveda: {
    id: 'ayurveda',
    title: 'Ayurveda',
    subtitle: 'Authentic consultations and wellness plans',
  },
  pharmacy: {
    id: 'pharmacy',
    title: 'Pharmacy',
    subtitle: 'Medicines and essentials — launching soon',
  },
}

export function isBrowseCategoryId(id: string | undefined): id is BrowseCategoryId {
  return id != null && id in BROWSE_CATEGORY_META
}

export function slugifyBrowseKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function serviceBrowsePath(categoryId: BrowseCategoryId, tab?: string, item?: string) {
  const params = new URLSearchParams()
  if (tab) params.set('tab', tab)
  if (item) params.set('item', item)
  const q = params.toString()
  return `/browse/${categoryId}${q ? `?${q}` : ''}`
}

function parseInrPrice(price: string): number {
  const match = price.match(/[\d,]+/)
  if (!match) return 0
  return Number(match[0].replace(/,/g, ''))
}

function reportHoursFromLabel(reportIn: string) {
  const m = reportIn.match(/(\d+)/)
  if (/instant/i.test(reportIn)) return 1
  return m ? Number(m[1]) : 24
}

function packageToShowcase(pkg: LandingPackagePreview, vertical: HealthVertical): ShowcasePackage {
  const tests = pkg.tests > 0 ? pkg.tests : 1
  const includes =
    pkg.tests > 1
      ? [...vertical.quickLinks.slice(0, 4), `${tests} parameters in one booking`]
      : [vertical.headline, ...vertical.quickLinks.slice(0, 3)]
  const fasting = vertical.id === 'diabetes' || vertical.id === 'full-body' ? '8–12 hrs fasting' : 'No fasting'
  return {
    id: pkg.id,
    name: pkg.name.toUpperCase(),
    category: vertical.label,
    testCount: tests,
    includes,
    tags: [fasting, 'Recommended for Everyone'],
    memberPrice: pkg.price > 0 ? pkg.price : 399,
    listPrice: pkg.mrp > 0 ? pkg.mrp : 999,
    mrp: pkg.mrp > 0 ? pkg.mrp : 999,
    reportHours: reportHoursFromLabel(pkg.reportIn),
    tint: 'teal',
  }
}

function radiologyItemToShowcase(group: RadiologyGroup, item: RadiologyItem): ShowcasePackage {
  const price = parseInrPrice(item.price)
  const mrp = price > 0 ? Math.round(price * 2.15) : 1999
  const includes = item.detail
    ? [item.detail, `${group.label} at NRI-affiliated centre`, 'Digital report on HealthID']
    : [`${group.label} imaging study`, 'Radiologist-reviewed report', 'Member rate with HealthID Card']
  return {
    id: `rad-${group.id}-${slugifyBrowseKey(item.name)}`,
    name: item.name.toUpperCase(),
    category: group.label,
    testCount: 1,
    includes,
    tags: ['No fasting', 'Recommended for Everyone'],
    memberPrice: price > 0 ? price : 999,
    listPrice: mrp,
    mrp,
    reportHours: 24,
    tint: 'teal',
  }
}

function quickLinkToShowcase(vertical: HealthVertical, link: string): ShowcasePackage {
  const base = vertical.packages[0]
  const price = base?.price && base.price > 0 ? Math.round(base.price * 0.35) : 399
  const mrp = price > 0 ? Math.round(price * 2.4) : 900
  return {
    id: `${vertical.id}-${slugifyBrowseKey(link)}`,
    name: link.toUpperCase(),
    category: vertical.label,
    testCount: 1,
    includes: [link, ...vertical.points.slice(0, 2)],
    tags: ['8–12 hrs fasting', 'Recommended for Everyone'],
    memberPrice: price,
    listPrice: mrp,
    mrp,
    reportHours: 6,
    tint: 'teal',
  }
}

export function browseTabsForCategory(categoryId: BrowseCategoryId): BrowseTab[] {
  switch (categoryId) {
    case 'radiology':
      return RADIOLOGY_GROUPS.map((g) => ({ id: g.id, label: g.label }))
    case 'blood-test':
      return HEALTH_VERTICALS.map((v) => ({ id: v.id, label: v.label }))
    case 'ecg':
      return ECG_VERTICALS.map((v) => ({ id: v.id, label: v.label }))
    case 'doctor':
      return DOCTOR_VERTICALS.map((v) => ({ id: v.id, label: v.label }))
    case 'ayurveda':
      return AYURVEDA_VERTICALS.map((v) => ({ id: v.id, label: v.label }))
    case 'pharmacy':
      return PHARMACY_VERTICALS.map((v) => ({ id: v.id, label: v.label }))
    default:
      return []
  }
}

function verticalsForCategory(categoryId: BrowseCategoryId): HealthVertical[] {
  switch (categoryId) {
    case 'blood-test':
      return HEALTH_VERTICALS
    case 'ecg':
      return ECG_VERTICALS
    case 'doctor':
      return DOCTOR_VERTICALS
    case 'ayurveda':
      return AYURVEDA_VERTICALS
    case 'pharmacy':
      return PHARMACY_VERTICALS
    default:
      return []
  }
}

export function defaultBrowseTab(categoryId: BrowseCategoryId) {
  return browseTabsForCategory(categoryId)[0]?.id ?? ''
}

export function browsePackagesForTab(categoryId: BrowseCategoryId, tabId: string): ShowcasePackage[] {
  if (categoryId === 'radiology') {
    const group = RADIOLOGY_GROUPS.find((g) => g.id === tabId) ?? RADIOLOGY_GROUPS[0]
    return group.items.map((item) => radiologyItemToShowcase(group, item))
  }

  const verticals = verticalsForCategory(categoryId)
  const vertical = verticals.find((v) => v.id === tabId) ?? verticals[0]
  if (!vertical) return []

  const fromPackages = vertical.packages.filter((p) => p.price > 0 || categoryId === 'pharmacy').map((p) => packageToShowcase(p, vertical))
  const fromLinks = vertical.quickLinks.map((link) => quickLinkToShowcase(vertical, link))
  const seen = new Set<string>()
  return [...fromPackages, ...fromLinks].filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })
}

export function resolveBrowseTab(categoryId: BrowseCategoryId, tabParam: string | null) {
  const tabs = browseTabsForCategory(categoryId)
  if (tabParam && tabs.some((t) => t.id === tabParam)) return tabParam
  return tabs[0]?.id ?? ''
}
