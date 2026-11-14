const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const outDir = '/home/dhanush/.gemini/antigravity/brain/fa9c73f2-dc71-458b-ae15-2afcba79f74b/scratch/screenshots';
fs.mkdirSync(outDir, { recursive: true });

async function run() {
  console.log('Launching Puppeteer Chrome for 3D Fitting Room...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. 3D Fitting Room
  console.log('Opening http://localhost:3000/fitting-room ...');
  await page.goto('http://localhost:3000/fitting-room', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 3000)); // wait for Three.js scene & avatar geometry
  await page.screenshot({ path: path.join(outDir, '05_fitting_room_3d.png'), fullPage: false });
  console.log('✓ 3D Virtual Fitting Room captured');

  // 2. Switch to Avatar tab and capture
  console.log('Clicking Avatar Tab...');
  try {
    const avatarButtons = await page.$$('button');
    for (const b of avatarButtons) {
      const text = await (await b.getProperty('textContent')).jsonValue();
      if (text && text.includes('Avatar')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outDir, '05_fitting_room_avatar_tab.png'), fullPage: false });
    console.log('✓ 3D Avatar tab captured');
  } catch (e) {
    console.log('Tab click skipped:', e.message);
  }

  // 3. Product Detail Page
  console.log('Opening Product Detail Page ...');
  await page.goto('http://localhost:3000/shop/nocturn-oversized-heavyweight-hoodie', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '06_product_detail.png'), fullPage: false });
  console.log('✓ Product Detail Page captured');

  // 4. Admin Dashboard
  console.log('Opening Admin Dashboard ...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '07_admin_dashboard.png'), fullPage: false });
  console.log('✓ Admin Dashboard captured');

  await browser.close();
  console.log('All detailed screenshots finished!');
}

run().catch(err => {
  console.error('Puppeteer capture error:', err);
  process.exit(1);
});
