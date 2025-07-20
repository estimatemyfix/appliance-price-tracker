const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('=== SERVER STARTING ===');
console.log('Port:', PORT);
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  credentials: true
}));

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
  console.log(`Server running on port ${PORT}, bound to 0.0.0.0`);
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