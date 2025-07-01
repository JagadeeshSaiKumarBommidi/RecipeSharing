#!/usr/bin/env node

// Network-accessible development server for RecipeShare
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌐 RecipeShare Network Development Server');
console.log('========================================');

// Get network interfaces
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const networkIP = getNetworkIP();
console.log(`📡 Network IP: ${networkIP}`);

const app = express();
const server = createServer(app);

// Serve static files from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = 4173;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Frontend Server Started`);
  console.log(`========================`);
  console.log(`📍 Local:   http://localhost:${PORT}`);
  console.log(`📍 Network: http://${networkIP}:${PORT}`);
  console.log(`\n🔧 Backend should be running on:`);
  console.log(`📍 Local:   http://localhost:5000`);
  console.log(`📍 Network: http://${networkIP}:5000`);
  console.log(`\n📱 Access from other devices using:`);
  console.log(`🌐 Frontend: http://${networkIP}:${PORT}`);
  console.log(`🔧 Make sure backend is running on port 5000!`);
  console.log(`\n💡 Press Ctrl+C to stop`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
