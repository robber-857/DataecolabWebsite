async (page) => {
  const paths = ['/', '/vision', '/services', '/toolsplatforms', '/resources', '/working-with-us', '/about-us', '/working-with-us/joining-rd-project', '/working-with-us/partners-clients', '/working-with-us/workshops-forums', '/contact-us'];
  const results = [];
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const inspect = () => page.evaluate(() => {
    const issues = [];
    for (const node of document.querySelectorAll('h1,h2,h3,p,.eyebrow,.text-link,.button,.breadcrumbs,.stage-tabs button,.lens-tabs button,.type-line,.footer-details > div')) {
      if (!node.checkVisibility() || node.closest('dialog:not([open])')) continue;
      const box = node.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;
      if (box.left < -1 || box.right > innerWidth + 1 || node.scrollWidth > node.clientWidth + 2) issues.push({tag:node.tagName,text:node.textContent.slice(0,65),left:box.left,right:box.right,scroll:node.scrollWidth,client:node.clientWidth});
    }
    const brand = document.querySelector('.site-nav .brand').getBoundingClientRect();
    const actions = document.querySelector('.nav-actions').getBoundingClientRect();
    return {overflow:document.documentElement.scrollWidth>innerWidth,issues,headerFits:brand.right<=actions.left && actions.right<=innerWidth-16};
  });
  for (const [width,height] of [[320,568],[360,740],[390,844],[430,932],[844,390]]) {
    await page.setViewportSize({width,height});
    for (const path of paths) {
      await page.goto('http://127.0.0.1:4173' + path);
      await page.locator('h1').waitFor(); await page.evaluate(() => document.fonts.ready);
      const layout = await inspect();
      await page.getByRole('button',{name:'Menu',exact:false}).click();
      const menu = page.getByRole('navigation',{name:'Mobile navigation',exact:true});
      const menuBounds = await menu.boundingBox();
      await menu.getByRole('link',{name:'Contact us',exact:false}).scrollIntoViewIfNeeded();
      const contact = await menu.getByRole('link',{name:'Contact us',exact:false}).boundingBox();
      const menuLayout = await menu.evaluate(node=>({count:node.querySelectorAll('a').length,overflow:node.scrollWidth>node.clientWidth}));
      await page.keyboard.press('Escape');
      await page.getByRole('button',{name:'Menu',exact:false}).click();
      const reopenedAtTop = await menu.evaluate(node=>node.scrollTop===0);
      const iconAlignment = await menu.locator('a:has(svg)').evaluateAll(nodes=>nodes.every(node=>{const text=node.querySelector('span').getBoundingClientRect();const icon=node.querySelector('svg').getBoundingClientRect();return Math.abs(text.y+text.height/2-icon.y-icon.height/2)<0.5}));
      results.push({width,height,path,...layout,menu:menuLayout,menuFits:menuBounds.x>=0 && menuBounds.x+menuBounds.width<=width && menuBounds.y+menuBounds.height<=height,contactReachable:contact.y>=0 && contact.y+contact.height<=height,reopenedAtTop,iconAlignment});
      if (path==='/' && [320,390,844].includes(width)) await page.screenshot({path:`output/playwright/audit-menu-${width}.png`});
      await page.keyboard.press('Escape');
      if(width===390) await page.screenshot({path:`output/playwright/audit-page-${path==='/'?'home':path.replaceAll('/','-')}.png`,fullPage:true});
    }
    await page.getByRole('button',{name:'Search this site',exact:true}).click();
    const dialog=page.getByRole('dialog',{name:'Find your perspective.'});
    results.push({width,search:await dialog.evaluate(node=>({client:node.clientWidth,scroll:node.scrollWidth,closeWidth:node.querySelector('button').getBoundingClientRect().width}))});
    await page.screenshot({path:`output/playwright/audit-search-${width}.png`});
    await page.keyboard.press('Escape');
  }
  await page.setViewportSize({width:320,height:568}); await page.goto('http://127.0.0.1:4173');
  await page.getByRole('button',{name:'Explore the perspective',exact:true}).first().click();
  results.push({width:320,research:await inspect()});
  await page.screenshot({path:'output/playwright/audit-research-dialog-320.png'});
  await page.keyboard.press('Escape');
  const failures=results.filter(item=>item.overflow || item.issues?.length || item.headerFits===false || item.menuFits===false || item.contactReachable===false || item.reopenedAtTop===false || item.iconAlignment===false || item.menu?.overflow || (item.search && (item.search.scroll>item.search.client || item.search.closeWidth<44)) || item.research?.issues.length);
  if(failures.length) throw new Error(JSON.stringify(failures));
  return results;
}
