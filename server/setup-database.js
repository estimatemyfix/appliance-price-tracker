const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Schema SQL
const schemaSQL = `
-- Appliance Price Tracker Database Schema

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Retailers table
CREATE TABLE IF NOT EXISTS retailers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    affiliate_base_url VARCHAR(500),
    scraping_enabled BOOLEAN DEFAULT TRUE,
    last_scraped TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appliance categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    parent_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    model_number VARCHAR(200),
    brand VARCHAR(100),
    category_id INTEGER REFERENCES categories(id),
    image_url VARCHAR(500),
    description TEXT,
    specifications JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product listings across retailers
CREATE TABLE IF NOT EXISTS product_listings (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    retailer_id INTEGER REFERENCES retailers(id),
    retailer_product_id VARCHAR(200),
    retailer_url VARCHAR(1000) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_scraped TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, retailer_id)
);

-- Price history table
CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    product_listing_id INTEGER REFERENCES product_listings(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    is_available BOOLEAN DEFAULT TRUE,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User price tracking
CREATE TABLE IF NOT EXISTS price_alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    target_price DECIMAL(10,2),
    alert_type VARCHAR(50) DEFAULT 'price_drop',
    is_active BOOLEAN DEFAULT TRUE,
    email_sent BOOLEAN DEFAULT FALSE,
    last_alert_sent TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email queue for alerts
CREATE TABLE IF NOT EXISTS email_queue (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    template_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    html_content TEXT NOT NULL,
    variables JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    last_attempt TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Price recommendations (AI-powered)
CREATE TABLE IF NOT EXISTS price_recommendations (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    current_price DECIMAL(10,2) NOT NULL,
    average_price_30d DECIMAL(10,2),
    average_price_90d DECIMAL(10,2),
    lowest_price_ever DECIMAL(10,2),
    recommendation VARCHAR(20) NOT NULL,
    confidence_score DECIMAL(3,2),
    reasoning TEXT,
    seasonal_factor VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin activity logs
CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts for SEO
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    author_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'draft',
    seo_title VARCHAR(500),
    seo_description VARCHAR(500),
    tags TEXT[],
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_price_history_product_listing ON price_history(product_listing_id);
CREATE INDEX IF NOT EXISTS idx_price_history_scraped_at ON price_history(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_product ON price_alerts(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_product_listings_product ON product_listings(product_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

// Seed data SQL
const seedSQL = `
-- Insert retailers
INSERT INTO retailers (name, domain, logo_url, affiliate_base_url, scraping_enabled) VALUES
('Amazon', 'amazon.com', 'https://logo.clearbit.com/amazon.com', 'https://www.amazon.com/dp/{product_id}?tag=your-affiliate-20', TRUE),
('Home Depot', 'homedepot.com', 'https://logo.clearbit.com/homedepot.com', 'https://homedepot.sjv.io/c/1234567/{product_id}', TRUE),
('Lowes', 'lowes.com', 'https://logo.clearbit.com/lowes.com', 'https://lowes.sjv.io/c/1234567/{product_id}', TRUE),
('Best Buy', 'bestbuy.com', 'https://logo.clearbit.com/bestbuy.com', 'https://bestbuy.7tiv.net/c/1234567/{product_id}', TRUE),
('Costco', 'costco.com', 'https://logo.clearbit.com/costco.com', 'https://costco.com/products/{product_id}', FALSE),
('Wayfair', 'wayfair.com', 'https://logo.clearbit.com/wayfair.com', 'https://www.wayfair.com/products/{product_id}?refid=TEM_WF_1234', TRUE)
ON CONFLICT (domain) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, slug, parent_id) VALUES
-- Main categories
('Kitchen Appliances', 'kitchen-appliances', NULL),
('Laundry Appliances', 'laundry-appliances', NULL),
('Outdoor Appliances', 'outdoor-appliances', NULL),
('HVAC & Air Quality', 'hvac-air-quality', NULL),
('Small Appliances', 'small-appliances', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories
INSERT INTO categories (name, slug, parent_id) VALUES
-- Kitchen subcategories
('Refrigerators', 'refrigerators', (SELECT id FROM categories WHERE slug = 'kitchen-appliances')),
('Dishwashers', 'dishwashers', (SELECT id FROM categories WHERE slug = 'kitchen-appliances')),
('Ranges & Cooktops', 'ranges-cooktops', (SELECT id FROM categories WHERE slug = 'kitchen-appliances')),
('Microwaves', 'microwaves', (SELECT id FROM categories WHERE slug = 'kitchen-appliances')),
('Range Hoods', 'range-hoods', (SELECT id FROM categories WHERE slug = 'kitchen-appliances')),

-- Laundry subcategories
('Washers', 'washers', (SELECT id FROM categories WHERE slug = 'laundry-appliances')),
('Dryers', 'dryers', (SELECT id FROM categories WHERE slug = 'laundry-appliances')),
('Washer Dryer Combos', 'washer-dryer-combos', (SELECT id FROM categories WHERE slug = 'laundry-appliances')),

-- HVAC subcategories
('Air Conditioners', 'air-conditioners', (SELECT id FROM categories WHERE slug = 'hvac-air-quality')),
('Water Heaters', 'water-heaters', (SELECT id FROM categories WHERE slug = 'hvac-air-quality')),
('Humidifiers', 'humidifiers', (SELECT id FROM categories WHERE slug = 'hvac-air-quality')),

-- Small appliances subcategories
('Coffee Makers', 'coffee-makers', (SELECT id FROM categories WHERE slug = 'small-appliances')),
('Blenders', 'blenders', (SELECT id FROM categories WHERE slug = 'small-appliances')),
('Food Processors', 'food-processors', (SELECT id FROM categories WHERE slug = 'small-appliances')),
('Air Fryers', 'air-fryers', (SELECT id FROM categories WHERE slug = 'small-appliances'))
ON CONFLICT (slug) DO NOTHING;

-- Sample products
INSERT INTO products (name, model_number, brand, category_id, image_url, description, specifications) VALUES
(
    'Samsung 4-Door Flex French Door Refrigerator',
    'RF23M8070SR',
    'Samsung',
    (SELECT id FROM categories WHERE slug = 'refrigerators'),
    'https://images.samsung.com/is/image/samsung/p6pim/us/rf23m8070sr/gallery/us-french-door-refrigerator-rf23m8070sr-rf23m8070sr-aa-frontsilver-206838623',
    'Experience flexible food storage with the FlexZone drawer that can be converted from freezer to fridge.',
    '{"capacity": "22.5 cu ft", "energy_star": true, "width": "35.75 inches", "height": "70 inches", "depth": "36.5 inches", "features": ["FlexZone Drawer", "Twin Cooling Plus", "Ice Master Ice Maker", "External Water & Ice Dispenser"]}'
),
(
    'LG Front Load Washing Machine',
    'WM3900HWA',
    'LG',
    (SELECT id FROM categories WHERE slug = 'washers'),
    'https://gscs.lge.com/content/dam/lge/us/products/washers/WM3900HWA/gallery/large01.jpg',
    'Ultra Large Capacity TurboWash 360 front load washer with AI technology.',
    '{"capacity": "4.5 cu ft", "energy_star": true, "width": "27 inches", "height": "39 inches", "depth": "30.25 inches", "features": ["TurboWash 360", "AI DD Technology", "Steam", "14 Wash Programs"]}'
),
(
    'Whirlpool Gas Range',
    'WFG505M0BS',
    'Whirlpool',
    (SELECT id FROM categories WHERE slug = 'ranges-cooktops'),
    'https://product-images.whirlpool.com/web1000/p7p23/WFG505M0BS_1.jpg',
    '5.0 cu ft gas range with center oval burner and storage drawer.',
    '{"capacity": "5.0 cu ft", "fuel_type": "gas", "burners": 5, "width": "30 inches", "height": "47 inches", "depth": "25 inches", "features": ["Center Oval Burner", "Accusimmer Burner", "Storage Drawer", "Broiler"]}'
),
(
    'KitchenAid Stand Mixer',
    'KSM75WH',
    'KitchenAid',
    (SELECT id FROM categories WHERE slug = 'small-appliances'),
    'https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/kitchenaid/en-us/marketing-content/site-assets/page-content/pinwheel/stand-mixer-attachments-KSM75WH-slide-2-9b6e.jpg',
    'Professional bowl-lift stand mixer with 6-quart stainless steel bowl.',
    '{"capacity": "6 quart", "power": "575 watts", "speeds": 10, "width": "10.4 inches", "height": "16.5 inches", "depth": "14.6 inches", "features": ["Bowl-Lift Design", "10 Speed Mixing", "PowerKnead Spiral Dough Hook", "Pouring Shield"]}'
),
(
    'Ninja Foodi Personal Blender',
    'BN401',
    'Ninja',
    (SELECT id FROM categories WHERE slug = 'blenders'),
    'https://ninjakitchen.com/wp-content/uploads/2020/02/BN401_1.jpg',
    'Blast through ice and frozen fruit with the Pro Extractor Blades Assembly.',
    '{"capacity": "18 oz cup", "power": "1200 watts", "width": "5.5 inches", "height": "15.2 inches", "depth": "8.9 inches", "features": ["Pro Extractor Blades", "Auto-iQ Technology", "BPA Free", "Dishwasher Safe"]}'
)
ON CONFLICT DO NOTHING;

-- Sample product listings (connecting products to retailers)
INSERT INTO product_listings (product_id, retailer_id, retailer_product_id, retailer_url) 
SELECT p.id, r.id, 
  CASE 
    WHEN r.name = 'Amazon' AND p.name LIKE '%Samsung%' THEN 'B07V2HBXQK'
    WHEN r.name = 'Home Depot' AND p.name LIKE '%Samsung%' THEN '315124657'
    WHEN r.name = 'Amazon' AND p.name LIKE '%LG%' THEN 'B08XXPV5HJ'
    WHEN r.name = 'Amazon' AND p.name LIKE '%Whirlpool%' THEN 'B08ZZABC12'
    WHEN r.name = 'Amazon' AND p.name LIKE '%KitchenAid%' THEN 'B00005UP2P'
    WHEN r.name = 'Amazon' AND p.name LIKE '%Ninja%' THEN 'B07VB6VMYP'
    ELSE 'SAMPLE_ID'
  END,
  'https://example.com/product-url'
FROM products p
CROSS JOIN retailers r
WHERE r.name IN ('Amazon', 'Home Depot', 'Best Buy')
ON CONFLICT (product_id, retailer_id) DO NOTHING;

-- Sample price history
INSERT INTO price_history (product_listing_id, price, original_price, scraped_at)
SELECT pl.id, 
  CASE 
    WHEN p.name LIKE '%Samsung%' THEN 1699.99
    WHEN p.name LIKE '%LG%' THEN 699.99
    WHEN p.name LIKE '%Whirlpool%' THEN 649.99
    WHEN p.name LIKE '%KitchenAid%' THEN 279.99
    WHEN p.name LIKE '%Ninja%' THEN 79.99
    ELSE 499.99
  END,
  CASE 
    WHEN p.name LIKE '%Samsung%' THEN 2299.99
    WHEN p.name LIKE '%LG%' THEN 899.99
    WHEN p.name LIKE '%Whirlpool%' THEN 799.99
    WHEN p.name LIKE '%KitchenAid%' THEN 379.99
    WHEN p.name LIKE '%Ninja%' THEN 99.99
    ELSE 599.99
  END,
  NOW()
FROM product_listings pl
JOIN products p ON pl.product_id = p.id;

-- Admin user for testing
INSERT INTO users (email, password_hash, first_name, last_name, email_verified) VALUES
('admin@appliancetracker.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewFBdNmUBM0fmOpm', 'Admin', 'User', TRUE)
ON CONFLICT (email) DO NOTHING;
`;

async function setupDatabase() {
  console.log('🚀 Setting up Appliance Price Tracker Database...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.log('Please add your Railway PostgreSQL DATABASE_URL to the environment variables');
    process.exit(1);
  }

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();

    // Run schema
    console.log('🏗️  Creating database schema...');
    await pool.query(schemaSQL);
    console.log('✅ Database schema created successfully');

    // Run seed data
    console.log('🌱 Inserting sample data...');
    await pool.query(seedSQL);
    console.log('✅ Sample data inserted successfully');

    // Verify setup
    const result = await pool.query('SELECT COUNT(*) as count FROM products');
    const productCount = result.rows[0].count;
    
    console.log('🎉 Database setup complete!');
    console.log(`📊 Sample data: ${productCount} products loaded`);
    console.log('🔧 Tables created: users, products, retailers, categories, price_history, price_alerts, and more');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 