const listeners = new Set();
export function openHealthCard() {
    listeners.forEach((fn) => fn());
}
export function subscribeHealthCard(listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
