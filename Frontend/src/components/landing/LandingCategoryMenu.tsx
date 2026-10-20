import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import {
  AYURVEDA_VERTICALS,
  DOCTOR_VERTICALS,
  LANDING_NAV_CATEGORIES,
  PHARMACY_VERTICALS,
} from '@/data/landing-nav-data'
import { HealthVerticalPanel } from '@/components/landing/HealthVerticalPanel'
import { RadMenu } from '@/components/landing/RadMenu'

export function LandingCategoryMenu() {
  const [openId, setOpenId] = useState<string | null>(null)
  const closeTimer = useRef<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const active = LANDING_NAV_CATEGORIES.find((c) => c.id === openId) ?? null

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openCategory = (id: string) => {
    clearCloseTimer()
    setOpenId(id)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = window.setTimeout(() => setOpenId(null), 120)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      clearCloseTimer()
    }
  }, [])

  useEffect(() => {
    if (!openId) return
    const backdrop = document.createElement('div')
    backdrop.className = 'menu-backdrop'
    const close = () => setOpenId(null)
    backdrop.addEventListener('click', close)
    backdrop.addEventListener('mouseenter', close)
    document.body.appendChild(backdrop)
    return () => {
      backdrop.removeEventListener('click', close)
      backdrop.removeEventListener('mouseenter', close)
      backdrop.remove()
    }
  }, [openId])

  useEffect(() => {
    if (!openId) return
    const onMove = (e: MouseEvent) => {
      const drop = dropRef.current
      const nav = rootRef.current
      if (!drop || !nav) return
      const dropR = drop.getBoundingClientRect()
      const navR = nav.getBoundingClientRect()
      const { clientX: x, clientY: y } = e
      const inDrop = x >= dropR.left && x <= dropR.right && y >= dropR.top && y <= dropR.bottom
      const inNav = x >= navR.left && x <= navR.right && y >= navR.top && y <= navR.bottom
      if (!inDrop && !inNav) scheduleClose()
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [openId])

  const closeMenu = () => setOpenId(null)

  return (
    <div
      id="categories-nav"
      ref={rootRef}
      className="relative border-t border-white/10 bg-gradient-to-r from-brand-700 via-ink to-brand-700"
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpenId(null)
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 no-scrollbar md:px-6">
        {LANDING_NAV_CATEGORIES.map((cat) => {
          const open = openId === cat.id
          return (
            <div key={cat.id} className="shrink-0">
              <button
                type="button"
                onMouseEnter={() => openCategory(cat.id)}
                onFocus={() => openCategory(cat.id)}
                onClick={() => setOpenId(open ? null : cat.id)}
                aria-expanded={open}
                aria-haspopup="true"
                className={`relative flex h-12 items-center gap-1.5 px-3 text-[14.5px] font-semibold transition-colors duration-150 ${
                  open ? 'text-white' : 'text-white/80 hover:text-white'
                }`}
              >
                {cat.label}
                {cat.badge ? (
                  <span className="rounded-full bg-brand-red-light px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-red">
                    {cat.badge}
                  </span>
                ) : null}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  aria-hidden
                />
                <span
                  className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-white transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
                  aria-hidden
                />
              </button>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            key={active.id}
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="pointer-events-none absolute inset-x-0 top-full z-40 px-4 pb-6 md:px-6"
            onMouseEnter={clearCloseTimer}
          >
            <div ref={dropRef} className="menu-drop pointer-events-auto mx-auto max-w-7xl">
              {active.id === 'radiology' ? (
                <RadMenu onNavigate={closeMenu} />
              ) : active.id === 'blood-test' ? (
                <HealthVerticalPanel compact browseCategoryId="blood-test" onNavigate={closeMenu} />
              ) : active.id === 'ecg' ? (
                <HealthVerticalPanel compact browseCategoryId="ecg" onNavigate={closeMenu} defaultActiveId="heart" />
              ) : active.id === 'doctor' ? (
                <HealthVerticalPanel
                  compact
                  browseCategoryId="doctor"
                  onNavigate={closeMenu}
                  verticals={DOCTOR_VERTICALS}
                  defaultActiveId="doc-gp-care"
                  sidebarEyebrow="Browse consult types"
                  sidebarBadge="Licensed doctors • Video consults"
                  packageCountLabel="consult options"
                />
              ) : active.id === 'ayurveda' ? (
                <HealthVerticalPanel
                  compact
                  browseCategoryId="ayurveda"
                  onNavigate={closeMenu}
                  verticals={AYURVEDA_VERTICALS}
                  defaultActiveId="ayu-consult-root"
                  sidebarEyebrow="Browse wellness paths"
                  sidebarBadge="Authentic Ayurveda • Personal plans"
                  packageCountLabel="wellness plans"
                />
              ) : active.id === 'pharmacy' ? (
                <HealthVerticalPanel
                  compact
                  browseCategoryId="pharmacy"
                  onNavigate={closeMenu}
                  verticals={PHARMACY_VERTICALS}
                  defaultActiveId="ph-rx"
                  sidebarEyebrow="Browse categories"
                  sidebarBadge="Licensed pharmacies • Launching soon"
                  packageCountLabel="categories"
                />
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
