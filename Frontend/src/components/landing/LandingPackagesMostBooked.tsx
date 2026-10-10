import { FV_PACKAGES, PANEL_TINTS } from '@/data/landing-healthid-content'
import { HealthIdFvPackageCard } from '@/components/landing/HealthIdFvPackageCard'

export function LandingPackagesMostBooked() {
  return (
    <section id="packages" className="bg-mint py-20" aria-labelledby="packages-heading">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2
            id="packages-heading"
            className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink sm:text-[38px]"
          >
            Packages people book most
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
            Bundled panels that cover a full picture in one visit — no repeat pricks, no repeat fees.
          </p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {FV_PACKAGES.map((pkg, i) => (
            <li key={pkg.id} className="flex">
              <HealthIdFvPackageCard pkg={pkg} tint={PANEL_TINTS[i % PANEL_TINTS.length]} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
