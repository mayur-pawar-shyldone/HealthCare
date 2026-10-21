import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useAccount } from '@/account/AccountContext'
import { AccountLoginPage } from '@/account/AccountLoginPage'
import { OtpVerification } from '@/account/OtpVerification'
import { consumeLoginReturn, loginReturnFromLocation } from '@/lib/auth-return'
import { AccountShell } from '@/account/AccountShell'
import {
  AccountBookDonePage,
  AccountBookMemberPage,
  AccountBookReviewPage,
  AccountBookSlotPage,
  AccountBookingDetailPage,
  AccountBookingsPage,
  AccountCataloguePage,
  AccountDashboardPage,
  AccountProfilePage,
  AccountReportsPage,
  AccountSupportPage,
} from '@/account/AccountPages'

/** OTP login from pasted HealthID account portal — use at `/login`. */
export function AccountLoginGate() {
  const acc = useAccount()
  const location = useLocation()
  if (acc.authed) {
    const dest = consumeLoginReturn(loginReturnFromLocation(location))
    return <Navigate to={dest} replace />
  }
  loginReturnFromLocation(location)
  return <AccountLoginPage />
}

export function AccountEmailOtpGate() {
  const acc = useAccount()
  const location = useLocation()
  if (acc.authed) {
    const dest = consumeLoginReturn(loginReturnFromLocation(location))
    return <Navigate to={dest} replace />
  }
  loginReturnFromLocation(location)
  return <OtpVerification />
}

function AccountProtected() {
  const acc = useAccount()
  const location = useLocation()
  if (!acc.authed) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export function AccountRoutes() {
  return (
      <Routes>
        <Route path="login" element={<Navigate to="/login" replace />} />
        <Route element={<AccountProtected />}>
          <Route element={<AccountShell />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AccountDashboardPage />} />
            <Route path="card" element={<Navigate to="/account/dashboard" replace />} />
            <Route path="family" element={<Navigate to="/account/dashboard" replace />} />
            <Route path="bookings" element={<AccountBookingsPage />} />
            <Route path="bookings/:id" element={<AccountBookingDetailPage />} />
            <Route path="reports" element={<AccountReportsPage />} />
            <Route path="catalogue" element={<AccountCataloguePage />} />
            <Route path="profile" element={<AccountProfilePage />} />
            <Route path="support" element={<AccountSupportPage />} />
            <Route path="book/member" element={<AccountBookMemberPage />} />
            <Route path="book/slot" element={<AccountBookSlotPage />} />
            <Route path="book/review" element={<AccountBookReviewPage />} />
            <Route path="book/done" element={<AccountBookDonePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  )
}
