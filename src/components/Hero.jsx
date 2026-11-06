import { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../data/siteData';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);

  const tryPlay = () => {
    const video = videoRef.current;
    if (video && video.paused) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(() => {});
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Configuration matérielle native stricte pour iOS Safari & Android
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      // Démarrage initial dès que les métadonnées sont chargées
      video.addEventListener('loadedmetadata', tryPlay);
      video.addEventListener('canplay', tryPlay);
      video.addEventListener('loadeddata', tryPlay);
      tryPlay();

      // Écouteurs de déblocage tactiles officiels reconnus par Apple (touchend, pointerup, click)
      const events = ['touchend', 'click', 'pointerup', 'scroll'];
      const onUserInteraction = () => {
        tryPlay();
        if (video && !video.paused) {
          events.forEach((ev) => window.removeEventListener(ev, onUserInteraction));
        }
      };

      events.forEach((ev) => window.addEventListener(ev, onUserInteraction, { passive: true }));

      // Reprise automatique si l'utilisateur change d'onglet ou réactive son écran
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          tryPlay();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsVideoReady(true);
      }, 150);

      return () => {
        video.removeEventListener('loadedmetadata', tryPlay);
        video.removeEventListener('canplay', tryPlay);
        video.removeEventListener('loadeddata', tryPlay);
        events.forEach((ev) => window.removeEventListener(ev, onUserInteraction));
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        clearTimeout(timer);
      };
    } else {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsVideoReady(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  const phoneCall = siteConfig?.phoneCall || '+33659519859';
  const phoneDisplay = siteConfig?.phoneDisplay || '06 59 51 98 59';

  return (
    <section
      className="hero-section hero-cinematic"
      onClick={tryPlay}
      onTouchEnd={tryPlay}
    >
      {/* Vidéo de fond avec attributs directs et boucle matérielle native sans coupure */}
      <video
        ref={(el) => {
          if (el) {
            el.muted = true;
            el.defaultMuted = true;
          }
          videoRef.current = el;
        }}
        src="/hero-bg.mp4"
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
        className={`hero-bg-video ${isVideoReady ? 'is-ready' : ''}`}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

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
