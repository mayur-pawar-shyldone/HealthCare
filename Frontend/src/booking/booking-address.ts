import type { Address } from '@/account/account-data'
import type { PublicBookingDraft } from '@/booking/booking-session'

export function resolveHomeAddress(
  draft: PublicBookingDraft,
  addresses: Address[],
): { label: string; line: string } | undefined {
  if (draft.addressId === 'custom') {
    const line = draft.customAddressLine.trim()
    if (!line) return undefined
    return {
      label: draft.customAddressLabel.trim() || 'Other address',
      line,
    }
  }
  const saved = addresses.find((a) => a.id === draft.addressId)
  if (!saved) return undefined
  return { label: saved.label, line: saved.line }
}

export function isCollectionStepComplete(draft: PublicBookingDraft): boolean {
  if (!draft.collection) return false
  if (draft.collection === 'lab') return Boolean(draft.labId)
  if (draft.addressId === 'custom') return draft.customAddressLine.trim().length >= 8
  return Boolean(draft.addressId)
}
