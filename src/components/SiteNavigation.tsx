import { useEffect, useRef, useState } from 'react';
import pages from '../site-map.json';

export const sitePath = () => window.location.pathname.replace(/\/+$/, '') || '/';
const isCurrent = (path: string) => path === '/' ? ['/', '/home'].includes(sitePath()) : sitePath() === path;

export function Brand() {
  return <a className="brand" href="/" aria-label="DataEco Lab home"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M3 6h10v20H3zM16 6c17 0 17 20 0 20V6Z" fill="currentColor" /></svg><span>DataEco <span className="brand-light">Lab</span><span className="brand-dot">.</span></span></a>;
}

export default function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const header = useRef<HTMLElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const mobileMenu = useRef<HTMLElement>(null);
  const workMenu = useRef<HTMLDetailsElement>(null);
  const search = useRef<HTMLDialogElement>(null);
  const searchTrigger = useRef<HTMLButtonElement>(null);
  const main = pages.filter(page => page.main);
  const children = pages.filter(page => page.parent === '/working-with-us');
  const results = query.trim() ? pages.filter(page => `${page.label} ${page.title} ${page.description}`.toLowerCase().includes(query.trim().toLowerCase())) : pages;

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) { setOpen(false); if (workMenu.current) workMenu.current.open = false; }
    };
    const resize = () => { setOpen(false); if (workMenu.current) workMenu.current.open = false; };
    document.addEventListener('pointerdown', close); window.addEventListener('resize', resize);
    return () => { document.removeEventListener('pointerdown', close); window.removeEventListener('resize', resize); };
  }, []);

  useEffect(() => { if (open && mobileMenu.current) mobileMenu.current.scrollTop = 0; }, [open]);

  const openSearch = () => { setOpen(false); setQuery(''); search.current?.showModal(); };
  return <>
    <header ref={header} className="glass-nav site-nav" onKeyDown={event => {
      if (event.key !== 'Escape') return;
      if (workMenu.current?.open) { workMenu.current.open = false; workMenu.current.querySelector('summary')?.focus(); }
      else { setOpen(false); mobileToggle.current?.focus(); }
    }}>
      <Brand />
      <nav className="desktop-links" aria-label="Main navigation">
        {main.map(page => page.path === '/working-with-us' ? <details className="work-dropdown" key={page.path} ref={workMenu}>
          <summary className={sitePath().startsWith(page.path) ? 'current-section' : ''}><span>Working with us</span><svg className="dropdown-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></summary>
          <div className="work-dropdown-panel"><a href={page.path} aria-current={isCurrent(page.path) ? 'page' : undefined}>Working with us <span>Overview</span></a>{children.map(child => <a key={child.path} href={child.path} aria-current={isCurrent(child.path) ? 'page' : undefined}>{child.label}</a>)}</div>
        </details> : <a href={page.path} key={page.path} aria-current={isCurrent(page.path) ? 'page' : undefined}>{page.label}</a>)}
      </nav>
      <div className="nav-actions"><button ref={searchTrigger} className="search-trigger" aria-label="Search this site" onClick={openSearch}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.8"/></svg></button>
        <a className="nav-contact" href="/contact-us">Talk to our team </a>
        <button ref={mobileToggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><span>{open ? 'Close' : 'Menu'}</span><svg className="nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={open ? 'M3 8h10' : 'M3 8h10M8 3v10'} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg></button>
      </div>
      <nav ref={mobileMenu} id="mobile-navigation" className="mobile-links" aria-label="Mobile navigation" hidden={!open}>
        {main.map(page => <div key={page.path}><a href={page.path} aria-current={isCurrent(page.path) ? 'page' : undefined}><span>{page.label}</span></a>{page.path === '/working-with-us' && <div className="mobile-subpages">{children.map(child => <a key={child.path} href={child.path} aria-current={isCurrent(child.path) ? 'page' : undefined}>{child.label}</a>)}</div>}</div>)}
        <a href="/contact-us" aria-current={isCurrent('/contact-us') ? 'page' : undefined}><span>Contact us</span></a>
      </nav>
    </header>
    <dialog ref={search} className="site-search" aria-labelledby="search-heading" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); search.current?.close(); } }} onClose={() => searchTrigger.current?.focus()} onClick={event => { if (event.target === event.currentTarget) search.current?.close(); }}>
      <div className="search-inner"><div className="search-heading-row"><h2 id="search-heading">Find your perspective.</h2><button onClick={() => search.current?.close()} aria-label="Close search"><svg className="nav-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button></div>
        <label htmlFor="site-search-input">Search pages and topics</label><input id="site-search-input" type="search" placeholder="Search the site" autoFocus value={query} onChange={event => setQuery(event.target.value)} />
        <p className="search-count" role="status">{results.length} {results.length === 1 ? 'page' : 'pages'} found</p>
        <ul className="search-results">{results.map(page => <li key={page.path}><a href={page.path}><strong><span>{page.label}</span></strong><span>{page.description}</span></a></li>)}</ul>
        {results.length === 0 && <p>No matching pages. Try “agents”, “ecosystem” or “research”.</p>}
      </div>
    </dialog>
  </>;
}
