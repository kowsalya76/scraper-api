import express from 'express';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// Logging middleware for API key usage
function logApiKeyUsage(req, res, next) {
  if (req.headers['x-api-key']) {
    console.log(`API key used: ${req.headers['x-api-key']}`);
  }
  next();
}

// API key authentication middleware
function apiKeyAuth(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  next();
}

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' });
});

// Public welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Express Puppeteer Scraper API!' });
  });

// Protected scraper route
app.get('/scraper', logApiKeyUsage, apiKeyAuth, async (req, res) => {
  const startUrl = req.query.url;
  if (!startUrl) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    const visited = new Set();
    const queue = [startUrl];
    const results = [];
    const origin = new URL(startUrl).origin;

    while (queue.length > 0 && visited.size < 20) {
      const currentUrl = queue.shift();
      if (visited.has(currentUrl)) continue;
      try {
        await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        const html = await page.content();
        results.push({ url: currentUrl, html });
        visited.add(currentUrl);

        // Find internal links
        const links = await page.$$eval('a[href]', anchors => anchors.map(a => a.href));
        for (const link of links) {
          try {
            const linkUrl = new URL(link);
            if (linkUrl.origin === origin && !visited.has(linkUrl.href) && !queue.includes(linkUrl.href)) {
              queue.push(linkUrl.href);
            }
          } catch (e) {
            // Ignore invalid URLs
          }
        }
      } catch (err) {
        results.push({ url: currentUrl, error: err.message });
      }
    }
    await browser.close();
    res.json({ pages: results });
  } catch (error) {
    console.error('Scraper error:', error);
    res.status(500).json({ error: 'Scraper failed', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
