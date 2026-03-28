const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const file = 'file:///' + path.resolve('cv/cv_davit_salibekovi.html').replace(/\\/g, '/');
  await page.goto(file, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: 'cv/cv_davit_salibekovi.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  await browser.close();
  console.log('Done');
})();
