import { lazy, Suspense, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import BlurText from './components/react-bits/BlurText';
import ShinyText from './components/react-bits/ShinyText';
import ShardWord from './components/ShardWord';
import BackgroundVideo from './components/BackgroundVideo';
import { articles, lenses, stages } from './content';
import SiteNavigation, { sitePath } from './components/SiteNavigation';
import ContentPage from './components/ContentPage';
import pages from './site-map.json';

const lifecyclePhrase = 'Discover and register.';
const TextType = lazy(() => import('./components/react-bits/TextType'));
const Mark = () => <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M3 6h10v20H3z" fill="currentColor"/><path d="M16 6c17 0 17 20 0 20V6Z" fill="currentColor"/></svg>;

function tabKey(event: KeyboardEvent, index: number, count: number, select: (n: number) => void) {
  let next = index;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % count;
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + count - 1) % count;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = count - 1;
  else return;
  event.preventDefault(); select(next);
  const siblings = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  siblings?.[next]?.focus();
}

function Hero() {
  const reduced = useReducedMotion();
  return <section id="home" className="hero h-screen w-full overflow-hidden" aria-label="DataEco Lab introduction">
    <div className="hero-media">
      <BackgroundVideo manifest="/media/hero.m3u8" fallback="/media/hero.mp4" poster="/media/architecture.webp" />
    </div>
    <SiteNavigation />
    <div className="hero-copy">
      <div className="eyebrow hero-eyebrow"><span className="label-marker" /><ShinyText text="Agent Lifecycle Management" color="#d9e7ff" shineColor="#ffffff" trigger="view" speed={1.3} disabled={!!reduced} /></div>
      <h1><span className="sr-only">Intelligent agents. Managed with confidence.</span><span aria-hidden="true" className="headline-animation">
        {reduced ? <span>Intelligent agents.<br />Managed with<br className="desktop-break" /> confidence.</span> : <>
          <BlurText text="Intelligent agents." animateBy="words" direction="bottom" delay={65} blur={5} distance={12} stepDuration={0.18} />
          <BlurText text="Managed with" animateBy="words" direction="bottom" delay={65} blur={5} distance={12} stepDuration={0.22} />
          <BlurText text="confidence." animateBy="words" direction="bottom" delay={65} blur={5} distance={12} stepDuration={0.26} />
        </>}
      </span></h1>
      <p className="hero-description">Research-led lifecycle management for agents, people and technology across your enterprise.</p>
      <div className="hero-actions flex flex-wrap items-center gap-3 sm:gap-4"><a className="button button-primary" href="#almops">Explore ALMOps</a><a className="button button-ghost" href="#research">Our research</a></div>
    </div>
    <div className="hero-topic-links" aria-label="Homepage topics"><a href="#almops">ALMOps</a><span>/</span><a href="#ecosystem">Ecosystem</a><span>/</span><a href="#research">Research</a></div>
    <a href="#almops" className="scroll-cue"><span>Discover a wider perspective</span></a>
  </section>;
}

function ALMOps() {
  const [stage, setStage] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  return <section id="almops" ref={ref} className="alm-section section-pad">
    <div className="section-kicker"><span>01 / ALMOps</span><span>A lifecycle perspective</span></div>
    <div className="oversight-intro"><ShardWord /><p>For every agent.<br />At every stage.</p></div>
    <div className="section-heading"><h2>Intelligence evolves.<br /><span className="muted-heading">Oversight should, too.</span></h2><div className="section-intro"><p>A methodology-led approach to Agent Lifecycle Management, connecting enterprise governance with the everyday practice of managing agents.</p><span className="development-note"><span />ALMOps · In development</span></div></div>
    <div className="lifecycle-layout">
      <div className="lifecycle-visual"><img src="/media/porcelain.webp" alt="Sculptural white surfaces surrounding a substantial cobalt glass core" loading="lazy" width="1440" height="810" />
        <div className="visual-caption"><span>Purpose. Context. Accountability.</span></div>
      </div>
      <div className="lifecycle-workspace">
        <div className="type-line"><span aria-hidden="true" className="type-dot" />
          {reduced ? <span>{lifecyclePhrase}</span> : <Suspense fallback={<span>{lifecyclePhrase}</span>}><TextType text={lifecyclePhrase} typingSpeed={44} loop={false} startOnVisible showCursor cursorStyle="bar" cursorBlinkDuration={0} className="lifecycle-type" /></Suspense>}
        </div>
        <div className="stage-tabs" role="tablist" aria-label="Agent lifecycle stages">
          {stages.map((item, i) => <button key={item.name} role="tab" id={`stage-tab-${i}`} aria-controls="stage-panel" aria-selected={i === stage} tabIndex={i === stage ? 0 : -1} onClick={() => setStage(i)} onKeyDown={e => tabKey(e, i, stages.length, setStage)}><span>0{i + 1}</span>{item.name}<span className="stage-indicator" aria-hidden="true">{i === stage ? '−' : '+'}</span></button>)}
        </div>
        <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${stage}`} tabIndex={0} className="stage-panel">
          <AnimatePresence mode="wait" initial={false}><motion.div key={stage} initial={{ opacity: 0, y: reduced ? 0 : 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}><h3>{stages[stage].title}</h3><p>{stages[stage].description}</p><p className="stage-question">{stages[stage].question}</p></motion.div></AnimatePresence>
        </div>
        <a href="#contact" className="text-link">Discuss your agent lifecycle</a>
      </div>
    </div>
    <p className="method-note">A guide to lifecycle thinking. Platform scope and availability can be discussed with our team.</p>
  </section>;
}

function Ecosystem() {
  const [lens, setLens] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const clip = useTransform(scrollYProgress, [0, 0.22, 0.65, 1], ['inset(9% 5% 0% 5% round 32px)', 'inset(0% 0% 0% 0% round 0px)', 'inset(0% 0% 0% 0% round 0px)', 'inset(0% 5% 8% 5% round 12px)']);
  return <section id="ecosystem" ref={ref} className="ecosystem-section" aria-labelledby="ecosystem-title">
    <motion.div className="ecosystem-world" style={reduced ? undefined : { clipPath: clip }}>
      <AnimatePresence initial={false}><motion.img key={lens} src={`/media/${lenses[lens].image}.webp`} alt="" className="ecosystem-image" style={{ objectPosition: lenses[lens].position }} initial={{ opacity: 0, scale: reduced ? 1 : 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.6 }} /></AnimatePresence>
      <div className="ecosystem-shade" />
    </motion.div>
    <div className="ecosystem-content section-pad">
      <div className="section-kicker"><span>02 / Enterprise ecosystem</span><span>See the whole picture</span></div>
      <motion.div className="ecosystem-title" initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}><span className="eyebrow">Connected by context.</span><h2 id="ecosystem-title">Beyond the agent.<br />Across the enterprise.</h2><p>People, data and technology.<br />One evolving ecosystem.</p></motion.div>
      <div className="ecosystem-bottom"><div className="lens-tabs" role="tablist" aria-label="Enterprise ecosystem perspectives">{lenses.map((item, i) => <button key={item.name} id={`lens-tab-${i}`} role="tab" aria-selected={lens === i} aria-controls="lens-panel" tabIndex={lens === i ? 0 : -1} onClick={() => setLens(i)} onKeyDown={e => tabKey(e, i, lenses.length, setLens)}><span>0{i + 1}</span>{item.name}</button>)}</div>
        <div id="lens-panel" role="tabpanel" aria-labelledby={`lens-tab-${lens}`} tabIndex={0} className="lens-panel"><AnimatePresence mode="wait" initial={false}><motion.div key={lens} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}><h3>{lenses[lens].title}</h3><p>{lenses[lens].text}</p><span className="lens-focus">{lenses[lens].focus}</span></motion.div></AnimatePresence></div>
      </div>
    </div>
  </section>;
}

function Research() {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (active === null) return;
    returnFocus.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; returnFocus.current?.focus(); };
  }, [active]);
  const close = () => { dialog.current?.close(); setActive(null); };
  const article = active === null ? null : articles[active];
  return <section id="research" className="research-section section-pad">
    <div className="section-kicker"><span>03 / Research & perspectives</span><span>Ideas that inform practice</span></div>
    <div className="section-heading"><h2>Rooted in research.<br /><span className="muted-heading">Built around reality.</span></h2><p className="section-intro">Explore the thinking behind our approach to agent lifecycles and enterprise ecosystems.</p></div>
    <div className="research-layout"><figure className="research-figure"><img src="/media/glass.webp" alt="Layered optical glass revealing different depths and perspectives" loading="lazy" width="1440" height="810" /><figcaption><span>A different lens on enterprise complexity.</span><span>DataEco Lab</span></figcaption></figure>
      <div className="research-articles">{articles.map((item, i) => <article key={item.id}><span className="article-category">Perspective / 0{i + 1}</span><h3>{item.title}</h3><p>{item.summary}</p><button className="text-link" onClick={() => setActive(i)}>Explore the perspective</button></article>)}</div>
    </div>
    <div className="research-note"><span>Research. Methodology. Dialogue.</span><a className="text-link" href="mailto:info@dataecolab.com?subject=Research%20collaboration">Explore a research collaboration</a></div>
    <dialog ref={dialog} className="research-dialog" aria-labelledby="article-title" onClose={() => setActive(null)} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="dialog-inner"><button className="dialog-close" aria-label="Close research perspective" onClick={close}>Close <span aria-hidden="true">×</span></button>
        {article && <><span className="eyebrow">{article.category}</span><h2 id="article-title">{article.title}</h2><p className="article-lead">{article.summary}</p>{article.paragraphs.map(text => <p key={text}>{text}</p>)}
          <p className="source-note">An editorial perspective based on DataEco Lab’s published company material. This is not presented as a peer-reviewed paper.</p>
          <details className="original-artwork"><summary>{article.imageCaption}<span aria-hidden="true">+</span></summary>
            {active === 1 && <p className="source-note">Conceptual illustration of people, data and technology sharing one enterprise environment.</p>}
            {active === 0 && <p className="source-note">Archived concept artwork, not verified product evidence. Metrics, standards, vendor integrations and capabilities shown in this original diagram have not been independently verified and do not establish current availability.</p>}
            <a href={article.image} target="_blank" rel="noreferrer" aria-label="Open illustration at full size"><img src={article.image} alt={article.imageCaption} /></a><p className="image-hint">Select the image to open at full size.</p>
          </details></>}
      </div>
    </dialog>
  </section>;
}

function Contact() {
  const reduced = useReducedMotion();
  return <footer id="contact" className="contact-section section-pad">
    <motion.img className="contact-image" src="/media/architecture.webp" loading="lazy" alt="" initial={reduced ? false : { opacity: 0.65 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8 }} /><div className="contact-shade" />
    <div className="contact-content"><div className="section-kicker"><span>04 / Let’s work together</span><span>Start a conversation</span></div>
      <motion.div className="contact-invitation" initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}><h2>A wider perspective.<br />A clearer way forward.</h2><p>Let’s explore what responsible agent lifecycle management<br className="desktop-break" /> could look like in your enterprise.</p><a className="button button-white" href="mailto:info@dataecolab.com">Talk to our team</a></motion.div>
      <div className="footer-details"><a className="brand" href="/"><Mark /><span>DataEco <span className="brand-light">Lab</span>.</span></a><div><a href="mailto:info@dataecolab.com">info@dataecolab.com</a><p>8 Hadenfeld Ave, Macquarie University<br />NSW 2109, Australia</p></div><div><p>DataEco Lab Pty Ltd<br />ABN 59 664 039 294</p><a href="#top" className="back-top">Back to top</a></div></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} DataEco Lab</span><span>People / Data / Technology</span></div>
    </div>
  </footer>;
}

export default function App() {
  const path = sitePath();
  const home = path === '/' || path === '/home';
  useEffect(() => {
    const page = pages.find(item => item.path === path);
    document.title = home ? 'DataEco Lab — Intelligence, with oversight.' : `${page?.label ?? 'Page not found'} | DataEco Lab`;
    const description = document.querySelector('meta[name="description"]');
    if (page) description?.setAttribute('content', page.description);
  }, [path, home]);
  return <div id="top"><a className="skip-link" href="#main-content">Skip to content</a>{home ? <><Hero /><main id="main-content" tabIndex={-1}><ALMOps /><Ecosystem /><Research /></main></> : <ContentPage path={path} />}<Contact /></div>;
}
