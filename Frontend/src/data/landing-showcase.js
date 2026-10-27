export const SHOWCASE_PACKAGES = [];
export const SHOWCASE_CATEGORIES = [
    'Full body',
    'Diabetes',
    'Heart',
    'Thyroid',
    'Vitamins',
    'Liver',
];
export const SHOWCASE_MEMBER_TIERS = [
    { members: 1, multiplier: 1 },
    { members: 2, multiplier: 0.96 },
    { members: 3, multiplier: 0.92 },
    { members: 4, multiplier: 0.9 },
    { members: 5, multiplier: 0.88 },
    { members: 6, multiplier: 0.85 },
];
export const SHOWCASE_VISIBLE_INCLUDES = 5;
export function showcaseMemberPrice(base, members) {
    const tier = SHOWCASE_MEMBER_TIERS.find((t) => t.members === members) ?? SHOWCASE_MEMBER_TIERS[0];
    return Math.round(base * tier.multiplier);
}
export function showcaseMetaLines(pkg) {
    const fasting = pkg.tags[0]?.replace(' fasting', '') ?? '8–12 hrs';
    const audience = pkg.tags[1]?.toLowerCase().includes('men')
        ? 'Recommended for Men'
        : pkg.tags[1]?.toLowerCase().includes('women')
            ? 'Recommended for Women'
            : 'Recommended for Everyone';
    return [`Fasting required (${fasting})`, audience, 'Reports within 6 hours'];
}
