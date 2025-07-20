export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  email_verified: boolean;
  verification_token?: string;
  reset_token?: string;
  reset_token_expires?: Date;
  is_premium: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Retailer {
  id: number;
  name: string;
  domain: string;
  logo_url?: string;
  affiliate_base_url?: string;
  scraping_enabled: boolean;
  last_scraped?: Date;
  created_at: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  created_at: Date;
}

export interface Product {
  id: number;
  name: string;
  model_number?: string;
  brand?: string;
  category_id?: number;
  image_url?: string;
  description?: string;
  specifications?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface ProductListing {
  id: number;
  product_id: number;
  retailer_id: number;
  retailer_product_id?: string;
  retailer_url: string;
  is_active: boolean;
  last_scraped?: Date;
  created_at: Date;
}

export interface PriceHistory {
  id: number;
  product_listing_id: number;
  price: number;
  original_price?: number;
  currency: string;
  is_available: boolean;
  scraped_at: Date;
}

export interface PriceAlert {
  id: number;
  user_id: number;
  product_id: number;
  target_price?: number;
  alert_type: 'price_drop' | 'back_in_stock' | 'any_change';
  is_active: boolean;
  email_sent: boolean;
  last_alert_sent?: Date;
  created_at: Date;
}

export interface PriceRecommendation {
  id: number;
  product_id: number;
  current_price: number;
  average_price_30d?: number;
  average_price_90d?: number;
  lowest_price_ever?: number;
  recommendation: 'buy_now' | 'wait' | 'good_deal';
  confidence_score?: number;
  reasoning?: string;
  seasonal_factor?: string;
  created_at: Date;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id?: number;
  status: 'draft' | 'published' | 'archived';
  seo_title?: string;
  seo_description?: string;
  tags?: string[];
  view_count: number;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchProductsResponse {
  products: (Product & {
    category?: Category;
    listings: (ProductListing & {
      retailer: Retailer;
      current_price?: PriceHistory;
    })[];
    recommendation?: PriceRecommendation;
  })[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductDetailResponse {
  product: Product & {
    category?: Category;
    listings: (ProductListing & {
      retailer: Retailer;
      price_history: PriceHistory[];
    })[];
    recommendation?: PriceRecommendation;
  };
}

// Request Types
export interface CreateUserRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreatePriceAlertRequest {
  product_id: number;
  target_price?: number;
  alert_type: 'price_drop' | 'back_in_stock' | 'any_change';
}

export interface SearchProductsRequest {
  query?: string;
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
  sort?: 'name' | 'price_low' | 'price_high' | 'newest';
}

// JWT Payload
export interface JwtPayload {
  userId: number;
  email: string;
  is_premium: boolean;
}

// Scraper Types
export interface ScrapingResult {
  success: boolean;
  price?: number;
  original_price?: number;
  is_available: boolean;
  error?: string;
  product_listing_id: number;
}

// Express Request Extensions
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
} 