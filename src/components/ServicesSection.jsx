import { useEffect, useRef, useState } from 'react';
import { servicesData } from '../data/siteData';

function PillarItem({ service }) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef(null);

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

    const el = itemRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <a
      ref={itemRef}
      href="#tarifs"
      className={`service-pillar-item ${isVisible ? 'is-visible' : ''}`}
      aria-label={`Obtenir un tarif pour ${service?.title || 'la prestation'}`}
    >
      {/* Photo réelle avec cadre overflow-hidden et zoom GPU 700ms */}
      <div className="pillar-thumb">
        <img
          src={service?.imageSrc}
          alt={service?.title || 'Prestation de nettoyage'}
          className="pillar-img"
          width="480"
          height="300"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="pillar-body">
        <h3 className="pillar-title">{service?.title || ''}</h3>
        <p className="pillar-desc">{service?.desc || ''}</p>
      </div>

      <div className="pillar-action">
        <span className="pillar-link-text">
          <span>Obtenir un tarif</span>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pillar-link-arrow"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
      </div>
    </a>
  );
}

export default function ServicesSection() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      const timer = setTimeout(() => setIsHeaderVisible(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderVisible(Boolean(entry?.isIntersecting));
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    const el = headerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const servicesList = Array.isArray(servicesData) ? servicesData : [];

  return (
    <section
      id="prestations"
      className="section-block services-section"
      style={{ scrollMarginTop: '100px' }}
    >
      <div className="container">
        {/* En-tête de section avec détection au scroll */}
        <div
          ref={headerRef}
          className={`services-header ${isHeaderVisible ? 'is-visible' : ''}`}
        >
          <h2 className="services-main-title">
            Ce que nous prenons en charge chez vous.
          </h2>
        </div>

        {/* Liste avec micro-interactions cadencées à 60 FPS */}
        <div className="services-streamlined-list">
          {servicesList.map((service, index) => (
            <PillarItem key={service?.id || index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
