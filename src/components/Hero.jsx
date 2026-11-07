import { useState, useEffect, useRef, useCallback } from 'react';
import { siteConfig } from '../data/siteData';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoSrc] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= 768
      ? '/hero-bg-mobile.mp4'
      : '/hero-bg.mp4'
  );
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const isInViewRef = useRef(true);

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isInViewRef.current) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    if (video.paused) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
  }, []);

  const setVideoNode = useCallback((el) => {
    if (el) {
      el.muted = true;
      el.defaultMuted = true;
      el.playsInline = true;
      el.setAttribute('muted', '');
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', '');
    }
    videoRef.current = el;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 80);

    const video = videoRef.current;
    if (!video) {
      return () => clearTimeout(timer);
    }

    // Configuration matérielle native stricte pour iOS Safari, Android & Desktop
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const markReadyAndPlay = () => {
      setIsVideoReady(true);
      tryPlay();
    };

    if (video.readyState >= 1) {
      setIsVideoReady(true);
    }

    video.addEventListener('loadedmetadata', markReadyAndPlay);
    video.addEventListener('loadeddata', markReadyAndPlay);
    video.addEventListener('canplay', markReadyAndPlay);
    video.addEventListener('playing', markReadyAndPlay);
    tryPlay();

    // Écouteurs de déblocage tactiles (mode Économie d'énergie iOS / Android)
    const events = ['touchstart', 'touchend', 'pointerdown', 'pointerup', 'click', 'scroll'];
    const onUserInteraction = () => {
      tryPlay();
      if (video && !video.paused) {
        events.forEach((ev) => window.removeEventListener(ev, onUserInteraction));
      }
    };
    events.forEach((ev) => window.addEventListener(ev, onUserInteraction, { passive: true }));

    // Reprise automatique au retour sur l'onglet
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else if (isInViewRef.current) {
        tryPlay();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Pause automatique hors écran pour libérer le GPU pendant le scroll
    let observer = null;
    if (typeof IntersectionObserver !== 'undefined' && sectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          isInViewRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            tryPlay();
          } else {
            video.pause();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(sectionRef.current);
    }

    return () => {
      clearTimeout(timer);
      video.removeEventListener('loadedmetadata', markReadyAndPlay);
      video.removeEventListener('loadeddata', markReadyAndPlay);
      video.removeEventListener('canplay', markReadyAndPlay);
      video.removeEventListener('playing', markReadyAndPlay);
      events.forEach((ev) => window.removeEventListener(ev, onUserInteraction));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer) observer.disconnect();
    };
  }, [tryPlay]);

  const phoneCall = siteConfig?.phoneCall || '+33659519859';
  const phoneDisplay = siteConfig?.phoneDisplay || '06 59 51 98 59';

  return (
    <section
      ref={sectionRef}
      className="hero-section hero-cinematic"
      onClick={tryPlay}
      onTouchStart={tryPlay}
      onTouchEnd={tryPlay}
    >
      {/* Vidéo de fond optimisée FastStart (720p mobile / 1080p PC) avec poster instantané */}
      <video
        ref={setVideoNode}
        src={videoSrc}
        poster="/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        width="1920"
        height="1080"
        disablePictureInPicture
        disableRemotePlayback
        controls={false}
        onLoadedData={() => setIsVideoReady(true)}
        onCanPlay={() => setIsVideoReady(true)}
        onPlaying={() => setIsVideoReady(true)}
        className={`hero-bg-video ${isVideoReady ? 'is-ready' : ''}`}
      />

      {/* Overlay sombre pour contraste & lisibilité parfaite */}
      <div className="hero-bg-overlay"></div>

      {/* Contenu textuel & Call to action */}
      <div className="container hero-content">
        <h1 className={`hero-title ${isVisible ? 'is-visible' : ''}`}>
          Retrouvez la fraîcheur
          <br />
          d’une demeure impeccable,{' '}
          <span className="hero-title-accent">chez vous.</span>
        </h1>
        <p className={`hero-description ${isVisible ? 'is-visible' : ''}`}>
          Des sols étincelants, une douche détartrée, la vaisselle rangée et des vitres sans la moindre trace. Oubliez la corvée du ménage et confiez vos clés à un professionnel rigoureux, discret et assuré. Profitez enfin de votre temps libre.
        </p>

        <div className={`hero-cta-group ${isVisible ? 'is-visible' : ''}`}>
          <a href="#prestations" className="btn btn-primary" style={{ fontSize: '1.02rem', paddingInline: '1.85rem' }}>
            Nos prestations →
          </a>
          <a
            href={`tel:${phoneCall}`}
            className="btn btn-outline mono-num"
            style={{
              fontSize: '1.02rem',
              paddingInline: '1.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Appeler {phoneDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
