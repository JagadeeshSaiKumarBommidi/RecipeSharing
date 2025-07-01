#!/usr/bin/env node

// Advanced network connectivity test
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

console.log('🚨 Advanced Network Connectivity Diagnostics');
console.log('============================================');

// Get network interfaces
function getNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const results = [];
  
  Object.keys(interfaces).forEach(name => {
    interfaces[name].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        results.push({
          name: name,
          address: iface.address,
          netmask: iface.netmask,
          mac: iface.mac
        });
      }
    });
  });
  
  return results;
}

// Test if a URL is accessible
async function testURL(url, timeout = 5000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      signal: controller.signal,
      method: 'GET'
    });
    
    clearTimeout(timeoutId);
    return {
      success: true,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    return {
      success: false,
      error: error.name === 'AbortError' ? 'Timeout' : error.message
    };
  }
}

// Check if ports are listening
async function checkPortListening(port) {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execAsync(`netstat -an | findstr :${port}`);
      return stdout.includes('LISTENING');
    } else {
      const { stdout } = await execAsync(`netstat -tlnp | grep :${port}`);
      return stdout.includes('LISTEN');
    }
  } catch (error) {
    return false;
  }
}

// Main diagnostic function
async function runDiagnostics() {
  console.log('\n📡 Network Interfaces:');
  const interfaces = getNetworkInterfaces();
  
  if (interfaces.length === 0) {
    console.log('❌ No network interfaces found');
    console.log('💡 Make sure you are connected to a network');
    return;
  }
  
  interfaces.forEach((iface, index) => {
    console.log(`${index + 1}. ${iface.name}: ${iface.address}`);
  });
  
  console.log('\n🔌 Port Status:');
  const port5000 = await checkPortListening(5000);
  const port5173 = await checkPortListening(5173);
  
  console.log(`Port 5000 (Backend): ${port5000 ? '✅ Listening' : '❌ Not listening'}`);
  console.log(`Port 5173 (Frontend): ${port5173 ? '✅ Listening' : '❌ Not listening'}`);
  
  if (!port5000) {
    console.log('💡 Backend server is not running. Start with: npm run dev');
    return;
  }
  
  console.log('\n🧪 Connectivity Tests:');
  
  // Test localhost
  console.log('Testing localhost...');
  const localhostTest = await testURL('http://localhost:5000/api/health');
  console.log(`localhost:5000 - ${localhostTest.success ? '✅ OK' : '❌ ' + localhostTest.error}`);
  
  // Test 127.0.0.1
  const loopbackTest = await testURL('http://127.0.0.1:5000/api/health');
  console.log(`127.0.0.1:5000 - ${loopbackTest.success ? '✅ OK' : '❌ ' + loopbackTest.error}`);
  
  // Test network interfaces
  for (const iface of interfaces) {
    console.log(`Testing ${iface.address}...`);
    const networkTest = await testURL(`http://${iface.address}:5000/api/health`);
    console.log(`${iface.address}:5000 - ${networkTest.success ? '✅ OK' : '❌ ' + networkTest.error}`);
  }
  
  console.log('\n📱 URLs for Other Devices:');
  interfaces.forEach(iface => {
    console.log(`🌐 http://${iface.address}:5173 (Frontend)`);
    console.log(`🔧 http://${iface.address}:5000/api/health (Backend Health Check)`);
  });
  
  console.log('\n🛠️ Troubleshooting Steps:');
  console.log('1. If localhost works but network IPs don\'t:');
  console.log('   - Check Windows Firewall settings');
  console.log('   - Run network-troubleshoot.bat as Administrator');
  console.log('2. If network IPs work from this device but not others:');
  console.log('   - Check router AP Isolation settings');
  console.log('   - Ensure devices are on same network');
  console.log('   - Temporarily disable antivirus/security software');
  console.log('3. If still not working:');
  console.log('   - Try accessing from another device on same network');
  console.log('   - Check if other device can ping this computer');
  
  console.log('\n🔍 Next Steps:');
  console.log('1. Run: network-troubleshoot.bat (as Administrator)');
  console.log('2. Test from another device using the URLs above');
  console.log('3. If health check works, test the full frontend URL');
}

runDiagnostics().catch(console.error);
