const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Log all console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    } else {
      console.log('BROWSER LOG:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
  });

  console.log("Navigating to frontend people page...");
  await page.goto('http://localhost:5173/#/people', { waitUntil: 'networkidle2' });
  
  console.log("Waiting for cards...");
  await new Promise(r => setTimeout(r, 3000));
  
  await page.evaluate(async () => {
    // Try to find the h3 with student name
    const h3s = Array.from(document.querySelectorAll('h3'));
    if (h3s.length > 0) {
      console.log("Found student:", h3s[0].textContent);
      h3s[0].click();
    } else {
      console.log("Student not found");
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(async () => {
    const btns = Array.from(document.querySelectorAll('button'));
    const viewBtn = btns.find(b => b.textContent.includes('View Profile'));
    if (viewBtn) {
      console.log("Found View Profile button, clicking...");
      viewBtn.click();
    } else {
      console.log("View profile button not found");
    }
  });
  
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
