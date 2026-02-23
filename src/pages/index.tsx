import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { MatchingCard } from '../components/matching-card';
import { supabase } from '../lib/supabase';

export default function Home() {
  // Aggiungiamo <any[]> per dire a TS che la lista accoglierà i dati
  const [matches, setMatches] = useState<any[]>([]);
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
          <p className="text-slate-500 mt-2 font-medium">Dati estratti in tempo reale da Supabase</p>
        </header>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium">Connessione al database in corso...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {matches.length > 0 ? (
              matches.map((m: any) => (
                <MatchingCard key={m.id} {...m} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                <p className="text-lg">Nessun profilo trovato.</p>
                <p className="text-sm">Aggiungi un ingegnere nella tabella "engineers" su Supabase.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
