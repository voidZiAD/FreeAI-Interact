const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
app.use(bodyParser.json());

let browserPromise = puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

app.post('/chat', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'No question provided' });
  }
  
  try {
    const browser = await browserPromise;
    const page = await browser.newPage();
    await page.goto('about:blank');
    
    // Load the puter script into the page
    await page.addScriptTag({ url: 'https://js.puter.com/v2/' });
    
    // Evaluate the chat call in the headless browser context
    const aiResponse = await page.evaluate(async (q) => {
      const response = await puter.ai.chat(q);
      return response;
    }, question);
    
    await page.close();
    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
