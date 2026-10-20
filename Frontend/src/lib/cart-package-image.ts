import { SHOWCASE_PACKAGES } from '@/data/landing-showcase'

const PACKAGE_IMAGES: Record<string, string> = {
  'be-healthy-comprehensive': '/landing/services/full-body.webp',
  'summer-wellness-male': '/landing/services/full-body.webp',
  'summer-wellness-female': '/landing/services/full-body.webp',
  'diabetic-panel': '/landing/services/blood-tests.webp',
  'diabetes-care': '/landing/services/blood-tests.webp',
  'heart-health': '/landing/scans/ecg-test.webp',
  'thyroid-complete': '/landing/services/blood-tests.webp',
  'vitamin-essentials': '/landing/services/supplements.webp',
  'liver-function': '/landing/services/blood-tests.webp',
  'bt-essential': '/landing/services/full-body.webp',
  'bt-advanced': '/landing/services/full-body.webp',
  'bt-elite': '/landing/services/full-body.webp',
  'rad-xray': '/landing/scans/digital-xray.webp',
  'rad-ct': '/landing/scans/ultrasound.webp',
  'rad-mri': '/landing/scans/ultrasound.webp',
  'ecg-home': '/landing/scans/ecg-test.webp',
  'ecg-plus': '/landing/scans/ecg-test.webp',
  'ecg-package': '/landing/scans/ecg-test.webp',
  'scan-ultrasound': '/landing/scans/ultrasound.webp',
  'scan-xray': '/landing/scans/digital-xray.webp',
  'scan-ecg': '/landing/scans/ecg-test.webp',
}

const CATEGORY_FALLBACK: Record<string, string> = {
  'Full body': '/landing/services/full-body.webp',
  Diabetes: '/landing/services/blood-tests.webp',
  Heart: '/landing/scans/ecg-test.webp',
  Thyroid: '/landing/services/blood-tests.webp',
  Vitamins: '/landing/services/supplements.webp',
  Liver: '/landing/services/blood-tests.webp',
}

/** Thumbnail for cart rows only — not shown on browse/showcase cards. */
export function resolveCartPackageImage(id: string, stored?: string): string {
  if (stored) return stored
  if (PACKAGE_IMAGES[id]) return PACKAGE_IMAGES[id]
  const showcase = SHOWCASE_PACKAGES.find((p) => p.id === id)
  if (showcase && CATEGORY_FALLBACK[showcase.category]) return CATEGORY_FALLBACK[showcase.category]
  return '/landing/services/blood-tests.webp'
}
