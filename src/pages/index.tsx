import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { MatchingCard } from '../components/matching-card';
import { OnboardingWizard } from '../components/onboarding-wizard';
import Login from './login';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [progetti, setProgetti] = useState<any[]>([]);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser);
      
      if (currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        setUserProfile(profile);
        const completed = !!(profile?.specialization && profile.specialization.length > 0);
        setHasProfile(completed);

        if (completed) {
          // Carichiamo i progetti dal database
          const { data: projectsData } = await supabase
            .from('progetti')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (projectsData) setProgetti(projectsData);
        }
      }
      setLoading(false);
    };

    initApp();
  }, []);

  // Funzione per calcolare lo score di matching
  const calculateMatchScore = (projectServices: string[], userServices: string[]) => {
    if (!projectServices || !userServices) return 0;
    const matches = projectServices.filter(s => userServices.includes(s));
    const score = (matches.length / projectServices.length) * 100;
    return Math.round(score);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold">Inizializzazione...</div>;
  if (!user) return <Login />;
  if (!hasProfile) return <div className="min-h-screen bg-slate-50 py-20"><OnboardingWizard user={user} onComplete={() => window.location.reload()} /></div>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">I tuoi Match</h1>
            <p className="text-slate-500 mt-2 font-medium">Progetti selezionati in base alle tue competenze: {userProfile?.specialization?.join(', ')}</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100">
            {userProfile?.role === 'engineer' ? 'Profilo Professionista' : 'Profilo Studio'}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {progetti.length > 0 ? (
            progetti.map((progetto) => {
              const score = calculateMatchScore(progetto.servizi_richiesti, userProfile.specialization);
              return (
                <MatchingCard 
                  key={progetto.id} 
                  name={progetto.titolo} 
                  score={score}
                  experience={progetto.budget || "Budget da definire"} 
                  software={progetto.servizi_richiesti?.join(' • ')}
                  aiInsight={`Questo progetto richiede competenze in ${progetto.servizi_richiesti?.filter((s: string) => !userProfile.specialization.includes(s)).join(', ') || 'tutte le tue aree'}.`}
                />
              );
            })
          ) : (
            <div className="col-span-2 text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
              Nessun progetto disponibile al momento.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
