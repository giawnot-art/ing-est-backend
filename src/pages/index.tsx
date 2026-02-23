import React from 'react';
import Layout from '../components/layout';
import { MatchingCard } from '../components/matching-card';

export default function Home() {
  const demoMatches = [
    { name: "Ing. Marco Rossi", score: 98, experience: 12, software: "Revit / SAP2000", aiInsight: "Profilo d'eccellenza. La sua esperienza decennale in strutture CA è perfetta per questa villa bifamiliare." },
    { name: "Arch. Laura Bianchi", score: 85, experience: 8, software: "Archicad / Twinmotion", aiInsight: "Ottima competenza architettonica, consigliata per la fase di modellazione 3D e rendering." }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard Matching</h1>
          <p className="text-slate-500 mt-2 font-medium">Progetto: Calcolo Villa Unifamiliare (ID: 001)</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {demoMatches.map((m, idx) => (
            <MatchingCard key={idx} {...m} />
          ))}
        </div>

        <div className="mt-16 pt-16 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Test Onboarding (Vista Professionista)</h2>
          {/* Mostriamo il form di onboarding qui per testarlo subito */}
          <div className="bg-slate-100 p-8 rounded-3xl">
            {/* Si può importare OnboardingForm qui */}
            <p className="text-center text-slate-400 italic">Area di configurazione profilo ingegnere</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
