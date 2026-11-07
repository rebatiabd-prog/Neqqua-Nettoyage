export const siteConfig = {
  brandName: 'NEQQUA',
  brandSuffix: 'NETTOYAGE',
  tagline: 'SOCIÉTÉ DE NETTOYAGE & ENTRETIEN À DOMICILE',
  phoneDisplay: '06 59 51 98 59',
  phoneCall: '+33659519859',
  email: 'contact.neqqua@gmail.com',
  hours: 'Lun – Sam : 9h00 – 12h00 / 13h30 – 17h30',
  whatsappNumber: '33659519859',
  logoEmblem: '/logo-neqqua-horizontal.png',
  logoFull: '/logo-neqqua-horizontal.png',
  locationBase: 'Arpajon',
  serviceZone: 'Toute l’Essonne',
};

export const servicesData = [
  {
    id: 'menage-complet',
    code: '01',
    category: 'INTERVENTION GLOBALE',
    title: 'Ménage complet à domicile',
    desc: 'Dépoussiérage méticuleux des surfaces et plinthes, aspiration en profondeur et lavage adapté de vos sols (parquet, carrelage, marbre).',
    badge: 'Formule Signature',
    photoPlaceholder: 'Emplacement Photo — Salon & Séjour Impeccable',
    imageSrc: '/images/prestation-menage-sol.jpg',
    points: [
      'Aspiration et dépoussiérage de toutes les pièces (séjour, chambres, couloirs)',
      'Lavage humide adapté (parquets, carrelages, marbres et vinyles)',
      'Dépoussiérage méticuleux des meubles, plinthes, étagères et radiateurs',
      'Aération, remise en ordre générale et finitions soignées',
    ],
  },
  {
    id: 'sanitaires-douche',
    code: '02',
    category: 'HYGIÈNE & DÉTARTRAGE',
    title: 'Nettoyage & Détartrage Douche / WC',
    desc: 'Élimination du calcaire incrusté sur parois vitrées et robinetteries, désinfection soignée des sanitaires et microfibres dédiées par zone.',
    badge: 'Zéro calcaire garanti',
    photoPlaceholder: 'Emplacement Photo — Douche à l’Italienne & Robinetterie',
    imageSrc: '/images/prestation-sanitaires.jpg',
    points: [
      'Détartrage intensif des parois de douche, faïences, joints et baignoires',
      'Désinfection intégrale des WC (cuvette, abattant, zones de contact)',
      'Nettoyage et lustrage miroir de toute la robinetterie et vasques',
      'Chiffons microfibres sanitaires strictement dédiés à code couleur',
    ],
  },
  {
    id: 'cuisine-vaisselle',
    code: '03',
    category: 'CUISINE & ART DE LA TABLE',
    title: 'Entretien Cuisine & Vaisselle',
    desc: 'Lavage et rangement de la vaisselle, dégraissage approfondi des plaques de cuisson, crédences et récurage complet des éviers et plans de travail.',
    badge: 'Vaisselle rangée & dégraissée',
    photoPlaceholder: 'Emplacement Photo — Cuisine & Vaisselle Étincelante',
    imageSrc: '/images/prestation-cuisine.jpg',
    points: [
      'Lavage soigné à la main ou gestion complète du lave-vaisselle',
      'Essuyage et rangement minutieux de la vaisselle et des casseroles',
      'Dégraissage des plaques de cuisson, crédence et façades',
      'Récurage, détartrage et désinfection de l’évier et de la robinetterie',
    ],
  },
  {
    id: 'vitres-surfaces',
    code: '04',
    category: 'CLARTÉ & SURFACES VITRÉES',
    title: 'Lavage des Vitres sans traces',
    desc: 'Nettoyage des vitres intérieures, baies vitrées et miroirs avec raclette et microfibres professionnelles pour une clarté sans traces ni reflets.',
    badge: 'Clarté diamant sans trace',
    photoPlaceholder: 'Emplacement Photo — Baies Vitrées & Clarté Solaire',
    imageSrc: '/images/prestation-vitres.jpg',
    points: [
      'Lavage des vitres intérieures, baies vitrées et portes coulissantes',
      'Nettoyage des encadrements, rainures et rebords de fenêtres',
      'Lustrage des miroirs et parois vitrées intérieures',
      'Finition au mouilleur et raclette professionnelle sans reflets ni coulures',
    ],
  },
];

export const pricingPlans = [
  {
    id: 'horaire',
    badge: 'PONCTUEL & SUR-MESURE',
    subtitleBadge: 'Min. 2 heures',
    title: "Prestation à l'heure",
    price: '30 €',
    unit: '/ heure TTC',
    desc: 'Pour un ménage ponctuel, un grand nettoyage ou un besoin exceptionnel.',
    isFeatured: false,
    ctaText: 'Demander un devis',
    features: [
      'Facturée à l\'heure, au tarif fixe de 30 €',
      'Intervention minimale de 2 heures',
      'Produits et matériel fournis',
      'Devis gratuit par téléphone ou formulaire',
      'Paiement après la prestation',
    ],
  },
  {
    id: 'abonnement',
    badge: 'RÉGULIER & FIXE',
    subtitleBadge: 'Sans engagement',
    featuredTag: 'FORMULE RECOMMANDÉE',
    title: 'Abonnement mensuel',
    price: '299 €',
    unit: '/ mois TTC',
    desc: 'Pour un ménage régulier, avec les mêmes horaires chaque mois.',
    isFeatured: true,
    ctaText: "Choisir l'abonnement",
    stripeUrl: import.meta.env.VITE_STRIPE_ABONNEMENT_URL || '',
    stripePortalUrl: import.meta.env.VITE_STRIPE_PORTAL_URL || '',
    features: [
      '3 à 4 interventions par semaine incluses (au choix)',
      'Même intervenante à chaque passage',
      'Produits et matériel fournis',
      'Planning fixe, à deux semaines d\'avance',
      'Réservation de créneaux prioritaires',
      'Résiliable en ligne à tout moment, sans frais',
    ],
  },
];

export const faqItems = [
  {
    id: 'faq-1',
    question: 'Fournissez-vous les produits ménagers et le matériel ?',
    answer:
      'Oui, nous venons entièrement équipés avec du matériel professionnel : serpillières microfibres lavées à 60°C, produits dégraissants, anticalcaires et nettoyants neutres sans danger pour vos enfants et animaux. Si vous préférez que nous utilisions vos propres produits (savon noir, vinaigre ménager, produits bio), nous nous adaptons selon vos souhaits.',
  },
  {
    id: 'faq-2',
    question: 'Dois-je être présent(e) pendant toute l\'intervention ?',
    answer:
      'Absolument pas. Vous pouvez être présent pour nous accueillir ou nous confier vos clés en toute sécurité pour aller travailler ou vaquer à vos occupations. Nous intervenons en totale autonomie, avec discrétion et rigueur, et refermons soigneusement votre domicile après vérification complète de la feuille de passage.',
  },
  {
    id: 'faq-3',
    question: 'Comment garantissez-vous l\'hygiène entre WC et cuisine ?',
    answer:
      'Nous appliquons un protocole strict de séparation par code couleur : les éponges et microfibres utilisées pour les toilettes et la cabine de douche ne sont JAMAIS introduites dans la cuisine, sur le plan de travail, sur la vaisselle ou les tables. Chaque zone possède son matériel désinfecté dédié.',
  },
  {
    id: 'faq-4',
    question: 'Intervenez-vous de manière ponctuelle ou régulière ?',
    answer:
      'Les deux formules sont possibles sans engagement : vous pouvez commander une prestation ponctuelle (grand ménage complet, remise en état, retour de vacances, emménagement) ou mettre en place un entretien régulier à la fréquence de votre choix (chaque semaine, tous les 15 jours ou mensuel avec notre formule 299 €).',
  },
  {
    id: 'faq-5',
    question: 'Quels sont vos délais d\'intervention et les tarifs ?',
    answer:
      'Nos tarifs sont transparents : 30 €/h en ponctuel ou 299 €/mois pour 3 à 4 interventions par semaine au choix. Nous établissons un devis clair sous 2h après votre demande. En cas de besoin urgent, un simple appel direct ou un échange WhatsApp nous permet généralement de caler une intervention sous 24h à 48h selon nos disponibilités de la semaine.',
  },
  {
    id: 'faq-6',
    question: 'Êtes-vous assurés en cas de bris ou dommage matériel ?',
    answer:
      'Oui, l\'ensemble de nos interventions est intégralement couvert par notre assurance responsabilité civile professionnelle. En cas de bris accidentel ou d\'incident sur un objet ou une surface, notre assurance prend directement en charge le remplacement ou le dédommagement en toute transparence.',
  },
];

export const reviewsData = [
  {
    id: 'rev-1',
    name: 'Laurent & Émilie B.',
    role: 'Arpajon • Abonnement mensuel',
    avatar: '/images/laurent-emilie-b.jpg',
    stars: 5,
    text: "Nous avons souscrit à l'abonnement mensuel il y a 4 mois. L'équipe est d'une ponctualité et d'une discrétion remarquables. Notre parquet et les parois vitrées sont étincelants, sans aucune trace.",
    isFeatured: false,
  },
  {
    id: 'rev-2',
    name: 'Stéphane R.',
    role: 'Brétigny-sur-Orge • Grand ménage complet',
    avatar: '/images/stephane-r.jpg',
    stars: 5,
    text: "Remise en état avant emménagement. Les joints, la cuisine dégraissée et les vitres ont été récupérés comme neufs. Devis clair reçu en 30 minutes sur WhatsApp. Je recommande les yeux fermés.",
    isFeatured: true,
  },
  {
    id: 'rev-3',
    name: 'Camille D.',
    role: 'Massy • Prestation régulière',
    avatar: '/images/camille-d.jpg',
    stars: 5,
    text: "Le protocole d'hygiène strict avec microfibres séparées et la qualité du matériel professionnel font toute la différence. On sent le vrai souci du détail et le respect du lieu à chaque passage.",
    isFeatured: false,
  },
  {
    id: 'rev-4',
    name: 'Marc & Valérie T.',
    role: 'Sainte-Geneviève-des-Bois • Ménage hebdomadaire',
    avatar: '/images/marc-t.jpg',
    stars: 5,
    text: "Un vrai soulagement après nos journées de travail chargées. Retrouver notre maison impeccable chaque jeudi soir avec une odeur fraîche et des sanitaires immaculés n'a pas de prix.",
    isFeatured: false,
  },
  {
    id: 'rev-5',
    name: 'Nathalie R.',
    role: 'Évry-Courcouronnes • Entretien soigné',
    avatar: '/images/nathalie-r.jpg',
    stars: 5,
    text: "Qualité de service digne d'un grand hôtel. Discrétion absolue, personnel de confiance et finitions soignées jusque dans les moindres recoins de la maison.",
    isFeatured: false,
  },
];

export const zoneInterventionData = {
  title: "Basés à Arpajon, nous intervenons dans toute l'Essonne",
  subtitle: "Particuliers et résidences : profitez d'un service de ménage à domicile de proximité, fiable et réactif sur l'ensemble des communes du département.",
  hubCity: "Arpajon",
  hubLabel: "Siège & Base opérationnelle",
  guarantees: [
    { title: "Sous 24h à 48h", desc: "Délai d'intervention rapide sur planning" },
    { title: "0 € de déplacement", desc: "Frais de route offerts dans toute l'Essonne" },
    { title: "100 % couvert", desc: "Toutes les communes urbaines et rurales" },
  ],
  sectors: [
    {
      id: 'coeur-essonne',
      name: "Cœur d'Essonne",
      badge: "Intervention prioritaire",
      towns: [
        'Arpajon',
        'Brétigny-sur-Orge',
        'Sainte-Geneviève-des-Bois',
        'Saint-Michel-sur-Orge',
        'Montlhéry',
        'Linas',
        'Leuville-sur-Orge',
        'Marolles-en-Hurepoix',
      ],
    },
    {
      id: 'nord-essonne',
      name: 'Nord Essonne',
      badge: 'Plateau de Saclay & Orge',
      towns: [
        'Massy',
        'Palaiseau',
        'Les Ulis',
        'Savigny-sur-Orge',
        'Longjumeau',
        'Chilly-Mazarin',
      ],
    },
    {
      id: 'grand-paris-sud',
      name: 'Grand Paris Sud & Seine',
      badge: 'Agglomération & Environs',
      towns: [
        'Évry-Courcouronnes',
        'Corbeil-Essonnes',
        'Draveil',
        'Ris-Orangis',
        'Mennecy',
        'Saint-Germain-lès-Corbeil',
        'Vigneux-sur-Seine',
      ],
    },
    {
      id: 'sud-ouest-essonne',
      name: 'Sud & Ouest Essonne',
      badge: "Pays d'Étampes & Hurepoix",
      towns: [
        'Étampes',
        'Dourdan',
        'Limours',
        'Marcoussis',
        'Lardy',
      ],
    },
  ],
  otherTownsNote: "Votre commune n'apparaît pas dans la liste ? Pas d'inquiétude : nous couvrons l'intégralité des communes de l'Essonne sans surcoût.",
};

