import { motion } from 'framer-motion'
import { MapPin, X } from 'lucide-react'
import { useAccount } from '@/account/AccountContext'
import { readForm } from '@/account/form-utils'
import { Input } from '@/components/ui/Input'

type Props = {
  open: boolean
  onClose: () => void
}

export function AccountAddAddressModal({ open, onClose }: Props) {
  const acc = useAccount()

  if (!open) return null

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = readForm(e.currentTarget) as { label: string; line: string; note: string }
    if (acc.addAddress(data)) onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-address-title">
      <button type="button" className="absolute inset-0 bg-navy/55 backdrop-blur-[3px]" aria-label="Close" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28 }}
        className="relative w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_-24px_rgba(16,52,74,0.45)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mp-teal-50 text-mp-teal-700">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 id="add-address-title" className="font-display text-xl font-extrabold text-navy">
                Add collection address
              </h2>
              <p className="mt-0.5 text-[13px] text-muted">Used for home sample pickup in Nashik.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-muted transition hover:bg-canvas"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3 px-5 py-4">
          <Input name="label" label="Label" required placeholder="e.g. Office, Parents" />
          <label className="block space-y-2 text-sm">
            <span className="font-semibold text-ink/80">Full address</span>
            <textarea
              name="line"
              required
              rows={3}
              placeholder="Flat, building, area, city, PIN"
              className="w-full resize-none rounded-2xl border border-line/80 bg-white px-4 py-3 outline-none focus:border-teal focus:ring-2 focus:ring-teal/10"
            />
          </label>
          <Input name="note" label="Note for phlebotomist (optional)" placeholder="Gate, floor, landmark" />
          {acc.error ? <p className="text-sm font-semibold text-brick">{acc.error}</p> : null}
          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 rounded-full bg-navy py-2.5 text-[13px] font-semibold text-white hover:bg-navy-600">
              Save address
            </button>
            <button
              type="button"
              onClick={() => {
                acc.setError('')
                onClose()
              }}
              className="rounded-full border border-line px-4 py-2.5 text-[13px] font-semibold text-navy hover:bg-canvas"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
