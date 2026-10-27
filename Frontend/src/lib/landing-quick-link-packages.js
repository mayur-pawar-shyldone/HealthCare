import { nameMatchesPackage } from '@/lib/catalog';
/** Jump to another sidebar vertical’s packages when the link names a panel. */
const VERTICAL_ID_BY_LINK = {
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
};
export function packagesForQuickLink(active, link, verticals) {
    const inActive = active.packages.filter((pkg) => nameMatchesPackage(pkg.name, link));
    if (inActive.length)
        return inActive;
    const aliasId = VERTICAL_ID_BY_LINK[link];
    if (aliasId) {
        const vertical = verticals.find((item) => item.id === aliasId);
        if (vertical?.packages.length)
            return vertical.packages;
    }
    const byQuickLink = verticals.find((item) => item.quickLinks.some((q) => q.toLowerCase() === link.toLowerCase()));
    if (byQuickLink && byQuickLink.id !== active.id && byQuickLink.packages.length)
        return byQuickLink.packages;
    const byLabel = verticals.find((item) => item.label.toLowerCase() === link.toLowerCase() || link.toLowerCase().includes(item.label.toLowerCase()));
    if (byLabel && byLabel.id !== active.id && byLabel.packages.length)
        return byLabel.packages;
    const byPackageName = verticals.flatMap((item) => item.packages).filter((pkg) => nameMatchesPackage(pkg.name, link));
    if (byPackageName.length)
        return byPackageName.slice(0, 3);
    return active.packages;
}
export function browseTabForQuickLink(active, link, verticals) {
    const aliasId = VERTICAL_ID_BY_LINK[link];
    if (aliasId && verticals.some((item) => item.id === aliasId))
        return aliasId;
    const pkgs = packagesForQuickLink(active, link, verticals);
    const owner = verticals.find((item) => pkgs.every((pkg) => item.packages.some((vp) => vp.id === pkg.id)));
    return owner?.id ?? active.id;
}
