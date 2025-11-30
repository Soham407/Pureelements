# Pure Elements - Ayurveda E-Commerce Platform

<div align="center">
  <h3>PROMISE OF AYURVEDA</h3>
  <p>An elegant e-commerce platform for authentic Ayurvedic products</p>
</div>

## 🌿 About

Pure Elements is a modern, full-featured e-commerce platform specializing in Ayurvedic skincare, haircare, body care, wellness, and luxury products. Built with React and TypeScript, it provides a seamless shopping experience with a comprehensive admin panel for product and content management.

## ✨ Features

### Customer Features
- **Product Browsing**: Browse products by category (Skin Care, Hair Care, Body Care, Men's Care, Kids Care, Wellness, Perfumes, Gifting)
- **Product Search**: Advanced search functionality across product names, descriptions, and categories
- **Product Details**: Detailed product pages with images, descriptions, ingredients, and usage instructions
- **Shopping Cart**: Persistent cart with real-time updates
- **Wishlist**: Save favorite products for later
- **User Authentication**: Secure signup and login with Supabase Auth
- **Order Management**: Track order history and status
- **Checkout**: Complete checkout flow with shipping address and payment options
- **Responsive Design**: Mobile-first design that works on all devices
- **Store Locator**: Find physical store locations

### Admin Features
- **Product Management**: Create, edit, and delete products with category and subcategory organization
- **Order Management**: View and update order statuses
- **Content Management**: 
  - Manage navigation menu items
  - Update hero banner slides
  - Manage product categories
- **Dashboard**: Overview of products, orders, and sales

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL database, Authentication, Row Level Security)
- **State Management**: React Context API
- **Routing**: Client-side routing with React state

## 📦 Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin panel components
│   ├── ProductCard.tsx
│   ├── ProductDetails.tsx
│   ├── ProductListing.tsx
│   └── ...
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── ToastContext.tsx
├── lib/                # Utility libraries
│   ├── database.ts     # Supabase database service
│   └── supabase.ts     # Supabase client configuration
├── types/              # TypeScript type definitions
├── constants/          # App constants and static data
└── App.tsx             # Main application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for database and authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Pureelements
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**
   
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/`:
     - `001_initial_schema.sql` - Creates all tables and RLS policies
     - `002_update_products_rls.sql` - Updates RLS policies for product management
   - Or use the Supabase CLI:
     ```bash
     supabase db push
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Admin Panel: Navigate to Admin section (default PIN: 1234)

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

- **products**: Product catalog with categories, pricing, images, and descriptions
- **orders**: Customer orders with shipping and payment information
- **order_items**: Individual items in each order
- **cart_items**: Shopping cart items (user-specific)
- **wishlist_items**: Wishlist items (user-specific)
- **user_profiles**: Extended user information
- **nav_items**: Navigation menu configuration
- **hero_slides**: Homepage hero carousel slides
- **categories**: Product categories

## 🔐 Authentication & Security

- **User Authentication**: Supabase Auth with email/password
- **Row Level Security (RLS)**: Enabled on all tables
- **Admin Access**: PIN-based admin panel (configurable)
- **Data Protection**: Secure API calls with Supabase client

## 📱 Admin Panel

Access the admin panel by navigating to the Admin section. Default PIN: `1234`

### Admin Features:
- **Products**: Manage product catalog (add, edit, delete)
- **Orders**: View and update order statuses
- **Content**: Manage navigation items and hero banners
- **Categories**: Organize product categories

## 🎨 Key Components

- **ProductListing**: Category-based product browsing with filters
- **ProductDetails**: Detailed product view with image zoom
- **CartDrawer**: Slide-out shopping cart
- **CheckoutPage**: Complete checkout flow
- **AdminLayout**: Admin dashboard with navigation
- **CategoryCircle**: Category display with hover effects

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Configuration

### Admin PIN
Default admin PIN is `1234`. To change it, edit `src/components/admin/AdminLogin.tsx`

### Categories
Categories are managed in `src/constants/index.ts` and can be updated through the admin panel.

### Product Categories
Main categories include:
- SKIN CARE
- HAIR-CARE
- BODY-CARE
- MENS CARE
- KIDS-CARE
- WELLNESS
- PERFUMES
- GIFTING

## 🐛 Troubleshooting

### Products not showing
- Ensure products have `mainCategory` set correctly
- Check that RLS policies are configured properly
- Verify database connection in browser console

### Authentication issues
- Verify Supabase credentials in `.env`
- Check that `user_profiles` table exists
- Ensure RLS policies allow user profile access

### Admin panel access
- Default PIN is `1234`
- Check browser console for errors
- Verify Supabase RLS policies allow product updates

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For issues or questions, please contact the development team.

## 📞 Support

For support, please refer to the documentation or contact the development team.

---

**Built with ❤️ for Pure Elements**
