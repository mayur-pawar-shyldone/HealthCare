import { Star } from 'lucide-react'
import { TESTIMONIALS, TRUST_STATS } from '@/data/landing-healthid-content'

export function LandingTestimonialsSection() {
  return (
    <section className="bg-white py-20" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-6">
        <h2
          id="testimonials-heading"
          className="max-w-2xl font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]"
        >
          Families in six cities already book with us
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li key={t.id}>
              <figure className="flex h-full flex-col rounded-2xl border border-ink/10 bg-mint/70 p-6">
                <div className="flex gap-0.5 text-brand-500" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-semibold text-ink">{t.name}</span>
                    <span className="block text-[12.5px] text-ink-muted">{t.meta}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <dl className="mt-12 grid gap-y-8 rounded-[26px] border border-ink/10 px-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-[28px] font-extrabold leading-none text-ink">{stat.value}</span>
                <span className="mt-2 block text-[13.5px] text-ink-soft">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
