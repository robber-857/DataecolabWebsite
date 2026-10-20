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
    const expected = ['Discover and register.', 'Assess and authorise.', 'Operate and evolve.', 'Retire responsibly.'];
    const samples = await page.locator('.type-line').evaluate(async el => {
      const values = [];
      for (let i = 0; i < 45; i++) {
        values.push({ text: [...el.querySelectorAll('.lifecycle-type')].map(node => node.querySelector('[aria-hidden="true"]').textContent.replace(/\u200B/g, '')), height: el.getBoundingClientRect().height });
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return values;
    });
    check('All four phrases grow without deletion ' + width, samples.every((s, i) => s.text.every((text, j) => !i || text.length >= samples[i - 1].text[j].length)) && samples.some(s => s.text.some((text, j) => text.length > 0 && text.length < expected[j].length)), samples);
    check('All four completed phrases remain ' + width, JSON.stringify(samples.at(-1).text) === JSON.stringify(expected));
    const firstAppearance = expected.map((_, j) => samples.findIndex(s => s.text[j].length > 0));
    check('Phrases appear sequentially ' + width, firstAppearance.every((n, j) => !j || n > firstAppearance[j - 1]));
    check('Reserved layout does not shift ' + width, new Set(samples.map(s => s.height)).size === 1);
    check('Typed text fits reserved space ' + width, await page.locator('.type-copy').evaluateAll(nodes => nodes.every(node => { const box = node.getBoundingClientRect(); return [...node.querySelectorAll('.lifecycle-type > [aria-hidden="true"] span')].every(char => { const b = char.getBoundingClientRect(); return b.bottom <= box.bottom + 1 && b.right <= box.right + 1; }); })));
    check('No cursor is rendered ' + width, await page.locator('.lifecycle-type > [aria-hidden="true"]').count() === 4);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.locator('.type-line').scrollIntoViewIfNeeded();
    check('Scrolling preserves all phrases ' + width, await page.locator('.lifecycle-type').evaluateAll((nodes, expected) => nodes.every((node, i) => node.querySelector('[aria-hidden="true"]').textContent.replace(/\u200B/g, '') === expected[i]), expected));
    await page.locator('.type-line').screenshot({ path: `output/playwright/lifecycle-retained-${width}.png` });
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
  check('Reduced motion displays all four phrases', await page.locator('.lifecycle-type').allTextContents().then(values => values.join(' ') === 'Discover and register. Assess and authorise. Operate and evolve. Retire responsibly.'));
  check('Reduced motion keeps video static', await page.locator('video').evaluate(el => el.paused && !el.getAttribute('src')));
  for (const path of ['/', '/about-us', '/contact-us']) {
    await page.goto('http://127.0.0.1:4173' + path);
    check('No ABN in company content ' + path, !/ABN|59 664 039 294/.test(await page.locator('body').innerText()));
  }
  return results;
}
