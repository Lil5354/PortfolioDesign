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

  console.log("Navigating to frontend...");
  await page.goto('http://localhost:5173/#/gallery', { waitUntil: 'networkidle2' });
  
  console.log("Waiting for cards...");
  await new Promise(r => setTimeout(r, 3000));
  
  await page.evaluate(async () => {
    // Click on any student card
    const h3s = Array.from(document.querySelectorAll('h3'));
    const studentH3 = h3s.find(h => h.textContent.includes('Phan Hoàng Dũng') || h.textContent.includes('Nguyễn Bích Hương'));
    if (studentH3) {
      console.log("Found student:", studentH3.textContent);
      studentH3.click();
    } else {
      console.log("Student not found, clicking the first card anyway...");
      // Try to find the flex grid and click the first child
      const grids = document.querySelectorAll('div');
      for(const g of grids) {
        if(g.style.gridTemplateColumns && g.style.gridTemplateColumns.includes('repeat')) {
           if(g.children.length > 0) g.children[0].click();
           break;
        }
      }
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(async () => {
    const btns = Array.from(document.querySelectorAll('button'));
    const viewBtn = btns.find(b => b.textContent.includes('View Profile'));
    if (viewBtn) {
      console.log("Found View Profile button");
      viewBtn.click();
    } else {
      console.log("View profile button not found");
    }
  });
  
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
