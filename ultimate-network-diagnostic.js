#!/usr/bin/env node

// Ultimate network diagnostic - finds the exact issue
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import net from 'net';

const execAsync = promisify(exec);

console.log('🔍 ULTIMATE Network Diagnostic for RecipeShare');
console.log('==============================================');

// Test if a port is actually accessible from network
function testPortFromNetwork(ip, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 3000;
    
    socket.setTimeout(timeout);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      resolve(false);
    });
    
    socket.connect(port, ip);
  });
}

// Get detailed network info
function getDetailedNetworkInfo() {
  const interfaces = os.networkInterfaces();
  const results = [];
  
  Object.keys(interfaces).forEach(name => {
    interfaces[name].forEach(iface => {
      if (iface.family === 'IPv4') {
        results.push({
          name: name,
          address: iface.address,
          netmask: iface.netmask,
          internal: iface.internal,
          mac: iface.mac
        });
      }
    });
  });
  
  return results;
}

// Check Windows firewall status
async function checkFirewallStatus() {
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execAsync('netsh advfirewall show allprofiles state');
      return stdout.includes('ON');
    }
    return false;
  } catch (error) {
    return 'unknown';
  }
}

// Main diagnostic
async function runUltimateDiagnostic() {
  console.log('\n📋 STEP 1: System Information');
  console.log('-----------------------------');
  console.log('Platform:', process.platform);
  console.log('Architecture:', process.arch);
  console.log('Node.js:', process.version);
  
  console.log('\n📡 STEP 2: Network Interfaces');
  console.log('-----------------------------');
  const interfaces = getDetailedNetworkInfo();
  
  interfaces.forEach((iface, index) => {
    const type = iface.internal ? '(Loopback)' : '(Network)';
    console.log(`${index + 1}. ${iface.name}: ${iface.address} ${type}`);
  });
  
  const networkIPs = interfaces.filter(iface => !iface.internal);
  if (networkIPs.length === 0) {
    console.log('❌ NO NETWORK INTERFACES FOUND!');
    console.log('💡 You are not connected to any network');
    return;
  }
  
  console.log('\n🔥 STEP 3: Firewall Status');
  console.log('-------------------------');
  const firewallOn = await checkFirewallStatus();
  console.log('Windows Firewall:', firewallOn === true ? '🔒 ON' : firewallOn === false ? '✅ OFF' : '❓ Unknown');
  
  console.log('\n🔌 STEP 4: Port Binding Test');
  console.log('---------------------------');
  
  // Test if we can bind to ports
  const testPorts = [5000, 5173];
  for (const port of testPorts) {
    try {
      const server = net.createServer();
      await new Promise((resolve, reject) => {
        server.listen(port, '0.0.0.0', () => {
          console.log(`✅ Port ${port}: Can bind to 0.0.0.0`);
          server.close(resolve);
        });
        server.on('error', reject);
      });
    } catch (error) {
      console.log(`❌ Port ${port}: Cannot bind - ${error.code}`);
      if (error.code === 'EADDRINUSE') {
        console.log(`   💡 Port ${port} is already in use (this is expected if server is running)`);
      }
    }
  }
  
  console.log('\n🧪 STEP 5: Server Connectivity Test');
  console.log('----------------------------------');
  
  // Test localhost first
  console.log('Testing localhost:5000...');
  const localhostWorks = await testPortFromNetwork('127.0.0.1', 5000);
  console.log(`localhost:5000 - ${localhostWorks ? '✅ ACCESSIBLE' : '❌ NOT ACCESSIBLE'}`);
  
  if (!localhostWorks) {
    console.log('❌ SERVER IS NOT RUNNING!');
    console.log('💡 Please start your server: npm run dev');
    return;
  }
  
  // Test network IPs
  console.log('\nTesting network accessibility...');
  for (const iface of networkIPs) {
    const accessible = await testPortFromNetwork(iface.address, 5000);
    console.log(`${iface.address}:5000 - ${accessible ? '✅ ACCESSIBLE' : '❌ BLOCKED'}`);
    
    if (!accessible) {
      console.log(`   🔍 Issue with ${iface.name} (${iface.address})`);
    }
  }
  
  console.log('\n🎯 STEP 6: Root Cause Analysis');
  console.log('-----------------------------');
  
  const accessibleNetworkIPs = [];
  for (const iface of networkIPs) {
    const accessible = await testPortFromNetwork(iface.address, 5000);
    if (accessible) accessibleNetworkIPs.push(iface);
  }
  
  if (accessibleNetworkIPs.length === 0) {
    console.log('🚨 ROOT CAUSE: Server not accessible from ANY network interface');
    console.log('');
    console.log('🛠️ SOLUTIONS (try in order):');
    console.log('');
    console.log('1️⃣ FIREWALL ISSUE (Most Likely):');
    console.log('   - Run as Administrator: network-quick-fix.bat');
    console.log('   - OR temporarily disable Windows Firewall');
    console.log('   - OR manually add firewall rules for ports 5000,5173');
    console.log('');
    console.log('2️⃣ ANTIVIRUS BLOCKING:');
    console.log('   - Temporarily disable antivirus software');
    console.log('   - Add exceptions for Node.js and your project folder');
    console.log('');
    console.log('3️⃣ WINDOWS NETWORK PROFILE:');
    console.log('   - Make sure network is set to "Private" not "Public"');
    console.log('   - Go to Settings > Network & Internet > Status');
    console.log('');
    console.log('4️⃣ SERVER BINDING ISSUE:');
    console.log('   - Check if server is actually binding to 0.0.0.0');
    console.log('   - Restart server and look for "Server running on 0.0.0.0:5000"');
    
  } else {
    console.log('✅ Server is accessible from network!');
    console.log('');
    console.log('📱 URLs for other devices:');
    accessibleNetworkIPs.forEach(iface => {
      console.log(`   - http://${iface.address}:5173 (Frontend)`);
    });
    console.log('');
    console.log('🔍 If other devices still can\'t connect:');
    console.log('   - Check router AP Isolation settings');
    console.log('   - Ensure all devices on same WiFi network');
    console.log('   - Try pinging this computer from other device');
  }
  
  console.log('\n📞 IMMEDIATE ACTION PLAN:');
  console.log('========================');
  console.log('1. Run: network-quick-fix.bat (as Administrator)');
  console.log('2. Restart your server: npm run dev');
  console.log('3. Run this diagnostic again');
  console.log('4. If still blocked, temporarily disable Windows Firewall');
  console.log('5. Test from other device using the IP addresses above');
}

runUltimateDiagnostic().catch(console.error);
