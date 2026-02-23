import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { MatchingCard } from '../components/matching-card';
import { supabase } from '../lib/supabase';
import AuthPage from './login';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Controlla sessione
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else setLoading(false);
    });
  }, []);

  async function fetchUserData(userId: string) {
    // 2. Prendi profilo e progetti
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).single();
    const { data: proj } = await supabase.from('progetti').select('*');
    
    setProfile(prof);
    setProjects(proj || []);
    setLoading(false);
  }

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Caricamento sistema...</div>;
  if (!session) return <AuthPage />;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black mb-8 text-slate-900">Match per {profile?.full_name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(p => (
            <MatchingCard 
              key={p.id} name={p.titolo} 
              score={75} // Qui poi metteremo la formula matematica
              experience={p.budget} 
              software={p.servizi_richiesti?.join(' • ')} 
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
