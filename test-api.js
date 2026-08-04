// Simple test without axios - use fetch (Node 18+)
async function testAPI() {
  console.log('🚀 Testing API...\n');
  
  const baseURL = 'http://localhost:5000/api';
  
  try {
    // 1. Health Check
    const healthRes = await fetch(`${baseURL}/health`);
    const health = await healthRes.json();
    console.log('✅ Health Check:', health);
  } catch (error) {
    console.log('❌ Health Check failed:', error.message);
  }
  
  // 2. Register User
  try {
    const registerRes = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Test@123456',
        country: 'Nigeria',
        campus: 'UNILAG'
      })
    });
    const register = await registerRes.json();
    console.log('✅ Register:', register.message || register);
  } catch (error) {
    console.log('❌ Register failed:', error.message);
  }
  
  // 3. Login
  try {
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'Test@123456'
      })
    });
    const login = await loginRes.json();
    console.log('✅ Login:', login.message);
    if (login.data?.token) {
      console.log('   Token:', login.data.token);
    }
  } catch (error) {
    console.log('❌ Login failed:', error.message);
  }
}

testAPI();