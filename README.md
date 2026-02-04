# E-Commerce Website

A full-stack e-commerce website built with Next.js, MongoDB, and Stripe payment integration.

## Features

- **User Authentication**: Register, login, and logout functionality with JWT
- **Product Management**: Browse products by categories, view product details
- **Shopping Cart**: Add/remove items, update quantities
- **Payment Integration**: Secure payments with Stripe
- **Order Management**: View order history and details
- **Dark/Light Theme**: Toggle between themes with persistent storage
- **Responsive Design**: Mobile-friendly interface
- **Admin Panel**: Basic product and category management (for admin users)

## Tech Stack

- **Frontend**: Next.js 14 with React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- Stripe account for payment processing

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ecommerce-site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
   NEXT_PUBLIC_DOMAIN=http://localhost:3000
   ```

4. Start MongoDB (if running locally)

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ecommerce-site/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (shop)/         # Shopping pages
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   ├── lib/                # Utility functions
│   └── models/             # Database models
├── public/                 # Static assets
└── README.md
```

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with optional category filter)
- `GET /api/products/[id]` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/[id]` - Get category by ID
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/[id]` - Update category (admin only)
- `DELETE /api/categories/[id]` - Delete category (admin only)

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/[id]` - Get order by ID
- `POST /api/orders` - Create order

### Payment
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhook` - Stripe webhook handler

## Database Models

### User
- name: String
- email: String (unique)
- password: String (hashed)
- isAdmin: Boolean (default: false)

### Product
- name: String
- description: String
- price: Number
- image: String
- category: String
- stock: Number

### Category
- name: String
- description: String

### Order
- user: ObjectId (ref: User)
- products: [{
  product: ObjectId (ref: Product),
  quantity: Number,
  price: Number
}]
- totalAmount: Number
- status: String (pending, paid, shipped, delivered)
- stripeSessionId: String

## Deployment

1. Set up a MongoDB database (MongoDB Atlas for production)
2. Configure Stripe webhook endpoint
3. Update environment variables for production
4. Deploy to Vercel, Netlify, or your preferred platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
