async (page) => {
  const results = [];
  const assert = (name, pass, details = '') => { results.push({ name, pass, details }); if (!pass) throw new Error(name + ': ' + details); };
  const status = () => page.locator('[data-video-status]').getAttribute('data-video-status');
  const settle = () => page.waitForTimeout(750);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173');
  await page.waitForFunction(() => document.querySelector('[data-video-status]')?.dataset.videoStatus === 'playing');
  assert('Desktop HLS playback', await page.locator('[data-video-source]').getAttribute('data-video-source') === 'hls');
  assert('8 second HD video decoded', await page.locator('video').evaluate(v => v.duration === 8 && v.videoWidth === 1920 && v.readyState >= 3));
  const frames = [];
  for (let i = 0; i < 20; i++) { frames.push(await page.locator('video').evaluate(v => v.currentTime)); await page.waitForTimeout(500); }
  assert('Video advances and loops', frames.some((n, i) => i > 0 && n < frames[i - 1]) && new Set(frames.map(n => n.toFixed(1))).size > 15, JSON.stringify(frames));
  await page.getByRole('button', { name: 'Pause background video', exact: true }).focus(); await page.keyboard.press('Enter');
  const paused = await page.locator('video').evaluate(v => v.currentTime);
  await page.waitForTimeout(500);
  assert('User pause holds', await page.locator('video').evaluate((v, time) => v.paused && Math.abs(v.currentTime - time) < 0.1, paused) && await status() === 'paused', String(paused));
  for (const time of [0.1, 2, 3.2, 4.8, 6.6, 7.95]) {
    await page.locator('video').evaluate((v, t) => { v.currentTime = t; }, time);
    await page.waitForTimeout(200);
    await page.screenshot({ path: `output/playwright/desktop-film-${time}.png` });
  }
  await page.getByRole('button', { name: 'Play background video', exact: true }).focus(); await page.keyboard.press('Enter');
  await page.waitForFunction(() => !document.querySelector('video').paused);
  await page.getByRole('link', { name: 'Explore ALMOps', exact: true }).click();
  await settle();
  assert('Offscreen video pauses', await page.locator('video').evaluate(v => v.paused));
  await page.waitForFunction(() => [...document.querySelectorAll('.shard')].every(n => Number(getComputedStyle(n).opacity) > 0.99));
  const shards = await page.locator('.shard').evaluateAll(nodes => nodes.map(n => ({ opacity: getComputedStyle(n).opacity, clip: getComputedStyle(n).clipPath })));
  assert('Heading polygon shards assemble', shards.length === 'AgentGovernanceandManagement'.length * 6 && shards.every(s => Number(s.opacity) > 0.99 && s.clip.startsWith('polygon')));
  await page.getByRole('button', { name: 'Agent Governance and Management — replay fragment animation', exact: true }).click();
  const broken = await page.locator('.shard').evaluateAll(nodes => nodes.some(n => getComputedStyle(n).transform !== 'none'));
  assert('Shards visibly move on interaction', broken);
  await settle();
  await page.screenshot({ path: 'output/playwright/desktop-almops.png' });
  const stageTabs = page.getByRole('tablist', { name: 'Agent lifecycle stages', exact: true }).getByRole('tab');
  const expected = ['Start with a clear view.', 'Understand the context.', 'Make accountability explicit.', 'Keep oversight in practice.', 'Treat change as a decision.', 'Close the lifecycle with care.'];
  for (let i = 0; i < 6; i++) {
    await stageTabs.nth(i).click(); await page.waitForTimeout(400);
    assert(`Lifecycle stage ${i + 1}`, await page.locator('#stage-panel h3').innerText() === expected[i]);
  }
  await stageTabs.first().click(); await page.keyboard.press('ArrowRight');
  assert('Lifecycle keyboard arrows', await stageTabs.nth(1).getAttribute('aria-selected') === 'true' && await stageTabs.nth(1).evaluate(el => el === document.activeElement));
  await page.keyboard.press('End');
  assert('Lifecycle keyboard End', await stageTabs.last().getAttribute('aria-selected') === 'true');
  const typeLine = page.locator('.type-line');
  const heights = new Set(); const typed = new Set();
  for (let i = 0; i < 85; i++) {
    heights.add(Math.round((await typeLine.boundingBox()).height));
    const text = await typeLine.locator('.lifecycle-type > span[aria-hidden="true"]').allTextContents().then(parts => parts.join(' '));
    for (const phrase of ['Discover and register.', 'Assess and authorise.', 'Operate and evolve.', 'Retire responsibly.']) if (text.includes(phrase)) typed.add(phrase);
    await page.waitForTimeout(250);
  }
  assert('All four Text Type phrases', typed.size === 4, JSON.stringify([...typed]));
  assert('Text Type reserves constant height', heights.size === 1, JSON.stringify([...heights]));
  await page.locator('#ecosystem').scrollIntoViewIfNeeded(); await settle();
  const lensTabs = page.getByRole('tablist', { name: 'Enterprise ecosystem perspectives', exact: true }).getByRole('tab');
  for (let i = 0; i < 3; i++) {
    await lensTabs.nth(i).click(); await settle();
    assert(`Ecosystem perspective ${i + 1}`, await lensTabs.nth(i).getAttribute('aria-selected') === 'true' && (await page.locator('.ecosystem-image').last().getAttribute('src')).includes(['architecture', 'glass', 'porcelain'][i]));
  }
  await lensTabs.first().click(); await settle();
  await page.screenshot({ path: 'output/playwright/desktop-ecosystem.png' });
  await page.locator('#research').scrollIntoViewIfNeeded(); await settle();
  await page.screenshot({ path: 'output/playwright/desktop-research.png' });
  const researchButtons = page.getByRole('button', { name: 'Explore the perspective', exact: true });
  await researchButtons.first().click();
  assert('Research dialog opens', await page.getByRole('dialog').isVisible());
  await page.locator('.original-artwork summary').click();
  assert('Original diagram available', await page.locator('.original-artwork img').evaluate(img => img.complete && img.naturalWidth > 0));
  await page.keyboard.press('Escape');
  assert('Escape closes dialog and restores focus', !await page.getByRole('dialog').isVisible() && await researchButtons.first().evaluate(el => el === document.activeElement));
  await researchButtons.nth(1).click();
  assert('Second perspective opens', (await page.locator('#article-title').innerText()).includes('living ecosystem'));
  await page.getByRole('button', { name: 'Close research perspective', exact: true }).click();
  await page.locator('#contact').scrollIntoViewIfNeeded(); await settle();
  await page.screenshot({ path: 'output/playwright/desktop-contact.png' });
  assert('Real contact address', await page.locator('footer a[href="mailto:info@dataecolab.com"]').count() === 2);
  assert('No desktop horizontal overflow', await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
  await page.screenshot({ path: 'output/playwright/desktop-full.png', fullPage: true });
  return results;
}
