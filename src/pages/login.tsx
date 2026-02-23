import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Layout from '../components/layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    
    if (error) setMessage("Errore: " + error.message);
    else setMessage("Controlla la tua email per il link di accesso!");
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Benvenuto su ING-EST</h1>
        <p className="text-slate-500 mb-8">Accedi o registrati per iniziare il matching.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="La tua email" 
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            {loading ? "Invio in corso..." : "Invia Magic Link"}
          </button>
        </form>
        
        <div className="mt-6">
          <button 
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
            className="w-full border border-slate-200 py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-50"
          >
            Continua con Google
          </button>
        </div>
        {message && <p className="mt-4 text-center text-sm font-medium text-blue-600">{message}</p>}
      </div>
    </Layout>
  );
}
