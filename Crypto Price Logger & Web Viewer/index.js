// ============================================
// CRYPTO PRICE LOGGER & WEB VIEWER
// ============================================
// This application demonstrates Node.js fundamentals:
// 1. Event Loop & Non-Blocking I/O
// 2. Core Modules (fs, http)
// 3. NPM Package Management (axios)
// ============================================

// Import required modules
const axios = require('axios'); // Third-party module for HTTP requests
const fs = require('fs');       // Core module for file system operations
const http = require('http');   // Core module for creating HTTP server

// Configuration
const PORT = 3000;
const LOG_FILE = 'crypto_log.txt';
const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

// ============================================
// PART 1: ASYNCHRONOUS API REQUEST
// ============================================
// This function demonstrates how Node.js handles asynchronous operations
// using the Event Loop without blocking the main thread.

async function fetchBitcoinPrice() {
  try {
    console.log('🔄 Fetching Bitcoin price from CoinGecko API...\n');

    // ASYNC OPERATION: Making HTTP request using axios
    // ------------------------------------------------
    // When axios.get() is called, Node.js doesn't wait for the response.
    // Instead, it:
    // 1. Delegates the network I/O operation to the system (libuv)
    // 2. Continues executing other code (non-blocking)
    // 3. When the response arrives, the callback is added to the Event Loop queue
    // 4. The Event Loop processes the callback when the call stack is empty
    const response = await axios.get(API_URL);

    const price = response.data.bitcoin.usd;
    const timestamp = new Date().toLocaleString();

    console.log('✅ Bitcoin Price Fetched Successfully!');
    console.log(`💰 Current Price: $${price.toLocaleString()}`);
    console.log(`🕒 Timestamp: ${timestamp}\n`);

    // Return the formatted log entry
    return `[${timestamp}] Bitcoin Price: $${price.toLocaleString()}\n`;

  } catch (error) {
    console.error('❌ Error fetching Bitcoin price:', error.message);
    return null;
  }
}

// ============================================
// PART 2: FILE SYSTEM INTEGRATION
// ============================================
// This function demonstrates asynchronous file operations using the fs module.

function saveToLogFile(logEntry) {
  // ASYNC FILE OPERATION: Writing to file system
  // ---------------------------------------------
  // fs.appendFile is asynchronous and non-blocking:
  // 1. Node.js delegates the file I/O to the thread pool (libuv)
  // 2. The main thread continues executing without waiting
  // 3. When the file operation completes, the callback is queued
  // 4. The Event Loop executes the callback when ready

  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error('❌ Error writing to log file:', err.message);
    } else {
      console.log(`📝 Price logged to ${LOG_FILE}\n`);
    }
  });

  // IMPORTANT: This console.log may execute BEFORE the file is written
  // because fs.appendFile is asynchronous (non-blocking)
  console.log('⏳ File write operation initiated (non-blocking)...');
}

// ============================================
// PART 3: HTTP SERVER
// ============================================
// This demonstrates how Node.js handles multiple concurrent requests
// using non-blocking I/O and the Event Loop.

const server = http.createServer((req, res) => {
  // EVENT-DRIVEN ARCHITECTURE:
  // --------------------------
  // Each incoming HTTP request triggers this callback function.
  // Node.js can handle thousands of concurrent connections because:
  // 1. I/O operations (like reading files) are non-blocking
  // 2. The Event Loop manages all callbacks efficiently
  // 3. No thread is blocked waiting for I/O to complete

  if (req.url === '/' && req.method === 'GET') {

    // ASYNC FILE READ: Non-blocking I/O
    // ----------------------------------
    // fs.readFile doesn't block the server from handling other requests.
    // While this file is being read, the server can process other incoming requests.

    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
      if (err) {
        // If file doesn't exist or error occurs
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('CRYPTO PRICE LOGGER\n\nNo log file found yet. The application will create one on the first price fetch.\nRefresh this page after a few seconds to see the logged data.\n');
      } else {
        // Successfully read the log file - display as plain text
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('==============================================\n' +
          'CRYPTO PRICE LOGGER - LOGGED DATA\n' +
          '==============================================\n\n' +
          data +
          '\n==============================================\n' +
          'Server powered by Node.js Event Loop\n' +
          '==============================================\n');
      }
    });

  } else {
    // Handle 404 for other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Not Found');
  }
});

// ============================================
// MAIN EXECUTION FLOW
// ============================================

// Start the HTTP server
server.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   CRYPTO PRICE LOGGER & WEB VIEWER        ║');
  console.log('╚════════════════════════════════════════════╝\n');
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
  console.log(`📂 Log file: ${LOG_FILE}\n`);
  console.log('─────────────────────────────────────────────\n');
});

// Fetch and log Bitcoin price immediately on startup
(async () => {
  const logEntry = await fetchBitcoinPrice();
  if (logEntry) {
    saveToLogFile(logEntry);
  }
})();

// Set up periodic price fetching (every 5 minutes)
// This demonstrates the Event Loop's timer phase
setInterval(async () => {
  console.log('─────────────────────────────────────────────');
  console.log('⏰ Scheduled price update triggered\n');
  const logEntry = await fetchBitcoinPrice();
  if (logEntry) {
    saveToLogFile(logEntry);
  }
}, 5 * 60 * 1000); // 5 minutes in milliseconds

// ============================================
// EVENT LOOP EXPLANATION
// ============================================
// The Node.js Event Loop processes operations in phases:
//
// 1. TIMERS: Executes callbacks scheduled by setTimeout/setInterval
// 2. PENDING CALLBACKS: Executes I/O callbacks deferred to next iteration
// 3. IDLE, PREPARE: Internal use only
// 4. POLL: Retrieves new I/O events; executes I/O callbacks
// 5. CHECK: Executes setImmediate() callbacks
// 6. CLOSE CALLBACKS: Executes close event callbacks
//
// In this application:
// - HTTP requests (axios) are handled in the POLL phase
// - File operations (fs) callbacks are executed in the POLL phase
// - Server request handlers are triggered in the POLL phase
// - setInterval timer is processed in the TIMERS phase
//
// All these operations are NON-BLOCKING, allowing Node.js to handle
// multiple operations concurrently on a single thread!
// ============================================
