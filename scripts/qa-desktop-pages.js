async (page) => {
  const paths = ['/', '/vision', '/services', '/toolsplatforms', '/resources', '/working-with-us', '/about-us', '/working-with-us/joining-rd-project', '/working-with-us/partners-clients', '/working-with-us/workshops-forums', '/contact-us'];
  const results = [];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [[1024,768],[1191,768],[1280,720],[1440,900],[1920,1080],[2560,1440]]) {
    await page.setViewportSize({ width, height });
    for (const path of paths) {
      const response = await page.goto('http://127.0.0.1:4173' + path);
      await page.locator('h1').waitFor();
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const issues = [];
        const visible = node => node.checkVisibility() && !node.closest('dialog:not([open])');
        for (const node of document.querySelectorAll('h1,h2,h3,p,.eyebrow,.text-link,.button,.breadcrumbs,.stage-tabs button,.lens-tabs button,.type-line,.footer-details > div,.page-status')) {
          if (!visible(node)) continue;
          const b = node.getBoundingClientRect();
          if (b.width && b.height && (b.left < -1 || b.right > innerWidth+1 || node.scrollWidth > node.clientWidth+2)) issues.push({type:'overflow',text:node.textContent.slice(0,75),left:b.left,right:b.right,scroll:node.scrollWidth,client:node.clientWidth});
        }
        for (const node of document.querySelectorAll('.site-nav,.section-heading,.lifecycle-layout,.ecosystem-bottom,.research-layout,.footer-details,.page-intro-grid,.page-chapters')) {
          const children = [...node.children].filter(child => visible(child) && getComputedStyle(child).position !== 'absolute');
          const boxes = children.map(child=>child.getBoundingClientRect());
          for (let i=1;i<boxes.length;i++) {
            const a=boxes[i-1], b=boxes[i];
            if(Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2 && a.right>b.left+2) issues.push({type:'overlap',container:node.className,gap:b.left-a.right});
          }
        }
        const intro=document.querySelector('.page-intro-grid');
        const chapter=document.querySelector('.page-chapters');
        const caption=document.querySelector('.page-banner figcaption');
        return {overflow:document.documentElement.scrollWidth>innerWidth,issues,editorialLeftAligned:!intro||Math.abs(intro.getBoundingClientRect().left-chapter.getBoundingClientRect().left-parseFloat(getComputedStyle(chapter).paddingLeft))<1,captionAligned:!caption||Math.abs(caption.getBoundingClientRect().left-intro.getBoundingClientRect().left)<1};
      });
      const menu = page.getByRole('navigation',{name:'Main navigation',exact:true});
      let dropdown = null;
      if (await menu.isVisible()) {
        await menu.locator('summary').click();
        dropdown = await menu.locator('.work-dropdown-panel').evaluate(node=>{
          const b=node.getBoundingClientRect();
          const summary=node.parentElement.querySelector('summary');
          const a=summary.querySelector('span').getBoundingClientRect(), icon=summary.querySelector('svg').getBoundingClientRect();
          return {fits:b.left>=0&&b.right<=innerWidth&&b.bottom<=innerHeight,count:node.querySelectorAll('a').length,iconDelta:Math.abs(a.y+a.height/2-icon.y-icon.height/2)};
        });
        await page.keyboard.press('Escape');
      }
      results.push({width,height,path,status:response.status(),...layout,dropdown});
      if(width===1440) {
        await page.evaluate(() => document.activeElement?.blur());
        await page.screenshot({path:`output/playwright/desktop-audit-${path==='/'?'home':path.replaceAll('/','-')}.png`,fullPage:true});
      }
      if(path==='/'&&[1191,1280,2560].includes(width))await page.screenshot({path:`output/playwright/desktop-audit-hero-${width}.png`});
    }
  }
  const failures=results.filter(r=>r.status!==200||r.overflow||r.issues.length||!r.editorialLeftAligned||!r.captionAligned||(r.dropdown&&(!r.dropdown.fits||r.dropdown.count!==4||r.dropdown.iconDelta>0.5)));
  if(failures.length||errors.length)throw new Error(JSON.stringify({failures,errors}));
  return {results,errors,failures};
}
