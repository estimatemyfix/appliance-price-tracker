const express = require('express');
const cors = require('cors');
const app = express();
// Use Railway's assigned port or fallback to 5000
const PORT = process.env.PORT || 5000;

console.log('=== SERVER STARTING ===');
console.log('🚀 Fresh Railway deployment triggered!');
console.log('Port (Railway env):', process.env.PORT);
console.log('Port (using):', PORT);
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);

// Import simple, crash-proof database setup
const { setupDatabase } = require('./simple-database-setup');

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database setup flag
let databaseSetupComplete = false;
let setupError = null;

// Automatic database setup on startup (non-blocking)
async function initializeDatabase() {
  try {
    console.log('🏗️  Starting automatic database setup...');
    const result = await setupDatabase();
    
    if (result.success) {
      databaseSetupComplete = true;
      console.log('✅ Database setup completed successfully!');
    } else {
      setupError = result.message;
      console.log('⚠️  Database setup skipped:', result.message);
    }
  } catch (error) {
    setupError = error.message;
    console.error('❌ Database setup failed:', error.message);
    // Don't crash the server - continue running
  }
}

// Initialize database on startup (non-blocking - don't wait for it)
initializeDatabase().catch(err => {
  console.error('❌ Database initialization error (non-fatal):', err.message);
  setupError = err.message;
});

// Root health check for Railway
app.get('/', (req, res) => {
  const status = {
    status: 'Railway deployment successful! 🚀',
    timestamp: new Date().toISOString(),
    database: {
      url_configured: !!process.env.DATABASE_URL,
      setup_complete: databaseSetupComplete,
      setup_error: setupError
    },
    endpoints: {
      health: '/health',
      test_api: '/api/test',
      products_search: '/api/products/search',
      database_setup: '/api/database/setup',
      database_status: '/api/database/status'
    }
  };
  
  console.log('Root endpoint accessed:', status);
  res.json(status);
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    database: {
      configured: !!process.env.DATABASE_URL,
      setup_complete: databaseSetupComplete,
      error: setupError
    },
    timestamp: new Date().toISOString()
  });
});

// Database setup endpoint (manual trigger)
app.post('/api/database/setup', async (req, res) => {
  console.log('Manual database setup requested');
  
  if (!process.env.DATABASE_URL) {
    return res.status(400).json({
      success: false,
      error: 'DATABASE_URL environment variable not configured'
    });
  }

  try {
    console.log('🏗️  Running manual database setup...');
    await setupDatabase();
    databaseSetupComplete = true;
    setupError = null;
    
    res.json({
      success: true,
      message: 'Database setup completed successfully!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    setupError = error.message;
    console.error('❌ Manual database setup failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Database status endpoint
app.get('/api/database/status', (req, res) => {
  res.json({
    database_url_configured: !!process.env.DATABASE_URL,
    setup_complete: databaseSetupComplete,
    setup_error: setupError,
    timestamp: new Date().toISOString()
  });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  console.log('API test requested');
  res.json({ 
    message: 'API is working!',
    database: {
      configured: !!process.env.DATABASE_URL,
      setup_complete: databaseSetupComplete
    },
    timestamp: new Date().toISOString()
  });
});

// Mock product search endpoint
app.get('/api/products/search', async (req, res) => {
  const searchQuery = req.query.q || req.query.query; // Support both ?q= and ?query=
  console.log('Product search requested with query:', searchQuery);
  
  // If database is set up, we could query real data here
  // For now, return mock data with database status
  const mockProducts = [
    {
      id: 1,
      name: 'Samsung 4-Door Flex French Door Refrigerator',
      brand: 'Samsung',
      model_number: 'RF23M8070SR',
      current_price: 1699.99,
      original_price: 2299.99,
      discount_percentage: 26,
      image_url: 'https://images.samsung.com/is/image/samsung/p6pim/us/rf23m8070sr/gallery/us-french-door-refrigerator-rf23m8070sr-rf23m8070sr-aa-frontsilver-206838623',
      retailers: [
        { name: 'Amazon', price: 1699.99, url: 'https://amazon.com/dp/B07V2HBXQK' },
        { name: 'Home Depot', price: 1749.99, url: 'https://homedepot.com/p/315124657' },
        { name: 'Best Buy', price: 1799.99, url: 'https://bestbuy.com/site/6403924.p' }
      ],
      database_sourced: databaseSetupComplete
    },
    {
      id: 2,
      name: 'LG Front Load Washing Machine',
      brand: 'LG',
      model_number: 'WM3900HWA',
      current_price: 699.99,
      original_price: 899.99,
      discount_percentage: 22,
      image_url: 'https://gscs.lge.com/content/dam/lge/us/products/washers/WM3900HWA/gallery/large01.jpg',
      retailers: [
        { name: 'Amazon', price: 699.99, url: 'https://amazon.com/dp/B08XXPV5HJ' },
        { name: 'Home Depot', price: 729.99, url: 'https://homedepot.com/p/314656789' },
        { name: 'Lowes', price: 749.99, url: 'https://lowes.com/pd/1003456789' }
      ],
      database_sourced: databaseSetupComplete
    },
    {
      id: 3,
      name: 'KitchenAid Stand Mixer',
      brand: 'KitchenAid',
      model_number: 'KSM75WH',
      current_price: 279.99,
      original_price: 379.99,
      discount_percentage: 26,
      image_url: 'https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/kitchenaid/en-us/marketing-content/site-assets/page-content/pinwheel/stand-mixer-attachments-KSM75WH-slide-2-9b6e.jpg',
      retailers: [
        { name: 'Amazon', price: 279.99, url: 'https://amazon.com/dp/B00005UP2P' },
        { name: 'Best Buy', price: 299.99, url: 'https://bestbuy.com/site/4259600.p' },
        { name: 'Wayfair', price: 289.99, url: 'https://wayfair.com/kitchen-tabletop/pdp/12345678.html' }
      ],
      database_sourced: databaseSetupComplete
    }
  ];

  // Filter by query if provided
  const query = searchQuery?.toLowerCase() || '';
  const filteredProducts = query 
    ? mockProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.brand.toLowerCase().includes(query)
      )
    : mockProducts;

  // Convert to format expected by frontend
  const frontendProducts = filteredProducts.map(product => ({
    id: product.id,
    name: product.name,
    brand: product.brand,
    model_number: product.model_number,
    image_url: product.image_url,
    description: `${product.brand} ${product.name}`,
    listings: product.retailers.map(retailer => ({
      retailer: {
        name: retailer.name,
        domain: retailer.url.split('/')[2], // Extract domain from URL
        logo_url: `https://logo.clearbit.com/${retailer.url.split('/')[2]}`
      },
      current_price: {
        price: retailer.price,
        original_price: product.original_price,
        is_available: true
      }
    }))
  }));

  res.json({
    success: true,
    data: {
      products: frontendProducts,
      total: frontendProducts.length,
      page: 1,
      limit: 20
    },
    query: searchQuery || 'all',
    timestamp: new Date().toISOString()
  });
});

// Auth endpoints (temporary placeholders)
app.post('/api/auth/login', (req, res) => {
  console.log('Login called');
  res.json({ success: false, message: 'Authentication not yet implemented' });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register called');
  res.json({ success: false, message: 'Registration not yet implemented' });
});

// Product details endpoint
app.get('/api/products/:id', (req, res) => {
  console.log('Product details called, ID:', req.params.id);
  res.json({ success: false, message: 'Product details not yet implemented' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('404 - Path not found:', req.originalUrl);
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl,
    available_endpoints: [
      'GET /',
      'GET /health', 
      'GET /api/test',
      'GET /api/products/search',
      'POST /api/database/setup',
      'GET /api/database/status'
    ]
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log('📡 Railway deployment active');
  console.log('🗄️  Database URL configured:', !!process.env.DATABASE_URL);
  console.log('⏰ Server started at:', new Date().toISOString());
});

server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

console.log('Server setup complete, waiting for connections...'); 