require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const authRoutes = require('./routes/auth');
const linkRoutes = require('./routes/links');
const Link = require('./models/Link');
const Click = require('./models/Click');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

// Redirect route - redirect and track clicks
app.get('/:shortId', async (req, res) => {
  try {
    const link = await Link.findOne({ shortId: req.params.shortId });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return res.status(410).json({ message: 'Link has expired' });
    }

    // Redirect immediately
    res.redirect(302, link.originalUrl);

    // Track click asynchronously (after redirect, don't await)
    (async () => {
      try {
        // Increment clicks
        link.clicks += 1;
        await link.save();

        // Get IP
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        // Get geolocation
        const geo = geoip.lookup(ip);

        // Parse user agent
        const parser = new UAParser(req.headers['user-agent']);
        const browser = parser.getBrowser().name || 'Unknown';
        const deviceType = parser.getDevice().type || 'Desktop';

        // Get referrer
        const referrer = req.headers['referer'] || 'Direct';

        // Save click
        const click = new Click({
          linkId: link._id,
          device: deviceType,
          browser,
          country: geo?.country || 'Unknown',
          city: geo?.city || 'Unknown',
          referrer
        });

        await click.save();
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    })();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
