const STORAGE_KEY = 'hid_login_return';
const BLOCKED = new Set(['/', '/login', '/login/otp', '/login/email', '/login/password', '/signup']);
export function isUsableReturnPath(path) {
    if (!path)
        return false;
    if (path.startsWith('/login'))
        return false;
    if (BLOCKED.has(path))
        return false;
    return path.startsWith('/');
}
export function rememberLoginReturn(path) {
    if (!isUsableReturnPath(path))
        return;
    try {
        sessionStorage.setItem(STORAGE_KEY, path);
    }
    catch {
        /* ignore */
    }
}
export function peekLoginReturn() {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        return isUsableReturnPath(stored) ? stored : null;
    }
    catch {
        return null;
    }
}
export function consumeLoginReturn(fallback = '/') {
    const stored = peekLoginReturn();
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    }
    catch {
        /* ignore */
    }
    return stored ?? fallback;
}
export function loginReturnFromLocation(location) {
    const fromState = location.state?.from;
    if (isUsableReturnPath(fromState)) {
        rememberLoginReturn(fromState);
        return fromState;
    }
    return peekLoginReturn() ?? '/';
}
export const BOOKING_RETURN_PATH = '/book';
