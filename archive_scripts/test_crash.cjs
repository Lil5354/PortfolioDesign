const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Log all console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    } else {
      // console.log('BROWSER LOG:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
  });

  console.log("Navigating to frontend...");
  await page.goto('http://localhost:5173/#/gallery', { waitUntil: 'networkidle2' });
  
  console.log("Waiting for cards...");
  await page.waitForTimeout(2000);
  
  // Try to find the student cards - clicking on "Phan Hoàng Dũng"
  // The first student card
  try {
    const cards = await page.$$('div > h3'); // Find elements with name
    let found = false;
    for (const card of cards) {
      const text = await page.evaluate(el => el.textContent, card);
      if (text === 'Phan Hoàng Dũng') {
        console.log("Found card, clicking...");
        await card.click();
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log("Card not found, clicking arbitrary point...");
      await page.mouse.click(500, 500);
    }
    
    console.log("Waiting 2s after click...");
    await page.waitForTimeout(2000);
    
    // Check if the modal opened, then click "View Profile"
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('View Profile')) {
        console.log("Found 'View Profile' button, clicking...");
        await btn.click();
        console.log("Waiting 3s for portfolio page...");
        await page.waitForTimeout(3000);
        break;
      }
    }
    
  } catch (err) {
    console.log("Script error:", err.message);
  }
  
  await browser.close();
})();
