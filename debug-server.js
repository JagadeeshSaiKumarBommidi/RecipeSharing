import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Load environment variables
dotenv.config();

console.log('🚀 RecipeShare Server - Network Debug Mode');
console.log('==========================================');

// Get network interfaces
function getNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const results = [];
  
  Object.keys(interfaces).forEach(name => {
    interfaces[name].forEach(iface => {
      if (iface.family === 'IPv4') {
        results.push({
          name: name,
          address: iface.address,
          internal: iface.internal
        });
      }
    });
  });
  
  return results;
}

// Display network info
const networkInterfaces = getNetworkInterfaces();
console.log('\n📡 Available Network Interfaces:');
networkInterfaces.forEach((iface, index) => {
  const type = iface.internal ? '(Loopback)' : '(Network)';
  console.log(`${index + 1}. ${iface.name}: ${iface.address} ${type}`);
});

const app = express();
const server = createServer(app);

// Ultra-permissive CORS for debugging
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['*'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add request logging
app.use((req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.url} from ${clientIP}`);
  next();
});

// Simple health check
app.get('/api/health', (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  console.log(`💓 Health check from ${clientIP}`);
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    server: 'RecipeShare Debug Server',
    clientIP: clientIP,
    networkInterfaces: networkInterfaces.filter(iface => !iface.internal)
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Server is accessible!',
    timestamp: new Date().toISOString(),
    yourIP: req.ip || req.connection.remoteAddress
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RecipeShare Server is running',
    health: '/api/health',
    test: '/api/test'
  });
});

// Catch all
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableRoutes: ['/', '/api/health', '/api/test']
  });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Force bind to all interfaces

server.listen(PORT, HOST, () => {
  console.log(`\n🚀 DEBUG SERVER STARTED`);
  console.log(`=======================`);
  console.log(`Host: ${HOST}`);
  console.log(`Port: ${PORT}`);
  
  console.log(`\n📍 Access URLs:`);
  console.log(`Local: http://localhost:${PORT}/api/health`);
  
  const networkIPs = networkInterfaces.filter(iface => !iface.internal);
  if (networkIPs.length > 0) {
    console.log(`\n🌐 Network Access:`);
    networkIPs.forEach(iface => {
      console.log(`${iface.name}: http://${iface.address}:${PORT}/api/health`);
    });
  }
  
  console.log(`\n🧪 Test from other device:`);
  console.log(`1. Connect to same WiFi network`);
  console.log(`2. Open browser and go to one of the network URLs above`);
  console.log(`3. You should see server response with network info`);
  
  console.log(`\n📊 Server will log all incoming requests`);
});

export default app;
