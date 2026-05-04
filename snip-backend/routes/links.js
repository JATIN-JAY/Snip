const express = require('express');
const Link = require('../models/Link');
const Click = require('../models/Click');
const { nanoid } = require('nanoid');
const QRCode = require('qrcode');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET / - Get all links for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const links = await Link.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ links });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /shorten - Create shortened link
router.post('/shorten', authMiddleware, async (req, res) => {
  try {
    const { title, originalUrl, customAlias, expiresAt } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: 'URL is required' });
    }

    let shortId = customAlias;

    if (customAlias) {
      // Check if custom alias exists
      const existing = await Link.findOne({ shortId: customAlias });
      if (existing) {
        return res.status(400).json({ message: 'Custom alias already taken' });
      }
    } else {
      // Generate shortId
      shortId = nanoid(6);
    }

    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(shortId);

    // Create link
    const link = new Link({
      userId: req.userId,
      title: title || 'Untitled',
      originalUrl,
      shortId,
      qrCode: qrDataUrl,
      expiresAt
    });

    await link.save();

    return res.status(200).json({
      _id: link._id,
      finalId: link.shortId,
      originalUrl: link.originalUrl,
      qrDataUrl: link.qrCode
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /analytics/:id - Get analytics for a link (BEFORE /:id route)
router.get('/analytics/:id', authMiddleware, async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.userId });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    const clicks = await Click.find({ linkId: link._id });

    return res.status(200).json({
      link: {
        title: link.title,
        originalUrl: link.originalUrl,
        shortId: link.shortId,
        clicks: link.clicks,
        createdAt: link.createdAt
      },
      clicks
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /:id - Update a link
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, originalUrl } = req.body;

    const link = await Link.findOne({ _id: req.params.id, userId: req.userId });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (title) link.title = title;
    if (originalUrl) link.originalUrl = originalUrl;

    await link.save();

    return res.status(200).json({ message: 'Link updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /:id - Delete a link
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.userId });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // Delete all clicks for this link
    await Click.deleteMany({ linkId: link._id });

    // Delete the link
    await Link.deleteOne({ _id: link._id });

    return res.status(200).json({ message: 'Link deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
