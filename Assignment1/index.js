const http = require('http');
const fs = require('fs');
const axios = require('axios');

// API URL for fetching weather data (Open-Meteo)
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true';

// 1. Fetch Weather Data (Asynchronous Operation)
// This function places the network request in the Event Loop's task queue.
// The main thread continues executing without waiting for the response.
console.log('--- Start of Script ---');

axios.get(WEATHER_API_URL)
  .then(response => {
    // This callback runs when the data is successfully fetched.
    // The Event Loop picks this up from the callback queue when the call stack is empty.
    
    const weatherData = response.data.current_weather;
    const logData = `Temperature: ${weatherData.temperature}°C, Windspeed: ${weatherData.windspeed} km/h\nTime: ${new Date().toISOString()}`;

    console.log('Weather data fetched successfully.');

    // 2. File System Operation (Non-blocking I/O)
    // We strive to use async versions of fs methods (writeFile instead of writeFileSync)
    // to prevent blocking the Event Loop.
    fs.writeFile('weather_log.txt', logData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
      // This callback runs after the file write operation is complete.
      console.log('Weather data saved to weather_log.txt');
    });

  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  });

// 3. Create HTTP Server
// The server listens for incoming requests. This is also an event-based mechanism.
const server = http.createServer((req, res) => {
  // This callback is triggered whenever a request hits the server.
  
  // Asynchronously read the file to serve its content
  fs.readFile('weather_log.txt', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error reading weather data. Please try again later.');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Current Weather in Berlin:\n\n${data}`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Note: The server is listening for events (requests) and does not block the rest of the script (if there were more code below).');
});

console.log('--- End of Script (Main Thread) ---');
console.log('Notice how this log appears BEFORE weather data is fetched or saved due to non-blocking I/O.');
