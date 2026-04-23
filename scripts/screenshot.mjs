import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const OUT = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });

// Above-the-fold viewport screenshots for README.
// Fullpage variants saved in /full for deeper review.
const targets = [
  { name: 'home',                url: '/',                        mobile: false, height: 1000 },
  { name: 'home-mobile',         url: '/',                        mobile: true,  height: 900 },
  { name: 'servicios',           url: '/servicios',               mobile: false, height: 1000, scrollY: 600 },
  { name: 'servicios-gas',       url: '/servicios/gas',           mobile: false, height: 1000 },
  { name: 'servicios-gas-tigre', url: '/servicios/gas/tigre',     mobile: false, height: 1000 },
  { name: 'zonas',               url: '/zonas',                   mobile: false, height: 1000 },
  { name: 'contacto',            url: '/contacto',                mobile: false, height: 1000 },
];

const BASE = 'http://localhost:4321';

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});

for (const t of targets) {
  const page = await browser.newPage();
  if (t.mobile) {
    await page.setViewport({ width: 414, height: t.height || 1600, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1');
  } else {
    await page.setViewport({ width: 1440, height: t.height || 1000, deviceScaleFactor: 1 });
  }
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(BASE + t.url, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(async (scrollY) => {
    document.querySelectorAll('.reveal, .reveal-stagger > *').forEach((el) => {
      el.classList.add('is-visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('[data-split="words"] *, [data-split="chars"] *').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    if (scrollY) window.scrollTo({ top: scrollY, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 500));
  }, t.scrollY || 0);
  await new Promise((r) => setTimeout(r, 800));
  const path = `${OUT}/${t.name}.png`;
  await page.screenshot({ path, fullPage: false, type: 'png' });
  console.log('captured', t.name);
  await page.close();
}

await browser.close();
