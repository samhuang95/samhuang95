const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const path = require('path');

const files = ['tags', 'timeline', 'activity'];
const langs = ['en', 'zh'];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const f of files) {
    for (const lang of langs) {
      const page = await browser.newPage({ backgroundColor: '#ffffff' });
      const svgPath = path.join(__dirname, `${f}-${lang}.svg`);
      await page.goto('file://' + svgPath);
      const el = await page.$('svg');
      await el.screenshot({ path: path.join(__dirname, `${f}-${lang}.png`) });
      await page.close();
    }
  }
  await browser.close();
  console.log('done');
})();
