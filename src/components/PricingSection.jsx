import { useState, useRef, useEffect } from 'react';
import { pricingPlans } from '../data/siteData';
import { Check } from 'lucide-react';
import OriginButton from './ui/OriginButton';

export default function PricingSection({ onSelectPlan }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const handleSelect = (planId) => {
    if (onSelectPlan) {
      onSelectPlan(planId);
    } else {
      const el = document.getElementById('devis');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="tarifs"
      className="section-block pricing-section"
      style={{ scrollMarginTop: '100px' }}
    >
      <div className="container">
        <div
          className={`pricing-header ${isVisible ? 'is-visible' : ''}`}
          style={{ textAlign: 'center', maxWidth: '860px', marginInline: 'auto', marginBottom: 'clamp(2rem, 3.5vw, 3rem)' }}
        >
          <h2 className="pricing-main-title">
            Nos 2 formules claires, adaptées à votre rythme
          </h2>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.isFeatured ? 'pricing-card-featured' : ''} ${isVisible ? 'is-visible' : ''}`}
              style={{
                '--pricing-delay': `${index * 110 + 60}ms`,
              }}
            >
              {plan.featuredTag && <div className="pricing-featured-tag">{plan.featuredTag}</div>}

              <div>
                <h3 className="pricing-card-title">
                  {plan.title}
                </h3>
                <div className="pricing-amount">
                  <span className="pricing-num">{plan.price}</span>
                  <span className="pricing-unit">{plan.unit}</span>
                </div>
                <p className="pricing-card-desc">
                  {plan.desc}
                </p>

                <div className="pricing-divider"></div>

                <ul className="pricing-features">
                  {plan.features.map((feat, idx) => (
                    <li key={idx}>
                      <span className="pricing-check">
                        <Check size={16} strokeWidth={2.8} aria-hidden="true" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <OriginButton
                variant={plan.isFeatured ? 'primary' : 'outline'}
                onClick={() => handleSelect(plan.id)}
              >
                {plan.ctaText}
              </OriginButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
