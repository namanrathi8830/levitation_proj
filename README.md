# Levitation InfoTech - Invoice Generator

A full-stack web application for secure invoice generation, product management, and user authentication. Built with Next.js (React, TypeScript), Express.js, and MongoDB.

## Technology Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- CSS Modules, Tailwind CSS, Shadcn UI
- Redux for state management
- Tanstack Query for data fetching
- Form validation

### Backend
- Express.js (Node.js)
- MongoDB Atlas
- JWT authentication (email/password)
- EncoreJS
- Puppeteer for PDF generation
- RESTful APIs
- Security: Helmet, CORS

## Project Structure

```
levitation/
├── frontend/                # Next.js frontend
│   ├── app/                 # Pages (login, signup, products)
│   ├── components/          # UI components
│   ├── public/              # Static assets
│   └── ...
├── backend/                 # Express.js backend
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   └── server.js            # Main server file
└── README.md                # Project documentation
```

## Features

### Authentication & Security
- JWT-based authentication
- Password hashing (bcrypt)
- Protected routes (frontend & backend)
- Input validation (client & server)
- CORS and security headers

### Product Management
- Add, view, and remove products
- Real-time calculation of totals and GST
- User-specific product isolation
- Form validation and error handling

### Invoice Generation
- Professional PDF invoice design (Puppeteer)
- Dynamic content from user products
- GST (18%) calculation and breakdown
- Invoices stored in MongoDB

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas or local MongoDB
- npm

### 1. Clone & Install

```bash
git clone <repository-url>
cd levitation

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Setup

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

**Backend (backend/.env):**
```
PORT=5001
NODE_ENV=development
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api
- Health Check: http://localhost:5001/api/health

## API Endpoints

### Authentication
- POST /api/auth/register  (Register new user)
- POST /api/auth/login     (Login user)
- GET  /api/auth/me        (Get current user)

### Products
- GET    /api/products     (Get all products)
- POST   /api/products     (Create product)
- GET    /api/products/:id (Get single product)
- PUT    /api/products/:id (Update product)
- DELETE /api/products/:id (Delete product)
- DELETE /api/products/clear (Delete all products for user)

### Invoices
- GET  /api/invoices           (Get all invoices)
- POST /api/invoices           (Create invoice)
- POST /api/invoices/generate  (Generate from products)
- GET  /api/invoices/:id       (Get single invoice)
- PUT  /api/invoices/:id       (Update invoice)
- DELETE /api/invoices/:id     (Delete invoice)

## Authentication Flow
1. Register with name, email, and password
2. Login to receive JWT token
3. Use token for all protected API calls
4. Auto-logout on invalid/expired tokens

## Database Schema (Simplified)

### User
```
{
  name: String,
  email: String (unique),
  password: String (hashed),
}
```

### Product
```
{
  name: String,
  price: Number,
  quantity: Number,
  totalPrice: Number,
  user: ObjectId (ref: User),
}
```

### Invoice
```
{
  invoiceNumber: String,
  user: ObjectId (ref: User),
  customerName: String,
  customerEmail: String,
  products: Array,
  subtotal: Number,
  gstRate: Number,
  gstAmount: Number,
  totalAmount: Number,
  status: String,
}
```

## Security & Best Practices
- Passwords are hashed and never stored in plain text
- All sensitive routes are protected by JWT
- Input validation and sanitization on all endpoints
- CORS and security headers enabled

## License
This project is for assignment and demonstration purposes only.
