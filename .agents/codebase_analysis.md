# Casa Viana - Frontend Codebase Analysis

Welcome! This document provides a detailed breakdown of the **Casa Viana Frontend** codebase. Casa Viana is a modern restaurant and event booking web application. This frontend handles reservations, order placements, event ticket purchases, blog management, profile configurations, and multi-gateway payment processing.

---

## 1. Project Architecture & Setup

The application is structured as a **Next.js** web application utilizing the **Pages Router** (`/src/pages`). It is configured to run as a **Static HTML Export (SSG)**, which generates fully static files during the build process.

- **Dynamic Routes:** Dynamic pages (such as `/blogs/[slug].jsx`) resolve routes on the client side using search parameters or slug subpaths, fetching content dynamically from the API.
- **Maintenance Mode:** Includes a middleware configuration and checks system settings from the backend. If `maintenance_mode` is enabled, the app serves a custom maintenance screen (`MaintenancePage.jsx`) or returns an Edge middleware response.
- **Path Resolution:** The project defines a path alias (`@/` maps to `./src/`) in `jsconfig.json` to keep imports clean.

---

## 2. Technology Stack & Key Dependencies

### Core Framework & Libraries
- **React 19** (`19.2.0`) & **React DOM** (`19.2.0`)
- **Next.js 16** (`^16.0.7`) - Pages routing and static site export configuration.
- **Redux Toolkit** (`^2.10.1` and `react-redux ^9.2.0`) - Global state management for authentication, cart, system configurations, and dynamic landing sections.
- **Axios** (`^1.13.2`) - Promise-based HTTP client for API calls, equipped with custom request/response interceptors.

### Styling & UI Components
- **Tailwind CSS v4** (`^4` with `@tailwindcss/postcss ^4.1.17`) - Main utility styling layer.
- **HeroUI** (`@heroui/react ^2.8.5`, `@heroui/system`, `@heroui/theme`) - Premium UI components, toast notifications, modals, and wrappers.
- **Swiper** (`^12.0.3`) - Dynamic carousels and sliders with navigation, pagination, and synchronized thumbnail previews.

### Utility & Features
- **i18next** (`react-i18next ^16.4.0`, `next-i18next ^15.4.3`) - Multilingual support (Portuguese, English, Chinese, French).
- **js-cookie** (`^3.0.5`) - Client-side cookie storage management (specifically for persisting language settings).
- **react-rating** (`@smastrom/react-rating ^1.5.0`) - Specialized star rating component for service reviews and blog posts.

---

## 3. Directory Structure

Below is the directory mapping of the `/src` folder structure:

```
src/
├── Api/               # API clients, Axios configurations, and interceptors
├── components/        # Reusable UI components (Headers, Footers, Sidebars, Forms)
│   ├── Comment/       # Comment section components
│   ├── Modals/        # Dialog overlays (Login, Bookings, Orders, Payments)
│   ├── Rating/        # Review/Rating components
│   └── Skeletons/     # Shimmer loaders for loading states
├── layouts/           # Page structural wrappers
├── pages/             # Next.js Pages router endpoints (mappings to URL paths)
│   ├── blogs/         # Blog pages
│   ├── bookings/      # Booking logs & checkout pages
│   ├── cardapio/      # Menu pages (Categorized food/drink menus)
│   ├── contact-us/    # Customer contact endpoints
│   ├── entradas/      # Appetizers / Entries selection
│   ├── events/        # Events listing and detailed booking
│   ├── my-profile/    # User settings and logs portal
│   ├── orders/        # Order history
│   ├── payments/      # Payment receipts & logs
│   ├── reserva/       # Custom booking reservation screens
│   ├── servicos/      # Custom service checkout pages
│   └── _app.js        # Global App wrapper (Redux, i18n, and HeroUI Provider setups)
├── store/             # Redux Store configuration and slices
├── styles/            # CSS globals and module stylesheets
├── utils/             # Helper/utility scripts (such as translation loaders)
└── views/             # Full page view designs corresponding to Pages router scripts
```

---

## 4. State Management (Redux Store Slices)

The store (`src/store/store.js`) binds several key slices to manage the application's global state:

1. **`auth` (`src/store/authSlice.js`)**
   - Keeps track of:
     - `isLoggedIn` (Boolean): User authentication state.
     - `user` (Object): Active user profile information (name, email, profile picture, etc.).
   - Actions: `setLogin`, `updateProfile`, `logout`.

2. **`cart` (`src/store/cartSlice.js`)**
   - Stores active cart information including `items` array, `cart_id`, and `final_total`.
   - Synchronizes cart items client-side when adding/removing dishes from the food menus.

3. **`systemSettings` (`src/store/systemSettingsSlice.js`)**
   - Manages state for backend-driven configurations:
     - `settings` (Object): Configurations like maintenance toggle (`maintenance_mode`).
     - `loading` and `error` states for initializing values on app boot.

4. **`contentSections` (`src/store/contentSectionsSlice.js`)**
   - Caches dynamic sections fetched from the CMS backend for rendering dynamic sliders/blocks on the landing page.

---

## 5. API Client & Backend Integration

Axios config is split into two files under `src/Api/`:

### 1. Axios Interceptor (`src/Api/interceptor.js`)
- **Base URL Prefixing:** Automatically reads target API path from `process.env.NEXT_PUBLIC_API_BASE_URL`.
- **JWT Authorization Injector:** Checks local storage (`authToken`) and injects it into headers as `Bearer <token>` on every outgoing request.
- **Response Error Handler:** Listens for `401 Unauthorized` responses (indicating session expiry) and logs warnings.

### 2. Service Endpoints (`src/Api/api.js`)
Contains clean async-await request wrappers. Major categories include:
- **Auth:** `login`, `register`, `logout`, `update_profile`.
- **Events:** `get_events`, `get_event`, `book_event` (ticket selections).
- **Categories & Menus:** `get_categories`, `get_restaurant_categories`, `get_menus`, `get_menu_details`, `get_menu_items`, `get_random_menu_items`.
- **Interactions:** `get_ratings`, `create_rating`, `get_comments`, `create_comment`, `report_comment`.
- **Cart Operations:** `add_to_cart`, `get_cart`, `delete_cart`.
- **Bookings & Services:** `fetch_all_services`, `fetch_service_details`, `get_rooms`, `get_addons`, `create_service_booking`, `get_booking`, `get_booking_details`.
- **Orders & Payments:** `get_orders`, `get_payments`, `initiate_payment`, `check_payment_status`, `upload_payment_proof`, `get_payment_gateways`.
- **System Configs:** `get_system_settings` (for maintenance screens), `get_advertisements`.

---

## 6. Core Flow Implementations

### Authentication Flow
On page load (`src/pages/_app.js`):
1. Hydrates authentication status from `localStorage` (`user` and `authToken`).
2. Dispatches `setLogin` to Redux after a short timeout to prevent React SSR hydration mismatch.
3. If a token exists, triggers `get_cart()` to update items in the checkout drawer.
4. On logout, clears `localStorage` tokens and dispatches the reset actions.

### Multilingual Translation Flow
Managed via `i18n.js` and `LanguageSwitcher.jsx`:
- Supported language configurations: **Portuguese (pt)** (default), **English (en)**, **Chinese (zh)**, and **French (fr)**.
- Language configuration is persisted via cookies (`app_language`).
- App wrapper explicitly sets the viewport orientation to Left-to-Right (`dir="ltr"`).

### Service and Event Booking
- **Events:** Customers can book event tickets using `book_event` with a selected ticket type and quantity.
- **Services:** Checked out via `ServiceBookingForm.jsx` (integrating room listings and optional add-ons/services). Triggers `create_service_booking`.

### Payment Processing Workflow
The site integrates multi-gateway payment processing:
1. When a booking or order is initiated, the system retrieves supported gateways using `get_payment_gateways`.
2. A payment is initialized (`initiate_payment`) using parameter sets like `gateway`, `payable_type`, and `phone_number`.
3. If manual bank transfers or Multicaixa are selected, payment directions display via `PaymentInstructionsModal.jsx`.
4. Users upload transaction receipts using `upload_payment_proof` via `PaymentProofModal.jsx`.
5. Payment status is continuously tracked using `check_payment_status(reference)`.

---

## 7. Development & Deployment Guidelines

### Configuration Setup
Ensure an `.env` file exists at the root of the project containing:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.casaviana.com  # Replace with target backend service URL
```

### Running Locally
To launch the developer hot-reloading environment:
```bash
npm run dev
```

### Linting
To check syntax and lint rules:
```bash
npm run lint
```

### Compiling to Static Files
Because Next.js has `output: 'export'` configured in `next.config.js`, building compiles static pages to HTML files:
```bash
npm run build
```
The static build artifacts are generated inside the `/out` directory (or `.next` output depending on Next configuration), which can be served directly from any static hosting provider.
