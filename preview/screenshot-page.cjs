const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const lang of ['en', 'zh']) {
    const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
    await page.goto('file://' + path.join(__dirname, `preview.${lang}.html`));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(__dirname, `full-readme-${lang}.png`), fullPage: true });
    await page.close();
  }
  await browser.close();
  console.log('done');
})();
