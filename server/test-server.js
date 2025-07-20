const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

console.log('Starting server...');

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