export type ScanTest = {
  id: string
  name: string
  originalPrice: number
  offerPrice: number
  description: string
  features: string[]
  image: string
}

/** Copy and prices from HealthID `tg` in index.html */
export const SCAN_TESTS: ScanTest[] = [
  {
    id: 'ultrasound',
    name: 'Ultrasound',
    originalPrice: 1500,
    offerPrice: 429,
    description:
      'An ultrasound scan, also known as sonography, is the second most popular image diagnostic test after X-ray. It uses high-frequency sound waves to capture detailed images of body parts and structures.',
    features: ['High-resolution image quality for accurate diagnosis', '100% non-invasive'],
    image: '/landing/scans/ultrasound.webp',
  },
  {
    id: 'digital-xray',
    name: 'Digital X-ray',
    originalPrice: 350,
    offerPrice: 125,
    description:
      'A digital X-ray test is the most common and non-invasive image diagnostic test that has been around for decades. This image testing is ordered to detect, diagnose, and monitor a host of medical issues.',
    features: ['Up to 90% less radiation exposure', 'Enhanced image quality than conventional X-rays'],
    image: '/landing/scans/digital-xray.webp',
  },
  {
    id: 'ecg-test',
    name: 'ECG Test',
    originalPrice: 1050,
    offerPrice: 149,
    description:
      'An ECG or an electrocardiogram test is a non-invasive and painless diagnostic procedure that helps in the detection of heart issues as well as monitoring the overall heart health.',
    features: ['100% non-invasive', 'Instant test reports'],
    image: '/landing/scans/ecg-test.webp',
  },
]

export const SCAN_LAYOUT_OPTIONS = [
  {
    label: 'Option 7',
    title: 'Bottom Sheet',
    note: 'A white sheet docked at the base of the photo — hover to slide up the full details and a booking button.',
  },
  {
    label: 'Option 9',
    title: '3D Flip',
    note: 'Photo and price on the front — hover to flip the card over and reveal the full details on a brand-blue back.',
  },
] as const
