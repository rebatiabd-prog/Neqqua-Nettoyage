import { siteConfig } from '../data/siteData';
import { MessageCircle } from 'lucide-react';

export default function MobileStickyBar() {
  return (
    <div className="mobile-sticky-bar" aria-label="Actions rapides smartphone">
      <a
        href={`tel:${siteConfig.phoneCall}`}
        className="btn btn-outline mono-num"
        style={{
          flex: 1,
          textAlign: 'center',
          padding: '0.65rem 0.35rem',
          fontSize: '0.82rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem',
          minHeight: '40px',
        }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span>Appeler</span>
      </a>
      <a
        href={`https://wa.me/${siteConfig.whatsappNumber}?text=Bonjour%20NEQQUA%20NETTOYAGE,%20je%20souhaite%20obtenir%20un%20devis`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp"
        style={{
          flex: 1,
          textAlign: 'center',
          padding: '0.65rem 0.35rem',
          fontSize: '0.82rem',
          minHeight: '40px',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <MessageCircle size={14} aria-hidden="true" />
          <span>WhatsApp</span>
        </span>
      </a>
      <a
        href="#devis"
        className="btn btn-primary"
        style={{
          flex: 1,
          textAlign: 'center',
          padding: '0.65rem 0.35rem',
          fontSize: '0.82rem',
          minHeight: '40px',
        }}
      >
        <span>Devis →</span>
      </a>
    </div>
  );
}

