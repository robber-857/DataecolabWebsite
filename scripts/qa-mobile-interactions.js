async (page) => {
  const results=[];
  const check=(name,pass,detail='')=>{results.push({name,pass,detail});if(!pass)throw new Error(JSON.stringify(results));};
  const fits=locator=>locator.evaluate(node=>node.scrollWidth<=node.clientWidth+1 && node.getBoundingClientRect().right<=innerWidth+1);
  for(const width of [320,360,390,430]) {
    await page.setViewportSize({width,height:width===320?568:844});
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.goto('http://127.0.0.1:4173');
    await page.waitForTimeout(1500);
    const headerAlignment=await page.locator('.menu-toggle').evaluate(node=>{const a=node.querySelector('span').getBoundingClientRect();const b=node.querySelector('svg').getBoundingClientRect();return Math.abs(a.y+a.height/2-b.y-b.height/2)});
    check('Menu icon center '+width,headerAlignment<0.5,headerAlignment);
    check('Animated headline fits '+width,await fits(page.locator('.hero-copy')));
    for(const name of ['01 Discover','02 Assess','03 Approve','04 Operate','05 Evolve','06 Retire']) {
      await page.getByRole('tab',{name,exact:true}).click(); await page.waitForTimeout(400);
      check(name+' fits '+width,await fits(page.locator('#stage-panel')));
    }
    for(const name of ['01 People','02 Data','03 Technology']) {
      await page.getByRole('tab',{name,exact:true}).click(); await page.waitForTimeout(400);
      check(name+' fits '+width,await fits(page.locator('#lens-panel')));
    }
    for(const i of [0,1]) {
      await page.getByRole('button',{name:'Explore the perspective',exact:true}).nth(i).click();
      const dialog=page.getByRole('dialog',{name:await page.locator('#article-title').innerText()});
      await dialog.locator('.original-artwork summary').click();
      check('Expanded research '+i+' fits '+width,await fits(dialog));
      await page.keyboard.press('Escape');
    }
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.getByRole('button',{name:'Menu',exact:false}).click();
    const menu=page.getByRole('navigation',{name:'Mobile navigation',exact:true});
    await menu.getByRole('link',{name:'Joining R&D Project',exact:true}).click();
    await page.waitForURL('**/working-with-us/joining-rd-project');
    check('Mobile child navigation '+width,await page.locator('h1').innerText()==='Explore a research collaboration.');
    await page.getByRole('button',{name:'Search this site',exact:true}).click();
    await page.getByRole('searchbox').fill('workshops');
    await page.getByRole('dialog',{name:'Find your perspective.'}).getByRole('link').filter({hasText:'Workshops & Forums'}).click();
    await page.waitForURL('**/working-with-us/workshops-forums');
    check('Mobile search result navigation '+width,await page.locator('h1').innerText()==='Make room for a deeper conversation.');
  }
  await page.setViewportSize({width:1440,height:900}); await page.goto('http://127.0.0.1:4173');
  const nav=page.getByRole('navigation',{name:'Main navigation',exact:true});
  await nav.locator('summary').click();
  check('Desktop dropdown regression',await nav.locator('.work-dropdown-panel a:visible').count()===4);
  await page.keyboard.press('Escape');
  return results;
}
