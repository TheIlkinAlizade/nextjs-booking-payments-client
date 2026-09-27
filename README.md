# Booking & Payments API — Frontend

Next.js frontend for the [Booking & Payments API](https://github.com/TheIlkinAlizade/springboot-booking-payments-api). Users browse available consultation sessions, book one, and pay through Stripe Checkout. Admins can create and manage sessions from the UI.

Built with Next.js (App Router) and TypeScript.

**Live demo:** _not planned for now — see setup instructions below to run locally_
**Backend repo:** [springboot-booking-payments-api](https://github.com/TheIlkinAlizade/springboot-booking-payments-api)

---

## What it does

- Register / log in (JWT-based auth against the backend)
- Browse available consultation sessions, no login required
- Log in and book a session — redirects to Stripe Checkout to pay
- After payment, a confirmation page checks the booking status and shows when it's confirmed
- "My Bookings" page shows a user's booking history and status
- Admin-only panel to create new sessions (title, time, price) and cancel existing ones

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript |
| Styling | CSS Modules |
| Auth state | React Context, JWT stored in `localStorage` |
| API | Fetches directly from the Spring Boot backend |
| Deployment | Vercel |

## Pages

| Route | Description |
|---|---|
| `/` | Home page |
| `/login` | Log in |
| `/register` | Create an account |
| `/slots` | Browse available sessions, book one |
| `/bookings` | Logged-in user's own bookings |
| `/booking/success` | Landing page after Stripe payment succeeds; polls for confirmation |
| `/booking/cancel` | Landing page if payment is cancelled |
| `/admin` | Admin-only — create and cancel sessions |
| `/payments/{bookingId}` (via API) | Used internally to check if a booking's payment has cleared |

## Prerequisites

- Node.js 18+
- The [backend API](https://github.com/TheIlkinAlizade/springboot-booking-payments-api) running locally (or a deployed URL)

## Setup

### 1. Clone and install

```bash
git clone https://github.com/TheIlkinAlizade/nextjs-booking-payments-client.git
cd nextjs-booking-payments-client
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to wherever the backend is running, e.g.:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Run it

```bash
npm run dev
```

App runs at `http://localhost:3000`. Make sure the backend is running first, otherwise pages that fetch data will fail.

### 4. Testing a real booking

To fully test booking + payment, the backend needs a Stripe test-mode key and its webhook listener running — see the [backend README](https://github.com/TheIlkinAlizade/springboot-booking-payments-api) for that setup. Without it, a booking will stay stuck in "Confirming your payment..." since nothing tells the backend the payment succeeded.

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API |

## Notes

- Route guards (e.g. the admin page redirecting non-admins) are client-side only, for UX. The actual access control is enforced by the backend — the frontend just reflects it.
- Booking a slot briefly locks it as `BOOKED` even before payment completes, to prevent two people booking the same session at once. If checkout is abandoned, the backend automatically releases it after a timeout.

## Related repos

- Backend: [springboot-booking-payments-api](https://github.com/TheIlkinAlizade/springboot-booking-payments-api)