const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log("Starting browser...");
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  
  const categories = ['ui-ux', 'branding', 'illustration', 'packaging', 'graphic-design'];
  const results = [];
  
  for (const cat of categories) {
    console.log(`Scraping category: ${cat}`);
    try {
      await page.goto(`https://www.behance.net/search/projects?search=${cat}`, { waitUntil: 'networkidle2', timeout: 60000 });
      for (let i = 0; i < 6; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
        await new Promise(r => setTimeout(r, 2000));
      }
      
      const items = await page.evaluate((category) => {
        const nodes = document.querySelectorAll('img');
        const data = [];
        nodes.forEach(node => {
          const img = node.getAttribute('src');
          if (img && (img.includes('mir-s3-cdn-cf.behance.net/project_modules/') || img.includes('mir-s3-cdn-cf.behance.net/projects/'))) {
            const title = node.getAttribute('alt') || (category.toUpperCase() + ' Project');
            if (title.length > 5 && !data.find(d => d.imageUrl === img)) {
              data.push({
                title: title,
                imageUrl: img,
                category: category,
                description: `A professional ${category} design project.`
              });
            }
          }
        });
        return data;
      }, cat);
      
      console.log(`Got ${items.length} from ${cat}`);
      results.push(...items);
    } catch (e) {
      console.error("Error scraping", cat, e.message);
    }
  }
  
  // Deduplicate and pad if needed
  const unique = [];
  for (const item of results) {
    if (!unique.find(u => u.imageUrl === item.imageUrl)) unique.push(item);
  }
  
  console.log(`Total unique collected: ${unique.length}`);
  fs.writeFileSync('behance_data.json', JSON.stringify(unique, null, 2));
  await browser.close();
  console.log("Done.");
})();
