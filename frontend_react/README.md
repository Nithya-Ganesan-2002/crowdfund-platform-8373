# Crowdfund Frontend (React)

Modern, lightweight React UI to browse, create, and fund projects. Integrates with Express backend and Stripe.

## Features
- User registration and login
- Browse/filter projects
- Project detail and pledging flow
- Create new projects
- User dashboard
- Responsive layout, light/dark toggle
- Stripe PaymentIntent flow (publishable key optional for simplified demo)

## Quick Start
1) Install deps:
   npm install

2) Configure env (copy and edit):
   cp .env.example .env
   - REACT_APP_API_BASE_URL=<backend-url>
   - REACT_APP_STRIPE_PUBLISHABLE_KEY=<pk_test_xxx>

3) Run:
   npm start
   Open http://localhost:3000

## Notes
- Auth token is stored in localStorage.
- API endpoints follow the provided OpenAPI spec (auth, projects, pledges).
- For full 3DS flows, set Stripe publishable key and integrate Stripe.js as needed.
- Theme colors used:
  - primary: #1976d2
  - secondary: #424242
  - accent: #ff9800
