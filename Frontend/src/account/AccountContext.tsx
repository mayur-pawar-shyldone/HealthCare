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
  MAX_FAMILY_MEMBERS,
  PRIMARY_MEMBER_ID,
  type AccountPackage,
  type Address,
  type BookDraft,
  type Booking,
  type FamilyMember,
  type Ticket,
} from '@/account/account-data'
import { labTestToAccountPackage } from '@/lib/catalog'
import { resolveBookingDateIso } from '@/lib/booking-dates'
import api, { unwrap } from '@/services/api'
import {
  authErrorMessage,
  channelNotice,
  sendOtp,
  verifyOtp,
  type VerifyOtpResult,
} from '@/services/otp'
import { store } from '@/store'
import { clearSession, setSession } from '@/store/authSlice'
import type { Appointment, FamilyMember as ApiFamilyMember, LabTest, UserProfile, WalletSummary } from '@/types'

export function rupee(n: number) {
  return `₹${Number(n).toLocaleString('en-IN')}`
}

export function validMobile(v: string) {
  return /^[6-9]\d{9}$/.test(v)
}

type AccountState = {
  authed: boolean
  /** True after family/profile have loaded for an authed session (or when logged out). */
  hydrated: boolean
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
  busy: boolean
  search: string
  tab: string
  reportMember: string
  sidebar: boolean
  toast: string
  family: FamilyMember[]
  addresses: Address[]
  defaultAddressId: string
  bookings: Booking[]
  tickets: Ticket[]
  packages: AccountPackage[]
  wallet: WalletSummary | null
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
  resendOtp: () => Promise<void>
  loginHelp: () => void
  submitLogin: (data: { mobile: string; name?: string; otp?: string }) => Promise<boolean>
  finishOtpLogin: (result: VerifyOtpResult) => boolean
  saveFamilyMember: (data: { name: string; relation: string; dob: string; phone: string }) => boolean
  updateFamilyMember: (
    id: string,
    data: { name: string; relation: string; dob: string; phone: string },
  ) => boolean
  removeMember: (id: string) => boolean
  addAddress: (data: { label: string; line: string; note: string }) => boolean
  setDefaultAddress: (id: string) => void
  toggleShowAdd: () => void
  saveProfile: (name: string) => void
  submitTicket: (issue: string) => void
  choosePackage: (id: string) => void
  pickDate: (id: string) => void
  pickSlot: (slot: string) => void
  submitMemberStep: (memberId: string, addressId: string) => boolean
  submitSlotStep: () => boolean
  packages: AccountPackage[]
  wallet: WalletSummary | null
  confirmBooking: () => Promise<boolean>
  confirmCartBookings: (items: { id: string; name: string; memberPrice: number }[], visit: {
    memberId: string
    addressId: string
    addressLine?: string
    collection?: 'home' | 'lab'
    dateLabel: string
    dateIso?: string
    slot: string
    patientName?: string
  }) => Promise<string | null>
  rescheduleBooking: (id: string) => void
  cancelBooking: (id: string) => boolean
  setDraftPartial: (patch: Partial<BookDraft>) => void
  setFamilyDraft: (patch: Partial<AccountState['familyDraft']>) => void
  setError: (msg: string) => void
  refreshBookings: () => Promise<void>
}

async function fetchAppointments() {
  const payload = (
    await api.get('/appointments', {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      params: { _ts: Date.now() },
    })
  ).data
  return mapBookings(unwrap<Appointment[]>(payload))
}

const AccountContext = createContext<AccountContextValue | null>(null)

function isValidMemberDob(dob: string) {
  if (/^\d{2}-\d{2}-\d{4}$/.test(dob)) return true
  if (/^\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}$/.test(dob.trim())) return true
  return false
}

function primaryMember(name: string, mobile: string): FamilyMember {
  return { id: PRIMARY_MEMBER_ID, name: name || 'Member', relation: 'Self', dob: '', phone: mobile, status: 'Active' }
}

function formatDob(value?: string | null) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function toIsoDob(dob: string) {
  const dmy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(dob.trim())
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`
  const parsed = new Date(dob)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed.toISOString()
}

function formatRelation(value?: string | null) {
  if (!value) return 'Family'
  return value.charAt(0) + value.slice(1).toLowerCase()
}

function toFamilyRelation(value: string) {
  const v = value.trim().toUpperCase()
  if (v === 'SPOUSE') return 'SPOUSE' as const
  if (v === 'PARENT' || v === 'FATHER' || v === 'MOTHER') return 'PARENT' as const
  if (v === 'CHILD' || v === 'SON' || v === 'DAUGHTER') return 'CHILD' as const
  if (v === 'SIBLING' || v === 'BROTHER' || v === 'SISTER') return 'SIBLING' as const
  return 'OTHER' as const
}

function mapAddresses(rows?: UserProfile['addresses']): Address[] {
  return (rows ?? []).map((a, i) => ({
    id: a.id || `addr-${i}`,
    label: a.label || (i === 0 ? 'Home' : 'Address'),
    line: [a.line1, a.city, a.state, a.pincode].filter(Boolean).join(', '),
    note: 'Home collection',
    city: a.city,
    state: a.state,
    pincode: a.pincode,
  }))
}

function parseAddressLine(line: string) {
  const pincode = line.match(/\b\d{6}\b/)?.[0] || '422001'
  return { line1: line.trim(), city: 'Nashik', state: 'Maharashtra', pincode }
}

function fallbackPackage(id: string, name?: string, amount?: number): AccountPackage {
  return {
    id,
    name: name || 'Test',
    summary: '',
    tests: 0,
    price: amount || 0,
    mrp: amount || 0,
    time: '',
    prep: '',
    includes: [],
  }
}

function mapFamily(name: string, mobile: string, rows?: ApiFamilyMember[]): FamilyMember[] {
  const extras = (rows ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    relation: formatRelation(m.relation),
    dob: formatDob(m.dateOfBirth),
    phone: m.mobile || '',
    status: 'Active',
  }))
  return [primaryMember(name, mobile), ...extras]
}

function mapBookings(rows?: Appointment[]): Booking[] {
  const statusMap: Record<string, Booking['status']> = {
    PENDING: 'Upcoming',
    CONFIRMED: 'Upcoming',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    RESCHEDULED: 'Upcoming',
  }
  const list = Array.isArray(rows) ? rows : []
  return list.map((a) => {
    const addr = (a as Appointment & { address?: { id?: string } }).address
    return {
      id: a.id,
      code: a.code,
      packageId: a.test?.id || '',
      packageName: a.test?.name,
      memberId: a.familyMember?.id || PRIMARY_MEMBER_ID,
      addressId: addr?.id || '',
      addressLine: a.deliveryAddress || a.location,
      date: a.date ? formatDob(a.date) : '',
      dateIso: a.date ? String(a.date).slice(0, 10) : '',
      slot: a.timeSlot,
      status: statusMap[a.status] || 'Upcoming',
      amount: Number(a.finalPrice ?? a.originalPrice ?? 0),
      report: Boolean(a.reports?.some((r) => r.status === 'AVAILABLE')),
      reportId: a.reports?.find((r) => r.status === 'AVAILABLE')?.id,
    }
  })
}

function readPersistedUser() {
  try {
    const access = localStorage.getItem('hc_access')
    const raw = localStorage.getItem('hc_user')
    const user = raw ? (JSON.parse(raw) as { id?: string; fullName?: string; mobile?: string }) : null
    if (user?.id && access) {
      return {
        authed: true,
        name: user.fullName || localStorage.getItem('hid_name') || '',
        mobile: user.mobile || localStorage.getItem('hid_mobile') || sessionStorage.getItem('hid_mobile') || '',
      }
    }
  } catch {
    /* ignore */
  }
  return { authed: false, name: '', mobile: '' }
}

function initialState(): AccountState {
  const persisted = readPersistedUser()
  return {
    authed: persisted.authed,
    hydrated: !persisted.authed,
    name: persisted.name,
    mobile: persisted.mobile,
    loginMode: 'login',
    mobileInput: '',
    nameInput: '',
    otp: '',
    otpSent: false,
    cooldown: 0,
    error: '',
    notice: '',
    busy: false,
    search: '',
    tab: 'Upcoming',
    reportMember: 'All',
    sidebar: false,
    toast: '',
    family: [primaryMember(persisted.name, persisted.mobile)],
    addresses: [],
    defaultAddressId: 'home',
    bookings: [],
    tickets: [],
    packages: [],
    wallet: null,
    draft: { packageId: '', memberId: 'self', addressId: 'home', date: '', slot: '', newAddress: false },
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
  const hydratedRef = useRef(false)
  const bookingsEpochRef = useRef(0)

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

  useEffect(() => {
    if (!state.authed || hydratedRef.current) return
    hydratedRef.current = true
    let cancelled = false
    void (async () => {
      try {
        const [profile, familyRows, appointments, wallet, packageRows] = await Promise.all([
          unwrap<UserProfile>((await api.get('/users/profile')).data),
          api.get('/family').then((r) => unwrap<ApiFamilyMember[]>(r.data)).catch(() => [] as ApiFamilyMember[]),
          fetchAppointments().catch(() => [] as Booking[]),
          api.get('/wallet').then((r) => unwrap<WalletSummary>(r.data)).catch(() => null),
          api
            .get('/tests', { params: { packages: 'true' } })
            .then((r) => unwrap<LabTest[]>(r.data))
            .catch(() => [] as LabTest[]),
        ])
        let catalog = packageRows
        if (!catalog.length) {
          catalog = await api.get('/tests').then((r) => unwrap<LabTest[]>(r.data)).catch(() => [] as LabTest[])
        }
        if (cancelled) return
        const name = profile.fullName || stateRef.current.name
        const mobile = profile.mobile || stateRef.current.mobile
        const addresses = mapAddresses(profile.addresses)
        const hydrateEpoch = bookingsEpochRef.current
        setState((s) => ({
          ...s,
          name,
          mobile,
          hydrated: true,
          family: mapFamily(name, mobile, familyRows),
          addresses,
          defaultAddressId: addresses[0]?.id || s.defaultAddressId,
          bookings: bookingsEpochRef.current === hydrateEpoch ? appointments : s.bookings,
          wallet,
          packages: catalog.map(labTestToAccountPackage),
        }))
      } catch {
        hydratedRef.current = false
        if (!cancelled) setState((s) => ({ ...s, hydrated: true }))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [state.authed])

  const showToast = useCallback((msg: string) => {
    setState((s) => ({ ...s, toast: msg }))
    window.setTimeout(() => setState((s) => ({ ...s, toast: '' })), 2200)
  }, [])

  const refreshBookings = useCallback(async () => {
    if (!stateRef.current.authed) return
    const epoch = ++bookingsEpochRef.current
    try {
      const bookings = await fetchAppointments()
      if (bookingsEpochRef.current !== epoch) return
      setState((s) => ({ ...s, bookings }))
    } catch {
      /* keep current list */
    }
  }, [])

  const pkg = useCallback(
    (id: string) =>
      state.packages.find((p) => p.id === id) ??
      fallbackPackage(
        id,
        state.bookings.find((b) => b.packageId === id)?.packageName,
        state.bookings.find((b) => b.packageId === id)?.amount,
      ),
    [state.packages, state.bookings],
  )
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
        const refreshToken = localStorage.getItem('hc_refresh') || ''
        void api.post('/auth/logout', { refreshToken }).catch(() => undefined)
        store.dispatch(clearSession())
        hydratedRef.current = false
        setState((s) => ({ ...initialState(), authed: false, hydrated: true, loginMode: s.loginMode }))
      },
      toggleAuthMode: () =>
        setState((s) => ({
          ...s,
          loginMode: s.loginMode === 'login' ? 'create' : 'login',
          error: '',
          otpSent: false,
          notice: '',
        })),
      resendOtp: async () => {
        const s = stateRef.current
        if (s.cooldown > 0 || s.busy) return
        const mobile = s.mobileInput.trim()
        if (!validMobile(mobile)) {
          setState((prev) => ({ ...prev, error: 'Enter a valid 10-digit mobile number.' }))
          return
        }
        setState((prev) => ({ ...prev, busy: true, error: '' }))
        try {
          const purpose = s.loginMode === 'create' ? 'signup' : 'login'
          const typedName = s.nameInput.trim()
          const result = await sendOtp({
            mobile,
            purpose,
            fullName: typedName.length >= 2 ? typedName : undefined,
          })
          setState((prev) => ({
            ...prev,
            busy: false,
            notice: channelNotice(result.channel, result.delivered, result.devCode),
          }))
          startCooldown()
        } catch (e) {
          setState((prev) => ({ ...prev, busy: false, error: authErrorMessage(e) }))
        }
      },
      loginHelp: () => setState((s) => ({ ...s, notice: 'Call 1800-123-4567 if the OTP doesn’t arrive.' })),
      finishOtpLogin: (result) => {
        if (!result.verified || !result.accessToken || !result.refreshToken || !result.user) return false
        store.dispatch(
          setSession({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          }),
        )
        const mobile = result.user.mobile || result.mobile || ''
        const name = result.user.fullName || stateRef.current.name
        hydratedRef.current = false
        setState((prev) => ({
          ...prev,
          authed: true,
          hydrated: false,
          name,
          mobile,
          mobileInput: mobile,
          nameInput: name,
          family: mapFamily(name, mobile),
          otpSent: false,
          notice: '',
          otp: '',
          error: '',
          busy: false,
        }))
        return true
      },
      submitLogin: async (data) => {
        const s = stateRef.current
        const mobileInput = data.mobile.trim()
        const nameInput = (data.name || '').trim()
        if (s.busy) return false
        if (!validMobile(mobileInput)) {
          setState((prev) => ({ ...prev, mobileInput, nameInput, error: 'Enter a valid 10-digit mobile number.' }))
          return false
        }
        const fullName = nameInput.length >= 2 ? nameInput : undefined
        const purpose = s.loginMode === 'create' ? 'signup' : 'login'
        if (!s.otpSent || mobileInput !== s.mobileInput) {
          setState((prev) => ({ ...prev, mobileInput, nameInput, error: '', notice: '', busy: true }))
          try {
            const result = await sendOtp({
              mobile: mobileInput,
              purpose,
              fullName,
            })
            setState((prev) => ({
              ...prev,
              mobileInput,
              nameInput,
              otp: '',
              busy: false,
              otpSent: true,
              notice: channelNotice(result.channel, result.delivered, result.devCode),
            }))
            startCooldown()
          } catch (e) {
            setState((prev) => ({ ...prev, mobileInput, nameInput, busy: false, error: authErrorMessage(e) }))
          }
          return false
        }
        const otp = (data.otp || '').trim()
        if (!/^\d{6}$/.test(otp)) {
          setState((prev) => ({ ...prev, mobileInput, nameInput, error: 'Enter the 6-digit OTP.', otp }))
          return false
        }
        setState((prev) => ({ ...prev, mobileInput, nameInput, busy: true, error: '' }))
        try {
          const result = await verifyOtp({
            mobile: mobileInput,
            otp,
            purpose,
            fullName,
          })
          if (!result.verified || !result.accessToken || !result.refreshToken || !result.user) {
            setState((prev) => ({ ...prev, busy: false, error: 'Could not verify OTP. Please try again.' }))
            return false
          }
          store.dispatch(
            setSession({
              user: result.user,
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
            }),
          )
          const name = result.user.fullName || nameInput || s.name
          hydratedRef.current = false
          setState((prev) => ({
            ...prev,
            authed: true,
            hydrated: false,
            name,
            mobile: mobileInput,
            mobileInput,
            nameInput,
            family: mapFamily(name, mobileInput),
            otpSent: false,
            notice: '',
            otp: '',
            error: '',
            busy: false,
          }))
          return true
        } catch (e) {
          setState((prev) => ({ ...prev, busy: false, error: authErrorMessage(e) }))
          return false
        }
      },
      saveFamilyMember: (data) => {
        if (state.family.length >= MAX_FAMILY_MEMBERS) {
          setState((s) => ({
            ...s,
            error: `This card already has ${MAX_FAMILY_MEMBERS} members (1 primary + ${MAX_FAMILY_MEMBERS - 1} others).`,
          }))
          return false
        }
        if (!isValidMemberDob(data.dob)) {
          setState((s) => ({ ...s, familyDraft: data, error: 'Use dd-mm-yyyy for date of birth.' }))
          return false
        }
        if (!data.name.trim()) {
          setState((s) => ({ ...s, familyDraft: data, error: 'Enter the member’s full name.' }))
          return false
        }
        const created = {
          id: `m${Date.now()}`,
          name: data.name.trim(),
          relation: data.relation,
          dob: data.dob,
          phone: data.phone,
          status: 'Active',
        }
        void api
          .post('/family', {
            name: created.name,
            relation: toFamilyRelation(data.relation),
            mobile: data.phone || undefined,
            dateOfBirth: toIsoDob(data.dob),
          })
          .then(async () => {
            const familyRows = await api
              .get('/family')
              .then((r) => unwrap<ApiFamilyMember[]>(r.data))
              .catch(() => [] as ApiFamilyMember[])
            setState((s) => ({ ...s, family: mapFamily(s.name, s.mobile, familyRows) }))
          })
          .catch(() => undefined)
        setState((s) => ({
          ...s,
          family: [...s.family, created],
          familyDraft: { name: '', relation: 'Spouse', dob: '', phone: '' },
          showAdd: false,
          error: '',
        }))
        showToast('Member added')
        return true
      },
      updateFamilyMember: (id, data) => {
        if (!data.name.trim()) {
          setState((s) => ({ ...s, error: 'Enter the member’s full name.' }))
          return false
        }
        if (!isValidMemberDob(data.dob)) {
          setState((s) => ({ ...s, error: 'Use dd-mm-yyyy for date of birth.' }))
          return false
        }
        setState((s) => ({
          ...s,
          family: s.family.map((m) =>
            m.id === id
              ? {
                  ...m,
                  name: data.name.trim(),
                  relation: id === PRIMARY_MEMBER_ID ? 'Self' : data.relation,
                  dob: data.dob,
                  phone: data.phone,
                }
              : m,
          ),
          error: '',
        }))
        showToast('Member updated')
        return true
      },
      removeMember: (id) => {
        if (id === PRIMARY_MEMBER_ID) {
          showToast('The primary card holder cannot be removed.')
          return false
        }
        void api.delete(`/family/${id}`).catch(() => undefined)
        setState((s) => ({ ...s, family: s.family.filter((m) => m.id !== id) }))
        showToast('Member removed')
        return true
      },
      addAddress: (data) => {
        if (!data.label.trim() || !data.line.trim()) {
          setState((s) => ({ ...s, error: 'Label and address line are required.' }))
          return false
        }
        const parsed = parseAddressLine(data.line)
        void api
          .patch('/users/profile', {
            ...parsed,
            label: data.label.trim(),
            newAddress: true,
          })
          .then(async () => {
            const profile = unwrap<UserProfile>((await api.get('/users/profile')).data)
            const addresses = mapAddresses(profile.addresses)
            setState((s) => ({
              ...s,
              addresses,
              defaultAddressId: addresses[0]?.id || s.defaultAddressId,
            }))
          })
          .catch(() => undefined)
        const id = `addr-${Date.now()}`
        setState((s) => ({
          ...s,
          addresses: [
            ...s.addresses,
            {
              id,
              label: data.label.trim(),
              line: data.line.trim(),
              note: data.note.trim() || 'Home collection',
              ...parsed,
            },
          ],
          error: '',
        }))
        showToast('Address added')
        return true
      },
      setDefaultAddress: (id) => {
        if (!stateRef.current.addresses.some((a) => a.id === id)) return
        setState((s) => ({ ...s, defaultAddressId: id, draft: { ...s.draft, addressId: id } }))
        showToast('Default address updated')
      },
      toggleShowAdd: () => setState((s) => ({ ...s, showAdd: !s.showAdd, error: '' })),
      saveProfile: (name) => {
        localStorage.setItem('hid_name', name)
        void api.patch('/users/profile', { fullName: name }).catch(() => undefined)
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
      confirmBooking: async () => {
        const s = stateRef.current
        const member = s.family.find((m) => m.id === s.draft.memberId)
        const addr = s.addresses.find((a) => a.id === s.draft.addressId)
        if (!s.draft.packageId || !s.draft.date || !s.draft.slot) {
          setState((prev) => ({ ...prev, error: 'Choose a test, date and time slot.' }))
          return false
        }
        const bookingDate = resolveBookingDateIso(s.draft.date)
        if (!bookingDate) {
          setState((prev) => ({ ...prev, error: 'Pick a collection date and time slot again, then confirm.' }))
          return false
        }
        const payload = {
          testId: s.draft.packageId,
          date: bookingDate,
          timeSlot: s.draft.slot,
          patientName: member?.name || s.name,
          familyMemberId: s.draft.memberId !== PRIMARY_MEMBER_ID ? s.draft.memberId : undefined,
          addressId: addr?.id && !addr.id.startsWith('addr-') ? addr.id : undefined,
          deliveryAddress: addr?.line || s.draft.addressId,
          collectionType: 'HOME' as const,
          paymentMethod: 'COD' as const,
          useWallet: false,
          useReferral: false,
        }
        try {
          setState((prev) => ({ ...prev, busy: true, error: '' }))
          if (s.draft.rescheduleId) {
            await api.patch(`/appointments/${s.draft.rescheduleId}`, {
              date: s.draft.date,
              timeSlot: s.draft.slot,
            })
          } else {
            await api.post('/appointments', payload)
          }
          bookingsEpochRef.current += 1
          const bookings = await fetchAppointments()
          setState((prev) => ({
            ...prev,
            busy: false,
            bookings,
            draft: { ...prev.draft, rescheduleId: undefined },
          }))
          showToast(s.draft.rescheduleId ? 'Visit rescheduled' : 'Booking confirmed')
          return true
        } catch (e) {
          setState((prev) => ({ ...prev, busy: false, error: authErrorMessage(e) }))
          return false
        }
      },
      confirmCartBookings: async (items, visit) => {
        const s = stateRef.current
        const member = s.family.find((m) => m.id === visit.memberId)
        const addr = s.addresses.find((a) => a.id === visit.addressId)
        const date = resolveBookingDateIso(visit.dateIso) || resolveBookingDateIso(visit.dateLabel)
        const savedAddressId =
          addr?.id && !addr.id.startsWith('addr-') && addr.id !== 'custom' && addr.id !== 'home'
            ? addr.id
            : undefined
        if (!date) {
          setState((prev) => ({ ...prev, error: 'Pick a collection date and time slot again, then confirm.' }))
          return null
        }
        try {
          setState((prev) => ({ ...prev, busy: true, error: '' }))
          let firstCode: string | null = null
          const createdRows: Appointment[] = []
          for (const item of items) {
            const created = unwrap<Appointment>(
              (
                await api.post('/appointments', {
                  testId: item.id,
                  date,
                  timeSlot: visit.slot,
                  patientName: member?.name || visit.patientName || s.name,
                  familyMemberId: visit.memberId && visit.memberId !== PRIMARY_MEMBER_ID ? visit.memberId : undefined,
                  addressId: savedAddressId,
                  deliveryAddress: visit.addressLine || addr?.line,
                  collectionType: visit.collection === 'lab' ? 'LAB' : 'HOME',
                  paymentMethod: 'COD',
                  useWallet: false,
                  useReferral: false,
                })
              ).data,
            )
            createdRows.push(created)
            if (!firstCode) firstCode = created.code || created.id || null
          }
          bookingsEpochRef.current += 1
          let bookings = await fetchAppointments().catch(() => [] as Booking[])
          if (!bookings.length && createdRows.length) bookings = mapBookings(createdRows)
          setState((prev) => ({ ...prev, busy: false, bookings }))
          showToast('Booking confirmed')
          return firstCode
        } catch (e) {
          setState((prev) => ({ ...prev, busy: false, error: authErrorMessage(e) }))
          return null
        }
      },
      rescheduleBooking: (id) => {
        const b = stateRef.current.bookings.find((x) => x.id === id)
        if (!b) return
        setState((s) => ({
          ...s,
          draft: {
            ...s.draft,
            packageId: b.packageId,
            memberId: b.memberId,
            addressId: b.addressId || s.defaultAddressId,
            date: b.dateIso || '',
            slot: '',
            rescheduleId: id,
          },
        }))
        showToast('Pick a new date and time')
      },
      cancelBooking: (id) => {
        void api
          .delete(`/appointments/${id}`)
          .then(async () => {
            const bookings = await fetchAppointments()
            setState((s) => ({ ...s, bookings }))
          })
          .catch(() => {
            setState((s) => ({
              ...s,
              bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b)),
            }))
          })
        showToast('Booking cancelled')
        return true
      },
      setDraftPartial: (patch) => setState((s) => ({ ...s, draft: { ...s.draft, ...patch } })),
      setFamilyDraft: (patch) => setState((s) => ({ ...s, familyDraft: { ...s.familyDraft, ...patch } })),
      setError: (error) => setState((s) => ({ ...s, error })),
      refreshBookings,
    }),
    [state, memberId, pkg, member, address, showToast, startCooldown, refreshBookings],
  )

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error('useAccount must be used within AccountProvider')
  return ctx
}
