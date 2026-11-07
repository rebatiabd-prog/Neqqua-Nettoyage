import { useState, useRef, useEffect } from 'react';
import { pricingPlans } from '../data/siteData';
import { Check, Lock } from 'lucide-react';
import OriginButton from './ui/OriginButton';

export default function PricingSection({ onSelectPlan }) {
  const [isVisible, setIsVisible] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('abonnement') === 'succes' || params.get('payment') === 'success';
  });
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

  const handleSelect = (plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan.id);
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

        {paymentSuccess && (
          <div
            role="status"
            style={{
              maxWidth: '680px',
              marginInline: 'auto',
              marginBottom: '2rem',
              padding: '1.1rem 1.4rem',
              borderRadius: '14px',
              background: 'rgba(3, 105, 161, 0.16)',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              color: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              fontSize: '0.95rem',
            }}
          >
            <span>
              <strong>Votre abonnement mensuel (299 € / mois) est confirmé !</strong> Notre équipe vous contacte sous 24h pour planifier vos créneaux fixes.
            </span>
            <button
              type="button"
              onClick={() => setPaymentSuccess(false)}
              style={{
                color: '#38bdf8',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0,
              }}
            >
              Fermer
            </button>
          </div>
        )}

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

              <div>
                <OriginButton
                  variant={plan.isFeatured ? 'primary' : 'outline'}
                  onClick={() => handleSelect(plan)}
                >
                  {plan.ctaText}
                </OriginButton>

                {plan.id === 'abonnement' && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.78rem',
                      color: '#94a3b8',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Lock size={12} strokeWidth={2.4} style={{ color: '#38bdf8', flexShrink: 0 }} aria-hidden="true" />
                      <span>Paiement sécurisé via Stripe • Sans engagement</span>
                    </span>
                    {plan.stripePortalUrl && plan.stripePortalUrl.trim().startsWith('http') && (
                      <a
                        href={plan.stripePortalUrl.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#38bdf8',
                          textDecoration: 'underline',
                          textUnderlineOffset: '3px',
                          fontWeight: 500,
                        }}
                      >
                        Déjà abonné ? Gérer ou résilier mon abonnement
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
