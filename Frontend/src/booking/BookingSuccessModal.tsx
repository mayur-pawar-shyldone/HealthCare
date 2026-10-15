import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

type Props = {
  open: boolean
  bookingId: string
  patientName: string
  scheduleLabel: string
  total: number
  testCount: number
  onDashboard: () => void
  onExplore: () => void
}

export function BookingSuccessModal({
  open,
  bookingId,
  patientName,
  scheduleLabel,
  total,
  testCount,
  onDashboard,
  onExplore,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="booking-success-title">
      <div className="absolute inset-0 bg-navy/55 backdrop-blur-[3px]" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_-24px_rgba(16,52,74,0.45)]"
      >
        <div className="bg-gradient-to-br from-mp-teal-50 via-white to-mp-coral-50 px-6 pb-2 pt-8 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
            className="relative mx-auto h-[120px] w-[120px]"
          >
            <img
              src="/landing/yk.webp"
              alt=""
              className="h-full w-full rounded-3xl object-cover ring-4 ring-white shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 grid h-11 w-11 place-items-center rounded-full bg-success text-white shadow-md ring-4 ring-white">
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            </span>
          </motion.div>
          <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-success">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Booking confirmed
          </p>
          <h2 id="booking-success-title" className="mt-3 font-display text-[26px] font-extrabold leading-tight text-navy">
            You&apos;re all set!
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            {patientName} · {testCount} {testCount === 1 ? 'test' : 'tests'} booked for home collection in Nashik.
          </p>
        </div>

        <div className="space-y-3 px-6 py-5 text-[14px]">
          <div className="rounded-2xl border border-line bg-canvas/60 px-4 py-3 text-left">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Booking ID</p>
            <p className="mt-0.5 font-display text-lg font-bold text-navy">{bookingId}</p>
            <p className="mt-2 text-[13px] text-muted">{scheduleLabel}</p>
            <p className="mt-2 text-[15px] font-bold text-navy">
              Pay ₹{total.toLocaleString('en-IN')} at sample collection (cash or UPI)
            </p>
          </div>

          <button
            type="button"
            onClick={onDashboard}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-navy text-[14px] font-bold text-white transition hover:bg-navy-600"
          >
            Go to dashboard
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-white text-[14px] font-bold text-navy transition hover:bg-canvas"
          >
            Explore more tests
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
