import { useEffect, useRef, useState } from 'react';
import type Hls from 'hls.js';
import { useReducedMotion } from 'motion/react';

type Props = { manifest: string; fallback: string; poster: string };
type Status = 'loading' | 'playing' | 'paused' | 'blocked' | 'error' | 'reduced';

/** Native HLS first, lazy hls.js second, MP4 third, always-visible poster last. */
export default function BackgroundVideo({ manifest, fallback, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>('loading');
  const [userPaused, setUserPaused] = useState(false);
  const [explicitPlay, setExplicitPlay] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [source, setSource] = useState<'hls' | 'mp4'>('hls');
  const [ready, setReady] = useState(false);
  const playRef = useRef<() => void>(() => {});
  const allowed = visible && pageVisible && !userPaused && (!reduced || explicitPlay);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    if (hostRef.current) observer.observe(hostRef.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);

  useEffect(() => {
    if (reduced) { setExplicitPlay(false); setUserPaused(false); }
  }, [reduced]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || (reduced && !explicitPlay)) return;
    let cancelled = false;
    let hls: Hls | undefined;
    setReady(false);
    const onReady = () => { if (!cancelled) { setReady(true); playRef.current(); } };
    const onError = () => {
      if (cancelled) return;
      if (source === 'hls') setSource('mp4');
      else { setStatus('error'); video.pause(); }
    };
    video.addEventListener('canplay', onReady);
    video.addEventListener('error', onError);
    if (source === 'mp4') { video.src = fallback; video.load(); }
    else if (video.canPlayType('application/vnd.apple.mpegurl')) { video.src = manifest; video.load(); }
    else {
      import('hls.js').then(({ default: HlsPlayer }) => {
        if (cancelled) return;
        if (!HlsPlayer.isSupported()) { setSource('mp4'); return; }
        hls = new HlsPlayer({ maxBufferLength: 12, manifestLoadPolicy: { default: {
          maxTimeToFirstByteMs: 5000, maxLoadTimeMs: 8000, timeoutRetry: null, errorRetry: null,
        } } });
        hls.on(HlsPlayer.Events.ERROR, (_event, data) => { if (data.fatal) onError(); });
        hls.loadSource(manifest);
        hls.attachMedia(video);
      }).catch(onError);
    }
    const deadline = window.setTimeout(() => { if (video.readyState < 2) onError(); }, 10000);
    return () => {
      cancelled = true; window.clearTimeout(deadline);
      video.removeEventListener('canplay', onReady); video.removeEventListener('error', onError);
      hls?.destroy(); video.pause(); video.removeAttribute('src'); video.load();
    };
  }, [manifest, fallback, source, reduced, explicitPlay]);

  playRef.current = () => {
    const video = videoRef.current;
    if (!video || !allowed) return;
    void video.play().catch((error: DOMException) => {
      // A visibility/pause race is not an autoplay denial.
      if (error.name !== 'AbortError') setStatus(error.name === 'NotAllowedError' ? 'blocked' : 'error');
    });
  };

  useEffect(() => {
    if (!allowed) {
      videoRef.current?.pause();
      setStatus(reduced && !explicitPlay ? 'reduced' : 'paused');
    } else if (ready) playRef.current();
  }, [allowed, ready, reduced, explicitPlay]);

  const toggle = () => {
    if (status === 'playing') { setUserPaused(true); videoRef.current?.pause(); }
    else { setUserPaused(false); setExplicitPlay(true); if (ready) void videoRef.current?.play().catch(() => setStatus('blocked')); }
  };

  const staticPoster = ['error', 'blocked', 'reduced', 'loading'].includes(status);
  return <div ref={hostRef} className="video-background" data-video-status={status} data-video-source={source}>
    <img className="hero-poster" src={poster} alt="" fetchPriority="high" />
    <video ref={videoRef} poster={poster} muted autoPlay={allowed} playsInline loop preload="none"
      aria-hidden="true" tabIndex={-1} className={staticPoster ? 'video-hidden' : ''}
      onPlaying={() => setStatus('playing')} onPause={() => setStatus(s => s === 'playing' ? 'paused' : s)} />
    <div className="hero-shade" />
    <button className="video-control" onClick={toggle} disabled={status === 'error'}
      aria-label={status === 'playing' ? 'Pause background video' : status === 'error' ? 'Background video unavailable — static image shown' : 'Play background video'}>
      <span aria-hidden="true">{status === 'playing' ? 'Ⅱ' : '▷'}</span>
      <span>{status === 'playing' ? 'Pause film' : status === 'error' ? 'Still image' : 'Play film'}</span>
    </button>
    <span className="sr-only" role="status">{status === 'error' ? 'Video unavailable. A still image is displayed.' : status === 'blocked' ? 'Autoplay was blocked. Select Play film to start.' : ''}</span>
  </div>;
}
