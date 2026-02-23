import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    setLoading(true);
    setMessage('');
    
    const { data, error } = type === 'LOGIN' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage("Errore: " + error.message);
    } else {
      if (type === 'SIGNUP') setMessage("Registrazione effettuata! Ora puoi accedere.");
      else router.push('/'); // Vai alla home (dove scatterà l'onboarding)
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 mb-2">ING-EST</h1>
        <p className="text-slate-500 mb-8 font-medium">Accedi alla piattaforma professionale</p>
        
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => handleAuth('LOGIN')}
              disabled={loading}
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              Accedi
            </button>
            <button 
              onClick={() => handleAuth('SIGNUP')}
              disabled={loading}
              className="flex-1 border-2 border-slate-100 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Registrati
            </button>
          </div>
        </div>

        <div className="relative my-8 text-center">
          <span className="bg-white px-4 text-slate-400 text-sm font-bold relative z-10 uppercase">Oppure</span>
          <div className="absolute top-1/2 w-full h-px bg-slate-100"></div>
        </div>

        <button 
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          className="w-full border-2 border-slate-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          Continua con Google
        </button>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-sm font-bold text-center ${message.includes('Errore') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
