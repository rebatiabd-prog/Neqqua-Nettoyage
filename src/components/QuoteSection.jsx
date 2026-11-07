import { useState, useEffect, useRef } from 'react';
import { siteConfig, pricingPlans } from '../data/siteData';
import { Check, Clock, MessageCircle, Lock } from 'lucide-react';

const PENDING_SUBSCRIPTION_KEY = 'neqqua_pending_subscription_v1';

export default function QuoteSection({ selectedFormula = 'abonnement', onFormulaChange, isHighlighted = false }) {
  const abonnementPlan = Array.isArray(pricingPlans)
    ? pricingPlans.find((p) => p.id === 'abonnement')
    : null;
  const stripeAbonnementUrl = (
    abonnementPlan?.stripeUrl ||
    import.meta.env.VITE_STRIPE_ABONNEMENT_URL ||
    ''
  ).trim();
  const hasStripeCheckout = stripeAbonnementUrl.startsWith('http');

  const todayStr = (() => {
    try {
      return new Date().toISOString().split('T')[0] || '';
    } catch {
      return '';
    }
  })();

  const [returnPayload] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const params = new URLSearchParams(window.location.search);
      const isPaymentSuccess =
        params.get('abonnement') === 'succes' || params.get('payment') === 'success';
      if (!isPaymentSuccess) return null;
      const raw = window.localStorage.getItem(PENDING_SUBSCRIPTION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name && parsed.phone && parsed.city) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState(() => ({
    name: returnPayload?.name || '',
    phone: returnPayload?.phone || '',
    city: returnPayload?.city || '',
    email: returnPayload?.email || '',
    preferredDate: returnPayload?.preferredDate || '',
    timeOfDay: returnPayload?.timeOfDay || 'matin',
    notes: returnPayload?.notes || '',
    consent: true,
  }));

  const [isSubmitted, setIsSubmitted] = useState(() => Boolean(returnPayload));
  const [isPaidSubscription, setIsPaidSubscription] = useState(() => Boolean(returnPayload));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const hasProcessedReturnRef = useRef(false);

  // Au retour de Stripe (?abonnement=succes ou ?payment=success),
  // envoie l'e-mail contenant les infos du formulaire UNIQUEMENT après paiement validé.
  useEffect(() => {
    if (!returnPayload || hasProcessedReturnRef.current) return;
    hasProcessedReturnRef.current = true;

    try {
      window.localStorage.removeItem(PENDING_SUBSCRIPTION_KEY);
    } catch {
      // Ignore
    }

    if (typeof onFormulaChange === 'function') {
      onFormulaChange('abonnement');
    }

    fetch('/api/send-quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...returnPayload,
        paymentConfirmed: true,
      }),
    }).catch((err) => {
      console.error('[Erreur envoi post-paiement]', err);
    });

    const devisEl = document.getElementById('devis');
    if (devisEl) {
      setTimeout(() => {
        devisEl.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [returnPayload, onFormulaChange]);

  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleFormulaChange = (e) => {
    if (typeof onFormulaChange === 'function' && e?.target) {
      onFormulaChange(e.target.value);
    }
  };

  const getFormulaLabel = (val) => {
    if (val === 'abonnement') return 'Abonnement mensuel (299 €)';
    if (val === 'horaire') return "Prestation à l'heure (30 € / h)";
    return 'Autre / Devis sur-mesure';
  };

  const formatDateFr = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const getTimeSlotLabel = (val) => {
    if (val === 'matin') return 'Matin';
    if (val === 'midi') return 'Midi';
    if (val === 'soir') return 'Soir';
    return 'Matin';
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const trimmedName = formData?.name?.trim() || '';
    const trimmedPhone = formData?.phone?.trim() || '';
    const trimmedCity = formData?.city?.trim() || '';

    if (!trimmedName || !trimmedPhone || !trimmedCity) {
      alert('Veuillez renseigner votre nom, votre numéro de téléphone et votre commune en Essonne.');
      return;
    }
    if (!formData?.consent) {
      alert("Veuillez accepter l'utilisation de vos données pour le traitement de votre demande.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      name: trimmedName,
      phone: trimmedPhone,
      city: trimmedCity,
      email: formData?.email?.trim() || '',
      preferredDate: formData?.preferredDate || '',
      timeOfDay: formData?.timeOfDay || 'matin',
      notes: formData?.notes?.trim() || '',
      consent: Boolean(formData?.consent),
      formula: getFormulaLabel(selectedFormula),
    };

    // Si le client a choisi l'abonnement mensuel (299 €) et que le lien Stripe est configuré :
    // 1. On N'envoie PAS l'e-mail tout de suite.
    // 2. On sauvegarde les infos du formulaire dans localStorage.
    // 3. On redirige le client directement vers la page de paiement Stripe.
    // L'e-mail ne sera envoyé qu'à son retour après paiement validé (?abonnement=succes).
    if (selectedFormula === 'abonnement' && hasStripeCheckout) {
      try {
        window.localStorage.setItem(PENDING_SUBSCRIPTION_KEY, JSON.stringify(payload));
      } catch {
        // Fallback silencieux si stockage restreint
      }

      let checkoutUrl = stripeAbonnementUrl;
      if (payload.email) {
        const separator = checkoutUrl.includes('?') ? '&' : '?';
        checkoutUrl = `${checkoutUrl}${separator}prefilled_email=${encodeURIComponent(payload.email)}`;
      }

      window.location.assign(checkoutUrl);
      return;
    }

    try {
      const response = await fetch('/api/send-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Parsing sécurisé : ne plante jamais même si le serveur retourne du HTML (erreur 502/504)
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Une erreur est survenue lors de l'envoi.");
      }

      setIsPaidSubscription(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('[Erreur devis]', err);
      setSubmitError(
        "Impossible d'envoyer votre demande pour le moment. Veuillez réessayer ou nous joindre directement par téléphone ou WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneCall = siteConfig?.phoneCall || '+33659519859';
  const phoneDisplay = siteConfig?.phoneDisplay || '06 59 51 98 59';
  const whatsappNumber = siteConfig?.whatsappNumber || '33659519859';
  const email = siteConfig?.email || 'contact.neqqua@gmail.com';
  const hours = siteConfig?.hours || 'Lun – Sam : 9h00 – 12h00 / 13h30 – 17h30';

  return (
    <section id="devis" className="section-block quote-section" style={{ scrollMarginTop: '100px' }}>
      <span id="contact" style={{ display: 'block', position: 'relative', top: '-90px', visibility: 'hidden' }}></span>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '760px', marginInline: 'auto', marginBottom: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
          <h2 className="quote-main-title">
            Demander un devis gratuit ou appeler directement
          </h2>
          <p className="quote-main-desc">
            Remplissez notre formulaire en 1 minute ou joignez-nous directement par téléphone pour planifier votre première intervention en Essonne.
          </p>
        </div>

        <div className="quote-grid">
          <div className={`quote-box ${isHighlighted ? 'quote-box-highlight' : ''}`}>
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#16a34a',
                    fontSize: '2rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Check size={28} strokeWidth={3} aria-hidden="true" />
                </div>
                <h3
                  style={{
                    fontSize: '1.45rem',
                    color: '#0f172a',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {isPaidSubscription
                    ? 'Paiement validé & Abonnement confirmé !'
                    : 'Demande envoyée avec succès !'}
                </h3>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
                  Merci <strong style={{ color: '#0f172a' }}>{formData?.name || 'Client'}</strong>. Votre demande d'intervention à{' '}
                  <strong style={{ color: '#0f172a' }}>{formData?.city || "l'Essonne"}</strong> pour la formule{' '}
                  <strong style={{ color: '#0f172a' }}>{getFormulaLabel(selectedFormula)}</strong>
                  {Boolean(formData?.preferredDate) && (
                    <>
                      {' '}le <strong style={{ color: '#0f172a' }}>{formatDateFr(formData.preferredDate)}</strong> ({getTimeSlotLabel(formData.timeOfDay)})
                    </>
                  )}{' '}
                  a bien été transmise à l'équipe{' '}
                  <strong style={{ color: '#0f172a' }}>NEQQUA NETTOYAGE</strong>.
                </p>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    maxWidth: '400px',
                    margin: '0 auto 1.5rem auto',
                    fontSize: '0.88rem',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Clock size={16} style={{ color: '#0284c7', flexShrink: 0 }} aria-hidden="true" />
                  <span>
                    Réponse garantie sous <strong style={{ color: '#0f172a' }}>2 heures ouvrées</strong> par appel ou SMS au{' '}
                    <strong style={{ color: '#0f172a' }}>{formData?.phone || phoneDisplay}</strong>.
                  </span>
                </div>
                <a href={`tel:${phoneCall}`} className="pricing-btn-primary mono-num" style={{ display: 'inline-flex', fontSize: '0.9rem', padding: '0.75rem 1.25rem', textDecoration: 'none' }}>
                  Besoin urgent ? Appelez directement le {phoneDisplay}
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Formulaire de demande de devis & réservation</h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '0.85rem' }}>
                  Choisissez votre formule et détaillez votre besoin, réponse garantie sous 2h.
                </p>

                {/* Nom et prénom */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <label htmlFor="quote-name" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                    Nom et prénom *
                  </label>
                  <input
                    id="quote-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-mock"
                    placeholder="Ex: Sophie Martin"
                    required
                  />
                </div>

                {/* Téléphone */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <label htmlFor="quote-phone" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                    Téléphone *
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-mock mono-num"
                    placeholder="Ex: 06 12 34 56 78"
                    required
                  />
                </div>

                {/* Votre commune en Essonne */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <label htmlFor="quote-city" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                    Votre commune en Essonne *
                  </label>
                  <input
                    id="quote-city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-mock"
                    placeholder="Ex: Arpajon, Massy, Évry, Brétigny..."
                    required
                  />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <label htmlFor="quote-email" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                    Email
                  </label>
                  <input
                    id="quote-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-mock"
                    placeholder="Ex: nom@domaine.fr"
                  />
                </div>

                {/* Formule souhaitée */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <label htmlFor="quote-formula" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                    Formule souhaitée *
                  </label>
                  <select
                    id="quote-formula"
                    name="formula"
                    value={selectedFormula}
                    onChange={handleFormulaChange}
                    className="input-mock quote-select"
                  >
                    <option value="abonnement">Abonnement mensuel (299 €)</option>
                    <option value="horaire">Prestation à l'heure (30 € / h)</option>
                    <option value="sur-mesure">Autre / Devis sur-mesure</option>
                  </select>
                </div>

                {/* Date souhaitée & Moment de la journée */}
                <div className="quote-datetime-row">
                  <div>
                    <label htmlFor="quote-date" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                      Date souhaitée
                    </label>
                    <input
                      id="quote-date"
                      type="date"
                      name="preferredDate"
                      min={todayStr}
                      value={formData.preferredDate}
                      onChange={handleChange}
                      onClick={(e) => {
                        try {
                          if (e?.currentTarget && typeof e.currentTarget.showPicker === 'function') {
                            e.currentTarget.showPicker();
                          }
                        } catch {
                          /* fallback si showPicker n'est pas supporté */
                        }
                      }}
                      className="input-mock quote-date-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="quote-timeofday" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                      Moment de la journée
                    </label>
                    <select
                      id="quote-timeofday"
                      name="timeOfDay"
                      value={formData.timeOfDay}
                      onChange={handleChange}
                      className="input-mock quote-select"
                    >
                      <option value="matin">Matin</option>
                      <option value="midi">Midi</option>
                      <option value="soir">Soir</option>
                    </select>
                  </div>
                </div>

                {/* Votre besoin */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <label htmlFor="quote-notes" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
                    Votre besoin (surface, pièces, disponibilités) *
                  </label>
                  <textarea
                    id="quote-notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input-mock"
                    rows={2}
                    placeholder="Ex: Appartement 75 m², besoin d'un passage régulier le mardi matin..."
                    required
                  />
                </div>

                {/* Case à cocher de consentement */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    marginBottom: '1rem',
                    fontSize: '0.82rem',
                    color: '#475569',
                    lineHeight: 1.45,
                  }}
                >
                  <input
                    type="checkbox"
                    id="privacy-check"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    style={{ marginTop: '0.2rem', cursor: 'pointer', accentColor: '#0284c7', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="privacy-check" style={{ cursor: 'pointer' }}>
                    J'accepte que mes données soient utilisées pour traiter ma demande, conformément à la politique de confidentialité.
                  </label>
                </div>

                {submitError && (
                  <div
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.86rem',
                      lineHeight: 1.45,
                      marginBottom: '0.85rem',
                    }}
                  >
                    ⚠️ {submitError}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="quote-submit-btn"
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.75 : 1, cursor: isSubmitting ? 'wait' : 'pointer' }}
                  >
                    <span>
                      {isSubmitting
                        ? selectedFormula === 'abonnement' && hasStripeCheckout
                          ? 'Redirection vers le paiement sécurisé...'
                          : 'Transmission en cours...'
                        : selectedFormula === 'abonnement'
                          ? 'Continuer vers le paiement sécurisé (299 € / mois)'
                          : 'Envoyer ma demande de devis gratuit'}
                    </span>
                    {!isSubmitting && <span className="quote-submit-arrow" aria-hidden="true">→</span>}
                  </button>
                  {selectedFormula === 'abonnement' && (
                    <div
                      style={{
                        marginTop: '0.6rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        fontSize: '0.78rem',
                        color: '#64748b',
                      }}
                    >
                      <Lock size={12} strokeWidth={2.4} style={{ color: '#0284c7', flexShrink: 0 }} aria-hidden="true" />
                      <span>Votre demande est transmise uniquement après validation du paiement sur Stripe.</span>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          <aside className="contact-side-card">
            <div>
              <span className="mono-num contact-side-tag">
                TRIPLE CANAL DIRECT & RAPIDE
              </span>
              <h3 className="contact-side-title">Appelez-nous directement</h3>
              <p className="contact-side-desc">
                En 2 minutes par téléphone ou par message instantané, nous faisons le point sur les pièces à nettoyer et vous donnons un tarif immédiat.
              </p>
              <a
                href={`tel:${phoneCall}`}
                className="contact-side-phone-box"
                aria-label={`Appeler directement le ${phoneDisplay}`}
              >
                <div className="phone-icon-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="mono-num phone-number">
                  <span>{phoneDisplay}</span>
                </div>
                <div className="phone-arrow" aria-hidden="true">
                  →
                </div>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Bonjour%20NEQQUA%20NETTOYAGE,%20je%20souhaite%20des%20renseignements`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  marginBottom: '1.35rem',
                  fontSize: '0.9rem',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', justifyContent: 'center' }}>
                  <MessageCircle size={16} aria-hidden="true" />
                  <span>Poser une question sur WhatsApp</span>
                </span>
              </a>
            </div>
            <div className="contact-side-info">
              <div><strong>E-mail :</strong> {email}</div>
              <div style={{ marginTop: '0.35rem' }}><strong>Horaires :</strong> {hours}</div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
