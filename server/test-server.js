const express = require('express');
const cors = require('cors');
const app = express();
// Force port 5000 to match Railway's Public Networking configuration
const PORT = 5000;

console.log('=== SERVER STARTING ===');
console.log('🚀 Fresh Railway deployment triggered!');
console.log('Port (Railway env):', process.env.PORT);
console.log('Port (using):', PORT);
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);

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

// Root health check for Railway
app.get('/', (req, res) => {
  console.log('Root path requested');
  try {
    res.json({ 
      status: 'ok', 
      message: 'Server is running on Railway!',
      timestamp: new Date().toISOString(),
      port: PORT
    });
  } catch (error) {
    console.error('Error in root handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  console.log('Health check requested');
  try {
    res.json({ 
      status: 'healthy', 
      message: 'Test server is running!',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    console.error('Error in health handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/test', (req, res) => {
  console.log('Test API called');
  try {
    res.json({ 
      message: 'Hello from Railway!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in test handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Product search endpoint (temporary mock data)
app.get('/api/products/search', (req, res) => {
  console.log('Product search called, query:', req.query.q);
  try {
    const query = req.query.q || '';
    
    // Mock data for now - replace with real database later
    const mockProducts = [
      {
        id: 1,
        name: `${query} Dishwasher`,
        brand: 'Samsung',
        model_number: 'DW80R9950US',
        image_url: 'https://images.samsung.com/is/image/samsung/p6pim/us/dw80r9950us/gallery/us-dw80r9950us-dw80r9950us-aa-frontopendoor-thumb-409992276',
        description: 'Energy efficient dishwasher with third rack',
        listings: [
          {
            retailer: {
              name: 'Best Buy',
              domain: 'bestbuy.com',
              logo_url: 'https://logos-world.net/wp-content/uploads/2020/05/Best-Buy-Logo.png'
            },
            current_price: {
              price: 899.99,
              original_price: 1199.99,
              is_available: true
            }
          },
          {
            retailer: {
              name: 'Home Depot',
              domain: 'homedepot.com', 
              logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Home-Depot-Logo.png'
            },
            current_price: {
              price: 849.99,
              original_price: 1199.99,
              is_available: true
            }
          }
        ]
      },
      {
        id: 2,
        name: `${query} Refrigerator`,
        brand: 'LG',
        model_number: 'LRFVC2406S',
        image_url: 'https://gscs.lge.com/gscs/Images/LG_LRFVC2406S_01.jpg',
        description: 'French door refrigerator with smart features',
        listings: [
          {
            retailer: {
              name: 'Lowes',
              domain: 'lowes.com',
              logo_url: 'https://logos-world.net/wp-content/uploads/2020/04/Lowes-Logo.png'
            },
            current_price: {
              price: 1299.99,
              original_price: 1499.99,
              is_available: true
            }
          }
        ]
      }
    ];

    res.json({
      success: true,
      data: {
        products: mockProducts,
        total: mockProducts.length,
        page: 1,
        limit: 10
      }
    });
  } catch (error) {
    console.error('Error in product search:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
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

// Add 404 handler
app.use('*', (req, res) => {
  console.log('404 - Path not found:', req.path);
  res.status(404).json({ error: 'Path not found', path: req.path });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ error: 'Internal server error', message: error.message });
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

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=== SERVER STARTED SUCCESSFULLY ===`);
  console.log(`Server running on port ${PORT} (fixed for Railway Public Networking), bound to 0.0.0.0`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Test API: http://localhost:${PORT}/api/test`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

console.log('Server setup complete, waiting for connections...'); 