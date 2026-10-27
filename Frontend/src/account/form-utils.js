export function readForm(form) {
    const out = {};
    new FormData(form).forEach((value, key) => {
        out[key] = String(value);
    });
    return out;
}
