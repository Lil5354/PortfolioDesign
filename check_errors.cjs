const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
    page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));
    
    await page.goto('http://localhost:5173/');
    
    await page.evaluate(() => {
      localStorage.setItem('token', 'fake_token');
      localStorage.setItem('auth_user', JSON.stringify({ email: "test@uef.edu.vn" }));
    });
    
    await page.reload({ waitUntil: 'networkidle0' });
    
    await browser.close();
  } catch(e) {
    console.error('Puppeteer failed:', e);
  }
})();
