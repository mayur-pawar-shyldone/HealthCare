const ICON_LEFT = 88
const CONNECTOR_OVERLAP = 40

/** HealthID `bk` — dashed arc between steps */
export function JourneyStepConnector() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-[10px] h-[34px]"
      style={{ left: ICON_LEFT, width: `calc(100% + ${CONNECTOR_OVERLAP - ICON_LEFT}px)` }}
    >
      <svg className="h-full w-full" viewBox="0 0 100 34" preserveAspectRatio="none" fill="none">
        <path
          d="M0 34 C 26 2, 74 2, 100 34"
          stroke="#6FAFC8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="0.5 6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="absolute left-1/2 top-[7px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-coral" />
    </span>
  )
}
