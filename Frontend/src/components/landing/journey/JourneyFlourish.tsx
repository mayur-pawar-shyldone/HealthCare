/** HealthID `Ak` — decorative curve under section title */
export function JourneyFlourish() {
  return (
    <svg
      className="mx-auto mt-5 h-[12px] w-[240px] sm:w-[300px]"
      viewBox="0 0 300 12"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="journey-flourish" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E23D26" stopOpacity="0" />
          <stop offset="0.22" stopColor="#E23D26" stopOpacity="0.85" />
          <stop offset="0.78" stopColor="#E23D26" stopOpacity="0.85" />
          <stop offset="1" stopColor="#E23D26" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M2 9 Q 150 0 298 9" stroke="url(#journey-flourish)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
