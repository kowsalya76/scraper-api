# Puppeteer Scraper API

A **Node.js + Puppeteer** API for extracting data from websites.  
Built to run on **Railway**, it allows you to send a URL and receive the scraped content as JSON.  
The API is secured using an **x-api-key** header to prevent unauthorized access.

---

## How It Works
1. You send a request to the `/scrape` endpoint with:
   - A target `url` (query parameter)
   - Your API key in the `x-api-key` header
2. Puppeteer launches a **headless Chrome** browser on the server.
3. The browser navigates to the given website URL.
4. It extracts specific data (like title, headings, or custom selectors) from the page.
5. The API responds with the extracted content in JSON format.

---
## Technologies Used
* Node.js – Backend server runtime
* Express.js – API routing
* Puppeteer-core – Headless browser automation
* Google Chrome (system-installed) – Required for Puppeteer-core
* dotenv – Local environment variable management
## Run Locally
```bash
# Clone the repo
git clone https://github.com/kowsalya76/puppeteer-scraper.git
cd puppeteer-scraper

# Install dependencies
npm install

# Create .env file
echo "PORT=3000" >> .env
echo "API_KEY=your_secret_key" >> .env

# Start the API
node scraper.js<br>
```
## Environment Variables
You need to create a .env file in the root folder and add:
```
API_KEY=your_secret_api_key
PORT=3000
```
API_KEY: The secret key required to access the API.<br>
PORT: Port for running the API locally (default is 3000).<br>
When deployed on Railway, set these variables in the Railway Dashboard → Variables section instead of using .env.
## API Usage
Endpoint:
```
GET /scrape?url=<target_website><br>
```
**Headers:**
x-api-key: your_secret_key<br>
**Example Request:**
```
curl -H "x-api-key: mySuperSecretKey123" \
  "http://localhost:3000/scrape?url=https://example.com"
```
  
**Example Response:**
```
{
  "title": "Example Domain",
  "description": "This domain is for use in illustrative examples..."
}
```
## Deployment
This project is preconfigured for Railway:
1. Push your code to GitHub.
2. Create a new Railway project → connect your repo.
3. Set environment variable API_KEY in Railway → Variables.
4. Railway will build and start the server automatically.
   
**Example Live Endpoint:**
```
https://puppeteer-scraper-production-05c6.up.railway.app/scrape?url=https://example.com
```
## Customization
+ Open scraper.js and modify the selectors inside page.evaluate() to scrape the exact data you want.
+ Add new routes for scraping different types of websites.
+ Adjust Puppeteer launch options if deploying to platforms other than Railway.




