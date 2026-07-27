# Savora — Food Ordering App

Savora is a full-stack food ordering and delivery web application. Customers can browse a menu of local and continental meals, search and filter by category, add items to a cart, check out with cash or card (via Paystack), and track their order status in real time. Admins have a separate dashboard to manage the menu (including photo uploads), view all customer orders, and update order and payment status. The backend is a REST API built with Node.js, Express, and MongoDB; the frontend is a React single-page application styled with Tailwind CSS.

---

## Live Links

| | Link |
|---|---|
| **Frontend (live app)** | https://savora-eatery.vercel.app |
| **Backend (API base URL)** | https://savora-backend-agz7.onrender.com|
| **API Documentation** | https://documenter.getpostman.com/view/56117825/2sBY4SKyL9 |

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 20–30 seconds to respond while the server wakes up.

---

## Tech Stack

**Backend**
- Node.js, Express
- MongoDB with Mongoose (hosted on MongoDB Atlas)
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- express-validator for input validation
- express-rate-limit for rate limiting sensitive routes
- Paystack (Node `https` module) for online payment processing
- Helmet, CORS, Morgan

**Frontend**
- React (Vite)
- React Router for client-side routing
- Tailwind CSS v4 for styling, with a custom brand color/theme system
- React Hook Form for form handling and validation
- Axios for API requests, with an interceptor that auto-attaches the JWT
- React Context API for global state (authentication, cart)
- Cloudinary for image uploads (menu photos, profile photos)

**Deployment**
- Backend: Render
- Frontend: Vercel
- Database: MongoDB Atlas

---

## Project Structure

This is a monorepo containing two independent projects:

```
eatery-app/
├── backend/     — Express REST API
└── frontend/    — React (Vite) client
```

---

## Setup Instructions (Run Locally)

### 1. Clone the repository

```bash
git clone https://github.com/Gemezuprince/eatery-app.git
cd eatery-app
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [Environment Variables](#environment-variables) below), then start the server:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (see below), then start the dev server:

```bash
npm run dev
```

The app runs on `http://localhost:5173` by default. Both the backend and frontend must be running at the same time for the app to work.

---

## Environment Variables

**`backend/.env`**

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used to sign authentication tokens |
| `JWT_EXPIRES_IN` | How long a login token stays valid (e.g. `7d`) |
| `PAYSTACK_SECRET_KEY` | Paystack secret key for payment processing |
| `FRONTEND_URL` | The deployed frontend's URL (used for the Paystack payment redirect) |
| `PORT` | *(optional — most hosts set this automatically)* |

**`frontend/.env`**

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:5000/api` locally, or the deployed backend URL in production) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary account identifier for image uploads |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset name |

> Real secret values are never committed to this repository — see `.gitignore`. Use the variable names above to create your own `.env` files.

---

## API Endpoints Summary

Full documentation (every endpoint's method, URL, auth requirement, request body, and example success/error responses) is available in the [API Documentation](#live-links) link above. Summary:

| Module | Endpoints |
|---|---|
| **Auth** | Register, Login |
| **Users** | Get/update own profile, change password |
| **Menu** | Browse, search, filter, view single item, grouped-by-category view (public); create, update, delete, admin listing (admin only) |
| **Cart** | View, add item, update quantity, remove item, clear cart (private) |
| **Orders** | Checkout, view own orders, verify card payment, cancel order (private/admin); view all orders, update status, update payment status (admin only) |
| **Admin Dashboard** | Key metrics — total orders, revenue, orders by status, total users, total menu items (admin only) |

---

## Screenshots

```markdown
### Home
![Home page](./docs/screenshots/home.jpg)

### Menu
![Menu page](./docs/screenshots/menu.jpg)

### Cart
![Cart page](./docs/screenshots/cart.jpg)

### Checkout
![Checkout page](./docs/screenshots/checkout.jpg)

### My-orders
![My-orders page](./docs/screenshots/my-orders.jpg)

### Admin Dashboard
![Admin Dashboard](./docs/screenshots/admin-dashboard.png)

### Admin Manage Menu
![Admin Manage Menu page](./docs/screenshots/admin-menu.jpg)

### Admin Manage Orders
![Admin Manage Orders page](./docs/screenshots/admin-orders.jpg)
```

---

## Known Limitations

- The Contact page's message form is simulated on the frontend — there is no backend endpoint to store or send submitted messages yet.
- The Home page's hero banner image is a static stock photo, not uploaded through Cloudinary (Cloudinary is used for dynamic content — menu item photos and user profile photos — not fixed site imagery).
- Payment confirmation for card payments relies on a manual verification step triggered when the customer is redirected back to the app after paying, rather than an automatic server-to-server webhook. This was a deliberate scope decision made to keep local development simple; in a production system, a webhook would be the more robust approach.
- There is no automated test suite (unit/integration tests); all testing was performed manually and systematically for every endpoint and page, covering both success and error cases.
- Currency is fixed to Nigerian Naira (₦); the app does not support multi-currency conversion.

---

## Author

**Name:** ONYEJINDU PRINCE HENRY
**Cohort:** COHORT 7
**Submission Date:** Monday, 27th July, 2026.
