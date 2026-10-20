export type AccountMpNotification = {
  id: string
  title: string
  body: string
  time: string
  unread: boolean
  kind: 'report' | 'visit' | 'offer'
}

/** Sample notifications for dashboard UI (replace with API when wired). */
export function accountMpNotifications(): AccountMpNotification[] {
  return [
    {
      id: 'n1',
      title: 'Report ready',
      body: 'Full Body Advanced for Priya is ready to view in Reports.',
      time: '2h ago',
      unread: true,
      kind: 'report',
    },
    {
      id: 'n2',
      title: 'Home visit tomorrow',
      body: 'Phlebotomist arrives 7:00–9:00 AM. Keep 8–12 hrs fasting if required.',
      time: '5h ago',
      unread: true,
      kind: 'visit',
    },
    {
      id: 'n4',
      title: 'Member pricing active',
      body: 'Book any package on the landing page at card rates with free collection.',
      time: '3 days ago',
      unread: false,
      kind: 'offer',
    },
  ]
}

export function unreadNotificationCount(items: AccountMpNotification[]) {
  return items.filter((n) => n.unread).length
}
