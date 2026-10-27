import { AYURVEDA_VERTICALS, DOCTOR_VERTICALS, HEALTH_VERTICALS, PHARMACY_VERTICALS, RADIOLOGY_GROUPS, } from '@/data/landing-nav-data';
const ECG_VERTICALS = HEALTH_VERTICALS.filter((v) => v.id === 'heart');
export const BROWSE_CATEGORY_META = {
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
};
export function isBrowseCategoryId(id) {
    return id != null && id in BROWSE_CATEGORY_META;
}
export function slugifyBrowseKey(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
export function serviceBrowsePath(categoryId, tab, item) {
    const params = new URLSearchParams();
    if (tab)
        params.set('tab', tab);
    if (item)
        params.set('item', item);
    const q = params.toString();
    return `/browse/${categoryId}${q ? `?${q}` : ''}`;
}
export function browseTabsForCategory(categoryId) {
    switch (categoryId) {
        case 'radiology':
            return RADIOLOGY_GROUPS.map((g) => ({ id: g.id, label: g.label }));
        case 'blood-test':
            return HEALTH_VERTICALS.map((v) => ({ id: v.id, label: v.label }));
        case 'ecg':
            return ECG_VERTICALS.map((v) => ({ id: v.id, label: v.label }));
        case 'doctor':
            return DOCTOR_VERTICALS.map((v) => ({ id: v.id, label: v.label }));
        case 'ayurveda':
            return AYURVEDA_VERTICALS.map((v) => ({ id: v.id, label: v.label }));
        case 'pharmacy':
            return PHARMACY_VERTICALS.map((v) => ({ id: v.id, label: v.label }));
        default:
            return [];
    }
}
export function defaultBrowseTab(categoryId) {
    return browseTabsForCategory(categoryId)[0]?.id ?? '';
}
export function resolveBrowseTab(categoryId, tabParam) {
    const tabs = browseTabsForCategory(categoryId);
    if (tabParam && tabs.some((t) => t.id === tabParam))
        return tabParam;
    return tabs[0]?.id ?? '';
}
