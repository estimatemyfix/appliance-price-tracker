-- Seed data for Appliance Price Tracker

-- Insert retailers
INSERT INTO retailers (name, domain, logo_url, affiliate_base_url, scraping_enabled) VALUES
('Amazon', 'amazon.com', 'https://logo.clearbit.com/amazon.com', 'https://www.amazon.com/dp/{product_id}?tag=your-affiliate-20', TRUE),
('Home Depot', 'homedepot.com', 'https://logo.clearbit.com/homedepot.com', 'https://homedepot.sjv.io/c/1234567/{product_id}', TRUE),
('Lowes', 'lowes.com', 'https://logo.clearbit.com/lowes.com', 'https://lowes.sjv.io/c/1234567/{product_id}', TRUE),
('Best Buy', 'bestbuy.com', 'https://logo.clearbit.com/bestbuy.com', 'https://bestbuy.7tiv.net/c/1234567/{product_id}', TRUE),
('Costco', 'costco.com', 'https://logo.clearbit.com/costco.com', 'https://costco.com/products/{product_id}', FALSE),
('Wayfair', 'wayfair.com', 'https://logo.clearbit.com/wayfair.com', 'https://www.wayfair.com/products/{product_id}?refid=TEM_WF_1234', TRUE);

-- Insert categories
INSERT INTO categories (name, slug, parent_id) VALUES
-- Main categories
('Kitchen Appliances', 'kitchen-appliances', NULL),
('Laundry Appliances', 'laundry-appliances', NULL),
('Outdoor Appliances', 'outdoor-appliances', NULL),
('HVAC & Air Quality', 'hvac-air-quality', NULL),
('Small Appliances', 'small-appliances', NULL);

-- Get the parent category IDs for subcategories
WITH category_ids AS (
    SELECT id, slug FROM categories
)
INSERT INTO categories (name, slug, parent_id) VALUES
-- Kitchen subcategories
('Refrigerators', 'refrigerators', (SELECT id FROM category_ids WHERE slug = 'kitchen-appliances')),
('Dishwashers', 'dishwashers', (SELECT id FROM category_ids WHERE slug = 'kitchen-appliances')),
('Ranges & Cooktops', 'ranges-cooktops', (SELECT id FROM category_ids WHERE slug = 'kitchen-appliances')),
('Microwaves', 'microwaves', (SELECT id FROM category_ids WHERE slug = 'kitchen-appliances')),
('Range Hoods', 'range-hoods', (SELECT id FROM category_ids WHERE slug = 'kitchen-appliances')),

-- Laundry subcategories
('Washers', 'washers', (SELECT id FROM category_ids WHERE slug = 'laundry-appliances')),
('Dryers', 'dryers', (SELECT id FROM category_ids WHERE slug = 'laundry-appliances')),
('Washer Dryer Combos', 'washer-dryer-combos', (SELECT id FROM category_ids WHERE slug = 'laundry-appliances')),

-- HVAC subcategories
('Air Conditioners', 'air-conditioners', (SELECT id FROM category_ids WHERE slug = 'hvac-air-quality')),
('Water Heaters', 'water-heaters', (SELECT id FROM category_ids WHERE slug = 'hvac-air-quality')),
('Humidifiers', 'humidifiers', (SELECT id FROM category_ids WHERE slug = 'hvac-air-quality')),

-- Small appliances subcategories
('Coffee Makers', 'coffee-makers', (SELECT id FROM category_ids WHERE slug = 'small-appliances')),
('Blenders', 'blenders', (SELECT id FROM category_ids WHERE slug = 'small-appliances')),
('Food Processors', 'food-processors', (SELECT id FROM category_ids WHERE slug = 'small-appliances')),
('Air Fryers', 'air-fryers', (SELECT id FROM category_ids WHERE slug = 'small-appliances'));

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
    'LG Top Load Washer with TurboWash Technology',
    'WT7800CW',
    'LG',
    (SELECT id FROM categories WHERE slug = 'washers'),
    'https://gscs.lge.com/downloadFile?fileId=7mJROz7QZRaxfHCm2HTfpw',
    'Get more done in less time with TurboWash technology that saves 20 minutes on large loads.',
    '{"capacity": "5.5 cu ft", "energy_star": true, "width": "27 inches", "height": "44.5 inches", "depth": "28.5 inches", "features": ["TurboWash Technology", "SmartDiagnosis", "LoadSense", "6Motion Technology"]}'
),
(
    'Whirlpool Gas Range with Air Fry',
    'WFG775H0HZ',
    'Whirlpool',
    (SELECT id FROM categories WHERE slug = 'ranges-cooktops'),
    'https://product-images.whirlpool.com/is/image/whirlpoolbrand/WFG775H0HZ_1',
    'Skip preheating and cook frozen favorites like chicken nuggets and pizza rolls with Air Fry mode.',
    '{"fuel_type": "Gas", "oven_capacity": "5.8 cu ft", "width": "30 inches", "height": "36 inches", "depth": "25 inches", "features": ["Air Fry Mode", "Frozen Bake Technology", "SpeedHeat Burner", "Self-Cleaning"]}'
),
(
    'KitchenAid Stand Mixer Artisan Series',
    'KSM150PSER',
    'KitchenAid',
    (SELECT id FROM categories WHERE slug = 'small-appliances'),
    'https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/kitchenaid/en-us/marketing-content/site-assets/page-content/pinwheel/KSM150PSER_1.jpg',
    'Make up to 9 dozen cookies in a single batch with the 5-quart stainless steel bowl.',
    '{"capacity": "5 qt", "power": "325 watts", "speeds": 10, "width": "14.3 inches", "height": "14 inches", "depth": "8.7 inches", "features": ["Planetary Mixing Action", "Tilt-Head Design", "Power Hub", "Multiple Attachments Available"]}'
),
(
    'Ninja Foodi Personal Blender',
    'BN401',
    'Ninja',
    (SELECT id FROM categories WHERE slug = 'blenders'),
    'https://ninjakitchen.com/wp-content/uploads/2020/02/BN401_1.jpg',
    'Blast through ice and frozen fruit with the Pro Extractor Blades Assembly.',
    '{"capacity": "18 oz cup", "power": "1200 watts", "width": "5.5 inches", "height": "15.2 inches", "depth": "8.9 inches", "features": ["Pro Extractor Blades", "Auto-iQ Technology", "BPA Free", "Dishwasher Safe"]}'
);

-- Sample product listings (connecting products to retailers)
INSERT INTO product_listings (product_id, retailer_id, retailer_product_id, retailer_url) VALUES
-- Samsung Refrigerator
(1, 1, 'B07V2HBXQK', 'https://www.amazon.com/dp/B07V2HBXQK'),
(1, 2, '315124657', 'https://www.homedepot.com/p/315124657'),
(1, 3, '1000735847', 'https://www.lowes.com/pd/1000735847'),
(1, 4, '6403924', 'https://www.bestbuy.com/site/6403924.p'),

-- LG Washer
(2, 1, 'B08XXPV5HJ', 'https://www.amazon.com/dp/B08XXPV5HJ'),
(2, 2, '314656789', 'https://www.homedepot.com/p/314656789'),
(2, 3, '1003456789', 'https://www.lowes.com/pd/1003456789'),

-- Whirlpool Range
(3, 1, 'B08ZZABC12', 'https://www.amazon.com/dp/B08ZZABC12'),
(3, 2, '312345678', 'https://www.homedepot.com/p/312345678'),
(3, 3, '1001234567', 'https://www.lowes.com/pd/1001234567'),

-- KitchenAid Mixer
(4, 1, 'B00005UP2P', 'https://www.amazon.com/dp/B00005UP2P'),
(4, 4, '4259600', 'https://www.bestbuy.com/site/4259600.p'),
(4, 6, '12345678', 'https://www.wayfair.com/kitchen-tabletop/pdp/12345678.html'),

-- Ninja Blender
(5, 1, 'B07VB6VMYP', 'https://www.amazon.com/dp/B07VB6VMYP'),
(5, 4, '6432198', 'https://www.bestbuy.com/site/6432198.p');

-- Sample price history
INSERT INTO price_history (product_listing_id, price, original_price, scraped_at) VALUES
-- Samsung Refrigerator prices
(1, 1999.99, 2299.99, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(1, 1899.99, 2299.99, CURRENT_TIMESTAMP - INTERVAL '25 days'),
(1, 1799.99, 2299.99, CURRENT_TIMESTAMP - INTERVAL '20 days'),
(1, 1849.99, 2299.99, CURRENT_TIMESTAMP - INTERVAL '15 days'),
(1, 1749.99, 2299.99, CURRENT_TIMESTAMP - INTERVAL '10 days'),
(1, 1799.99, 2299.99, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(1, 1699.99, 2299.99, CURRENT_TIMESTAMP),

-- LG Washer prices
(5, 799.99, 899.99, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(5, 749.99, 899.99, CURRENT_TIMESTAMP - INTERVAL '20 days'),
(5, 729.99, 899.99, CURRENT_TIMESTAMP - INTERVAL '10 days'),
(5, 699.99, 899.99, CURRENT_TIMESTAMP),

-- KitchenAid Mixer prices
(13, 349.99, 379.99, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(13, 329.99, 379.99, CURRENT_TIMESTAMP - INTERVAL '20 days'),
(13, 299.99, 379.99, CURRENT_TIMESTAMP - INTERVAL '15 days'),
(13, 319.99, 379.99, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(13, 279.99, 379.99, CURRENT_TIMESTAMP);

-- Admin user for testing
INSERT INTO users (email, password_hash, first_name, last_name, email_verified) VALUES
('admin@appliancetracker.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewFBdNmUBM0fmOpm', 'Admin', 'User', TRUE);

-- Sample blog posts for SEO
INSERT INTO blog_posts (title, slug, content, excerpt, status, seo_title, seo_description, tags, published_at) VALUES
(
    'Best Time to Buy Appliances in 2024: Complete Buyer''s Guide',
    'best-time-buy-appliances-2024',
    '<h2>When Should You Buy Appliances?</h2><p>Timing your appliance purchases can save you hundreds or even thousands of dollars. Here''s everything you need to know about seasonal sales, retailer promotions, and the best months to buy each type of appliance.</p><h3>Major Sale Seasons</h3><p>The biggest appliance sales happen during these key periods...</p>',
    'Discover the best times to buy appliances and save big on your next purchase. Complete guide to seasonal sales and retailer promotions.',
    'published',
    'Best Time to Buy Appliances in 2024 - Save Up to 40% | Appliance Price Tracker',
    'Learn when to buy appliances to get the best deals. Comprehensive guide covering seasonal sales, Black Friday deals, and month-by-month buying strategies.',
    ARRAY['appliances', 'deals', 'shopping-tips', 'seasonal-sales'],
    CURRENT_TIMESTAMP - INTERVAL '10 days'
),
(
    'Refrigerator Price Trends 2024: What to Expect',
    'refrigerator-price-trends-2024',
    '<h2>Refrigerator Market Analysis</h2><p>Refrigerator prices have been fluctuating significantly in 2024 due to supply chain improvements and new model releases. Here''s what our data shows...</p>',
    'Analysis of refrigerator price trends in 2024, including forecast predictions and best buying opportunities.',
    'published',
    '2024 Refrigerator Price Trends & Forecasts | Market Analysis',
    'Complete analysis of refrigerator price trends in 2024. Expert predictions, seasonal patterns, and buying recommendations based on market data.',
    ARRAY['refrigerators', 'price-trends', 'market-analysis', '2024'],
    CURRENT_TIMESTAMP - INTERVAL '5 days'
); 