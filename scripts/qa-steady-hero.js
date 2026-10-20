async (page) => {
  const results = [];
  const check = (name, pass, details = '') => { results.push({name, pass, details}); if (!pass) throw new Error(JSON.stringify(results)); };
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.goto('http://127.0.0.1:4173');
    await page.waitForFunction(() => document.querySelector('[data-video-status]')?.dataset.videoStatus === 'playing');
    check('HLS plays at ' + width, await page.locator('[data-video-source]').getAttribute('data-video-source') === 'hls');
    const sample = await page.locator('video').evaluate(async video => {
      let wraps = 0, last = video.currentTime, min = Infinity, max = 0;
      const initial = video.getVideoPlaybackQuality();
      const start = performance.now();
      while (performance.now() - start < 8600) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (video.currentTime < last - 1) wraps++;
        last = video.currentTime;
        min = Math.min(min, last); max = Math.max(max, last);
      }
      const final = video.getVideoPlaybackQuality();
      return {wraps, min, max, width:video.videoWidth, dropped:final.droppedVideoFrames-initial.droppedVideoFrames, frames:final.totalVideoFrames-initial.totalVideoFrames};
    });
    check('Full loop advances at ' + width, sample.wraps >= 1 && sample.width === 1920 && sample.frames > 200, sample);
    for (const y of [0, 200, 450, 0]) {
      await page.evaluate(y => window.scrollTo({top:y, behavior:'instant'}), y);
      check('No hero transform at ' + width + '/' + y, await page.locator('.hero-media').evaluate(node => getComputedStyle(node).transform === 'none'));
    }
    await page.getByRole('button', {name:'Pause background video',exact:true}).focus(); await page.keyboard.press('Enter');
    check('Pause still works at ' + width, await page.locator('video').evaluate(video => video.paused));
    check('Footer has no duplicate menu at ' + width, await page.locator('footer nav').count() === 0);
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({path:`output/playwright/footer-clean-${width}.png`});
    check('Company contact remains at ' + width, await page.locator('footer').getByRole('link',{name:'info@dataecolab.com',exact:true}).isVisible());
    check('No overflow at ' + width, await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
  }
  await page.setViewportSize({width:1440,height:900}); await page.goto('http://127.0.0.1:4173');
  return results;
}
