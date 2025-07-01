#!/usr/bin/env node

// Network accessibility test script
import os from 'os';

console.log('🌐 RecipeShare Network Accessibility Test');
console.log('=========================================');

// Get all network interfaces
const interfaces = os.networkInterfaces();
const networkIPs = [];

// Extract all IP addresses
Object.keys(interfaces).forEach(interfaceName => {
  interfaces[interfaceName].forEach(interfaceInfo => {
    if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
      networkIPs.push({
        interface: interfaceName,
        ip: interfaceInfo.address,
        netmask: interfaceInfo.netmask
      });
    }
  });
});

console.log('\n📡 Available Network Interfaces:');
if (networkIPs.length === 0) {
  console.log('❌ No external network interfaces found');
  console.log('💡 Make sure you are connected to a network');
} else {
  networkIPs.forEach((net, index) => {
    console.log(`${index + 1}. ${net.interface}: ${net.ip} (${net.netmask})`);
  });
}

console.log('\n🚀 Server Access URLs:');
console.log('📍 Local access:');
console.log('   - http://localhost:5000 (same machine only)');
console.log('   - http://127.0.0.1:5000 (same machine only)');

console.log('\n🌐 Network access:');
networkIPs.forEach((net, index) => {
  console.log(`   - http://${net.ip}:5000 (from ${net.interface})`);
});

console.log('\n📱 Frontend URLs:');
console.log('📍 Local access:');
console.log('   - http://localhost:5173');

console.log('\n🌐 Network access:');
networkIPs.forEach((net, index) => {
  console.log(`   - http://${net.ip}:5173`);
});

console.log('\n🔧 Testing Instructions:');
console.log('1. Start your server: npm run dev');
console.log('2. Wait for "Server running on 0.0.0.0:5000" message');
console.log('3. Test local access: http://localhost:5000/api/health');
console.log('4. Test network access from other devices using the IP addresses above');

console.log('\n🛡️ Security Notes:');
console.log('⚠️  CORS is set to allow all origins (development only)');
console.log('⚠️  Server is accessible from any IP address');
console.log('⚠️  For production, restrict CORS to specific domains');
console.log('⚠️  Consider using HTTPS in production');

console.log('\n🔍 Troubleshooting:');
console.log('- If connection refused: Check Windows Firewall');
console.log('- If timeout: Check router/network settings');
console.log('- If 404: Server may not be running');
console.log('- If CORS errors: Check browser console');

// Test function to check if server is running
async function testServerAccess() {
  console.log('\n🧪 Quick Server Test:');
  
  const testURLs = [
    'http://localhost:5000/api/health',
    ...networkIPs.map(net => `http://${net.ip}:5000/api/health`)
  ];
  
  for (const url of testURLs) {
    try {
      const response = await fetch(url, { 
        method: 'GET',
        timeout: 3000 
      });
      if (response.ok) {
        console.log(`✅ ${url} - Server accessible`);
      } else {
        console.log(`⚠️ ${url} - Server responded with ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${url} - ${error.code === 'ECONNREFUSED' ? 'Connection refused (server not running?)' : error.message}`);
    }
  }
}

// Run the test
testServerAccess().catch(() => {
  console.log('\n💡 Start your server first: npm run dev');
});
