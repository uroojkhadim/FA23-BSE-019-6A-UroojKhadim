# 📊 Crypto Price Logger & Web Viewer

A beginner-friendly Node.js application that demonstrates fundamental concepts including **Event Loop**, **Non-Blocking I/O**, **Core Modules** (fs, http), and **NPM** package management.

## 🎯 Learning Objectives

This project teaches:
- ✅ **Node.js Architecture**: Understanding the Event Loop and how it handles asynchronous operations
- ✅ **Non-Blocking I/O**: How Node.js performs I/O operations without blocking the main thread
- ✅ **Core Modules**: Using built-in `fs` (file system) and `http` modules
- ✅ **NPM**: Package management with `package.json` and third-party modules like `axios`
- ✅ **Async Programming**: Working with Promises and async/await syntax

## 📋 Project Requirements Met

### ✅ Project Setup
- Initialized Node.js project with `package.json`
- Explained the purpose of `package.json` (manages dependencies, scripts, and project metadata)

### ✅ NPM Dependency
- Installed `axios` package for HTTP requests
- Listed in `package.json` under dependencies

### ✅ Asynchronous API Request
- Fetches Bitcoin price from CoinGecko API using `axios`
- Implemented with `async/await` syntax
- Includes detailed comments explaining Event Loop behavior

### ✅ File System Integration
- Uses `fs.appendFile()` to log prices with timestamps
- Asynchronous file operations (non-blocking)
- Comments explain how the Event Loop handles file I/O

### ✅ HTTP Server
- Creates server on `http://localhost:3000` using `http` module
- Reads and displays `crypto_log.txt` as plain text
- Uses `fs.readFile()` asynchronously
- Comments explain how Node.js handles concurrent requests

## 🎮 How to Run

### Start the application:
```bash
npm start
```
or
```bash
node index.js
```

### What happens:
1. ✅ HTTP server starts on port 3000
2. ✅ Bitcoin price is fetched immediately from CoinGecko API
3. ✅ Price is logged to `crypto_log.txt` with timestamp
4. ✅ Price updates automatically every 5 minutes
5. ✅ Visit `http://localhost:3000` to view all logged data as plain text

## 📁 Project Structure

```
Crypto Price Logger/
│
├── index.js              # Main application file
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Dependency lock file (auto-generated)
├── crypto_log.txt        # Price log file (created automatically)
└── node_modules/         # Installed dependencies (auto-generated)
```

## 🧠 Key Concepts Explained

### 1️⃣ **package.json Purpose**
The `package.json` file is the manifest for your Node.js project. It contains:
- **Project metadata**: name, version, description, author
- **Dependencies**: third-party packages your project needs
- **Scripts**: commands you can run with `npm run <script>`
- **Configuration**: entry point, license, keywords, etc.

### 2️⃣ **Event Loop & Asynchronous Operations**

When you make an API request with `axios`:
```javascript
const response = await axios.get(API_URL);
```

**What happens:**
1. Node.js initiates the HTTP request
2. The operation is delegated to the system (libuv)
3. **Main thread continues executing** (non-blocking!)
4. When response arrives, callback is queued in Event Loop
5. Event Loop processes the callback when the call stack is empty

**Result**: Your application can handle other tasks while waiting for the API response!

### 3️⃣ **Non-Blocking File I/O**

When writing to a file:
```javascript
fs.appendFile(LOG_FILE, logEntry, (err) => {
  // Callback executed when write completes
});
```

**What happens:**
1. File write operation is initiated
2. Operation is sent to the thread pool
3. **Main thread continues** without waiting
4. When write completes, callback is queued
5. Event Loop executes the callback

**Result**: The server can handle requests while file operations are in progress!

### 4️⃣ **HTTP Server & Concurrent Requests**

The HTTP server can handle multiple requests simultaneously:
```javascript
http.createServer((req, res) => {
  fs.readFile(LOG_FILE, 'utf8', (err, data) => {
    // Send response as plain text
  });
});
```

**How it works:**
- Each request triggers the callback function
- File reads are non-blocking
- While one request waits for file I/O, others can be processed
- **Single-threaded** but handles thousands of concurrent connections!

### 5️⃣ **Event Loop Phases**

The Event Loop processes operations in phases:

1. **TIMERS**: `setTimeout`, `setInterval` callbacks
2. **PENDING CALLBACKS**: I/O callbacks deferred to next iteration
3. **POLL**: Retrieve new I/O events, execute I/O callbacks
4. **CHECK**: `setImmediate()` callbacks
5. **CLOSE CALLBACKS**: Close event callbacks

**In this app:**
- HTTP requests (axios) → **POLL phase**
- File operations (fs) → **POLL phase**
- Periodic updates (setInterval) → **TIMERS phase**

## 🔍 Code Walkthrough

### Main Components:

1. **`fetchBitcoinPrice()`**
   - Async function using axios
   - Fetches current Bitcoin price in USD
   - Returns formatted log entry with timestamp

2. **`saveToLogFile()`**
   - Uses `fs.appendFile()` for non-blocking writes
   - Appends price data to `crypto_log.txt`
   - Demonstrates async file operations

3. **HTTP Server**
   - Listens on port 3000
   - Reads log file asynchronously
   - Displays all logged prices as plain text
   - Demonstrates non-blocking I/O

4. **Periodic Updates**
   - `setInterval()` fetches price every 5 minutes
   - Demonstrates Event Loop's timer phase
   - Runs continuously in the background

## 📊 Expected Output

### Terminal Output:
```
╔════════════════════════════════════════════╗
║   CRYPTO PRICE LOGGER                     ║
╚════════════════════════════════════════════╝

🚀 Server running at http://localhost:3000/
📂 Log file: crypto_log.txt

─────────────────────────────────────────────

🔄 Fetching Bitcoin price from CoinGecko API...

✅ Bitcoin Price Fetched Successfully!
💰 Current Price: $66,359
🕒 Timestamp: 2/13/2026, 9:59:52 AM

⏳ File write operation initiated (non-blocking)...
📝 Price logged to crypto_log.txt
```

### Browser Output (http://localhost:3000):
Plain text listing of logged Bitcoin prices with timestamps.

### crypto_log.txt:
```
[2/13/2026, 9:54:42 AM] Bitcoin Price: $95,234
[2/13/2026, 9:59:42 AM] Bitcoin Price: $95,456
[2/13/2026, 10:04:42 AM] Bitcoin Price: $95,123
```

## 🎓 Educational Value

This project demonstrates:
- ✅ **Real-world async patterns**: API calls, file I/O, server requests
- ✅ **Event Loop mechanics**: How Node.js handles concurrency
- ✅ **Non-blocking architecture**: Why Node.js is efficient
- ✅ **Core module usage**: `fs` and `http` in practice
- ✅ **NPM ecosystem**: Installing and using third-party packages
- ✅ **Best practices**: Error handling, code comments, project structure

## 🛠️ Customization Ideas

- Change the cryptocurrency (e.g., Ethereum, Litecoin)
- Adjust update frequency (currently 5 minutes)
- Add more data points (market cap, volume, etc.)
- Implement data visualization with charts
- Add database integration instead of text file
- Create a REST API for the logged data

## 📚 Additional Resources

- [Node.js Event Loop Documentation](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [CoinGecko API Documentation](https://www.coingecko.com/en/api)
- [Axios Documentation](https://axios-http.com/)
- [Node.js fs Module](https://nodejs.org/api/fs.html)
- [Node.js http Module](https://nodejs.org/api/http.html)

## 📝 License

ISC

## 👨‍💻 Author

FA23-BSE-019

---

**Happy Learning! 🚀**
