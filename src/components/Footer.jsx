import { useState, useEffect } from 'react';
import { siteConfig } from '../data/siteData';
import { MessageCircle } from 'lucide-react';

export default function Footer() {
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLegalOpen(false);
    };
    if (isLegalOpen && typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      }
    };
  }, [isLegalOpen]);

  const brandName = siteConfig?.brandName || 'NEQQUA';
  const brandSuffix = siteConfig?.brandSuffix || 'NETTOYAGE';
  const logoEmblem = siteConfig?.logoEmblem || '/logo-neqqua-horizontal.png';
  const phoneCall = siteConfig?.phoneCall || '+33659519859';
  const phoneDisplay = siteConfig?.phoneDisplay || '06 59 51 98 59';
  const whatsappNumber = siteConfig?.whatsappNumber || '33659519859';
  const email = siteConfig?.email || 'contact.neqqua@gmail.com';
  const hours = siteConfig?.hours || 'Lun – Sam (07h30 – 19h30)';

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Colonne 1 : Identité & Marque avec dimensions pour 0 CLS */}
          <div className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.85rem' }}>
              <img
                src={logoEmblem}
                alt={`${brandName} ${brandSuffix}`}
                width="180"
                height="48"
                loading="lazy"
                decoding="async"
                style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            <p className="footer-brand-desc">
              Société de nettoyage et d’entretien à domicile. Prestations soignées, régulières ou ponctuelles avec du personnel qualifié et du matériel professionnel.
            </p>

            <div className="footer-local-anchor" style={{ marginTop: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#94a3b8' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0ea5e9' }}></span>
              <span>Basés à Arpajon • Toute l'Essonne</span>
            </div>
          </div>

          {/* Colonne 2 : Liens rapides / Navigation */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-nav-links">
              <li>
                <a href="#prestations">
                  <span>→</span> Nos prestations à domicile
                </a>
              </li>
              <li>
                <a href="#tarifs">
                  <span>→</span> Tarifs & formules (à l'heure / mois)
                </a>
              </li>
              <li>
                <a href="#zone">
                  <span>→</span> Zone d'intervention (Essonne)
                </a>
              </li>
              <li>
                <a href="#devis">
                  <span>→</span> Demande de devis gratuit
                </a>
              </li>
              <li>
                <a href="#avis">
                  <span>→</span> Avis de nos clients
                </a>
              </li>
              <li>
                <a href="#faq">
                  <span>→</span> Questions fréquentes (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Contact & Horaires */}
          <div className="footer-contact-col">
            <h4 className="footer-col-title">Contact & Horaires</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item footer-contact-phone-item">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#0369a1"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="footer-phone-icon"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Appel direct :</div>
                  <a href={`tel:${phoneCall}`} className="mono-num footer-contact-phone" style={{ fontSize: '1.05rem' }}>
                    {phoneDisplay}
                  </a>
                </div>
              </li>

              <li className="footer-contact-item footer-contact-whatsapp-item">
                <MessageCircle size={18} className="footer-whatsapp-icon" aria-hidden="true" />
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>WhatsApp 7j/7 :</div>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Bonjour%20NEQQUA%20NETTOYAGE,%20je%20souhaite%20des%20renseignements`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-contact-whatsapp"
                  >
                    <span>Envoyer un message WhatsApp</span>
                    <span className="footer-wa-arrow">→</span>
                  </a>
                </div>
              </li>

              <li className="footer-contact-item">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>E-mail :</div>
                  <a href={`mailto:${email}`}>
                    {email}
                  </a>
                </div>
              </li>

              <li className="footer-contact-item">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Disponibilité :</div>
                  <span style={{ color: '#cbd5e1' }}>{hours}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre inférieure de copyright */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} {brandName} {brandSuffix}. Tous droits réservés.
          </div>
          <div className="footer-bottom-meta">
            <span>Déclaré & Assuré RC Pro</span>
            <span aria-hidden="true">•</span>
            <span>Ménage & entretien à domicile</span>
            <span aria-hidden="true">•</span>
            <button
              type="button"
              onClick={() => setIsLegalOpen(true)}
              className="footer-legal-link"
            >
              Mentions Légales
            </button>
          </div>
        </div>
      </div>

      {/* Modale interactive Mentions Légales & RGPD */}
      {isLegalOpen && (
        <div
          className="legal-modal-backdrop"
          onClick={() => setIsLegalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          <div
            className="legal-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="legal-modal-header">
              <h3 id="legal-modal-title" className="legal-modal-title">
                Mentions Légales & RGPD
              </h3>
              <button
                type="button"
                className="legal-modal-close"
                onClick={() => setIsLegalOpen(false)}
                aria-label="Fermer les mentions légales"
              >
                ✕
              </button>
            </div>
            <div className="legal-modal-body">
              <section className="legal-section">
                <h4>1. Éditeur du site & Coordonnées</h4>
                <p>
                  Le présent site internet est édité par la société <strong>{brandName} {brandSuffix}</strong>, spécialisée dans les services de nettoyage et d'entretien à domicile.
                </p>
                <ul>
                  <li><strong>Raison sociale :</strong> {brandName} {brandSuffix}</li>
                  <li><strong>Activité :</strong> Entretien, ménage et nettoyage à domicile</li>
                  <li><strong>Téléphone direct :</strong> <a href={`tel:${phoneCall}`}>{phoneDisplay}</a></li>
                  <li><strong>Adresse e-mail :</strong> <a href={`mailto:${email}`}>{email}</a></li>
                  <li><strong>Immatriculation :</strong> RCS / En cours d’immatriculation</li>
                  <li><strong>Responsable de la publication :</strong> Direction {brandName} {brandSuffix}</li>
                </ul>
              </section>

              <section className="legal-section">
                <h4>2. Hébergement du site</h4>
                <p>
                  Ce site web est hébergé sur les infrastructures sécurisées de :<br />
                  <strong>Vercel Inc.</strong> — 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
                </p>
              </section>

              <section className="legal-section">
                <h4>3. Protection des données personnelles (RGPD)</h4>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD 2016/679) et à la loi française « Informatique et Libertés », les données personnelles collectées via le formulaire de devis (nom, prénom, numéro de téléphone, e-mail, précisions sur vos besoins) font l'objet d'un traitement destiné exclusivement à :
                </p>
                <ul>
                  <li>L'établissement et la transmission d'un devis personnalisé.</li>
                  <li>La prise de contact direct pour la planification d'interventions à votre domicile.</li>
                </ul>
                <p>
                  Vos données ne sont <strong>en aucun cas vendues, louées ou cédées</strong> à des tiers ou plateformes publicitaires. Elles sont conservées pour une durée strictement nécessaire au traitement de la demande commerciale.
                </p>
                <p>
                  Vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données personnelles. Vous pouvez exercer ce droit à tout moment par simple e-mail à : <strong>{email}</strong>.
                </p>
              </section>

              <section className="legal-section">
                <h4>4. Propriété intellectuelle</h4>
                <p>
                  L'ensemble des éléments figurant sur ce site (structure générale, textes, photographies, vidéos, identité visuelle, logos et graphismes) est protégé par les dispositions du Code de la Propriété Intellectuelle. Toute reproduction, représentation ou diffusion, totale ou partielle, sans l'accord préalable écrit de {brandName} {brandSuffix} est formellement interdite.
                </p>
              </section>

              <section className="legal-section">
                <h4>5. Assurance & Responsabilité</h4>
                <p>
                  Toutes les interventions de nettoyage et d'entretien à domicile sont couvertes par une assurance responsabilité civile professionnelle garantissant la sécurité des biens et des installations de nos clients.
                </p>
              </section>
            </div>
            <div className="legal-modal-footer">
              <button
                type="button"
                className="btn quote-submit-btn"
                style={{ padding: '0.65rem 1.8rem', fontSize: '0.9rem' }}
                onClick={() => setIsLegalOpen(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
