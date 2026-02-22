# Travel App

Next.js 14+ (App Router) TypeScript app for Travel platform features (public browsing, user flows, admin dashboard).

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios
- TanStack Query
- DOMPurify (safe HTML rendering)

## Environment

Create `.env`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_API_KEY=your_api_key
```

## Run

```bash
npm install
npm run dev
```

## Architecture Summary

- `lib/api/client.ts`:
  - Axios client with request interceptor.
  - Always sends `apiKey`.
  - Sends `Authorization: Bearer <token>` when token is available.
- `app/api/auth/login/route.ts`:
  - Calls backend `/api/v1/login`.
  - Stores JWT in httpOnly cookie `token`.
- `app/api/auth/logout/route.ts`:
  - Calls backend logout (best effort).
  - Clears `token` cookie.
  - Redirects to `/login`.
- `app/api/proxy/[...path]/route.ts`:
  - Server-side proxy for backend `/api/v1/*`.
  - Injects `apiKey` and cookie token automatically.
- `middleware.ts`:
  - Protects user/admin routes.
  - Redirects unauthenticated users to `/login`.
  - Redirects non-admin users away from `/admin/*`.

## Pages Documentation

### Public Pages

- `/` (`app/page.tsx`)
  - Home dashboard.
  - Shows banners, promos, categories, activities.
- `/login` (`app/(auth)/login/page.tsx`)
  - Login form.
  - Submits to `/api/auth/login`.
- `/register` (`app/(auth)/register/page.tsx`)
  - Registration form.
  - Submits to `/api/proxy/register`.
- `/promos/[id]` (`app/promos/[id]/page.tsx`)
  - Promo details.
  - Renders `terms_condition` safely with DOMPurify.
- `/banners/[id]` (`app/banners/[id]/page.tsx`)
  - Banner detail by ID.
- `/categories/[id]` (`app/categories/[id]/page.tsx`)
  - Category detail and activities by category.
- `/activities/[id]` (`app/activities/[id]/page.tsx`)
  - Activity detail.
  - Safely renders `facilities` and `location_maps` (iframe map allowed for `location_maps`).
  - Add to cart action.

### User Pages (auth required)

- `/account` (`app/account/page.tsx`)
  - Shows authenticated user profile.
  - Update profile form (`name`, `email`, `profilePictureUrl`, `phoneNumber`).
- `/cart` (`app/cart/page.tsx`)
  - Shows user cart list.
  - Update quantity and delete cart items.
  - Choose payment method and proceed to payment (`create-transaction`).
- `/transactions` (`app/transactions/page.tsx`)
  - Shows current user transactions.
- `/transactions/[id]` (`app/transactions/[id]/page.tsx`)
  - Transaction detail by ID.
  - Cancel transaction.
  - Upload proof image and update proof payment URL.

### Admin Pages (admin role required)

- `/admin` (`app/admin/page.tsx`)
  - Admin dashboard links.
- `/admin/users` (`app/admin/users/page.tsx`)
  - List users and update role.
- `/admin/banners` (`app/admin/banners/page.tsx`)
  - Banner CRUD with create/update form and delete confirm modal.
- `/admin/promos` (`app/admin/promos/page.tsx`)
  - Promo CRUD page.
- `/admin/categories` (`app/admin/categories/page.tsx`)
  - Category CRUD page.
- `/admin/activities` (`app/admin/activities/page.tsx`)
  - Activity CRUD page.
- `/admin/transactions` (`app/admin/transactions/page.tsx`)
  - List transactions and update status.
- `/admin/payment-methods` (`app/admin/payment-methods/page.tsx`)
  - List payment methods and trigger generation.

## Route Handlers

- `POST /api/auth/login` (`app/api/auth/login/route.ts`)
- `POST /api/auth/logout` (`app/api/auth/logout/route.ts`)
- `GET|POST|DELETE /api/proxy/[...path]` (`app/api/proxy/[...path]/route.ts`)

## Endpoint Coverage

The current UI flow and proxy/API integration cover these backend endpoints:

- Auth: `register`, `login`, `logout`
- Users: `user`, `all-user`, `update-profile`, `update-user-role/:id`
- Banners: `banners`, `banner/:id`, `create-banner`, `update-banner/:id`, `delete-banner/:id`
- Promos: `promos`, `promo/:id`, `create-promo`, `update-promo/:id`, `delete-promo/:id`
- Categories: `categories`, `category/:id`, `create-category`, `update-category/:id`, `delete-category/:id`
- Activities: `activities`, `activity/:id`, `activities-by-category/:id`, `create-activity`, `update-activity/:id`, `delete-activity/:id`
- Payment methods: `payment-methods`, `generate-payment-methods`
- Cart: `carts`, `add-cart`, `update-cart/:id`, `delete-cart/:id`
- Transactions: `my-transactions`, `all-transactions`, `transaction/:id`, `create-transaction`, `cancel-transaction/:id`, `update-transaction-status/:id`, `update-transaction-proof-payment/:id`
- Upload: `upload-image`

## Types

Domain types are in `types/index.ts`:

- `User`
- `Banner`
- `Promo`
- `Category`
- `Activity`
- `Cart`
- `Transaction`
- `PaymentMethod`

## UI Components

- `components/ui/*`: button, input, textarea, card primitives.
- `components/ui/notification.tsx`: inline success/error/info notification component.
- `components/confirm-modal.tsx`: reusable delete confirmation modal.
- `components/admin-crud-page.tsx`: reusable admin CRUD page pattern.
- `components/safe-html.tsx`: sanitized HTML renderer.

## Notes

- If `.next` gets stale and you see missing chunk/module errors, delete `.next` and rerun:

```bash
npm run build
```
