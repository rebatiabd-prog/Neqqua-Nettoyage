import { useState, useRef, useEffect } from 'react';
import { zoneInterventionData } from '../data/siteData';
import { Clock, Car, MapPin, CheckCircle2, ArrowRight, ExternalLink, RotateCcw } from 'lucide-react';

export default function ZoneSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTown, setSelectedTown] = useState(null);
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

  const scrollToDevis = () => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('devis');
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const guaranteesIcons = [Clock, Car, MapPin];
  const stripDelays = ['0.16s', '0.24s', '0.32s'];
  const colDelays = ['0.40s', '0.50s', '0.60s', '0.70s'];

  const guaranteesList = Array.isArray(zoneInterventionData?.guarantees) ? zoneInterventionData.guarantees : [];
  const sectorsList = Array.isArray(zoneInterventionData?.sectors) ? zoneInterventionData.sectors : [];

  const mapQuery = selectedTown
    ? `${selectedTown}, Essonne, France`
    : 'Arpajon, Essonne, France';
  const mapZoom = selectedTown ? 13 : 10;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=m&z=${mapZoom}&ie=UTF8&iwloc=&output=embed&hl=fr`;
  const mapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <section ref={sectionRef} id="zone" className="section-block zone-section">
      <div className="container">
        {/* Domino 1 : En-tête (Titre puis sous-titre) */}
        <div className={`zone-section-header ${isVisible ? 'is-visible' : ''}`}>
          <h2 className="zone-title">
            {zoneInterventionData?.title || "Basés à Arpajon, nous intervenons dans toute l'Essonne"}
          </h2>
          <p className="zone-subtitle">
            {zoneInterventionData?.subtitle || "Particuliers et résidences : profitez d'un service de ménage à domicile de proximité, fiable et réactif sur l'ensemble des communes du département."}
          </p>
        </div>

        {/* Domino 2 : 3 Piliers de réassurance qui tombent individuellement avec icône sécurisée */}
        <div className="zone-reassurance-strip">
          {guaranteesList.map((item, idx) => {
            const IconComponent = guaranteesIcons[idx] || CheckCircle2;
            const delay = stripDelays[idx] || '0.2s';
            return (
              <div
                key={idx}
                className={`zone-reassurance-item ${isVisible ? 'is-visible' : ''}`}
                style={{ '--zone-item-delay': delay }}
              >
                <div className="zone-reassurance-icon">
                  <IconComponent size={19} strokeWidth={2.4} aria-hidden="true" />
                </div>
                <div>
                  <div className="zone-reassurance-title">{item?.title || ''}</div>
                  <div className="zone-reassurance-desc">{item?.desc || ''}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Domino 3 : Disposition Côte à Côte (Secteurs Essonne + Google Maps Interactive) */}
        <div className="zone-content-split">
          <div className="zone-editorial-grid">
            {sectorsList.map((sec, index) => {
              const townsList = Array.isArray(sec?.towns) ? sec.towns : [];
              const delay = colDelays[index] || '0.4s';
              return (
                <div
                  key={sec?.id || index}
                  className={`zone-editorial-col ${isVisible ? 'is-visible' : ''}`}
                  style={{ '--zone-col-delay': delay }}
                >
                  <div className="zone-editorial-head">
                    <span className="zone-editorial-eyebrow">
                      {sec?.badge || 'Secteur'}
                    </span>
                    <h3 className="zone-editorial-name">{sec?.name || 'Essonne'}</h3>
                  </div>

                  <ul className="zone-editorial-list" aria-label={`Communes couvertes en ${sec?.name || 'Essonne'}`}>
                    {townsList.map((town, idx) => {
                      const isArpajon = town === 'Arpajon';
                      const isSelected = selectedTown === town;
                      return (
                        <li key={idx}>
                          <button
                            type="button"
                            onClick={() => setSelectedTown((prev) => (prev === town ? null : town))}
                            className={`zone-editorial-item ${isArpajon ? 'is-arpajon' : ''} ${isSelected ? 'is-selected' : ''}`}
                            title={`Afficher ${town} sur la carte Google Maps`}
                          >
                            <span className="zone-editorial-dot" aria-hidden="true"></span>
                            <span className="zone-editorial-town">
                              {isArpajon ? <strong>Arpajon</strong> : town}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Carte Google Maps de la zone d'intervention */}
          <div className={`zone-map-card ${isVisible ? 'is-visible' : ''}`}>
            <div className="zone-map-header">
              <div className="zone-map-header-info">
                <span className="zone-map-pin-badge" aria-hidden="true">
                  <MapPin size={15} strokeWidth={2.4} />
                </span>
                <div>
                  <div className="zone-map-title">
                    {selectedTown ? `${selectedTown} (91)` : "Toute l'Essonne (91) • Base Arpajon"}
                  </div>
                  <div className="zone-map-subtitle">
                    {selectedTown
                      ? 'Commune couverte • 0 € de frais de déplacement'
                      : 'Cliquez sur une commune pour zoomer sur la carte'}
                  </div>
                </div>
              </div>

              <div className="zone-map-actions">
                {selectedTown && (
                  <button
                    type="button"
                    onClick={() => setSelectedTown(null)}
                    className="zone-map-reset-btn"
                    title="Revenir à la vue globale de l'Essonne"
                  >
                    <RotateCcw size={13} strokeWidth={2.3} aria-hidden="true" />
                    <span>Vue globale 91</span>
                  </button>
                )}
                <a
                  href={mapExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="zone-map-external-link"
                  aria-label="Ouvrir la zone d'intervention dans Google Maps"
                  title="Ouvrir dans Google Maps"
                >
                  <span>Google Maps</span>
                  <ExternalLink size={13} strokeWidth={2.3} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="zone-map-frame-wrap">
              <iframe
                key={mapEmbedUrl}
                src={mapEmbedUrl}
                title={`Carte Google Maps — Zone d'intervention NEQQUA Nettoyage (${selectedTown || 'Essonne 91'})`}
                className="zone-map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Domino 4 : Bannière du bas */}
        <div className={`zone-editorial-footer ${isVisible ? 'is-visible' : ''}`}>
          <div className="zone-editorial-footer-text">
            <CheckCircle2 size={18} strokeWidth={2.4} style={{ color: '#0369a1', flexShrink: 0 }} aria-hidden="true" />
            <span>
              <strong>Votre commune n'est pas dans la liste ?</strong> Nous intervenons dans 100 % des communes de l'Essonne sans aucun surcoût ni frais de déplacement.
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToDevis}
            className={`zone-editorial-cta ${isVisible ? 'is-visible' : ''}`}
          >
            <span>Demander un devis pour ma commune</span>
            <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
