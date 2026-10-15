export type LandingPackagePreview = {
  id: string
  name: string
  tests: number
  reportIn: string
  price: number
  mrp: number
  tag?: string
}

export type LandingNavCategory = {
  id: string
  label: string
  badge?: string
  headline: string
  points: string[]
  quickLinks: string[]
  packages: LandingPackagePreview[]
}

export type RadiologyItem = {
  name: string
  price: string
  detail?: string
}

export type RadiologyGroup = {
  id: string
  label: string
  note?: string
  items: RadiologyItem[]
}

export const LANDING_NAV_CATEGORIES: LandingNavCategory[] = [
  {
    id: 'blood-test',
    label: 'Blood Test',
    headline: 'Complete blood picture, at home',
    points: [
      'CBC, thyroid & lipids in one draw',
      'NABL labs, barcoded & temp-tracked',
      'Reports in 6 hours + free doctor call',
    ],
    quickLinks: ['CBC', 'Thyroid Profile', 'Lipid Profile', 'Vitamin D & B12'],
    packages: [
      { id: 'bt-essential', name: 'Full Body Essential', tests: 52, reportIn: '24 hrs', price: 999, mrp: 3200 },
      { id: 'bt-advanced', name: 'Full Body Advanced', tests: 84, reportIn: '24 hrs', price: 1799, mrp: 5600, tag: 'Most booked' },
      { id: 'bt-elite', name: 'Full Body Elite', tests: 112, reportIn: '36 hrs', price: 2999, mrp: 9400 },
    ],
  },
  {
    id: 'radiology',
    label: 'Radiology',
    headline: 'Imaging with clarity — X-ray, CT & MRI',
    points: [
      'Digital X-ray, CT-Scan & MRI at partner centres',
      'NABL & NABH accredited imaging labs',
      'Reports reviewed by radiologists',
    ],
    quickLinks: ['X-ray', 'CT-Scan', 'MRI', 'Ultrasound'],
    packages: [
      { id: 'rad-xray', name: 'Digital X-ray', tests: 1, reportIn: '12 hrs', price: 399, mrp: 900 },
      { id: 'rad-ct', name: 'CT-Scan', tests: 1, reportIn: '24 hrs', price: 2499, mrp: 5500, tag: 'Popular' },
      { id: 'rad-mri', name: 'MRI Scan', tests: 1, reportIn: '24 hrs', price: 3999, mrp: 8500 },
    ],
  },
  {
    id: 'ecg',
    label: 'ECG',
    headline: 'Heart rhythm, checked at home',
    points: [
      '12-lead ECG with cardiologist review',
      'Portable device, 5-minute test',
      'Report in 6 hours with guidance',
    ],
    quickLinks: ['ECG at Home', 'Cardiac Consultation', 'Heart Packages'],
    packages: [
      { id: 'ecg-home', name: 'ECG at Home', tests: 1, reportIn: '6 hrs', price: 499, mrp: 999, tag: 'Popular' },
      { id: 'ecg-plus', name: 'ECG + Consultation', tests: 2, reportIn: '6 hrs', price: 899, mrp: 1999 },
      { id: 'ecg-package', name: 'Cardiac Risk Package', tests: 71, reportIn: '12 hrs', price: 2949, mrp: 9829 },
    ],
  },
  {
    id: 'doctor',
    label: 'Doctor Consultation',
    headline: 'Talk to a doctor, anytime',
    points: [
      'GP & specialist video consultations',
      'Prescription & follow-up on app',
      'Free call with every lab report',
    ],
    quickLinks: ['GP Consultation', 'Specialist', 'Second Opinion'],
    packages: [
      { id: 'doc-gp', name: 'GP Consultation', tests: 1, reportIn: 'Instant', price: 299, mrp: 499, tag: 'Popular' },
      { id: 'doc-specialist', name: 'Specialist Consultation', tests: 1, reportIn: 'Instant', price: 499, mrp: 899 },
      { id: 'doc-followup', name: 'Follow-up Consultation', tests: 1, reportIn: 'Instant', price: 199, mrp: 299 },
    ],
  },
  {
    id: 'ayurveda',
    label: 'Ayurveda',
    headline: 'Ancient wellness, modern care',
    points: [
      'Authentic Ayurvedic consultations',
      'Personalized diet & lifestyle plans',
      'Herbal & panchakarma guidance',
    ],
    quickLinks: ['Ayurvedic Consultation', 'Panchakarma', 'Herbal Care'],
    packages: [
      { id: 'ayu-consult', name: 'Ayurvedic Consultation', tests: 1, reportIn: 'Instant', price: 399, mrp: 699, tag: 'New' },
      { id: 'ayu-panchakarma', name: 'Panchakarma Guidance', tests: 1, reportIn: '24 hrs', price: 999, mrp: 1999 },
      { id: 'ayu-herbal', name: 'Herbal Wellness Plan', tests: 1, reportIn: '24 hrs', price: 599, mrp: 1199 },
    ],
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    badge: 'Coming Soon',
    headline: 'Medicines at your doorstep — coming soon',
    points: [
      'Genuine medicines from licensed pharmacies',
      'Prescription upload & verification',
      'Same-day delivery in 6 cities — upcoming',
    ],
    quickLinks: ['Medicines', 'Health Supplements', 'Coming Soon'],
    packages: [
      { id: 'ph-soon-1', name: 'Pharmacy — Coming Soon', tests: 0, reportIn: 'Soon', price: 0, mrp: 0, tag: 'Coming Soon' },
      { id: 'ph-soon-2', name: 'Health Supplements', tests: 0, reportIn: 'Soon', price: 0, mrp: 0, tag: 'Coming Soon' },
      { id: 'ph-soon-3', name: 'Daily Essentials', tests: 0, reportIn: 'Soon', price: 0, mrp: 0 },
    ],
  },
]

export type HealthVertical = {
  id: string
  label: string
  subtitle: string
  headline: string
  points: string[]
  quickLinks: string[]
  packages: LandingPackagePreview[]
}

const _heartVertical = {
  id: 'heart',
  label: 'Heart',
  subtitle: 'ECG + lipids',
  headline: 'Keep your heart in check — ECG, lipids & more',
  points: [
    '12-lead ECG with cardiologist review',
    'Lipid & cardiac risk markers',
    'NABL accredited labs',
  ],
  quickLinks: ['ECG', 'Lipid Profile', 'Cardiac Risk'],
  packages: [
    { id: 'ecg-home', name: 'ECG at Home', tests: 1, reportIn: '6 hrs', price: 499, mrp: 999, tag: 'Popular' },
    { id: 'heart-basic', name: 'Heart Basic', tests: 28, reportIn: '12 hrs', price: 899, mrp: 2200 },
    { id: 'heart-advanced', name: 'Cardiac Risk Package', tests: 71, reportIn: '12 hrs', price: 2949, mrp: 9829, tag: 'Most booked' },
  ],
} satisfies HealthVertical

export const HEALTH_VERTICALS: HealthVertical[] = [
  {
    id: 'full-body',
    label: 'Full Body Checkup',
    subtitle: '52-112 tests',
    headline: 'Complete blood picture, at home',
    points: [
      'CBC, thyroid & lipids in one draw',
      'NABL labs, barcoded & temp-tracked',
      'Reports in 6 hours + free doctor call',
    ],
    quickLinks: ['CBC', 'Thyroid Profile', 'Lipid Profile', 'Vitamin D & B12'],
    packages: [
      { id: 'fb-essential', name: 'Full Body Essential', tests: 52, reportIn: '24 hrs', price: 999, mrp: 3200 },
      { id: 'fb-advanced', name: 'Full Body Advanced', tests: 84, reportIn: '24 hrs', price: 1799, mrp: 5600, tag: 'Most booked' },
      { id: 'fb-elite', name: 'Full Body Elite', tests: 112, reportIn: '36 hrs', price: 2999, mrp: 9400 },
    ],
  },
  _heartVertical,
  {
    id: 'cancer',
    label: 'Cancer',
    subtitle: 'Tumor markers',
    headline: 'Early detection saves lives',
    points: [
      'Tumor markers for men & women',
      'Barcoded, temp-tracked samples',
      'Oncologist consultation available',
    ],
    quickLinks: ['CA 125', 'PSA', 'CEA'],
    packages: [
      { id: 'cancer-female', name: 'Cancer Marker - Female', tests: 8, reportIn: '24 hrs', price: 1999, mrp: 4500 },
      { id: 'cancer-male', name: 'Cancer Marker - Male', tests: 9, reportIn: '24 hrs', price: 2199, mrp: 4800, tag: 'Recommended' },
      { id: 'cancer-comprehensive', name: 'Comprehensive Cancer Screen', tests: 15, reportIn: '36 hrs', price: 4999, mrp: 9500 },
    ],
  },
  {
    id: 'thyroid',
    label: 'Thyroid',
    subtitle: 'T3 T4 TSH',
    headline: 'Thyroid health, simplified',
    points: ['T3, T4 & TSH in one draw', 'No fasting required', 'Reports in 6 hours'],
    quickLinks: ['TSH', 'T3 T4', 'Thyroid Profile'],
    packages: [
      { id: 'thyroid-basic', name: 'Thyroid Profile - Basic', tests: 3, reportIn: '6 hrs', price: 399, mrp: 900 },
      { id: 'thyroid-advanced', name: 'Thyroid Advanced', tests: 5, reportIn: '6 hrs', price: 799, mrp: 1800, tag: 'Most booked' },
      { id: 'thyroid-comprehensive', name: 'Thyroid Comprehensive', tests: 8, reportIn: '12 hrs', price: 1299, mrp: 2800 },
    ],
  },
  {
    id: 'diabetes',
    label: 'Diabetes',
    subtitle: 'HbA1c & more',
    headline: 'Manage diabetes with confidence',
    points: ['HbA1c & glucose panels', 'Home collection, 6-hr reports', 'Track trends over time'],
    quickLinks: ['HbA1c', 'Fasting Glucose', 'Diabetes Panel'],
    packages: [
      { id: 'diabetes-hba1c', name: 'HbA1c', tests: 1, reportIn: '6 hrs', price: 299, mrp: 600 },
      { id: 'diabetes-essential', name: 'Diabetes Essential', tests: 12, reportIn: '12 hrs', price: 699, mrp: 1500 },
      { id: 'diabetes-advanced', name: 'Diabetes Advanced', tests: 32, reportIn: '24 hrs', price: 1499, mrp: 3200, tag: 'Popular' },
    ],
  },
  {
    id: 'pregnancy',
    label: 'Pregnancy',
    subtitle: 'Antenatal',
    headline: 'Care for you and your baby',
    points: [
      'Antenatal screenings & NIPT',
      'NABL labs, doctor guidance',
      'Safe home sample collection',
    ],
    quickLinks: ['Beta hCG', 'Antenatal Panel', 'NIPT'],
    packages: [
      { id: 'preg-early', name: 'Early Pregnancy Panel', tests: 6, reportIn: '12 hrs', price: 799, mrp: 1800 },
      { id: 'preg-comprehensive', name: 'Comprehensive Antenatal', tests: 18, reportIn: '24 hrs', price: 2499, mrp: 5500, tag: 'Recommended' },
      { id: 'preg-nipt', name: 'NIPT - Genetic Screening', tests: 1, reportIn: '7 days', price: 14999, mrp: 22000 },
    ],
  },
  {
    id: 'hormone',
    label: 'Hormone',
    subtitle: 'Hormones',
    headline: 'Balance your hormones',
    points: ['LH, FSH, Prolactin & more', 'For men & women', 'Endocrinologist reviewed reports'],
    quickLinks: ['LH FSH', 'Prolactin', 'Testosterone'],
    packages: [
      { id: 'hormone-female', name: 'Hormone Panel - Female', tests: 7, reportIn: '24 hrs', price: 1199, mrp: 2800 },
      { id: 'hormone-male', name: 'Hormone Panel - Male', tests: 6, reportIn: '24 hrs', price: 1099, mrp: 2600 },
      { id: 'hormone-pcos', name: 'PCOS Panel', tests: 11, reportIn: '24 hrs', price: 1999, mrp: 4200, tag: 'Popular' },
    ],
  },
]

export const DOCTOR_VERTICALS: HealthVertical[] = [
  {
    id: 'doc-gp-care',
    label: 'GP & primary care',
    subtitle: 'Video · Instant',
    headline: 'Talk to a doctor, anytime',
    points: [
      'GP & family physician video calls',
      'Prescription & follow-up on app',
      'Free call with every lab report',
    ],
    quickLinks: ['GP Consultation', 'Follow-up', 'Prescription'],
    packages: [
      { id: 'doc-gp', name: 'GP Consultation', tests: 1, reportIn: 'Instant', price: 299, mrp: 499, tag: 'Popular' },
      { id: 'doc-followup', name: 'Follow-up Consultation', tests: 1, reportIn: 'Instant', price: 199, mrp: 299 },
      { id: 'doc-tele-rx', name: 'Tele-consult + prescription', tests: 1, reportIn: 'Instant', price: 349, mrp: 549 },
    ],
  },
  {
    id: 'doc-specialist',
    label: 'Specialist',
    subtitle: 'Expert opinion',
    headline: 'Specialist video consultations',
    points: ['Cardiology, dermatology & more', 'Share reports before the call', 'Follow-up slots available'],
    quickLinks: ['Specialist', 'Second opinion', 'Report review'],
    packages: [
      { id: 'doc-specialist', name: 'Specialist Consultation', tests: 1, reportIn: 'Instant', price: 499, mrp: 899, tag: 'Most booked' },
      { id: 'doc-second', name: 'Second opinion', tests: 1, reportIn: 'Instant', price: 699, mrp: 1299 },
      { id: 'doc-report', name: 'Report review call', tests: 1, reportIn: 'Instant', price: 399, mrp: 699 },
    ],
  },
  {
    id: 'doc-cardio',
    label: 'Heart & BP',
    subtitle: 'Cardiac consult',
    headline: 'Cardiologist guidance after labs or ECG',
    points: ['Ideal after ECG or cardiac panels', 'Medication & lifestyle advice', 'Member pricing on packages'],
    quickLinks: ['Cardiology', 'ECG follow-up', 'BP management'],
    packages: [
      { id: 'doc-cardio', name: 'Cardiology consult', tests: 1, reportIn: 'Instant', price: 599, mrp: 999 },
      { id: 'doc-bp', name: 'BP management consult', tests: 1, reportIn: 'Instant', price: 399, mrp: 649 },
      { id: 'doc-ecg-review', name: 'ECG report review', tests: 1, reportIn: 'Instant', price: 449, mrp: 799, tag: 'Popular' },
    ],
  },
  {
    id: 'doc-women',
    label: "Women's health",
    subtitle: 'Gynaec · wellness',
    headline: 'Consults for women’s health concerns',
    points: ['Gynaecology & wellness', 'Antenatal guidance', 'Private video consults'],
    quickLinks: ['Gynaecology', 'Antenatal', 'PCOS'],
    packages: [
      { id: 'doc-gynaec', name: 'Gynaecology consult', tests: 1, reportIn: 'Instant', price: 499, mrp: 899 },
      { id: 'doc-ante', name: 'Antenatal consult', tests: 1, reportIn: 'Instant', price: 449, mrp: 799 },
      { id: 'doc-pcos', name: 'PCOS consult', tests: 1, reportIn: 'Instant', price: 499, mrp: 849 },
    ],
  },
  {
    id: 'doc-peds',
    label: 'Child & family',
    subtitle: 'Pediatrics',
    headline: 'Paediatrician for your child',
    points: ['Fever, growth & vaccination queries', 'Family plans on HealthID Card', 'Evening slots available'],
    quickLinks: ['Pediatrics', 'Vaccination', 'Family plan'],
    packages: [
      { id: 'doc-peds', name: 'Pediatrics consult', tests: 1, reportIn: 'Instant', price: 399, mrp: 699 },
      { id: 'doc-vax', name: 'Vaccination guidance', tests: 1, reportIn: 'Instant', price: 299, mrp: 499 },
      { id: 'doc-family', name: 'Family doctor slot', tests: 1, reportIn: 'Instant', price: 349, mrp: 599 },
    ],
  },
  {
    id: 'doc-mental',
    label: 'Mind & sleep',
    subtitle: 'Counselling',
    headline: 'Mental wellness consults',
    points: ['Stress, anxiety & sleep', 'Confidential video sessions', 'Follow-up care plans'],
    quickLinks: ['Counselling', 'Sleep', 'Stress'],
    packages: [
      { id: 'doc-counselling', name: 'Counselling session', tests: 1, reportIn: 'Instant', price: 499, mrp: 899 },
      { id: 'doc-sleep', name: 'Sleep consult', tests: 1, reportIn: 'Instant', price: 449, mrp: 799 },
      { id: 'doc-stress', name: 'Stress management', tests: 1, reportIn: 'Instant', price: 399, mrp: 699 },
    ],
  },
]

export const AYURVEDA_VERTICALS: HealthVertical[] = [
  {
    id: 'ayu-consult-root',
    label: 'Ayurvedic consult',
    subtitle: 'Prakriti · diet',
    headline: 'Ancient wellness, modern care',
    points: [
      'Authentic Ayurvedic consultations',
      'Personalized diet & lifestyle plans',
      'Herbal & panchakarma guidance',
    ],
    quickLinks: ['Ayurvedic Consultation', 'Prakriti', 'Diet plan'],
    packages: [
      { id: 'ayu-consult', name: 'Ayurvedic Consultation', tests: 1, reportIn: 'Instant', price: 399, mrp: 699, tag: 'New' },
      { id: 'ayu-diet', name: 'Personalized diet plan', tests: 1, reportIn: '24 hrs', price: 499, mrp: 899 },
      { id: 'ayu-prakriti', name: 'Prakriti assessment', tests: 1, reportIn: '24 hrs', price: 599, mrp: 1099, tag: 'Popular' },
    ],
  },
  {
    id: 'ayu-pancha',
    label: 'Panchakarma',
    subtitle: 'Detox programs',
    headline: 'Panchakarma & detox guidance',
    points: ['Centre & home protocols', 'Licensed Ayurveda partners', 'Member advisory support'],
    quickLinks: ['Panchakarma', 'Detox', 'Rejuvenation'],
    packages: [
      { id: 'ayu-panchakarma', name: 'Panchakarma Guidance', tests: 1, reportIn: '24 hrs', price: 999, mrp: 1999, tag: 'Most booked' },
      { id: 'ayu-detox', name: 'Weekend detox plan', tests: 1, reportIn: '24 hrs', price: 799, mrp: 1499 },
      { id: 'ayu-rejuvenation', name: 'Rejuvenation package', tests: 1, reportIn: '48 hrs', price: 1499, mrp: 2999 },
    ],
  },
  {
    id: 'ayu-herbal',
    label: 'Herbal care',
    subtitle: 'Formulations',
    headline: 'Herbal wellness plans',
    points: ['Classical & safe formulations', 'Guidance on interactions', 'Ships where available'],
    quickLinks: ['Herbal Care', 'Immunity', 'Digestion'],
    packages: [
      { id: 'ayu-herbal', name: 'Herbal Wellness Plan', tests: 1, reportIn: '24 hrs', price: 599, mrp: 1199 },
      { id: 'ayu-immunity', name: 'Immunity booster plan', tests: 1, reportIn: '24 hrs', price: 699, mrp: 1299 },
      { id: 'ayu-digest', name: 'Digestive herbal care', tests: 1, reportIn: '24 hrs', price: 549, mrp: 999 },
    ],
  },
  {
    id: 'ayu-women',
    label: "Women's Ayurveda",
    subtitle: 'Hormonal balance',
    headline: 'Ayurveda for women’s health',
    points: ['PCOS & hormonal support', 'Antenatal Ayurveda', 'Skin & hair care'],
    quickLinks: ['PCOS', 'Antenatal', 'Skin & hair'],
    packages: [
      { id: 'ayu-pcos', name: 'PCOS Ayurveda plan', tests: 1, reportIn: '24 hrs', price: 899, mrp: 1799 },
      { id: 'ayu-ante-ayu', name: 'Antenatal Ayurveda', tests: 1, reportIn: '24 hrs', price: 799, mrp: 1499 },
      { id: 'ayu-skin', name: 'Skin & hair program', tests: 1, reportIn: '24 hrs', price: 649, mrp: 1199 },
    ],
  },
  {
    id: 'ayu-stress',
    label: 'Stress & sleep',
    subtitle: 'Rasayana',
    headline: 'Calm mind, balanced body',
    points: ['Stress & sleep protocols', 'Breath & routine coaching', 'Follow-up check-ins'],
    quickLinks: ['Stress', 'Sleep', 'Rasayana'],
    packages: [
      { id: 'ayu-stress', name: 'Stress relief program', tests: 1, reportIn: '24 hrs', price: 749, mrp: 1399 },
      { id: 'ayu-sleep', name: 'Sleep wellness plan', tests: 1, reportIn: '24 hrs', price: 699, mrp: 1299 },
      { id: 'ayu-rasayana', name: 'Rasayana rejuvenation', tests: 1, reportIn: '48 hrs', price: 1299, mrp: 2499 },
    ],
  },
  {
    id: 'ayu-weight',
    label: 'Weight & metabolism',
    subtitle: 'Agni balance',
    headline: 'Metabolic balance with Ayurveda',
    points: ['Weight & metabolism focus', 'Works with lab reports', 'Sustainable routines'],
    quickLinks: ['Weight', 'Metabolism', 'Diabetes support'],
    packages: [
      { id: 'ayu-weight', name: 'Weight management plan', tests: 1, reportIn: '24 hrs', price: 899, mrp: 1699 },
      { id: 'ayu-meta', name: 'Metabolism boost plan', tests: 1, reportIn: '24 hrs', price: 799, mrp: 1499 },
      { id: 'ayu-diabetes-ayu', name: 'Diabetes Ayurveda support', tests: 1, reportIn: '24 hrs', price: 849, mrp: 1599 },
    ],
  },
]

export const PHARMACY_VERTICALS: HealthVertical[] = [
  {
    id: 'ph-rx',
    label: 'Prescription medicines',
    subtitle: 'Coming soon',
    headline: 'Medicines at your doorstep — coming soon',
    points: [
      'Genuine medicines from licensed pharmacies',
      'Prescription upload & verification',
      'Same-day delivery in 6 cities — upcoming',
    ],
    quickLinks: ['Medicines', 'Upload Rx', 'Refills'],
    packages: [
      { id: 'ph-soon-1', name: 'Pharmacy — Coming Soon', tests: 0, reportIn: 'Soon', price: 0, mrp: 0, tag: 'Coming Soon' },
      { id: 'ph-rx-upload', name: 'Upload prescription', tests: 0, reportIn: 'Soon', price: 0, mrp: 0, tag: 'Coming Soon' },
      { id: 'ph-refill', name: 'Chronic refills', tests: 0, reportIn: 'Soon', price: 0, mrp: 0 },
    ],
  },
  {
    id: 'ph-supplements',
    label: 'Health supplements',
    subtitle: 'Vitamins · protein',
    headline: 'Supplements with pharmacist check',
    points: ['Member-priced catalogue upcoming', 'Quality-assured brands', 'Advisory on interactions'],
    quickLinks: ['Vitamins', 'Protein', 'Immunity'],
    packages: [
      { id: 'ph-soon-2', name: 'Health Supplements', tests: 0, reportIn: 'Soon', price: 0, mrp: 0, tag: 'Coming Soon' },
      { id: 'ph-vit', name: 'Vitamin bundles', tests: 0, reportIn: 'Soon', price: 0, mrp: 0 },
      { id: 'ph-protein', name: 'Protein & sports', tests: 0, reportIn: 'Soon', price: 0, mrp: 0 },
    ],
  },
  {
    id: 'ph-essentials',
    label: 'Daily essentials',
    subtitle: 'OTC · hygiene',
    headline: 'Everyday health essentials',
    points: ['OTC & personal care', 'Bundled with lab bookings', 'Launching with pharmacy'],
    quickLinks: ['OTC', 'Hygiene', 'First aid'],
    packages: [
      { id: 'ph-soon-3', name: 'Daily Essentials', tests: 0, reportIn: 'Soon', price: 0, mrp: 0, tag: 'Coming Soon' },
      { id: 'ph-otc', name: 'OTC medicines', tests: 0, reportIn: 'Soon', price: 0, mrp: 0 },
      { id: 'ph-firstaid', name: 'First aid kits', tests: 0, reportIn: 'Soon', price: 0, mrp: 0 },
    ],
  },
  {
    id: 'ph-chronic',
    label: 'Chronic care',
    subtitle: 'Diabetes · BP',
    headline: 'Refills for long-term therapy',
    points: ['Diabetes & BP refills', 'Reminders on HealthID app', 'Pharmacist verification'],
    quickLinks: ['Diabetes', 'BP', 'Thyroid meds'],
    packages: [
      { id: 'ph-chronic', name: 'Chronic care refills', tests: 0, reportIn: 'Soon', price: 0, mrp: 0, tag: 'Coming Soon' },
      { id: 'ph-diabetes-med', name: 'Diabetes medicines', tests: 0, reportIn: 'Soon', price: 0, mrp: 0 },
      { id: 'ph-bp-med', name: 'BP medicines', tests: 0, reportIn: 'Soon', price: 0, mrp: 0 },
    ],
  },
  {
    id: 'ph-family',
    label: 'Family on card',
    subtitle: '6 members',
    headline: 'Order for anyone on your card',
    points: ['Family profiles on HealthID Card', 'Single checkout upcoming', 'Wallet credits at launch'],
    quickLinks: ['Family', 'Wallet', 'HealthID Card'],
    packages: [
      { id: 'ph-family', name: 'Family pharmacy profile', tests: 0, reportIn: 'Soon', price: 0, mrp: 0 },
      { id: 'ph-wallet', name: 'Pay with wallet', tests: 0, reportIn: 'Soon', price: 0, mrp: 0, tag: 'Coming Soon' },
      { id: 'ph-notify', name: 'Notify me at launch', tests: 0, reportIn: 'Soon', price: 0, mrp: 0 },
    ],
  },
]

export const RADIOLOGY_GROUPS: RadiologyGroup[] = [
  {
    id: 'usg',
    label: 'Ultrasonography',
    items: [
      { name: 'Abdomen & Pelvis', price: '₹1,600' },
      { name: 'Small parts ultrasonography', detail: 'B-scan, scrotum, neck, thorax, neuro, breast, swelling, TRUS, MSK, perineal', price: '₹2,500' },
      { name: 'Abdomen + Scrotum', price: '₹4,100' },
      { name: 'Follicular study', detail: '5 visits, then ₹300 per visit', price: '₹1,800' },
      { name: 'Pelvis (TAS + TVS)', price: '₹1,800' },
      { name: 'TVS — transvaginal sonography', price: '₹200 extra' },
    ],
  },
  {
    id: 'obs',
    label: 'Obstetrics',
    items: [
      { name: 'Routine / dating / viability scan', price: '₹1,700' },
      { name: 'NT & NFT scan', detail: 'Up to 17 weeks', price: '₹2,500' },
      { name: 'Anomaly scan', price: '₹3,500' },
      { name: 'Follow-up anomaly scan', price: '₹3,500' },
      { name: 'USG with fetal echo or neurosonogram', price: '₹3,000' },
      { name: '3D / 4D USG', price: '₹4,000' },
      { name: 'Growth scan / obstetric colour Doppler', price: '₹3,000' },
      { name: 'Multiple pregnancy', price: 'As per study' },
      { name: 'Abdomen with obstetric scan', price: '₹1,600 + study' },
    ],
  },
  {
    id: 'vasc',
    label: 'Vascular studies',
    items: [
      { name: 'Neck Doppler', detail: 'Carotid, IJV, hepatic, mesenteric, pelvic', price: '₹3,000' },
      { name: 'Renal Doppler', price: '₹3,000' },
      { name: 'Peripheral Doppler', detail: 'Single limb, single system', price: '₹3,500' },
      { name: 'A.V. fistula Doppler', price: '₹3,000' },
      { name: 'Small part, endometrial or scrotal Doppler', price: '₹3,000' },
    ],
  },
  {
    id: 'xray',
    label: 'Radiograph',
    items: [
      { name: 'Chest', price: '₹600' },
      { name: 'Joint / extremity AP & lateral', price: '₹900' },
      { name: 'Joint / extremity AP, lateral & oblique', price: '₹1,000' },
      { name: 'Spine AP & lateral', price: '₹1,000' },
      { name: 'OPG', price: '₹800' },
      { name: 'Lateral cephalogram', price: '₹600' },
      { name: 'Scanogram', detail: 'Knee and spine', price: '₹2,000' },
      { name: 'Digital mammography with sonomammography', price: '₹3,500' },
    ],
  },
  {
    id: 'proc',
    label: 'Procedures',
    items: [
      { name: 'Barium swallow', price: '₹4,500' },
      { name: 'Barium meal', price: '₹4,500' },
      { name: 'Barium meal follow through', price: '₹5,000' },
      { name: 'Barium enema', price: '₹5,000' },
      { name: 'HSG', price: '₹5,000' },
      { name: 'IVP', price: '₹5,000' },
      { name: 'PCN-o-gram / loop-o-gram', price: '₹4,000' },
      { name: 'Fistulography', price: '₹4,500' },
      { name: 'RGU', price: '₹4,500' },
      { name: 'RGU + MCU', price: '₹7,000' },
      { name: 'MCU', price: '₹4,500' },
    ],
  },
  {
    id: 'ir',
    label: 'Interventional',
    note: 'Consumables and medicines extra',
    items: [
      { name: 'FNAC', price: '₹4,000' },
      { name: 'Aspiration', price: '₹6,000' },
      { name: 'Drainage procedures', price: '₹8,000' },
      { name: 'Biopsy', detail: '₹8,000 USG · ₹12,000 CT', price: '₹8,000' },
    ],
  },
  {
    id: 'mri',
    label: 'MRI',
    items: [
      { name: 'Brain / abdomen / pelvis', price: '₹6,800' },
      { name: 'Brain angio / veno / spectro', price: '₹12,000' },
      { name: 'Brain CISS, vertigo, epilepsy, MTS', price: '₹6,800' },
      { name: 'Spine — cervical, dorsal or lumbar', price: '₹6,800' },
      { name: 'Spine with whole-spine screening', price: '₹6,800' },
      { name: 'Plexus — brachial or lumbar', price: '₹6,800' },
      { name: 'Single joint', detail: 'Shoulder, elbow, wrist, hip, knee, ankle', price: '₹6,800' },
      { name: 'Single extremity', detail: 'Arm, forearm, hand, thigh, leg, foot', price: '₹6,800' },
      { name: 'Abdomen / pelvis', price: '₹6,800' },
      { name: 'MRCP', price: '₹7,500' },
      { name: 'MRI fistulography', price: '₹6,800' },
      { name: 'MRI mammography', price: '₹12,000' },
      { name: 'Limb angio / veno / neurography', price: '₹12,000' },
      { name: 'Functional MRI', price: '₹12,000' },
      { name: 'Cardiac MRI', price: '₹15,000' },
      { name: 'Pituitary dynamic', price: '₹12,000' },
      { name: 'TMJ bilateral', price: '₹6,800' },
      { name: 'Tractography', price: '₹13,000' },
      { name: 'Contrast or extra screening', price: '₹3,200' },
    ],
  },
  {
    id: 'ct',
    label: 'CT scan',
    items: [
      { name: 'Brain / PNS', price: '₹3,200' },
      { name: 'Adenoids', price: '₹2,000' },
      { name: 'Abdomen / KUB — plain', price: '₹6,000' },
      { name: 'CT urography', price: '₹9,500' },
      { name: 'Single spine', detail: 'Cervical, dorsal or lumbar', price: '₹5,500' },
      { name: 'HRCT lung / temporal bone', price: '₹5,000' },
      { name: '3D CT — joint or face', price: '₹5,500' },
      { name: 'Neck with contrast', price: '₹8,500' },
      { name: 'Pulmonary angiography', price: '₹11,000' },
      { name: 'Triphasic abdomen', price: '₹9,500' },
      { name: 'Angio / veno, single system', price: '₹11,000' },
      { name: 'Cardiac CT', price: '₹15,000' },
      { name: 'Contrast or extra screening', price: '₹3,200' },
    ],
  },
  {
    id: 'other',
    label: 'Other charges',
    items: [
      { name: 'Extra films', price: '₹250 / film' },
      { name: 'Duplicate report', price: 'On request' },
      { name: 'Night emergency', price: 'On request' },
      { name: 'Sunday charges', price: 'On request' },
      { name: 'CD / pen drive', price: 'On request' },
      { name: 'Anesthesia, sedation or short GA', price: 'As per study' },
      { name: 'Ambulance', price: 'On request' },
    ],
  },
]

function radiologyParseInr(price: string): number {
  const match = price.match(/[\d,]+/)
  return match ? Number(match[0].replace(/,/g, '')) : 0
}

function radiologySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

function radiologyItemToPackage(group: RadiologyGroup, item: RadiologyItem): LandingPackagePreview {
  const price = radiologyParseInr(item.price)
  const mrp = price > 0 ? Math.round(price * 2.15) : 1999
  const name = item.detail ? `${item.name} — ${item.detail}` : item.name
  return {
    id: `rad-${group.id}-${radiologySlug(item.name)}`,
    name,
    tests: 1,
    reportIn: '24 hrs',
    price: price > 0 ? price : 0,
    mrp,
    ...(price <= 0 ? { tag: 'On request' } : {}),
  }
}

function quickLinksForRadiologyGroup(group: RadiologyGroup): string[] {
  const links: string[] = []
  for (const item of group.items) {
    const label = item.name.length > 30 ? `${item.name.slice(0, 28)}…` : item.name
    if (links.length >= 4) break
    links.push(label)
  }
  return links
}

/** Radiology mega-menu panels — same shape as blood-test / ECG verticals. */
export const RADIOLOGY_VERTICALS: HealthVertical[] = RADIOLOGY_GROUPS.map((group) => ({
  id: group.id,
  label: group.label,
  subtitle: `${group.items.length} studies`,
  headline: group.note ?? `${group.label} at member rates in Nashik`,
  points: [
    'NRI-affiliated imaging centres in Nashik',
    'Digital reports with radiologist review',
    'HealthID Card member pricing on every study',
  ],
  quickLinks: quickLinksForRadiologyGroup(group),
  packages: group.items.map((item) => radiologyItemToPackage(group, item)),
}))
