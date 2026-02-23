import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: `${window.location.origin}/` }
    });

    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ 
        text: "Registrazione riuscita! Controlla la tua email per il link di conferma.", 
        type: 'success' 
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <h2 className="text-3xl font-black mb-2 text-slate-900">Inizia ora</h2>
        <p className="text-slate-500 mb-8 font-medium">Bastano 30 secondi per unirti a ING-EST.</p>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            type="email" placeholder="La tua email" className="w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)} required
          />
          <input 
            type="password" placeholder="Scegli una password" className="w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)} required
          />
          <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">
            {loading ? 'Creazione account...' : 'Registrati'}
          </button>
        </form>

        <button onClick={() => router.push('/login')} className="mt-6 text-sm font-bold text-blue-600 block text-center w-full">
          Hai già un account? Accedi
        </button>

        {message.text && (
          <div className={`mt-6 p-4 rounded-xl text-xs font-bold text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
