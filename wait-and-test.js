#!/usr/bin/env node

// Wait for server to be ready and then run connectivity test
async function waitAndTest() {
  console.log('⏳ Waiting for server to be ready...');
  
  // Wait 3 seconds for server to fully start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('🚀 Starting connectivity test...\n');
  
  // Import and run the test
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);
  
  try {
    const { stdout, stderr } = await execAsync('node test-server-connectivity.js');
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error('Test execution error:', error.message);
  }
}

waitAndTest();
