// Load the http module to create an HTTP server
const http = require('http');
const url = require('url');

// Define the port where the server will listen
const port = 3000;

// Sample quotes for the /quote endpoint
const quotes = [
  "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
  "Do not watch the clock. Do what it does. Keep going. - Sam Levenson",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis"
];

// Create an HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); // Parse the URL and query parameters
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Set the response header
  res.setHeader('Content-Type', 'application/json');

  // Root route (/)
  if (path === '/') {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'Welcome to our API!' }));
  }
  // /quote - Returns a random quote
  else if (path === '/quote') {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    res.statusCode = 200;
    res.end(JSON.stringify({ quote: randomQuote }));
  }
  // /math/add?x=5&y=3 - Adds two query parameters x and y
  else if (path === '/math/add') {
    const x = parseFloat(query.x);
    const y = parseFloat(query.y);

    if (isNaN(x) || isNaN(y)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid query parameters. Please provide x and y as numbers.' }));
    } else {
      const sum = x + y;
      res.statusCode = 200;
      res.end(JSON.stringify({ x, y, sum }));
    }
  }
  // Fallback for unknown routes
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
