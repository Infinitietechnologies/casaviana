---
name: casaviana-guide
description: >-
  Comprehensive architectural reference, development runbook, and conventions guide for the Casa Viana Next.js codebase. Use this skill whenever inspecting, developing, modifying, debugging, or reviewing features, APIs, state management, routes, or UI components in the Casa Viana project.
---

# Casa Viana Codebase Reference & AI Skill Guide

This document is the definitive guide for AI agents and developers working on the **Casa Viana** repository (`d:\projects\next\casaviana`). It provides technical context, architectural patterns, state handling, API interfaces, and critical project rules.

---

## 1. Tech Stack & Environment

| Layer | Technology | Details / Version |
| :--- | :--- | :--- |
| **Framework** | Next.js (Pages Router) | `v16.0.7`, `pages/` directory architecture |
| **Runtime / Library** | React | `v19.2.0` |
| **Styling** | Tailwind CSS v4 + HeroUI | `@tailwindcss/postcss ^4`, `@heroui/react ^2.8`, `@heroui/theme` |
| **State Management** | Redux Toolkit + React-Redux | `@reduxjs/toolkit ^2.10`, `react-redux ^9.2` |
| **API Client** | Axios | `^1.13.2` with custom Bearer token interceptor |
| **Internationalization** | `next-i18next` / `react-i18next` | Locales: Portuguese (`pt`), English (`en`), French (`fr`) |
| **Carousels / Sliders**| Swiper | `swiper ^12.0.3` (Navigation, Thumbs) |
| **Rating** | `@smastrom/react-rating` | `^1.5.0` |
| **Target Build** | Static Export (`output: 'export'`) | Defined in `next.config.js` |

---

## 2. Directory Layout & Conventions

```text
casaviana/
├── .agents/skills/casaviana-guide/   # AI skill documentation (this guide)
├── public/                           # Static assets, logos, placeholder images
├── src/
│   ├── Api/                          # Backend API interfaces & Axios configuration
│   │   ├── api.js                    # Exported API call functions
│   │   └── interceptor.js            # Axios client, baseURL, JWT Authorization header
│   ├── components/                   # Reusable UI components
│   │   ├── Modals/                   # Modal dialogs (Login, Order/Booking details, Payments, QuickView)
│   │   ├── Skeletons/                # Loading skeletons (Cardápio, Blogs, Events, Services, Swiper)
│   │   ├── Comment/                  # Comment rendering and reply threads
│   │   ├── Rating/                   # Star rating widgets
│   │   ├── Header.jsx                # Sticky navigation header, auth status, cart badge, i18n
│   │   ├── Footer.jsx                # Global site footer
│   │   ├── LeftSidebar.jsx           # Left sidebar navigation links & quick actions
│   │   ├── RightSidebar.jsx          # Right sidebar promotional banners & social links
│   │   ├── CartOffcanvas.jsx         # Slide-out shopping cart drawer
│   │   ├── LanguageSwitcher.jsx      # Language dropdown switcher
│   │   └── MaintenancePage.jsx       # Maintenance screen UI
│   ├── layouts/
│   │   └── layout.jsx                # RootLayout wrapper (Header + Main container + Footer)
│   ├── pages/                        # Next.js Pages router endpoints (thin wrappers around Views)
│   │   ├── _app.js                   # Application bootstrap: Redux, HeroUI, i18n, settings initialization
│   │   ├── _document.js              # HTML document template
│   │   ├── index.js                  # Homepage route
│   │   ├── cardapio/                 # Restaurant menu & category items ([slug].jsx)
│   │   ├── servicos/                 # Hospitality services & room booking ([slug].jsx)
│   │   ├── events/                   # Event catalog & ticket booking ([slug].jsx)
│   │   ├── blogs/                    # Blog articles & post details ([slug].jsx)
│   │   ├── orders/                   # Customer food/menu orders
│   │   ├── bookings/                 # Service & venue reservations
│   │   ├── payments/                 # Payment histories, gateways, proof uploads
│   │   ├── my-profile/               # User profile edit & password update
│   │   └── contact-us/               # Contact details and information
│   ├── store/                        # Redux slices
│   │   ├── store.js                  # Store configuration
│   │   ├── authSlice.js              # Authentication state, current user, token
│   │   ├── cartSlice.js              # Menu items cart, count, totals
│   │   ├── contentSectionsSlice.js   # Dynamic CMS sections caching
│   │   └── systemSettingsSlice.js    # Global settings & maintenance mode flag
│   ├── styles/                       # CSS files (globals.css, Home.module.css)
│   ├── utils/                        # Helpers and i18n instance
│   └── views/                        # Page View components containing core presentation logic
├── i18n.js                           # Language resource definitions
├── middleware.js                     # Edge middleware
├── next.config.js                    # Next.js configuration
└── package.json
```

---

## 3. Architecture & Code Patterns

### 3.1. Route-to-View Separation Pattern
Pages under `src/pages/` should remain **thin wrappers** that delegate presentation and layout to `src/views/`.
- **Example**: `src/pages/cardapio/[slug].jsx` only renders `<CardapioItemsView />`.
- **Rule**: When adding new pages or refactoring existing ones, keep route parameter retrieval and heavy UI logic inside the corresponding component in `src/views/`.

### 3.2. Authentication Pattern
- **Token Management**: JWT access token stored in `localStorage` under key `authToken`, and user object under `user`.
- **Interceptor** (`src/Api/interceptor.js`): Automatically injects `Authorization: Bearer <token>` on all requests.
- **Hydration**: `Header.jsx` and `_app.js` hydrate authentication state on mount inside `typeof window !== 'undefined'` checks.
- **Modals**: Triggered via HeroUI `useDisclosure` (`LoginModal`, `LogoutModal`).

### 3.3. Shopping Cart Pattern
- Stored in Redux (`cartSlice.js`) and synchronized with the backend cart API (`/cart`).
- Items can be added via `add_to_cart(menu_item_id, quantity)`.
- Global offcanvas drawer (`CartOffcanvas.jsx`) provides checkout initiation, item removal, and subtotal calculation.

### 3.4. Layout Grid Pattern
Pages like `Homepage.jsx`, `CardapioView.jsx`, `CardapioItemsView.jsx`, and `ServicesView.jsx` share a unified responsive 3-column layout:
- **Left Column** (`lg:col-span-2`): `<LeftSidebar />` (Desktop side navigation, hidden/reordered on mobile).
- **Center Content** (`lg:col-span-8`): Main view content (banners, grids, sliders, listings).
- **Right Column** (`lg:col-span-2`): `<RightSidebar />` (Promotions, ads, social channels).

---

## 4. API Reference Summary (`src/Api/api.js`)

| Category | Function | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `login({ type, username, email, password })` | `POST /auth/login` | Email/username login |
| | `register(data)` | `POST /auth/register` | New user registration |
| | `logout()` | `POST /auth/logout` | Revokes token & clears auth |
| | `update_profile(formData)` | `POST /auth/profile` | Updates user profile & avatar |
| **Menu / Food** | `get_restaurant_categories()` | `GET /categories/restaurant-categories` | Fetches food categories with children |
| | `get_menus()` | `GET /menus` | Lists all menus |
| | `get_menu_items(categoryId, menuId, page, perPage)` | `GET /menu-items` | Dishes filtered by category/menu with pagination |
| | `get_random_menu_items()` | `GET /menu-items/random-list` | Highlighted dishes for widgets |
| **Cart** | `get_cart()` | `GET /cart` | Fetches active cart & totals |
| | `add_to_cart(itemId, qty)` | `POST /cart` | Adds item to cart |
| | `delete_cart()` | `DELETE /cart` | Empties active cart |
| **Services / Rooms** | `fetch_all_services(params)` | `GET /services` | Services listing (optional `is_featured`) |
| | `fetch_service_details(slug)` | `GET /services/:slug` | Service details & package information |
| | `get_rooms()` | `GET /rooms` | Room availability & types |
| | `get_addons(search, type)` | `GET /addons` | Additional room/service options |
| | `create_service_booking(data)` | `POST /service-bookings` | Submits a service/room booking |
| **Events** | `get_events(category, search, page)` | `GET /events` | Event listings |
| | `get_event(slug)` | `GET /events/:slug` | Event detail, ticket types |
| | `book_event(slug, ticketId, qty)` | `POST /events/:slug/book`| Books tickets for an event |
| **Orders & Bookings**| `get_orders(page, perPage, status)` | `GET /orders` | User order history |
| | `get_booking(page, perPage, status)` | `GET /bookings` | User booking history |
| | `get_booking_details(bookingNumber)` | `GET /bookings/:id` | Detailed booking information |
| **Payments** | `get_payments()` | `GET /payments/list` | User payment transactions |
| | `initiate_payment(data)` | `POST /payments/initiate` | Initiates gateway / Multicaixa payment |
| | `check_payment_status(reference)` | `GET /payments/:ref/status`| Polls payment confirmation |
| | `upload_payment_proof(id, file)` | `POST /payments/:id/proof` | Uploads bank transfer receipt |
| **Social** | `get_comments(resource, slug)` | `GET /:resource/:slug/comments` | Comments for event or blog |
| | `create_comment(resource, slug, data)`| `POST /:resource/:slug/comments`| Submits new comment/reply |
| | `get_ratings(resource, slug)` | `GET /:resource/:slug/ratings` | Gets ratings breakdown |
| | `create_rating(resource, slug, data)` | `POST /:resource/:slug/ratings` | Submits rating |
| **System** | `get_system_settings()` | `GET /system-settings` | Maintenance flag & system config |
| | `get_content_sections()` | `GET /content-sections` | Homepage carousel & CMS sections |

---

## 5. Critical Development Guidelines & Gotchas

1. **Static Export Build Target (`next.config.js`)**:
   - `output: 'export'` is active. Next.js does not run node-based API routes or server-side functions like `getServerSideProps`.
   - Use client-side data fetching (`useEffect`, hooks) or SSG (`getStaticProps` / `getStaticPaths`) if pre-rendering static routes.
   - Dynamic parameters must be handled via `useRouter().query` inside `useEffect` (e.g., check `if (!slug) return;` before calling APIs).

2. **Hydration & Browser APIs**:
   - LocalStorage and DOM manipulations must be guarded with `typeof window !== 'undefined'`.
   - In components with dynamic or translated text, use `suppressHydrationWarning` on elements that can differ between SSR and client renders.

3. **Images**:
   - Images in `next.config.js` have `unoptimized: true`.
   - Always provide fallback image URLs (e.g., `item.image || "/cardapio/default.png"`) to prevent broken UI cards.

4. **Multi-language Support (i18n)**:
   - When introducing new text, add translations to `i18n.js` under `pt`, `en`, and `fr`.
   - Use `const { t } = useTranslation();` and avoid hardcoding strings directly in JSX.

5. **Modals and Overlays**:
   - Use HeroUI's `useDisclosure` pattern for modals:
     ```jsx
     const { isOpen, onOpen, onOpenChange } = useDisclosure();
     <MyModal isOpen={isOpen} onOpenChange={onOpenChange} />
     ```
