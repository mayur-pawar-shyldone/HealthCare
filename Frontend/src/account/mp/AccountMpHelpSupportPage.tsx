import { useState } from 'react'
import { Mail, MessageCircle, Phone, Search } from 'lucide-react'
import { AccountDashboardPanel } from '@/account/dashboard/AccountDashboardPanel'
import { AccountMpFaqList } from '@/account/mp/AccountMpFaqList'
import { AccountMpRequestForm } from '@/account/mp/AccountMpRequestForm'

export function AccountMpHelpSupportPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="space-y-7">
      <section className="rounded-[28px] bg-mp-teal px-7 py-10 sm:px-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-white">How can we help?</h2>
        <p className="mt-2 text-lg text-white/90">Search answers about bookings, reports, wallet and your card.</p>
        <label className="relative mt-7 block max-w-[720px]">
          <span className="sr-only">Search help</span>
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. fasting, reschedule, refund"
            className="w-full rounded-full bg-white py-4 pl-14 pr-5 text-[17px] text-navy placeholder:text-muted focus:outline-none focus:ring-4 focus:ring-white/40"
          />
        </label>
      </section>

      <div className="grid items-start gap-7 lg:grid-cols-[1.45fr_1fr]">
        <AccountMpFaqList query={query} />

        <div className="space-y-7">
          <AccountDashboardPanel title="Talk to us">
            <ul className="space-y-2">
              <li>
                <a
                  href="https://wa.me/918001234567"
                  className="flex items-center gap-4 rounded-2xl bg-mp-teal-50 p-4 transition-colors duration-150 hover:bg-[#d3ecea]"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-mp-teal text-white">
                    <MessageCircle className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[17px] font-semibold text-navy">WhatsApp</span>
                    <span className="block text-sm text-muted">Fastest · replies in ~5 min</span>
                  </span>
                </a>
              </li>
              <li>
                <a href="tel:18001234567" className="flex items-center gap-4 rounded-2xl p-4 transition-colors duration-150 hover:bg-canvas">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-canvas text-navy">
                    <Phone className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[17px] font-semibold text-navy">Call 1800-123-4567</span>
                    <span className="block text-sm text-muted">Toll free · 7am–9pm</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:care@healthidcard.com"
                  className="flex items-center gap-4 rounded-2xl p-4 transition-colors duration-150 hover:bg-canvas"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-canvas text-navy">
                    <Mail className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[17px] font-semibold text-navy">Email us</span>
                    <span className="block text-sm text-muted">care@healthidcard.com</span>
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
