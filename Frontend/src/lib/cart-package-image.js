const PACKAGE_IMAGES = {
    'be-healthy-comprehensive': '/landing/services/full-body.webp',
    'summer-wellness-male': '/landing/services/full-body.webp',
    'summer-wellness-female': '/landing/services/full-body.webp',
    'diabetic-panel': '/landing/services/blood-tests.webp',
    'diabetes-care': '/landing/services/blood-tests.webp',
    'heart-health': '/landing/scans/ecg-test.webp',
    'thyroid-complete': '/landing/services/blood-tests.webp',
    'vitamin-essentials': '/landing/services/supplements.webp',
    'liver-function': '/landing/services/blood-tests.webp',
};
/** Thumbnail for cart rows only — not shown on browse/showcase cards. */
export function resolveCartPackageImage(id, stored) {
    if (stored)
        return stored;
    if (PACKAGE_IMAGES[id])
        return PACKAGE_IMAGES[id];
    const hay = id.toLowerCase();
    if (/heart|ecg|cardio/.test(hay))
        return '/landing/scans/ecg-test.webp';
    if (/vitamin|supplement/.test(hay))
        return '/landing/services/supplements.webp';
    if (/xray|x-ray|mri|ct|ultrasound|scan/.test(hay))
        return '/landing/scans/ultrasound.webp';
    if (/full-body|wellness|comprehensive/.test(hay))
        return '/landing/services/full-body.webp';
    return '/landing/services/blood-tests.webp';
}
