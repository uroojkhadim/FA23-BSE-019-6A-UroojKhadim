const { exec } = require('child_process');
const fs = require('fs');

console.log('Node.js MySQL CRUD Application - Project Verification');
console.log('=====================================================');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'server.js', 
  'db_setup.js',
  '.env',
  'public/index.html'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✓ ${file} - Found`);
  } else {
    console.log(`✗ ${file} - Missing`);
    allFilesExist = false;
  }
}

console.log('\nProject Structure:');
console.log('------------------');
exec('dir /s', (error, stdout) => {
  if (error) {
    console.error(`Error executing dir command: ${error.message}`);
    return;
  }
  
  console.log(stdout);
  
  if (allFilesExist) {
    console.log('\n🎉 Project setup is complete!');
    console.log('\nTo run the application:');
    console.log('1. Make sure MySQL server is running');
    console.log('2. Run: npm run setup-db (to create database and tables)');
    console.log('3. Run: npm start (to start the server)');
    console.log('4. Open http://localhost:3000 in your browser');
  } else {
    console.log('\n❌ Some files are missing. Please check the project setup.');
  }
});