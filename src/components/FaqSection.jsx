import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { faqItems } from '../data/siteData';

export default function FaqSection() {
  const [openId, setOpenId] = useState('faq-1');
  const listRef = useRef(null);
  const lastWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0);

  const measureAndLock = useCallback(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    const items = Array.from(listEl.querySelectorAll('.faq-accordion-item'));
    if (!items.length) return;

    let totalClosedHeight = 0;
    let maxAnswerHeight = 0;

    items.forEach((item) => {
      const trigger = item.querySelector('.faq-accordion-trigger');
      if (trigger) {
        totalClosedHeight += trigger.offsetHeight + 2;
      }
      const body = item.querySelector('.faq-accordion-body');
      const inner = item.querySelector('.faq-accordion-inner');
      const h = body ? body.offsetHeight : inner ? inner.scrollHeight : 0;
      if (h > maxAnswerHeight) {
        maxAnswerHeight = h;
      }
    });

    let gapPx = 12;
    if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
      const parsedGap = parseFloat(window.getComputedStyle(listEl).rowGap);
      if (!Number.isNaN(parsedGap)) {
        gapPx = parsedGap;
      }
    }

    const gapTotal = (items.length - 1) * gapPx;
    const targetHeight = Math.ceil(totalClosedHeight + gapTotal + maxAnswerHeight + 6);

    listEl.style.minHeight = `${targetHeight}px`;
  }, []);

  useLayoutEffect(() => {
    measureAndLock();

    let resizeTimer = null;
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      const currentWidth = window.innerWidth;
      // Ignore les variations de hauteur de barre d'adresse mobile si la largeur n'a pas changé
      if (Math.abs(currentWidth - lastWidthRef.current) < 2) return;
      lastWidthRef.current = currentWidth;

      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measureAndLock, 50);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    if (document.fonts?.ready) {
      document.fonts.ready.then(measureAndLock).catch(() => {});
    }

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [measureAndLock]);

  const toggleItem = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const faqList = Array.isArray(faqItems) ? faqItems : [];

  return (
    <section id="faq" className="section-block faq-section" style={{ scrollMarginTop: '100px' }}>
      <span id="questions" style={{ display: 'block', position: 'relative', top: '-90px', visibility: 'hidden' }}></span>
      <div className="container">
        <div className="faq-grid">
          {/* Colonne gauche : Titre */}
          <div>
            <h2 className="faq-main-title">
              Questions fréquentes
            </h2>
          </div>

          {/* Colonne droite : Blocs indépendants décollés avec assise DOM verrouillée */}
          <div
            ref={listRef}
            className="faq-accordion-list"
          >
            {faqList.map((item, idx) => {
              const itemId = item?.id || `faq-${idx}`;
              const isOpen = openId === itemId;
              return (
                <div key={itemId} className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="faq-accordion-trigger"
                    onClick={() => toggleItem(itemId)}
                    aria-expanded={isOpen}
                  >
                    <span>{item?.question || ''}</span>
                    <svg
                      className="faq-chevron"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className="faq-accordion-content">
                    <div className="faq-accordion-inner">
                      <div className="faq-accordion-body">{item?.answer || ''}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
