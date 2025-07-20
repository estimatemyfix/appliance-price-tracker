# Appliance Price Tracker

A full-stack web application that tracks appliance prices across major retailers (Amazon, Home Depot, Lowe's, Best Buy, etc.) and provides AI-powered buying recommendations.

## 🚀 Features

- **Price Tracking**: Monitor appliance prices across 6+ major retailers
- **Smart Alerts**: Get email notifications when prices drop or products come back in stock
- **AI Recommendations**: Get "Buy Now or Wait?" suggestions based on price history and seasonal trends
- **User Dashboard**: Track your favorite products and manage price alerts
- **Price History Charts**: Visualize price trends over 30/90 days
- **Mobile-First Design**: Responsive UI built with Tailwind CSS
- **SEO Optimized**: Blog system with structured data markup
- **Admin Panel**: Manage retailers and scraping intervals

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **React Query** - Data fetching and caching
- **Chart.js** - Price history visualizations
- **Zustand** - State management
- **React Hook Form** - Form handling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **Puppeteer** - Web scraping
- **SendGrid** - Email notifications
- **OpenAI API** - AI recommendations

### Infrastructure
- **Docker** - Containerization (optional)
- **Node Cron** - Scheduled scraping jobs
- **Winston** - Logging
- **Helmet** - Security middleware

## 📁 Project Structure

```
appliance-price-tracker/
├── client/                     # Next.js frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/             # Next.js pages
│   │   ├── styles/            # CSS styles
│   │   ├── utils/             # Utility functions
│   │   ├── hooks/             # Custom React hooks
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
├── server/                     # Express.js backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Express middleware
│   │   ├── services/          # Business logic
│   │   ├── config/            # Configuration
│   │   └── types/             # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── database/                  # Database files
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Sample data
├── package.json              # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 13+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/appliance-price-tracker.git
cd appliance-price-tracker
```

### 2. Install Dependencies

```bash
# Install all dependencies for both frontend and backend
npm run install:all
```

### 3. Database Setup

Create a PostgreSQL database and run the schema:

```bash
# Create database
createdb appliance_tracker

# Run schema
psql appliance_tracker < database/schema.sql

# Seed with sample data (optional)
psql appliance_tracker < database/seed.sql
```

### 4. Environment Configuration

#### Backend Environment (server/src/config/env.example → server/.env)

```bash
# Copy and modify the environment file
cp server/src/config/env.example server/.env
```

Update the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/appliance_tracker
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appliance_tracker
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@appliancetracker.com

# OpenAI (for AI recommendations)
OPENAI_API_KEY=your-openai-api-key

# Affiliate Links
AMAZON_ASSOCIATE_TAG=your-amazon-associate-tag
```

#### Frontend Environment (client/.env.local)

```bash
# Create client environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > client/.env.local
```

### 5. Start Development Servers

```bash
# Start both frontend and backend simultaneously
npm run dev

# Or start individually:
npm run dev:server  # Backend on http://localhost:5000
npm run dev:client  # Frontend on http://localhost:3000
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 📚 API Documentation

### Authentication

```bash
# Register new user
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}

# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Product Search

```bash
# Search products
GET /api/products/search?query=samsung+refrigerator&page=1&limit=20&sort=price_low

# Get product details
GET /api/products/:id

# Get price history
GET /api/products/:id/price-history?days=90&retailer=amazon.com
```

### Price Tracking

```bash
# Track a product (requires authentication)
POST /api/products/track
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "product_id": 1,
  "target_price": 1500.00,
  "alert_type": "price_drop"
}

# Get user alerts
GET /api/user/alerts
Authorization: Bearer <jwt_token>
```

### Categories

```bash
# Get all categories
GET /api/products/categories
```

## 🤖 Web Scraping

The application includes a robust web scraping system:

### Amazon Scraper Example

```typescript
import { AmazonScraper } from '@/services/scrapers/amazonScraper';

const scraper = new AmazonScraper();
await scraper.init();

const result = await scraper.scrapeProduct(
  'https://www.amazon.com/dp/B07V2HBXQK',
  productListingId
);

console.log(result); // { success: true, price: 1699.99, original_price: 2299.99, ... }
```

### Key Features:
- **Anti-Bot Protection**: Rotating user agents, request delays
- **Error Handling**: CAPTCHA detection, retry logic
- **Rate Limiting**: Configurable delays between requests
- **Resource Optimization**: Block images/CSS to speed up scraping

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:client       # Start frontend only
npm run dev:server       # Start backend only

# Building
npm run build           # Build both projects
npm run build:client    # Build frontend only
npm run build:server    # Build backend only

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with sample data

# Production
npm start               # Start production server
```

## 📱 Key Components

### Frontend Components

- **Layout**: Main application layout with navigation
- **SearchBar**: Product search with autocomplete
- **ProductCard**: Individual product display
- **PriceChart**: Price history visualization
- **PriceAlert**: Price tracking form
- **HeroSection**: Landing page hero
- **CallToAction**: Newsletter signup

### Backend Services

- **ProductController**: Handle product-related API requests
- **AuthController**: User authentication and authorization
- **ScraperService**: Coordinate web scraping across retailers
- **EmailService**: Send price alerts and notifications
- **AIService**: Generate buying recommendations

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS:

### Colors
- **Primary**: Blue tones (#0ea5e9)
- **Secondary**: Green tones (#22c55e)
- **Accent**: Yellow tones (#eab308)
- **Neutral**: Gray scale (#737373)

### Components
- Consistent button styles (.btn, .btn-primary, etc.)
- Form inputs (.input, .input-error)
- Cards (.card, .card-hover)
- Badges (.badge, .badge-success)

## 💰 Monetization Features

### Affiliate Links
- Automatic affiliate link generation for each retailer
- Configurable affiliate IDs in environment variables
- Link tracking and analytics ready

### Premium Features (Placeholder)
- Early price alerts
- Advanced tracking options
- Priority customer support
- API access

### Advertising
- Banner ad spaces in search results
- Sponsored product placements
- Newsletter sponsorships

## 🔍 SEO Features

### Blog System
- Dynamic blog pages for SEO content
- Automated sitemap generation
- Social media meta tags

### Structured Data
```javascript
// Product schema example
{
  "@type": "Product",
  "name": "Samsung Refrigerator",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "1699.99",
    "highPrice": "2299.99",
    "priceCurrency": "USD"
  }
}
```

## 📊 Performance & Monitoring

### Frontend
- Next.js optimization (SSG, ISR)
- Image optimization with next/image
- Code splitting and lazy loading
- Web vitals monitoring

### Backend
- Database query optimization
- Response caching with Redis (optional)
- Request logging with Winston
- Health check endpoints

## 🚀 Deployment

### Production Environment

1. **Build the applications**:
```bash
npm run build
```

2. **Set environment variables**:
- Update all production environment variables
- Use secure JWT secrets
- Configure production database

3. **Deploy**:
- Frontend: Deploy to Vercel, Netlify, or similar
- Backend: Deploy to Railway, Render, or similar
- Database: Use managed PostgreSQL (AWS RDS, etc.)

### Docker Support (Optional)

```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/dist ./dist
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@appliancetracker.com or create an issue on GitHub.

## 🙏 Acknowledgments

- Next.js team for the amazing React framework
- Tailwind CSS for the utility-first CSS framework
- PostgreSQL for reliable data storage
- SendGrid for email delivery
- OpenAI for AI recommendations
- All the retailers for providing product data

---

**Happy Price Tracking! 💰** 