// Simple environment validation for production startup
const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter((k) => !process.env[k]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  console.error('Please set these before starting the server.');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are present');
  process.exit(0);
}
