import { useState } from 'react'
import { Mail, MessageCircle, Phone, Search } from 'lucide-react'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'
import { AccountMpFaqList } from '@/account/mp/AccountMpFaqList'
import { AccountMpRequestForm } from '@/account/mp/AccountMpRequestForm'

export function AccountMpHelpSupportPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="space-y-4">
      <section className="rounded-[20px] bg-mp-teal px-5 py-5 sm:px-6 sm:py-6">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-[26px]">How can we help?</h2>
        <p className="mt-1 text-[13px] text-white/90">Search answers about bookings, reports, and your card.</p>
        <label className="relative mt-4 block max-w-[640px]">
          <span className="sr-only">Search help</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. fasting, reschedule, refund"
            className="w-full rounded-full bg-white py-3 pl-11 pr-4 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-4 focus:ring-white/40"
          />
        </label>
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-[1.45fr_1fr]">
        <AccountMpFaqList query={query} />

        <div className="space-y-4">
          <AccountDashboardPanel title="Talk to us">
            <ul className="space-y-2">
              <li>
                <a
                  href="https://wa.me/918001234567"
                  className="flex items-center gap-3 rounded-xl bg-mp-teal-50 p-3 transition-colors duration-150 hover:bg-[#d3ecea]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-mp-teal text-white">
                    <MessageCircle className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-navy">WhatsApp</span>
                    <span className="block text-[13px] text-muted">Fastest · replies in ~5 min</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="tel:18001234567" className="flex items-center gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-canvas">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-canvas text-navy">
                    <Phone className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-navy">Call 1800-123-4567</span>
                    <span className="block text-[13px] text-muted">Toll free · 7am–9pm</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:care@healthidcard.com"
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-canvas"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-canvas text-navy">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-navy">Email us</span>
                    <span className="block text-[13px] text-muted">care@healthidcard.com</span>
                  </span>
                </a>
              </li>
            </ul>
          </AccountDashboardPanel>

          <AccountMpRequestForm />
        </div>
      </div>
    </div>
  )
}
