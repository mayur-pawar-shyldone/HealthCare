export function bookStartUrl(item) {
    const params = new URLSearchParams({
        id: item.id,
        name: item.name,
        price: String(item.memberPrice),
        mrp: String(item.mrp),
        tests: String(item.testCount ?? 1),
    });
    if (item.prep)
        params.set('prep', item.prep);
    return `/book/start?${params.toString()}`;
}
