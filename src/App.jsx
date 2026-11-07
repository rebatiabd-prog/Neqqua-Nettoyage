import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import PricingSection from './components/PricingSection';
import ZoneSection from './components/ZoneSection';
import QuoteSection from './components/QuoteSection';
import ReviewsSection from './components/ReviewsSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

export default function App() {
  const [selectedFormula, setSelectedFormula] = useState('horaire');
  const [highlightQuote, setHighlightQuote] = useState(false);

  const handleSelectPlan = (planId) => {
    setSelectedFormula(planId);
    setHighlightQuote(true);
    setTimeout(() => {
      setHighlightQuote(false);
    }, 1800);

    const target = document.getElementById('devis');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="site-wrapper">
      <Navbar />
      <main>
        <Hero />
        <ServicesSection />
        <PricingSection onSelectPlan={handleSelectPlan} />
        <ZoneSection />
        <QuoteSection
          selectedFormula={selectedFormula}
          onFormulaChange={setSelectedFormula}
          isHighlighted={highlightQuote}
        />
        <ReviewsSection />
        <FaqSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
