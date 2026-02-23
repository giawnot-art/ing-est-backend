import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [catalogo, setCatalogo] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Carica i servizi per la registrazione
  useEffect(() => {
    async function getServices() {
      const { data } = await supabase.from('servizi').select('nome');
      if (data) setCatalogo(data.map(s => s.nome));
    }
    getServices();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegistering) {
      // 1. Registrazione Utente
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else if (authData.user) {
        // 2. Creazione Profilo con Tag
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: authData.user.id,
          full_name: fullName,
          specialization: selectedTags,
          updated_at: new Date(),
        });
        if (profileError) setError(profileError.message);
        else router.push('/');
      }
    } else {
      // Login semplice
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) setError(loginError.message);
      else router.push('/');
    }
    setLoading(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">ING-EST</h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isRegistering ? 'Crea il tuo profilo professionale' : 'Bentornato nella rete'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {isRegistering && (
            <input 
              type="text" placeholder="Nome Completo / Studio" required
              className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setFullName(e.target.value)}
            />
          )}
          
          <input 
            type="email" placeholder="Email" required
            className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input 
            type="password" placeholder="Password (min. 6 caratteri)" required
            className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />

          {isRegistering && (
            <div className="pt-4">
              <p className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Seleziona le tue competenze:</p>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-slate-100 rounded-xl">
                {catalogo.map(tag => (
                  <button
                    key={tag} type="button" onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedTags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Elaborazione...' : (isRegistering ? 'Registrati e Inizia' : 'Accedi')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 font-bold hover:underline"
          >
            {isRegistering ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati ora'}
          </button>
        </div>

        {error && <p className="mt-6 text-center text-red-500 bg-red-50 p-4 rounded-xl font-bold text-sm">{error}</p>}
      </div>
    </div>
  );
}
