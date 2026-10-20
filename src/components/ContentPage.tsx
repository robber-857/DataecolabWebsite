import SiteNavigation from './SiteNavigation';
import pages from '../site-map.json';
import { pageContent } from '../site-content';

export default function ContentPage({ path }: { path: string }) {
  const page = pages.find(item => item.path === path);
  const content = pageContent[path];
  if (!page || !content) return <><div className="subpage-header"><SiteNavigation /></div><main id="main-content" className="not-found section-pad" tabIndex={-1}><p className="eyebrow">Page not found</p><h1>Let’s find your way.</h1><p>This address doesn’t match a page on our website.</p><a href="/" className="button button-primary">Return home ↗</a></main></>;
  return <>
    <div className="subpage-header"><SiteNavigation /></div>
    <main id="main-content" tabIndex={-1}>
      <section className="page-intro section-pad">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span>{page.parent && <><a href={page.parent}>Working with us</a><span aria-hidden="true">/</span></>}<span aria-current="page">{page.label}</span></nav>
        <div className="page-intro-grid"><div><p className="eyebrow">{page.label}</p><h1>{page.title}</h1></div><div className="page-lead"><p>{content.lead}</p>{content.status && <span className="page-status">{content.status}</span>}</div></div>
      </section>
      <figure className="page-banner"><img src={`/media/${content.image}.webp`} alt="Conceptual blue and white material study" fetchPriority="high" /><figcaption>People / Data / Technology</figcaption></figure>
      <section className="page-chapters section-pad" aria-label={`${page.label} details`}>
        <aside><span className="eyebrow">Explore this page</span><nav aria-label="On this page">{content.chapters.map((chapter, i) => <a key={chapter.title} href={`#detail-${i + 1}`}>{chapter.title}</a>)}</nav>{page.parent && <a className="text-link" href={page.parent}>All ways to work with us ↗</a>}</aside>
        <div>{content.chapters.map((chapter, i) => <article key={chapter.title} id={`detail-${i + 1}`} className="page-chapter"><span className="chapter-number">0{i + 1}</span><h2>{chapter.title}</h2><p>{chapter.text}</p>{chapter.href && <a className="text-link" href={chapter.href}>{chapter.link}<span className="arrow" aria-hidden="true">↗</span></a>}</article>)}</div>
      </section>
      {path === '/working-with-us' && <nav className="collaboration-next section-pad" aria-label="Collaboration pages">{pages.filter(item => item.parent === path).map(item => <a href={item.path} key={item.path}>{item.label}<span aria-hidden="true">↗</span></a>)}</nav>}
    </main>
  </>;
}
