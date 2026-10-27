export const POPULAR_PLANS_SECTION_ID = 'popular-plans';
export function scrollToPopularPlans(behavior = 'smooth') {
    document.getElementById(POPULAR_PLANS_SECTION_ID)?.scrollIntoView({ behavior, block: 'start' });
}
/** Land on home and scroll to Popular tests (works from booking, cart drawer, etc.). */
export function navigateToPopularPlans(navigate, onClose, options) {
    onClose?.();
    navigate({ pathname: '/', hash: POPULAR_PLANS_SECTION_ID }, { replace: options?.replace ?? false });
    window.setTimeout(() => scrollToPopularPlans('smooth'), 120);
    window.setTimeout(() => scrollToPopularPlans('smooth'), 400);
    window.setTimeout(() => scrollToPopularPlans('smooth'), 800);
}
