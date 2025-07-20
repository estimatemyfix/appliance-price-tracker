const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running!' });
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});

// Basic API routes that your frontend expects
app.get('/api/products/search', (req, res) => {
  console.log('Search request received:', req.query);
  res.json({
    success: true,
    data: {
      products: [
        {
          id: 1,
          name: 'Samsung Refrigerator',
          brand: 'Samsung',
          model_number: 'RF23M8070SR',
          image_url: 'https://via.placeholder.com/300x300',
          description: 'French Door Refrigerator with Smart Features',
          created_at: new Date(),
          updated_at: new Date(),
          listings: [{
            retailer: {
              id: 1,
              name: 'Amazon',
              domain: 'amazon.com',
              logo_url: 'https://via.placeholder.com/100x50'
            },
            current_price: {
              price: 1299.99,
              original_price: 1499.99,
              is_available: true
            }
          }]
        }
      ],
      total: 1,
      page: 1,
      limit: 10
    }
  });
});

app.get('/api/products/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      id: parseInt(req.params.id),
      name: 'Sample Product',
      brand: 'Sample Brand',
      description: 'This is a sample product',
      listings: []
    }
  });
});

// Authentication endpoints (mock)
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration successful',
    data: {
      user: { id: 1, email: req.body.email },
      token: 'sample-jwt-token'
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { id: 1, email: req.body.email },
      token: 'sample-jwt-token'
    }
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 