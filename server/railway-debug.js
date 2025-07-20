// Railway Debug Script
console.log('=== RAILWAY DEBUGGING INFO ===');
console.log('PORT from Railway env:', process.env.PORT);
console.log('PORT we are using:', 5000);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('RAILWAY_SERVICE_NAME:', process.env.RAILWAY_SERVICE_NAME);
console.log('RAILWAY_PROJECT_NAME:', process.env.RAILWAY_PROJECT_NAME);

// Check if Railway provides any URL info
const possibleUrlEnvs = [
  'RAILWAY_STATIC_URL',
  'RAILWAY_PUBLIC_DOMAIN', 
  'PUBLIC_URL',
  'VERCEL_URL',
  'RENDER_EXTERNAL_URL'
];

console.log('\n=== URL ENVIRONMENT VARIABLES ===');
possibleUrlEnvs.forEach(envName => {
  if (process.env[envName]) {
    console.log(`${envName}:`, process.env[envName]);
  }
});

console.log('\n=== NETWORK INFO ===');
console.log('Server should be accessible at: https://[railway-domain]:' + (process.env.PORT || 5000));

const express = require('express');
const app = express();
// Force port 5000 to match Railway's Public Networking configuration
const PORT = 5000;

app.get('/', (req, res) => {
  res.json({
    message: 'Railway Debug Server Running!',
    port: PORT,
    environment: process.env.NODE_ENV,
    railwayProject: process.env.RAILWAY_PROJECT_NAME,
    railwayService: process.env.RAILWAY_SERVICE_NAME,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n=== DEBUG SERVER STARTED ===');
  console.log(`Listening on port ${PORT} (forced to match Railway's Public Networking config)`);
  console.log('Server bound to 0.0.0.0 for external access');
}); 