import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { MatchingCard } from '../components/matching-card';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEngineers() {
      try {
        const { data, error } = await supabase
          .from('engineers') 
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setMatches(data);
      } catch (err) {
        console.error("Errore caricamento dati:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEngineers();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard Matching</h1>
          <p className="text-slate-500 mt-2 font-medium">Progetti e Professionisti in tempo reale</p>
        </header>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Caricamento database...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {matches.length > 0 ? (
              matches.map((m: any, idx: number) => (
                <MatchingCard key={m.id || idx} {...m} />
              ))
            ) : (
              <div className="col-span-2 text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
                Nessun ingegnere trovato nel database. Inseriscine uno su Supabase per vederlo qui!
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
