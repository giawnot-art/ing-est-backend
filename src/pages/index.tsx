import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { MatchingCard } from '../components/matching-card';
import { OnboardingWizard } from '../components/onboarding-wizard';
import Login from './login'; // Assicurati che il file login sia in src/pages/
import { supabase } from '../lib/supabase';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      // 1. Controlla Sessione Utente
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser);
      
      if (currentUser) {
        // 2. Controlla se il profilo ha le specializzazioni (Onboarding completato)
        const { data: profile } = await supabase
          .from('profiles')
          .select('specialization')
          .eq('id', currentUser.id)
          .single();
        
        const completed = !!(profile?.specialization && profile.specialization.length > 0);
        setHasProfile(completed);

        // 3. Se il profilo è ok, carica i match (Ingegneri/Studi)
        if (completed) {
          const { data: engineers } = await supabase
            .from('profiles')
            .select('*')
            .not('id', 'eq', currentUser.id); // Esclude se stessi dai match
          
          if (engineers) setMatches(engineers);
        }
      }
      setLoading(false);
    };

    initApp();
  }, []);

  // Stati di visualizzazione condizionale
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!user) return <Login />;

  if (!hasProfile) return (
    <div className="min-h-screen bg-slate-50 py-20">
      <OnboardingWizard user={user} onComplete={() => setHasProfile(true)} />
    </div>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard Matching</h1>
          <p className="text-slate-500 mt-2 font-medium">Basata sulle tue specializzazioni</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {matches.length > 0 ? (
            matches.map((m) => (
              <MatchingCard 
                key={m.id} 
                name={m.full_name || 'Professionista'} 
                score={85} // Qui poi inseriremo la logica AI reale
                experience={5} 
                software={m.specialization?.join(' / ') || 'Generalista'}
                aiInsight="Ottimo match basato sulle tue competenze comuni."
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
              Nessun match trovato per i tuoi criteri.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
