# Booking UX spec — frontend implementation notes

Based on `HealthIDCard_Complete_Member_and_NonMember_Booking_Flows.pdf`.

## Public routes (`/book/*`)

Single-page **accordion checkout** (flight-style) at `/book` — six expandable steps through confirm.

Entry: `/book/start?...` → `/book`. Confirmation: `/book/confirmed`. Lookup: `/book/lookup`.

**Payment:** no online checkout — cash or UPI at sample collection only.

- Cart and draft persist in `sessionStorage` (`hid_public_booking_v1`); **multiple packages** supported in UI via `BookingCartProvider`.
- Header cart drawer on landing, browse, and `/book` (Phase 0–2). See `docs/multi-test-booking-backend-gap.md` for API limits.
- Guest bookings stored in `hid_guest_bookings_v1`.
- **Find my booking:** `/book/lookup` (booking ID + mobile + OTP; no unrestricted access by phone alone).

## Wiring

- Landing **Book now** → `/book/start` with test/package params (`booking/booking-url.ts`).
- Member confirm syncs to `AccountContext` bookings when logged in.
- Non-member confirm does not require card or password; optional member CTA on order summary only.

## Still backend-dependent

- Live slot inventory, serviceability, payment gateways, real OTP, eligibility rules, report authorization, and account linking should replace preview behaviour when APIs are ready.
