import { useState, useRef, useEffect, useCallback } from 'react';
import { reviewsData } from '../data/siteData';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReviewsSection() {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const reviewsList = Array.isArray(reviewsData) ? reviewsData : [];

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(Boolean(entry?.isIntersecting));
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const checkScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    // Calcul optimisé de l'avis actif
    const firstCard = el.querySelector('.review-card-modern');
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth + 24;
      const index = Math.round(el.scrollLeft / cardWidth);
      setActiveReviewIndex(Math.max(0, Math.min(reviewsList.length - 1, index)));
    }
  }, [reviewsList.length]);

  // Synchronisation du scroll tactile avec requestAnimationFrame pour fluidité 60/120 FPS
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    checkScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [checkScroll]);

  // Défilement automatique doux temporisé (uniquement sur grand écran et quand la section est visible)
  useEffect(() => {
    if (isPaused || !isVisible || (typeof window !== 'undefined' && window.innerWidth <= 768)) return;
    const interval = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 20) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 360, behavior: 'smooth' });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, isVisible]);

  const scrollPrev = () => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: -360, behavior: 'smooth' });
  };

  const scrollNext = () => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: 360, behavior: 'smooth' });
  };

  const scrollToIndex = (idx) => {
    const el = trackRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('.review-card-modern');
    if (cards[idx]) {
      cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      setActiveReviewIndex(idx);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="avis"
      className="section-block reviews-section"
      style={{ scrollMarginTop: '100px' }}
    >
      <div className="container">
        {/* Header avec Titre et Boutons de défilement Suivant / Précédent */}
        <div className={`reviews-carousel-header ${isVisible ? 'is-visible' : ''}`}>
          <div>
            <h2 className="reviews-main-title">
              Avis de nos <span className="reviews-title-accent">clients</span>
            </h2>
          </div>

          <div className="reviews-nav-controls">
            <button
              type="button"
              className="reviews-nav-btn"
              onClick={scrollPrev}
              disabled={!canScrollLeft}
              aria-label="Avis précédents"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="reviews-nav-btn"
              onClick={scrollNext}
              disabled={!canScrollRight}
              aria-label="Avis suivants"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Piste de défilement horizontal avec glissement fluide & snap */}
        <div
          ref={trackRef}
          className="reviews-track"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          tabIndex={0}
          aria-label="Carrousel des avis clients"
        >
          {reviewsList.map((rev, index) => {
            const starCount = Math.max(0, Math.min(5, Math.floor(Number(rev?.stars) || 5)));
            const delay = `${index * 80 + 60}ms`;

            return (
              <div
                key={rev?.id || index}
                className={`review-card-modern ${isVisible ? 'is-visible' : ''}`}
                style={{
                  '--card-delay': delay,
                }}
              >
                {/* En-tête : Étoiles et guillemets doux en filigrane */}
                <div className="review-card-top">
                  <div className="review-stars-row" aria-label={`${starCount} étoiles sur 5`}>
                    {Array.from({ length: starCount }).map((_, i) => (
                      <Star key={i} size={15} fill="#0369a1" stroke="none" aria-hidden="true" />
                    ))}
                  </div>
                  <div className="review-card-quote-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>

                {/* Corps : Texte de l'avis client */}
                <p className="review-card-body">{rev?.text || ''}</p>

                {/* Filet séparateur ultra-fin */}
                <div className="review-card-divider"></div>

                {/* Bas : Auteur avec dimensions fixes pour 0 CLS */}
                <div className="review-card-author">
                  <img
                    src={rev?.avatar || '/images/avatar-default.jpg'}
                    alt={rev?.name || 'Client NEQQUA'}
                    className="review-author-img"
                    width="44"
                    height="44"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="review-author-info">
                    <div className="review-author-name">{rev?.name || 'Client vérifié'}</div>
                    <div className="review-author-role">{rev?.role || 'Essonne'}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicateurs de défilement mobile avec points tactiles (44px target) */}
        <div className="reviews-mobile-indicators" aria-label="Pagination des avis">
          {reviewsList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`reviews-indicator-dot ${activeReviewIndex === idx ? 'is-active' : ''}`}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Afficher l'avis ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
