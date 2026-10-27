function relativeTime(iso) {
    const t = new Date(iso).getTime();
    if (Number.isNaN(t))
        return '';
    const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
    if (mins < 60)
        return `${Math.max(1, mins)}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24)
        return `${hours}h ago`;
    const days = Math.round(hours / 24);
    return `${days}d ago`;
}
function kindFromType(type) {
    const v = type.toUpperCase();
    if (v.includes('REPORT'))
        return 'report';
    if (v.includes('APPOINT') || v.includes('VISIT') || v.includes('BOOK'))
        return 'visit';
    return 'offer';
}
export function mapAccountNotifications(rows) {
    return rows.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        time: relativeTime(n.createdAt),
        unread: !n.isRead,
        kind: kindFromType(n.type),
    }));
}
export function unreadNotificationCount(items) {
    return items.filter((n) => n.unread).length;
}
