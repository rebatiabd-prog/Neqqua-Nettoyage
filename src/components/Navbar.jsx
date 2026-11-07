import { useState, useEffect, useCallback } from 'react';
import { siteConfig } from '../data/siteData';
import { MessageCircle, Phone, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Détection du scroll cadencée avec requestAnimationFrame (60 FPS, zéro re-render inutile)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 25);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermeture automatique lors du redimensionnement vers grand écran avec debouncing
  useEffect(() => {
    let resizeTimer = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 960) {
          setIsMobileMenuOpen(false);
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Verrouillage du scroll body & gestion de la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const closeMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const phoneCall = siteConfig?.phoneCall || '+33659519859';
  const phoneDisplay = siteConfig?.phoneDisplay || '06 59 51 98 59';
  const whatsappNumber = siteConfig?.whatsappNumber || '33659519859';
  const logoEmblem = siteConfig?.logoEmblem || '/logo-neqqua-horizontal.png';

  return (
    <>
      <header className={`navbar ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo marque avec dimensions explicites pour 0 CLS et chargement prioritaire LCP */}
          <a
            href="#top"
            className="brand-block"
            aria-label="NEQQUA NETTOYAGE - Accueil"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              closeMenu();
            }}
          >
            <img
              src={logoEmblem}
              alt="NEQQUA NETTOYAGE"
              className="brand-logo-img"
              width="230"
              height="44"
              fetchPriority="high"
              decoding="async"
            />
          </a>

          {/* Navigation Desktop */}
          <nav className="nav-links" aria-label="Navigation principale">
            <a href="#prestations">Prestations</a>
            <a href="#tarifs">Tarifs</a>
            <a href="#zone">Zone d'intervention</a>
            <a href="#faq">Questions Fréquentes</a>
          </nav>

          {/* Actions & Bouton Burger */}
          <div className="navbar-actions">
            <a href="#devis" className="btn-nav-quote">
              Demander un devis
            </a>

            <a
              href={`tel:${phoneCall}`}
              className="btn-nav-mobile-phone"
              aria-label={`Appeler directement le ${phoneDisplay}`}
              title={`Appeler le ${phoneDisplay}`}
            >
              <Phone size={19} strokeWidth={2.2} aria-hidden="true" />
            </a>

            {/* Bouton burger animé 60 FPS (Zone tactile 44x44px minimum) */}
            <button
              type="button"
              className={`btn-burger ${isMobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <span className="burger-box" aria-hidden="true">
                <span className="burger-line burger-line-top"></span>
                <span className="burger-line burger-line-middle"></span>
                <span className="burger-line burger-line-bottom"></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Voile d'assombrissement indépendant (Backdrop) */}
      <div
        className={`mobile-nav-backdrop ${isMobileMenuOpen ? 'is-visible' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Tiroir coulissant 100dvh (Drawer Architectural) */}
      <aside
        id="mobile-nav-drawer"
        className={`mobile-nav-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
      >
        {/* En-tête du tiroir avec Logo et Bouton Fermer */}
        <div className="mobile-drawer-header">
          <a
            href="#top"
            className="mobile-drawer-brand"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              closeMenu();
            }}
          >
            <img
              src={logoEmblem}
              alt="NEQQUA NETTOYAGE"
              className="mobile-drawer-logo"
              width="180"
              height="36"
              loading="lazy"
              decoding="async"
            />
          </a>
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={closeMenu}
            aria-label="Fermer le menu"
          >
            <X size={22} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        {/* Corps : Liens du menu mobile */}
        <nav className="mobile-nav-list" aria-label="Liens du menu mobile">
          <a href="#prestations" className="mobile-nav-item" onClick={closeMenu}>
            <span className="mobile-nav-label">Nos prestations</span>
            <span className="mobile-nav-arrow" aria-hidden="true">→</span>
          </a>

          <a href="#tarifs" className="mobile-nav-item" onClick={closeMenu}>
            <span className="mobile-nav-label">Tarifs & Formules</span>
            <span className="mobile-nav-arrow" aria-hidden="true">→</span>
          </a>

          <a href="#zone" className="mobile-nav-item" onClick={closeMenu}>
            <span className="mobile-nav-label">Zone d'intervention (Essonne)</span>
            <span className="mobile-nav-arrow" aria-hidden="true">→</span>
          </a>

          <a href="#avis" className="mobile-nav-item" onClick={closeMenu}>
            <span className="mobile-nav-label">Avis de nos clients</span>
            <span className="mobile-nav-arrow" aria-hidden="true">→</span>
          </a>

          <a href="#faq" className="mobile-nav-item" onClick={closeMenu}>
            <span className="mobile-nav-label">Questions fréquentes (FAQ)</span>
            <span className="mobile-nav-arrow" aria-hidden="true">→</span>
          </a>
        </nav>

        {/* Pied de tiroir : Zone de conversion accessible au pouce */}
        <div className="mobile-drawer-footer">
          <a href="#devis" className="btn btn-primary mobile-drawer-cta" onClick={closeMenu}>
            Demander un devis gratuit →
          </a>

          <div className="mobile-drawer-contact-grid">
            <a
              href={`tel:${phoneCall}`}
              className="mobile-drawer-contact-btn mono-num"
              onClick={closeMenu}
            >
              <Phone size={16} strokeWidth={2.2} aria-hidden="true" />
              <span>{phoneDisplay}</span>
            </a>

            <a
              href={`https://wa.me/${whatsappNumber}?text=Bonjour%20NEQQUA%20NETTOYAGE,%20je%20souhaite%20des%20renseignements`}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-drawer-contact-btn mobile-drawer-wa"
              onClick={closeMenu}
            >
              <MessageCircle size={16} aria-hidden="true" />
              <span>WhatsApp 7j/7</span>
            </a>
          </div>

          <div className="mobile-drawer-reassurance">
            <span>📍 Basé à Arpajon • Toute l'Essonne • Intervention sous 24h-48h</span>
          </div>
        </div>
      </aside>
    </>
  );
}
