# Multi-test booking — backend gap

## Current API (source of truth)

`POST /appointments` (`CreateAppointmentDto`) accepts a **single** `testId` per appointment.

There is no cart or multi-line booking endpoint in the backend today.

## Required backend changes (for production)

1. **Option A — Multi-line DTO**  
   Extend create (or add `POST /appointments/batch`) with `items: { testId: string }[]`, shared slot/patient/collection fields, and server-side total/discount calculation.

2. **Option B — Client creates N appointments**  
   Keep single-test API; frontend calls create once per cart line with the same slot/patient. Requires transactional grouping (shared `bookingGroupId`) and idempotency keys to avoid duplicate submits.

3. **Pricing / availability**  
   Quote endpoint should accept multiple `testId`s or a cart payload; return authoritative line prices and eligibility.

## Frontend (until API exists)

- Cart and checkout support **multiple packages** in session state.
- Confirmation creates **one preview booking per cart line** (account/guest session storage) with shared visit details, or a **single combined guest record** with aggregated total — clearly labeled as preview until batch API is wired.
