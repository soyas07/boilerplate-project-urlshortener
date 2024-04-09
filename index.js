require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const shortUrls = {}; // Store short URLs in memory

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  // Check if the URL is valid by parsing it
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({ error: 'invalid url' });
  }

  // Generate a unique short URL
  const shortUrl = generateShortUrl();
  shortUrls[shortUrl] = url;
  
  res.send({
    original_url: url,
    short_url: shortUrl,
  });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;

  // Check if the short URL exists
  if (!shortUrls.hasOwnProperty(shortUrl)) {
    return res.status(404).send('Short URL not found');
  }

  // Redirect to the original URL
  res.redirect(shortUrls[shortUrl]);
})

const generateShortUrl = () => {
  return Math.random().toString(36).substr(2, 8);
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
