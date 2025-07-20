const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('Starting server...');

// Root health check for Railway
app.get('/', (req, res) => {
  console.log('Root path requested');
  res.json({ status: 'ok', message: 'Server is running on Railway!' });
});

app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', message: 'Test server is running!' });
});

app.get('/api/test', (req, res) => {
  console.log('Test API called');
  res.json({ message: 'Hello from Railway!' });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 