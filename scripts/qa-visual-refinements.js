async (page) => {
  const results = [];
  const check = (name, pass, details) => {
    results.push({ name, pass, details });
    if (!pass) throw new Error(JSON.stringify(results));
  };
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('http://127.0.0.1:4173');
    await page.waitForFunction(() => document.querySelector('[data-video-status]')?.dataset.videoStatus === 'playing');
    check('No persistent film overlay ' + width, await page.locator('.video-control').evaluate(el => getComputedStyle(el).clipPath === 'inset(50%)'));
    check('No decorative arrows ' + width, !/[↗↓↑]/.test(await page.locator('body').innerText()));
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `output/playwright/refinement-hero-${width}.png` });
    await page.locator('.type-line').scrollIntoViewIfNeeded();
    const samples = await page.locator('.lifecycle-type').evaluate(async el => {
      const values = [];
      for (let i = 0; i < 45; i++) {
        values.push(el.querySelector('[aria-hidden="true"]').textContent.replace(/\u200B/g, ''));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return values;
    });
    check('Typed text grows without deletion ' + width, samples.some(s => s.length > 0 && s.length < 22) && samples.every((s, i) => !i || s.length >= samples[i - 1].length), samples);
    check('Completed phrase remains ' + width, samples.at(-1) === 'Discover and register.');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.locator('.type-line').scrollIntoViewIfNeeded();
    check('Scrolling does not restart typing ' + width, (await page.locator('.lifecycle-type > span[aria-hidden="true"]').first().innerText()).replace(/\u200B/g, '') === 'Discover and register.');
    await page.getByRole('button', { name: 'Explore the perspective', exact: true }).nth(1).click();
    check('Old website source link removed ' + width, await page.locator('.research-dialog a[href^="https://www.dataecolab.com"]').count() === 0);
    await page.locator('.original-artwork summary').click();
    const img = page.locator('.original-artwork img');
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(el => el.decode());
    check('New ecosystem illustration loads ' + width, await img.evaluate(el => el.src.endsWith('/enterprise-ecosystem.webp') && el.naturalWidth === 1672 && el.getBoundingClientRect().right <= innerWidth));
    await page.screenshot({ path: `output/playwright/refinement-research-${width}.png` });
    await page.keyboard.press('Escape');
    await page.goto('http://127.0.0.1:4173/toolsplatforms');
    const button = page.locator('.page-chapter .text-link').first();
    await button.scrollIntoViewIfNeeded();
    const base = await button.evaluate(el => {
      const style = getComputedStyle(el);
      return { border: style.borderBottomWidth, underline: style.textDecorationLine, background: style.backgroundColor };
    });
    check('CTA has no underline or bottom border ' + width, base.border === '0px' && base.underline === 'none');
    await button.hover();
    await page.waitForTimeout(300);
    check('CTA hover changes colour ' + width, await button.evaluate((el, base) => getComputedStyle(el).backgroundColor !== base, base.background));
    await page.screenshot({ path: `output/playwright/refinement-buttons-${width}.png` });
    check('No horizontal page overflow ' + width, await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:4173');
  check('Reduced motion retains static phrase', await page.locator('.type-line').innerText() === 'Discover and register.');
  check('Reduced motion keeps video static', await page.locator('video').evaluate(el => el.paused && !el.getAttribute('src')));
  return results;
}
