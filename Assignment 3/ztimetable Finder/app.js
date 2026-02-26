const express = require('express');
const path = require('path');

const { handleSearch, handleUpload } = require('./controllers/timetableController.js');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url}`);
  next();
});

app.get('/search', async (req, res) => {
  const q = String(req.query.q || '');
  const result = await handleSearch(q);
  res.status(result.ok ? 200 : 400).json(result);
});

app.post('/upload', async (req, res) => {
  const file = { name: req.body?.name, size: req.body?.size || 0 };
  const result = await handleUpload(file);
  res.status(result.ok ? 200 : 400).json(result);
});

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
