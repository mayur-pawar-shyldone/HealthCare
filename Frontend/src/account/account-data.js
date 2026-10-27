/** One primary holder + up to 4 additional members on a single card. */
export const MAX_FAMILY_MEMBERS = 5;
export const PRIMARY_MEMBER_ID = 'self';
export const ACCOUNT_PACKAGES = [];
export const BOOKING_DATES = [
    { id: 'd1', label: 'Sat 11 Oct', slots: ['6:30–7:30 AM', '7:00–8:00 AM', '8:00–9:00 AM'] },
    { id: 'd2', label: 'Sun 12 Oct', slots: [] },
    { id: 'd3', label: 'Mon 13 Oct', slots: ['7:00–8:00 AM', '9:00–10:00 AM'] },
    { id: 'd4', label: 'Tue 14 Oct', slots: ['6:30–7:30 AM', '8:00–9:00 AM'] },
];
export function createInitialFamily(name, mobile) {
    return [
        { id: 'self', name, relation: 'Self', dob: '14 Aug 1991', phone: mobile, status: 'Active' },
        { id: 'spouse', name: 'Meera Menon', relation: 'Spouse', dob: '02 Jan 1993', phone: '9876501122', status: 'Active' },
        { id: 'father', name: 'Suresh Menon', relation: 'Father', dob: '19 May 1962', phone: '9820012345', status: 'Active' },
    ];
}
export const INITIAL_BOOKINGS = [
    {
        id: 'HID-20418',
        packageId: 'full-body',
        memberId: 'father',
        addressId: 'parents',
        date: 'Tue, 14 Oct',
        slot: '7:00–8:00 AM',
        status: 'Upcoming',
        amount: 1799,
    },
    {
        id: 'HID-19802',
        packageId: 'diabetes',
        memberId: 'self',
        addressId: 'home',
        date: 'Sat, 20 Sep',
        slot: '8:00–9:00 AM',
        status: 'Completed',
        amount: 649,
        report: true,
    },
    {
        id: 'HID-18770',
        packageId: 'heart',
        memberId: 'spouse',
        addressId: 'home',
        date: 'Mon, 4 Aug',
        slot: '6:30–7:30 AM',
        status: 'Cancelled',
        amount: 899,
    },
];
export const INITIAL_ADDRESSES = [
    { id: 'home', label: 'Home', line: '14, Palm Court, Andheri East, Mumbai 400069', note: 'Gate 2, call on arrival' },
    { id: 'parents', label: 'Parents', line: '8, Shanti Nagar, Dadar West, Mumbai 400028', note: 'Third floor, no lift' },
];
export const ACCOUNT_FAQS = [
    {
        id: 'f1',
        category: 'Bookings',
        q: 'How do I reschedule a home visit?',
        a: 'Open Bookings & Reports, find the upcoming visit and tap Reschedule. You can move it up to 2 hours before the slot at no cost.',
    },
    {
        id: 'f2',
        category: 'Bookings',
        q: 'Do I need to fast before my test?',
        a: "Most blood panels need 10–12 hours of fasting. Water is fine. We'll remind you the evening before.",
    },
    {
        id: 'f3',
        category: 'Reports',
        q: 'When is the report ready?',
        a: "Most panels are released within 6 hours of collection. You'll get a WhatsApp message when it's ready.",
    },
    {
        id: 'f4',
        category: 'Reports',
        q: 'Can a doctor explain my report?',
        a: 'Yes. Full Body Advanced includes a physician review call. For other tests, you can book one from your report.',
    },
    {
        id: 'f7',
        category: 'Membership',
        q: 'Can I add a parent?',
        a: 'Yes — one primary member plus up to four others (5 people total). Manage family from Home → Family on this card.',
    },
];
export const ACCOUNT_FAQ_CATEGORIES = ['All', 'Bookings', 'Reports', 'Membership'];
