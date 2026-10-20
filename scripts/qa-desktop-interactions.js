async (page) => {
  const results = [];
  const check = (name, pass) => { results.push({name,pass}); if(!pass)throw new Error(JSON.stringify(results)); };
  const fits = locator => locator.evaluate(node=>node.scrollWidth<=node.clientWidth+1 && node.getBoundingClientRect().left>=0 && node.getBoundingClientRect().right<=innerWidth);
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const width of [1191,1440,1920]) {
    await page.setViewportSize({width,height:900});
    await page.goto('http://127.0.0.1:4173');
    await page.waitForTimeout(1300);
    check('Animated hero fits '+width,await fits(page.locator('.hero-copy')));
    for(const name of ['01 Discover','02 Assess','03 Approve','04 Operate','05 Evolve','06 Retire']) {
      await page.getByRole('tab',{name,exact:true}).click(); await page.waitForTimeout(400);
      check(name+' panel fits '+width,await fits(page.locator('#stage-panel')));
    }
    for(const name of ['01 People','02 Data','03 Technology']) {
      await page.getByRole('tab',{name,exact:true}).click(); await page.waitForTimeout(400);
      check(name+' panel fits '+width,await fits(page.locator('#lens-panel')));
    }
    for(const i of [0,1]) {
      await page.getByRole('button',{name:'Explore the perspective',exact:true}).nth(i).click();
      await page.locator('.research-dialog .original-artwork summary').click();
      check('Expanded research '+i+' fits '+width,await fits(page.locator('.research-dialog')));
      await page.keyboard.press('Escape');
    }
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    const summary=page.getByRole('navigation',{name:'Main navigation',exact:true}).locator('summary');
    await summary.focus(); await page.keyboard.press('Enter');
    check('Keyboard opens submenu '+width,await page.locator('.work-dropdown-panel a:visible').count()===4);
    await page.locator('.work-dropdown-panel').getByRole('link',{name:'Partners & Clients',exact:false}).click();
    await page.waitForURL('**/working-with-us/partners-clients');
    check('Submenu destination '+width,await page.locator('h1').innerText()==='Start with a shared challenge.');
    await page.getByRole('button',{name:'Search this site',exact:true}).click();
    await page.getByRole('searchbox').fill('workshops');
    check('Search dialog fits '+width,await fits(page.locator('.site-search')));
    await page.getByRole('dialog',{name:'Find your perspective.'}).getByRole('link').filter({hasText:'Workshops & Forums'}).click();
    await page.waitForURL('**/working-with-us/workshops-forums');
    check('Search result destination '+width,await page.locator('h1').innerText()==='Make room for a deeper conversation.');
    await page.getByRole('navigation',{name:'On this page',exact:true}).getByRole('link').last().click();
    check('In-page chapter navigation '+width,page.url().endsWith('#detail-2'));
  }
  await page.setViewportSize({width:1440,height:900}); await page.goto('http://127.0.0.1:4173');
  return results;
}
