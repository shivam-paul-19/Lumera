# Lumera - Melt Into Luxury

A premium candle brand e-commerce website built with Next.js 14, Payload CMS, and Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **CMS**: Payload CMS 3.0
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Payment**: PhonePe Payment Gateway (UPI, Cards, Net Banking)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- MongoDB (local or Atlas)
- PhonePe Merchant Account (for payments)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd Lumera
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your credentials:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/lumera

   # Payload CMS
   PAYLOAD_SECRET=your-super-secret-key-min-32-chars
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000

   # PhonePe Payment Gateway
   PHONEPE_MERCHANT_ID=your-merchant-id
   PHONEPE_SALT_KEY=your-salt-key
   PHONEPE_SALT_INDEX=1
   PHONEPE_ENV=UAT  # Use 'PRODUCTION' for live payments
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

### First-time Setup

1. Navigate to http://localhost:3000/admin
2. Create your first admin user
3. Start adding products and collections

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (payload)/          # Payload CMS admin routes
│   ├── api/                # API routes
│   │   ├── payment/        # PhonePe payment endpoints
│   │   └── newsletter/     # Newsletter subscription
│   ├── policies/           # Policy pages
│   └── page.tsx            # Homepage
├── components/
│   ├── layout/             # Header, Footer
│   ├── sections/           # Homepage sections
│   └── ui/                 # Reusable UI components
├── lib/                    # Utility functions
│   └── phonepe.ts          # PhonePe integration
└── payload/
    └── collections/        # Payload CMS schemas
        ├── Products.ts
        ├── Collections.ts
        ├── Orders.ts
        └── ...
```

## Features

### For Customers
- Elegant, luxury-focused design
- Animated hero section with slideshow
- Product browsing by collections (Serene, Essence, Signature)
- Product cards with quick view and wishlist
- Detailed FAQ section
- Newsletter subscription
- Mobile-responsive design

### For Store Owner (via Payload CMS)
- Full product management with fragrance notes, specifications
- Collection management
- Order tracking and management
- Customer management
- Newsletter subscriber list
- Media library for images

### Payment Integration
- PhonePe UPI payments
- Google Pay, Paytm support via UPI Intent
- Credit/Debit cards
- Net Banking
- Webhook handling for payment confirmation

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Burgundy | `#800020` | Primary brand color |
| Champagne Gold | `#D4C088` | Accent color |
| Off-White/Cream | `#F9F6EE` | Background |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Self-hosted

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Adding Images

Place your images in the `public/images/` directory:

```
public/images/
├── hero/
│   ├── hero-1.jpg
│   ├── hero-2.jpg
│   └── hero-3.jpg
├── products/
│   └── [product-images].jpg
├── collections/
│   └── [collection-images].jpg
├── rituals/
│   └── [ritual-images].jpg
└── about/
    └── [about-images].jpg
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run generate:types` | Generate Payload types |

## Support

For questions or support, contact:
- Email: lumeracandlesinfo@gmail.com
- Phone: +91 9625205260, +91 8178947955

---

© 2025 Lumera. Melt Into Luxury.
