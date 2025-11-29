# Supabase Integration Guide

This React app has been converted to use Supabase as the Backend-as-a-Service (BaaS) and database.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `pure-elements` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Wait for the project to be created (takes ~2 minutes)

### 2. Run Database Migrations

1. In your Supabase project dashboard, go to **SQL Editor**
2. Open the file `supabase/migrations/001_initial_schema.sql`
3. Copy the entire SQL content
4. Paste it into the SQL Editor in Supabase
5. Click "Run" to execute the migration

This will create all necessary tables:
- `user_profiles` - Extended user information
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items
- `cart_items` - Shopping cart items
- `wishlist_items` - User wishlists
- `nav_items` - Navigation menu items
- `hero_slides` - Homepage hero carousel slides

### 3. Configure Environment Variables

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

3. Create a `.env` file in the root of your project:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Never commit your `.env` file to version control. The `.env.example` file is already in `.gitignore`.

### 4. Seed Initial Data (Optional)

You can seed your database with initial products, categories, nav items, and hero slides from the `constants.ts` file. You can do this manually through the Supabase dashboard or create a seed script.

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Application

```bash
npm run dev
```

## Features Migrated to Supabase

### Authentication
- ✅ User signup and login via Supabase Auth
- ✅ User profiles stored in `user_profiles` table
- ✅ Session management handled by Supabase

### Products
- ✅ Product CRUD operations
- ✅ Product search and filtering
- ✅ Category-based filtering
- ✅ Dynamic bestseller calculation based on order history

### Orders
- ✅ Order creation during checkout
- ✅ Order history for users
- ✅ Order status management (admin)
- ✅ Order items tracking

### Shopping Cart
- ✅ Persistent cart per user
- ✅ Cart synced across devices
- ✅ Cart cleared after order placement

### Wishlist
- ✅ User wishlist management
- ✅ Persistent wishlist per user

### Admin Panel
- ✅ Product management
- ✅ Order management
- ✅ Navigation menu management
- ✅ Hero slides management

## Database Schema

### Key Tables

- **products**: Main product catalog with all product details
- **orders**: Customer orders with shipping and payment info
- **order_items**: Individual items in each order
- **cart_items**: Shopping cart items (user-specific)
- **wishlist_items**: Wishlist items (user-specific)
- **nav_items**: Navigation menu configuration
- **hero_slides**: Homepage hero carousel slides
- **categories**: Product categories
- **user_profiles**: Extended user information

### Row Level Security (RLS)

All tables have Row Level Security enabled:
- Users can only see/modify their own data (orders, cart, wishlist)
- Products, categories, nav items, and hero slides are publicly readable
- Only authenticated users can create/modify products and admin content

## Storage (Future Enhancement)

For product images, you can use Supabase Storage:
1. Create a bucket named `product-images` in Supabase Storage
2. Update product image URLs to use Supabase Storage URLs
3. Configure bucket policies for public read access

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure you've created a `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after adding environment variables

### Authentication not working
- Check that the `user_profiles` table was created
- Verify the trigger `on_auth_user_created` is set up correctly
- Check browser console for detailed error messages

### Data not loading
- Verify your Supabase project is active
- Check that migrations were run successfully
- Look for errors in the browser console and Supabase logs

### RLS Policy Errors
- Make sure you're logged in for user-specific data
- Check that RLS policies are correctly configured in the migration

## Next Steps

1. **Set up email authentication** in Supabase Dashboard → Authentication → Providers
2. **Configure storage** for product images
3. **Set up admin role** - You may want to add an `is_admin` field to `user_profiles` and update RLS policies
4. **Add payment integration** - Integrate with payment gateways (Razorpay, Stripe, etc.)
5. **Set up email notifications** - Use Supabase Edge Functions for order confirmations

## Support

For Supabase-specific issues, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

