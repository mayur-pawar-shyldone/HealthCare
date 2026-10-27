import { memberShortName } from '@/account/dashboard/mp-utils';
export function accountMpReminder(acc) {
    const next = acc.bookings.find((b) => b.status === 'Upcoming');
    if (!next)
        return null;
    const person = acc.member(next.memberId);
    const name = person ? memberShortName(person.name) : 'Member';
    const slotStart = next.slot.split('–')[0]?.trim() ?? next.slot;
    return `Reminder: ${name}'s home collection is ${next.date} at ${slotStart}. Please fast for 10–12 hours before.`;
}
