import { useState } from 'react';

export default function TestBackend() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (url, name) => {
    setLoading(true);
    try {
      console.log(`Testing ${name}:`, url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      const data = await response.json();
      setResult(prev => prev + `\n✅ ${name}: ${response.status} - ${JSON.stringify(data)}`);
    } catch (error) {
      setResult(prev => prev + `\n❌ ${name}: Error - ${error.message}`);
    }
    setLoading(false);
  };

  const runTests = () => {
    setResult('Starting tests...\n');
    const baseUrl = 'https://appliance-price-tracker-production.up.railway.app';
    
    testEndpoint(baseUrl, 'Root');
    setTimeout(() => testEndpoint(`${baseUrl}/health`, 'Health'), 1000);
    setTimeout(() => testEndpoint(`${baseUrl}/api/test`, 'API Test'), 2000);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Backend Connectivity Test</h1>
      <button onClick={runTests} disabled={loading}>
        {loading ? 'Testing...' : 'Test Backend'}
      </button>
      
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '10px', 
        marginTop: '20px',
        whiteSpace: 'pre-wrap',
        minHeight: '100px'
      }}>
        {result || 'Click "Test Backend" to start'}
      </pre>
      
      <p>
        <strong>Expected URL:</strong> https://appliance-price-tracker-production.up.railway.app
      </p>
    </div>
  );
} 