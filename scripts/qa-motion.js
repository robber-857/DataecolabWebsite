async (page) => {
  const result = {};
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:4173');
  await page.locator('h1 .blur-text').first().waitFor();
  const headingSamples = [], shines = [];
  for(let i=0;i<19;i++) {
    headingSamples.push(await page.locator('h1 .blur-text span[aria-hidden="true"]').evaluateAll(nodes => nodes.map(n => ({ opacity: +getComputedStyle(n).opacity, filter: getComputedStyle(n).filter }))));
    shines.push(await page.locator('.hero-eyebrow > span').last().evaluate(n => n.style.backgroundImage));
    await page.waitForTimeout(100);
  }
  result.blurMotionObserved = headingSamples.some(sample => sample.some(n => n.opacity < .99 || n.filter !== 'blur(0px)'));
  result.headingSettledWithinTwoSeconds = headingSamples.at(-1).every(n => n.opacity === 1 && n.filter === 'blur(0px)');
  result.shineChangesOnEntry = new Set(shines).size > 3;
  const rest = shines.at(-1); await page.waitForTimeout(1300);
  result.shineStops = rest === await page.locator('.hero-eyebrow > span').last().evaluate(n => n.style.backgroundImage);
  await page.getByRole('link', { name: 'Explore ALMOps', exact: true }).click();
  await page.getByRole('tab', { name: '01 Discover', exact: true }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const visiblePhrases = new Set(), heights = new Set();
  for(let i=0;i<20;i++) {
    const text = (await page.locator('.lifecycle-type > span[aria-hidden="true"]').allTextContents()).join(' ').replace(/\u200B/g, '');
    for(const phrase of ['Discover and register.', 'Assess and authorise.', 'Operate and evolve.', 'Retire responsibly.']) if(text.includes(phrase)) visiblePhrases.add(phrase);
    heights.add((await page.locator('.type-line').boundingBox()).height);
    await page.waitForTimeout(250);
  }
  result.visibleTypedPhrases = [...visiblePhrases]; result.typingHeight = [...heights];
  result.allFourPhrasesRetained = visiblePhrases.size === 4;
  if(!result.headingSettledWithinTwoSeconds || !result.shineChangesOnEntry || !result.shineStops || !result.allFourPhrasesRetained || heights.size !== 1) throw new Error(JSON.stringify(result));
  return result;
}
