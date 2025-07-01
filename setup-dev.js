import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Starting RecipeShare Development Environment...\n');

async function runCommand(command, cwd = __dirname) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Running: ${command}`);
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`⚠️  Warning: ${stderr}`);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

async function startDevelopment() {
  try {
    // 1. Install dependencies
    console.log('📦 Installing dependencies...');
    await runCommand('npm install');
    
    // 2. Seed challenge data
    console.log('\n🌱 Seeding challenge data...');
    await runCommand('node seeds/seedChallenges.js', path.join(__dirname, 'server'));
    
    // 3. Start development servers concurrently
    console.log('\n🎯 Starting development servers concurrently...');
    console.log('   - Backend Server (nodemon server/index.js)');
    console.log('   - Frontend Dev Server (vite)');
    console.log('\n💡 Press Ctrl+C to stop all servers\n');
    
    // Start both servers using concurrently
    const devProcess = spawn('npm', ['run', 'dev'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });
    
    devProcess.on('close', (code) => {
      console.log(`\n🛑 Development servers stopped with code ${code}`);
    });
    
    devProcess.on('error', (err) => {
      console.error(`❌ Failed to start development servers: ${err}`);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping development servers...');
      devProcess.kill('SIGINT');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Setup failed: ${error.message}`);
    process.exit(1);
  }
}

startDevelopment();
