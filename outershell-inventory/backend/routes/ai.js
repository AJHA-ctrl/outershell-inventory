const express = require('express');
const router = express.Router();

// POST generate product description
router.post('/describe', async (req, res) => {
  try {
    const { name, category, notes } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Product name required' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Write a short punchy product description for OuterShell, a trendy Indian streetwear brand.
Product: "${name}"
Category: ${category || 'Clothing'}
Notes: ${notes || 'none'}
Keep it 2-3 sentences, youthful tone, no hashtags.`
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || 'Could not generate description.';
    res.json({ success: true, description: text });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST generate full marketing copy
router.post('/marketing', async (req, res) => {
  try {
    const { name, category, notes } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Product name required' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are a copywriter for OuterShell, a trendy Indian streetwear brand.
Generate:
1. Product Description (2-3 sentences, youthful tone)
2. Instagram Caption (punchy, with emojis)
3. WhatsApp Marketing Message (short, direct)

Product: "${name}"
Category: ${category || 'Clothing'}
Notes: ${notes || 'none'}

Format with clear labels.`
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || 'Could not generate.';
    res.json({ success: true, content: text });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST inventory insights
router.post('/insights', async (req, res) => {
  try {
    const { products, orders } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are an inventory analyst for OuterShell clothing store.
Based on this data, give 3 short actionable insights:

Products Summary: ${JSON.stringify(products?.slice(0, 10))}
Recent Orders: ${JSON.stringify(orders?.slice(0, 5))}

Give insights in bullet points. Be specific and actionable.`
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || 'Could not generate insights.';
    res.json({ success: true, insights: text });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
