import type { AccountPackage } from '@/account/account-data'
import type { CheckupPackage } from '@/data/landing-checkup-tabs'
import type { FvPackage } from '@/data/landing-healthid-content'
import type { LandingPackagePreview } from '@/data/landing-nav-data'
import type { ShowcasePackage } from '@/data/landing-showcase'
import type { LabTest } from '@/types'

export function testIncludes(test: LabTest): string[] {
  const fromPkg = test.packageTests?.map((p) => p.includedTest.name).filter(Boolean) ?? []
  if (fromPkg.length) return fromPkg
  return test.parameters?.map((p) => p.name).filter(Boolean) ?? []
}

export function testMemberPrice(test: LabTest) {
  return Number(test.memberPrice ?? test.discountedPrice ?? test.price)
}

export function labTestToShowcase(test: LabTest): ShowcasePackage {
  const includes = testIncludes(test)
  const mrp = Number(test.price)
  const memberPrice = testMemberPrice(test)
  return {
    id: test.id,
    name: test.name,
    category: test.category?.name || 'Packages',
    testCount: includes.length || 1,
    includes: includes.length ? includes : [test.shortDescription].filter(Boolean),
    tags: [test.preparation || 'Follow preparation on the report', 'Recommended for Everyone'],
    memberPrice,
    listPrice: mrp,
    mrp,
    reportHours: test.reportHours || 24,
    tint: 'teal',
  }
}

export function labTestToAccountPackage(test: LabTest): AccountPackage {
  const includes = testIncludes(test)
  return {
    id: test.id,
    name: test.name,
    summary: test.shortDescription || test.description || '',
    tests: includes.length || 1,
    price: testMemberPrice(test),
    mrp: Number(test.price),
    time: `${test.reportHours || 6} hours`,
    prep: test.preparation || '',
    includes,
  }
}

export function browseFilter(categoryId: string, test: LabTest) {
  const hay = testHaystack(test)
  if (categoryId === 'blood-test') {
    return (
      test.isPackage ||
      /blood|patholog|health|diabetes|thyroid|vitamin|liver|kidney|full body|package/i.test(hay)
    )
  }
  if (categoryId === 'ecg') return /heart|ecg|cardio|lipid/i.test(hay)
  if (categoryId === 'radiology') return /radio|scan|x-ray|xray|mri|ct|ultrasound|sonograph/i.test(hay)
  if (categoryId === 'doctor') return /consult|doctor|physician/i.test(hay)
  if (categoryId === 'ayurveda') return /ayurved/i.test(hay)
  if (categoryId === 'pharmacy') return /pharma|medicine/i.test(hay)
  return true
}

function testHaystack(test: LabTest) {
  return `${test.name} ${test.slug} ${test.category?.name ?? ''} ${test.category?.slug ?? ''} ${test.shortDescription ?? ''}`
}

export function labTestToPreview(test: LabTest): LandingPackagePreview {
  const includes = testIncludes(test)
  return {
    id: test.id,
    name: test.name,
    tests: includes.length || 1,
    reportIn: `${test.reportHours || 24} hrs`,
    price: testMemberPrice(test),
    mrp: Number(test.price),
    ...(test.isPopular ? { tag: 'Most booked' } : {}),
  }
}

export function labTestToCheckup(test: LabTest): CheckupPackage {
  const includes = testIncludes(test)
  return {
    id: test.id,
    name: test.name,
    testCount: includes.length || 1,
    includes: includes.length ? includes : [test.shortDescription].filter(Boolean),
    fasting: test.preparation || 'Follow preparation on the report',
    recommendedFor: 'Recommended for Everyone',
    reportTime: `Reports within ${test.reportHours || 6} hours`,
    price: testMemberPrice(test),
    mrp: Number(test.price),
  }
}

export function labTestToFv(test: LabTest): FvPackage {
  const includes = testIncludes(test)
  return {
    id: test.id,
    name: test.name,
    summary: test.shortDescription || test.description || '',
    tests: includes.length || 1,
    price: testMemberPrice(test),
    mrp: Number(test.price),
    reportTime: `${test.reportHours || 6} hours`,
    badge: test.isPopular ? 'Most booked' : undefined,
    includes,
  }
}

const NAV_FILTERS: Record<string, RegExp> = {
  'blood-test': /blood|patholog|health|diabetes|thyroid|vitamin|liver|kidney|full body|package|cbc|lipid/i,
  radiology: /radio|scan|x-ray|xray|mri|ct|ultrasound|sonograph/i,
  usg: /ultrasound|sonograph|usg/i,
  obs: /obstetric|pregnan|anomaly|viability|fetal/i,
  vasc: /doppler|vascular/i,
  xray: /x-ray|xray|radiograph|chest|opg|mammograph/i,
  proc: /barium|hsg|ivp|fistulo|mcu|rgu/i,
  ir: /fnac|biopsy|aspiration|drainage/i,
  mri: /mri/i,
  ct: /ct scan|\bct\b|computed tomo/i,
  other: /radio|scan|x-ray|xray|mri|ct|ultrasound/i,
  ecg: /heart|ecg|cardio|lipid/i,
  heart: /heart|ecg|cardio|lipid|cardiac/i,
  'full-body': /full body|comprehensive|wellness|essential|advanced|elite|health package|complete/i,
  cancer: /cancer|tumor|tumour|ca 125|psa|cea|marker/i,
  thyroid: /thyroid|tsh|\bt3\b|\bt4\b/i,
  diabetes: /diabet|hba1c|glucose|insulin|homa/i,
  pregnancy: /pregnan|antenatal|hcg|nipt|fertil/i,
  hormone: /hormone|lh|fsh|prolactin|testosterone|infertil/i,
  doctor: /consult|doctor|physician/i,
  'doc-gp-care': /consult|doctor|physician|gp|general/i,
  'doc-specialist': /specialist|consult/i,
  'doc-cardio': /cardio|heart|consult/i,
  'doc-women': /women|gynaec|gynae/i,
  'doc-peds': /pedia|child/i,
  'doc-mental': /mental|psych/i,
  ayurveda: /ayurved/i,
  'ayu-consult-root': /ayurved/i,
  'ayu-pancha': /pancha|ayurved/i,
  'ayu-herbal': /herbal|ayurved/i,
  'ayu-women': /ayurved|women/i,
  'ayu-stress': /ayurved|stress/i,
  'ayu-weight': /ayurved|weight/i,
  pharmacy: /pharma|medicine/i,
  'ph-rx': /pharma|medicine|prescription/i,
  'ph-supplements': /supplement|vitamin/i,
  'ph-essentials': /pharma|essential/i,
  'ph-chronic': /chronic|pharma/i,
  'ph-family': /family|pharma/i,
}

export function filterTestsForNav(navId: string, test: LabTest) {
  const pattern = NAV_FILTERS[navId]
  if (!pattern) return Boolean(test.isPackage)
  return pattern.test(testHaystack(test))
}

export function pickTestsForNav(navId: string, tests: LabTest[], limit = 6): LabTest[] {
  return tests.filter((t) => filterTestsForNav(navId, t)).slice(0, limit)
}

export function nameMatchesPackage(name: string, link: string) {
  const n = name.toLowerCase()
  const l = link.toLowerCase()
  if (n.includes(l) || l.includes(n)) return true
  return l.split(/\s+/).every((word) => word.length > 2 && n.includes(word))
}
