import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import Layout from '../components/layout';
import { MatchingCard } from '../components/matching-card';
import { OnboardingWizard } from '../components/onboarding-wizard';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      
      if (!activeSession) {
        router.push('/login');
        return;
      }

      setSession(activeSession);
      
      // Carichiamo il profilo per vedere se ha le specializzazioni
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', activeSession.user.id)
        .single();
      
      setProfile(prof);

      // Carichiamo i progetti (per dopo l'onboarding)
      const { data: proj } = await supabase.from('progetti').select('*');
      setProjects(proj || []);
      
      setLoading(false);
    };

    init();
  }, [router]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400">Verifica profilo in corso...</div>;

  // GATE DI PROFILAZIONE: Se non ci sono specializzazioni, mostriamo l'onboarding
  if (!profile?.specialization || profile.specialization.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-6">
        <OnboardingWizard user={session.user} onComplete={() => window.location.reload()} />
      </div>
    );
  }

  // DASHBOARD REALE: Se il profilo è completo
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Match per {profile.full_name || 'il tuo profilo'}</h1>
          <p className="text-slate-500 font-medium">Basati sulle tue skill: {profile.specialization.join(' • ')}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map(p => (
            <MatchingCard 
              key={p.id} 
              name={p.titolo} 
              score={88} // Qui metteremo la formula reale
              experience={p.budget} 
              software={p.servizi_richiesti?.join(' • ')} 
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
