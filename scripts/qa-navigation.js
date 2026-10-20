async (page) => {
  const results = [];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const check = (name, pass, detail = '') => { results.push({ name, pass, detail }); if (!pass) throw new Error(JSON.stringify(results)); };
  const base = 'http://127.0.0.1:4173';
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base);
  const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
  check('Seven desktop menu entries', await nav.locator(':scope > a, :scope > details').count() === 7);
  await page.screenshot({ path: 'output/playwright/navigation-desktop-1440.png' });
  const summary = nav.locator('summary');
  await summary.focus(); await page.keyboard.press('Enter');
  check('Keyboard opens collaboration dropdown with four destinations', await nav.locator('.work-dropdown-panel a:visible').count() === 4);
  await page.screenshot({ path: 'output/playwright/navigation-dropdown.png' });
  await page.keyboard.press('Escape');
  check('Escape closes dropdown and restores focus', !await nav.locator('details').evaluate(node => node.open) && await summary.evaluate(node => document.activeElement === node));
  await nav.getByRole('link', { name: 'Services', exact: true }).click();
  await page.waitForURL('**/services');
  check('Menu opens independent Services page', await page.locator('h1').innerText() === 'From understanding to enterprise practice.');
  check('Current page is identified', await nav.getByRole('link', { name: 'Services', exact: true }).getAttribute('aria-current') === 'page');
  await page.screenshot({ path: 'output/playwright/services-desktop.png', fullPage: true });
  await page.goBack(); await page.waitForURL(base + '/');
  check('Browser back returns home', await page.locator('h1').getAttribute('aria-label') === 'Intelligent agents. Managed with confidence.' || (await page.locator('h1').innerText()).includes('Intelligent'));
  await page.getByRole('button', { name: 'Search this site', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Find your perspective.' });
  check('Search indexes all eleven pages', await dialog.getByRole('link').count() === 11);
  await dialog.getByRole('searchbox').fill('workshops');
  check('Search finds the workshop page', await dialog.getByRole('link').filter({ hasText: 'Workshops & Forums' }).count() === 1);
  await dialog.getByRole('searchbox').fill('zzzz-no-match');
  check('Search empty state', (await dialog.innerText()).includes('No matching pages'));
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  check('Search Escape restores trigger focus', await page.getByRole('button', { name: 'Search this site', exact: true }).evaluate(node => node === document.activeElement));
  const paths = ['/vision', '/services', '/toolsplatforms', '/resources', '/working-with-us', '/about-us', '/working-with-us/joining-rd-project', '/working-with-us/partners-clients', '/working-with-us/workshops-forums', '/contact-us'];
  for (const path of paths) {
    const response = await page.goto(base + path);
    await page.locator('h1').waitFor();
    const heading = await page.locator('h1').innerText();
    check('Direct URL ' + path, response.status() === 200 && heading !== 'Let’s find your way.' && await page.locator('.page-chapter').count() >= 2, heading);
    await page.reload();
    check('Refresh ' + path, await page.locator('h1').innerText() === heading);
  }
  await page.goto(base + '/home/');
  check('Original /home alias', await page.locator('.hero-copy').count() === 1);
  await page.goto(base + '/working-with-us/joining-rd-project/');
  check('Nested trailing slash route', await page.locator('h1').innerText() === 'Explore a research collaboration.');
  await page.goto(base + '/unknown-page');
  check('Unknown path has recovery', await page.getByRole('link', { name: 'Return home', exact: false }).isVisible());
  for (const width of [320, 390, 768, 1024, 1190, 1280, 1440]) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 900 });
    for (const path of ['/', '/toolsplatforms']) {
      await page.goto(base + path); await page.locator('h1').waitFor();
      check('No horizontal overflow ' + width + path, await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
      const fits = await page.locator('.site-nav').evaluate(node => {
        const children = [...node.children].filter(child => getComputedStyle(child).display !== 'none' && !child.hasAttribute('hidden'));
        const boxes = children.map(child => child.getBoundingClientRect());
        return boxes.every((box, i) => box.left >= 0 && box.right <= innerWidth && (i === 0 || boxes[i - 1].right <= box.left + 1));
      });
      check('Header content fits ' + width + path, fits);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto(base);
  await page.getByRole('button', { name: 'Menu', exact: false }).click();
  const mobile = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
  check('Mobile includes all eleven destinations', await mobile.getByRole('link').count() === 11);
  await page.screenshot({ path: 'output/playwright/navigation-mobile-390.png' });
  await mobile.getByRole('link', { name: 'Workshops & Forums', exact: true }).click();
  await page.waitForURL('**/working-with-us/workshops-forums');
  check('Mobile submenu navigates', await page.locator('h1').innerText() === 'Make room for a deeper conversation.');
  await page.screenshot({ path: 'output/playwright/workshops-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Menu', exact: false }).click(); await page.keyboard.press('Escape');
  check('Mobile Escape closes and restores focus', !await mobile.isVisible() && await page.getByRole('button', { name: 'Menu', exact: false }).evaluate(node => node === document.activeElement));
  await page.getByRole('button', { name: 'Search this site', exact: true }).click();
  await dialog.getByRole('searchbox').fill('ALMOps');
  check('Mobile search fits viewport', (await dialog.boundingBox()).width <= 390);
  await dialog.getByRole('link').filter({ hasText: 'Tools/Platforms' }).click(); await page.waitForURL('**/toolsplatforms');
  check('Search result opens page', await page.locator('h1').innerText() === 'Methodology, made operational.');
  check('No application errors', errors.length === 0, errors);
  await page.setViewportSize({ width: 1440, height: 900 }); await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.goto(base);
  return results;
}
