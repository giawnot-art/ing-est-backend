import React from 'react';
import Layout from '../components/layout';
import { MatchingCard } from '../components/matching-card';

export default function Home() {
  const demoMatches = [
    { name: "Ing. Marco Rossi", score: 98, experience: 12, software: "Revit / SAP2000", aiInsight: "Profilo d'eccellenza. La sua esperienza decennale in strutture CA è perfetta per questa villa bifamiliare." },
    { name: "Arch. Laura Bianchi", score: 85, experience: 8, software: "Archicad / Twinmotion", aiInsight: "Ottima competenza architettonica, consigliata per la fase di modellazione 3D e rendering." }
  ];

  return (
    /* Questo stile inline FORZA lo sfondo blu e il testo bianco anche se Tailwind è rotto */
    <div style={{ backgroundColor: '#1e40af', minHeight: '100vh', color: 'white' }}>
      <Layout>
        <div className="max-w-6xl mx-auto" style={{ padding: '40px' }}>
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight">Dashboard Matching</h1>
            <p className="mt-2 font-medium">Progetto: Calcolo Villa Unifamiliare (ID: 001)</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {demoMatches.map((m, idx) => (
              <MatchingCard key={idx} {...m} />
            ))}
          </div>
        </div>
      </Layout>
    </div>
  );
}
