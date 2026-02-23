import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) alert(error.message);
    else {
      alert("Password aggiornata con successo!");
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form onSubmit={handleReset} className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl">
        <h2 className="text-2xl font-black mb-6">Nuova Password</h2>
        <input 
          type="password" placeholder="Inserisci la nuova password" required
          className="w-full p-4 rounded-2xl border mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all">
          {loading ? 'Aggiornamento...' : 'Salva Password'}
        </button>
      </form>
    </div>
  );
}
