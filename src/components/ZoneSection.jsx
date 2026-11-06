import { useState, useRef, useEffect } from 'react';
import { zoneInterventionData } from '../data/siteData';
import { Clock, Car, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ZoneSection() {
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
        <div className="zone-reassurance-strip border-y border-slate-200 py-6 my-8 grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-slate-200">
          {guaranteesList.map((item, idx) => {
            // Sécurité anti-crash : fallback sur CheckCircle2 si l'icône est introuvable
            const IconComponent = guaranteesIcons[idx] || CheckCircle2;
            const delay = stripDelays[idx] || '0.2s';
            return (
              <div
                key={idx}
                className={`zone-reassurance-item px-4 py-2 flex items-center justify-start md:justify-center gap-3 ${isVisible ? 'is-visible' : ''}`}
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

        {/* Domino 3 : Grille des 4 colonnes en cascade naturelle */}
        <div className="zone-editorial-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start mb-10">
          {sectorsList.map((sec, index) => {
            const townsList = Array.isArray(sec?.towns) ? sec.towns : [];
            const delay = colDelays[index] || '0.4s';
            return (
              <div
                key={sec?.id || index}
                className={`zone-editorial-col flex flex-col ${isVisible ? 'is-visible' : ''}`}
                style={{ '--zone-col-delay': delay }}
              >
                <div className="zone-editorial-head pb-3 mb-3 border-b border-slate-200">
                  <span className="zone-editorial-eyebrow">
                    {sec?.badge || 'Secteur'}
                  </span>
                  <h3 className="zone-editorial-name text-slate-900">{sec?.name || 'Essonne'}</h3>
                </div>

                <ul className="zone-editorial-list" aria-label={`Communes couvertes en ${sec?.name || 'Essonne'}`}>
                  {townsList.map((town, idx) => {
                    const isArpajon = town === 'Arpajon';
                    return (
                      <li
                        key={idx}
                        className={`zone-editorial-item ${isArpajon ? 'is-arpajon' : ''}`}
                      >
                        <span className="zone-editorial-dot" aria-hidden="true"></span>
                        <span className="zone-editorial-town">
                          {isArpajon ? <strong>Arpajon</strong> : town}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Domino 4 : Bannière du bas */}
        <div className={`zone-editorial-footer bg-slate-50 border border-slate-200 rounded-xl p-5 ${isVisible ? 'is-visible' : ''}`}>
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
