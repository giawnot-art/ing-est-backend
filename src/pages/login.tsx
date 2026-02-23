import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setErrorMsg("Credenziali errate. Se non hai un account, registrati!");
      } else {
        setErrorMsg(error.message);
      }
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    if (!email) return setErrorMsg("Inserisci l'email per il reset");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setErrorMsg(error.message);
    else alert("Controlla l'email per resettare la password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-black mb-6 text-slate-900">Accedi</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="Email" className="w-full p-4 rounded-xl border"
            onChange={(e) => setEmail(e.target.value)} required
          />
          <input 
            type="password" placeholder="Password" className="w-full p-4 rounded-xl border"
            onChange={(e) => setPassword(e.target.value)} required
          />
          
          <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">
            {loading ? 'Entrando...' : 'Accedi'}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-sm font-medium">
          <button onClick={() => router.push('/signup')} className="text-blue-600">Non hai un account? Registrati</button>
          <button onClick={handleReset} className="text-slate-400">Dimenticata la password?</button>
        </div>

        {errorMsg && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-bold">{errorMsg}</div>}
      </div>
    </div>
  );
}
