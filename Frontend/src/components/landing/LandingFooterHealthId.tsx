import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

const LINK_COLUMNS = [
  {
    title: 'Tests',
    links: ['Full body checkup', 'Heart & lipids', 'Diabetes', 'Thyroid & hormones', 'Cancer screening'],
  },
  {
    title: 'Company',
    links: ['About HealthIDCard', 'Partner labs', 'Careers', 'Press', 'Blog'],
  },
  {
    title: 'Support',
    links: ['Track my report', 'Reschedule a visit', 'Refund policy', 'FAQs', 'Contact us'],
  },
]

export function LandingFooterHealthId() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="pointer-events-none absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-brand-500/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-coral/10 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16">
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-brand-700 via-ink to-ink p-8 ring-1 ring-white/10 lg:p-10">
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-brand-100">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                Health letter
              </span>
              <h3 className="mt-4 font-display text-[26px] font-extrabold leading-tight sm:text-[30px]">
                Get health tips and package drops
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {['One email a month', 'Member-only pricing', 'Unsubscribe anytime'].map((t) => (
                  <li
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[12.5px] font-medium text-white/80"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <label className="flex-1">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="h-12 w-full rounded-full border border-white/15 bg-white/10 px-5 text-[15px] text-white outline-none placeholder:text-white/65 focus:border-brand-300 focus:bg-white/15"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-500 px-6 text-[15px] font-semibold text-white transition hover:bg-brand-400 active:scale-[0.98]"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_repeat(3,0.85fr)]">
          <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] p-6">
            <span className="absolute inset-y-6 left-0 w-0.5 rounded-full bg-gradient-to-b from-coral to-brand-400" aria-hidden />
            <Logo variant="compact" onDark />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/70">
              Member-priced diagnostics with free home collection, processed only at NABL-accredited partner labs.
            </p>
            <ul className="mt-6 space-y-2">
              <li>
                <a href="tel:18001234567" className="flex items-center gap-3 rounded-xl px-2 py-2 text-[14px] text-white/75 hover:bg-white/5">
                  <Phone className="h-4 w-4 text-brand-200" aria-hidden />
                  1800-123-4567
                </a>
              </li>
              <li>
                <a href="mailto:care@healthidcard.com" className="flex items-center gap-3 rounded-xl px-2 py-2 text-[14px] text-white/75 hover:bg-white/5">
                  <Mail className="h-4 w-4 text-brand-200" aria-hidden />
                  care@healthidcard.com
                </a>
              </li>
              <li className="flex items-center gap-3 px-2 py-2 text-[14px] text-white/75">
                <MapPin className="h-4 w-4 text-brand-200" aria-hidden />
                Andheri East, Mumbai 400069
              </li>
            </ul>
          </div>
          {LINK_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/45">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#packages" className="text-[14px] text-white/70 transition hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8 text-[13px] text-white/50">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-200" aria-hidden />
            NABL accredited partner labs
          </span>
          <Link to="/login" className="hover:text-white/80">
            Member login
          </Link>
          <Link to="/signup" className="hover:text-white/80">
            Create account
          </Link>
          <span className="ml-auto">© {new Date().getFullYear()} HealthID Card Pvt. Ltd.</span>
        </div>
      </div>
    </footer>
  )
}
