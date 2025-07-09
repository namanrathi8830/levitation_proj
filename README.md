# Levitation Invoice Generator Backend API

This is the backend for the Levitation Invoice Generator application. It is built with Express.js, MongoDB Atlas, JWT authentication, and provides RESTful APIs for user authentication, product management, and invoice generation.

## Quick Start

1. **Install Dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup:**
   Copy `.env.example` to `.env` and update the values:

   ```bash
   cp .env.example .env
   ```

3. **Start Development Server:**

   ```bash
   npm run dev
   ```

4. **Start Production Server:**

   ```bash
   npm start
   ```

## Project Structure

```
backend/
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/           # MongoDB models
├── routes/           # API routes
├── utils/            # Utility functions
├── server.js         # Main server file
├── package.json      # Dependencies
└── .env              # Environment variables
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products

- `GET /api/products` - Get all products for the authenticated user
- `POST /api/products` - Create a new product
- `GET /api/products/:id` - Get a single product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `DELETE /api/products/clear` - Delete all products for the authenticated user

### Invoices

- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create a new invoice
- `POST /api/invoices/generate` - Generate invoice from products
- `POST /api/invoices/generate-pdf` - Generate and download PDF invoice
- `GET /api/invoices/:id` - Get a single invoice
- `PUT /api/invoices/:id` - Update an invoice
- `DELETE /api/invoices/:id` - Delete an invoice

### Health Check

- `GET /api/health` - Server health status

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### Product Model

```javascript
{
  name: String,
  price: Number,
  quantity: Number,
  totalPrice: Number (calculated),
  user: ObjectId (ref: User),
  timestamps: true
}
```

### Invoice Model

```javascript
{
  invoiceNumber: String (auto-generated),
  user: ObjectId (ref: User),
  customerName: String,
  customerEmail: String,
  products: Array,
  subtotal: Number,
  gstRate: Number,
  gstAmount: Number,
  totalAmount: Number,
  status: String,
  timestamps: true
}
```

## Features

- Secure JWT authentication
- Password hashing with bcrypt
- Input validation using express-validator
- Centralized error handling middleware
- CORS enabled for cross-origin requests
- Security headers with Helmet.js
- Request logging with Morgan
- Automatic price and GST calculations

## Environment Variables

Example `.env` configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

## API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "count": 10
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Security headers with Helmet
- MongoDB injection protection
- Rate limiting ready

## Deployment

This backend is ready for deployment on platforms such as:

- Heroku
- Vercel
- AWS EC2
- DigitalOcean
- Any Node.js hosting platform

## API Testing

You can use tools like Postman, Insomnia, or cURL to test the API endpoints.

Example login request:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```
