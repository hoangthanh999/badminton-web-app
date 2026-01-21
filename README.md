# Badminton Court Management - ReactJS Web App

## Overview
Modern ReactJS frontend for Badminton Court Management system with full USER and ADMIN features.

## Features

### USER Features
- 🏸 Court browsing and booking
- 📋 Booking management
- 🛒 Shop with cart and checkout
- 👤 Profile management
- 🔒 JWT authentication

### ADMIN Features
- 📊 Dashboard with statistics
- ⚙️ Court management (CRUD)
- 📋 Booking management
- 👥 User view

## Tech Stack
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router v6** for routing
- **Axios** for API calls
- **JWT** authentication
- Modern CSS with variables

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation
```bash
cd "d:\LTDD2\New folder\badminton-web-app"
npm install
```

### Development
```bash
npm run dev
```
Open http://localhost:5173

### Build
```bash
npm run build
```
```bash
npm run preview
```

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── UI/             # Button, Input, Card, Modal, etc.
│   ├── ProtectedRoute.tsx
│   └── AdminRoute.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── pages/              # Page components
│   ├── Auth/          # Login, Register, ForgotPassword
│   ├── Home/          # HomePage
│   ├── Courts/        # CourtList, CourtDetail
│   ├── Bookings/      # CreateBooking, MyBookings, BookingDetail
│   ├── Shop/          # ShopHome, ProductDetail, Cart, Checkout
│   ├── Profile/       # Profile
│   └── Admin/         # Admin pages
├── services/          # API services
│   ├── apiClient.ts
│   ├── authService.ts
│   ├── bookingService.ts
│   ├── courtService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   └── userService.ts
├── types/             # TypeScript types
├── styles/            # Global styles
└── config/            # Configuration

## API Configuration
Backend API: `https://demobackendb.onrender.com/api`

Configure in `.env`:
```
VITE_API_BASE_URL=https://demobackendb.onrender.com/api
```

## Features Highlight

### Authentication
- Email/Phone + Password login
- Registration with validation
- Forgot password flow
- JWT token management
- Role-based access (USER/ADMIN)

### Court Management
- Browse available courts
- View court details
- Book courts with date/time selection
- View booking history
- Cancel bookings

### Shop
- Browse products
- Add to cart
- Checkout with shipping info
- View order history

### Admin
- Dashboard with statistics
- Manage all bookings (approve/reject)
- Manage courts (create/edit/delete)
- View all users

## Design
- Sports-themed color palette (green, blue)
- Responsive design (desktop/tablet/mobile)
- Modern UI with animations
- Distinct USER vs ADMIN themes

## License
© 2026 Badminton Court Management
