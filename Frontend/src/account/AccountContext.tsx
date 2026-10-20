import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  ACCOUNT_PACKAGES,
  BOOKING_DATES,
  INITIAL_ADDRESSES,
  INITIAL_BOOKINGS,
  createInitialFamily,
  type AccountPackage,
  type Address,
  type BookDraft,
  type Booking,
  type FamilyMember,
  type Ticket,
} from '@/account/account-data'

export function rupee(n: number) {
  return `₹${Number(n).toLocaleString('en-IN')}`
}

export function validMobile(v: string) {
  return /^[6-9]\d{9}$/.test(v)
}

type AccountState = {
  authed: boolean
  name: string
  mobile: string
  loginMode: 'login' | 'create'
  mobileInput: string
  nameInput: string
  otp: string
  otpSent: boolean
  cooldown: number
  error: string
  notice: string
  search: string
  tab: string
  reportMember: string
  sidebar: boolean
  toast: string
  family: FamilyMember[]
  addresses: Address[]
  bookings: Booking[]
  tickets: Ticket[]
  draft: BookDraft
  familyDraft: { name: string; relation: string; dob: string; phone: string }
  profileSaved: boolean
  showAdd: boolean
}

type AccountContextValue = AccountState & {
  memberId: () => string
  pkg: (id: string) => AccountPackage
  member: (id: string) => FamilyMember | undefined
  address: (id: string) => Address | undefined
  setSearch: (q: string) => void
  setTab: (t: string) => void
  setReportMember: (m: string) => void
  setSidebar: (open: boolean) => void
  showToast: (msg: string) => void
  logout: () => void
  toggleAuthMode: () => void
  resendOtp: () => void
  loginHelp: () => void
  submitLogin: (data: { mobile: string; name?: string; otp?: string }) => boolean
  saveFamilyMember: (data: { name: string; relation: string; dob: string; phone: string }) => boolean
  removeMember: (id: string) => void
  toggleShowAdd: () => void
  saveProfile: (name: string) => void
  submitTicket: (issue: string) => void
  choosePackage: (id: string) => void
  pickDate: (id: string) => void
  pickSlot: (slot: string) => void
  submitMemberStep: (memberId: string, addressId: string) => boolean
  submitSlotStep: () => boolean
  confirmBooking: () => void
  rescheduleBooking: (id: string) => void
  cancelBooking: (id: string) => boolean
  setDraftPartial: (patch: Partial<BookDraft>) => void
  setFamilyDraft: (patch: Partial<AccountState['familyDraft']>) => void
  setError: (msg: string) => void
}

const AccountContext = createContext<AccountContextValue | null>(null)

function loadAuthed() {
  return sessionStorage.getItem('hid_auth') === '1'
}

function initialState(): AccountState {
  const name = sessionStorage.getItem('hid_name') || 'Rohit Menon'
  const mobile = sessionStorage.getItem('hid_mobile') || '9876543210'
  return {
    authed: loadAuthed(),
    name,
    mobile,
    loginMode: 'login',
    mobileInput: '',
    nameInput: '',
    otp: '',
    otpSent: false,
    cooldown: 0,
    error: '',
    notice: '',
    search: '',
    tab: 'Upcoming',
    reportMember: 'All',
    sidebar: false,
    toast: '',
    family: createInitialFamily(name, mobile),
    addresses: INITIAL_ADDRESSES,
    bookings: INITIAL_BOOKINGS,
    tickets: [],
    draft: { packageId: 'full-body', memberId: 'self', addressId: 'home', date: '', slot: '', newAddress: false },
    familyDraft: { name: '', relation: 'Spouse', dob: '', phone: '' },
    profileSaved: false,
    showAdd: false,
  }
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)
  stateRef.current = state
  const timerRef = useRef<number | null>(null)

  const startCooldown = useCallback(() => {
    setState((s) => ({ ...s, cooldown: 30 }))
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setState((s) => {
        const next = s.cooldown - 1
        if (next <= 0) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          return { ...s, cooldown: 0 }
        }
        return { ...s, cooldown: next }
      })
    }, 1000)
  }, [])

  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current) }, [])

  const showToast = useCallback((msg: string) => {
    setState((s) => ({ ...s, toast: msg }))
    window.setTimeout(() => setState((s) => ({ ...s, toast: '' })), 2200)
  }, [])

  const pkg = useCallback((id: string) => ACCOUNT_PACKAGES.find((p) => p.id === id) ?? ACCOUNT_PACKAGES[0], [])
  const member = useCallback((id: string) => state.family.find((m) => m.id === id), [state.family])
  const address = useCallback((id: string) => state.addresses.find((a) => a.id === id), [state.addresses])
  const memberId = useCallback(() => `HID-${(state.mobile || '482910').slice(-5)}`, [state.mobile])

  const value = useMemo<AccountContextValue>(
    () => ({
      ...state,
      memberId,
      pkg,
      member,
      address,
      setSearch: (search) => setState((s) => ({ ...s, search })),
      setTab: (tab) => setState((s) => ({ ...s, tab })),
      setReportMember: (reportMember) => setState((s) => ({ ...s, reportMember })),
      setSidebar: (sidebar) => setState((s) => ({ ...s, sidebar })),
      showToast,
      logout: () => {
        sessionStorage.removeItem('hid_auth')
        setState((s) => ({ ...initialState(), authed: false, loginMode: s.loginMode }))
      },
      toggleAuthMode: () =>
        setState((s) => ({
          ...s,
          loginMode: s.loginMode === 'login' ? 'create' : 'login',
          error: '',
          otpSent: false,
          notice: '',
        })),
      resendOtp: () => {
        if (stateRef.current.cooldown > 0) return
        setState((s) => ({ ...s, notice: 'A new OTP has been sent.' }))
        startCooldown()
      },
      loginHelp: () => setState((s) => ({ ...s, notice: 'Call 1800-123-4567 if the OTP doesn’t arrive.' })),
      submitLogin: (data) => {
        const s = stateRef.current
        const mobileInput = data.mobile.trim()
        const nameInput = (data.name || '').trim()
        if (s.loginMode === 'create' && nameInput.length < 2) {
          setState((prev) => ({ ...prev, mobileInput, nameInput, error: 'Enter the name for this account.' }))
          return false
        }
        if (!validMobile(mobileInput)) {
          setState((prev) => ({ ...prev, mobileInput, nameInput, error: 'Enter a valid 10-digit mobile number.' }))
          return false
        }
        if (!s.otpSent) {
          setState((prev) => ({
            ...prev,
            mobileInput,
            nameInput,
            error: '',
            otpSent: true,
            notice: 'OTP sent. It expires in 5 minutes.',
          }))
          startCooldown()
          return false
        }
        const otp = (data.otp || '').trim()
        if (!/^\d{6}$/.test(otp)) {
          setState((prev) => ({ ...prev, mobileInput, nameInput, error: 'Enter the 6-digit OTP.', otp }))
          return false
        }
        const name = s.loginMode === 'create' ? nameInput : s.name
        sessionStorage.setItem('hid_auth', '1')
        sessionStorage.setItem('hid_name', name)
        sessionStorage.setItem('hid_mobile', mobileInput)
        setState((prev) => {
          const family = [...prev.family]
          family[0] = { ...family[0], name, phone: mobileInput }
          return {
            ...prev,
            authed: true,
            name,
            mobile: mobileInput,
            mobileInput,
            nameInput,
            family,
            otpSent: false,
            notice: '',
            otp: '',
            error: '',
          }
        })
        return true
      },
      saveFamilyMember: (data) => {
        if (state.family.length >= 6) {
          setState((s) => ({ ...s, error: 'This card already has 6 members.' }))
          return false
        }
        if (!/^\d{2}-\d{2}-\d{4}$/.test(data.dob)) {
          setState((s) => ({ ...s, familyDraft: data, error: 'Use dd-mm-yyyy for date of birth.' }))
          return false
        }
        setState((s) => ({
          ...s,
          family: [
            ...s.family,
            {
              id: `m${Date.now()}`,
              name: data.name,
              relation: data.relation,
              dob: data.dob,
              phone: data.phone,
              status: 'Active',
            },
          ],
          familyDraft: { name: '', relation: 'Spouse', dob: '', phone: '' },
          showAdd: false,
          error: '',
        }))
        showToast('Member added')
        return true
      },
      removeMember: (id) => {
        setState((s) => ({ ...s, family: s.family.filter((m) => m.id !== id) }))
        showToast('Member removed')
      },
      toggleShowAdd: () => setState((s) => ({ ...s, showAdd: !s.showAdd, error: '' })),
      saveProfile: (name) => {
        sessionStorage.setItem('hid_name', name)
        setState((s) => {
          const family = [...s.family]
          family[0] = { ...family[0], name }
          return { ...s, name, family, profileSaved: true }
        })
        showToast('Profile saved')
      },
      submitTicket: (issue) => {
        setState((s) => ({
          ...s,
          tickets: [{ id: `SUP-${String(Date.now()).slice(-4)}`, issue, status: 'Open' }, ...s.tickets],
        }))
        showToast('Request submitted')
      },
      choosePackage: (id) => setState((s) => ({ ...s, draft: { ...s.draft, packageId: id } })),
      pickDate: (id) => setState((s) => ({ ...s, draft: { ...s.draft, date: id, slot: '' }, error: '' })),
      pickSlot: (slot) => setState((s) => ({ ...s, draft: { ...s.draft, slot }, error: '' })),
      submitMemberStep: (memberId, addressId) => {
        if (!memberId || !addressId) {
          setState((s) => ({ ...s, error: 'Choose a member and a collection address.' }))
          return false
        }
        setState((s) => ({ ...s, draft: { ...s.draft, memberId, addressId }, error: '' }))
        return true
      },
      submitSlotStep: () => {
        const draft = stateRef.current.draft
        if (!draft.date || !draft.slot) {
          setState((s) => ({ ...s, error: 'Choose an open date and time.' }))
          return false
        }
        setState((s) => ({ ...s, error: '' }))
        return true
      },
      confirmBooking: () => {
        setState((s) => {
          const p = ACCOUNT_PACKAGES.find((x) => x.id === s.draft.packageId) ?? ACCOUNT_PACKAGES[0]
          const d = BOOKING_DATES.find((x) => x.id === s.draft.date)
          return {
            ...s,
            bookings: [
              {
                id: `HID-${String(Date.now()).slice(-5)}`,
                packageId: p.id,
                memberId: s.draft.memberId,
                addressId: s.draft.addressId,
                date: d?.label || '',
                slot: s.draft.slot,
                status: 'Upcoming',
                amount: p.price,
              },
              ...s.bookings,
            ],
          }
        })
      },
      rescheduleBooking: (id) => {
        setState((s) => ({
          ...s,
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, status: 'Rescheduled', slot: '8:00–9:00 AM' } : b,
          ),
        }))
        showToast('Visit marked for reschedule')
      },
      cancelBooking: (id) => {
        setState((s) => ({
          ...s,
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b)),
        }))
        showToast('Booking cancelled')
        return true
      },
      setDraftPartial: (patch) => setState((s) => ({ ...s, draft: { ...s.draft, ...patch } })),
      setFamilyDraft: (patch) => setState((s) => ({ ...s, familyDraft: { ...s.familyDraft, ...patch } })),
      setError: (error) => setState((s) => ({ ...s, error })),
    }),
    [state, memberId, pkg, member, address, showToast, startCooldown],
  )

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error('useAccount must be used within AccountProvider')
  return ctx
}
