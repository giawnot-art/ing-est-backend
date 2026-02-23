import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const OnboardingWizard = ({ user, onComplete }: any) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [serviziDatabase, setServiziDatabase] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingServices, setFetchingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('servizi') 
          .select('nome')
          .order('nome', { ascending: true });

        if (error) throw error;
        if (data) {
          setServiziDatabase(data.map(s => s.nome));
        }
      } catch (err) {
        console.error("Errore nel recupero catalogo servizi:", err);
      } finally {
        setFetchingServices(false);
      }
    };
    fetchServices();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          role: role,
          specialization: selectedTags,
          updated_at: new Date()
        });

      if (error) throw error;
      onComplete();
    } catch (err) {
      alert("Errore durante il salvataggio del profilo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 1 ? 'bg-blue-600' : 'bg-slate-100'}`} />
        <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 2 ? 'bg-blue-600' : 'bg-slate-100'}`} />
      </div>

      {step === 1 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Benvenuto</h2>
            <p className="text-slate-500 font-medium">Seleziona la tua tipologia di account</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => { setRole('engineer'); setStep(2); }}
              className="group p-8 border-2 border-slate-100 rounded-3xl hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left relative overflow-hidden"
            >
              <div className="text-4xl mb-4">🏗️</div>
              <div className="font-bold text-xl text-slate-900">Professionista</div>
              <div className="text-sm text-slate-500 mt-1">Ingegnere, Architetto o Tecnico</div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 font-bold">→</div>
            </button>
            <button 
              onClick={() => { setRole('studio'); setStep(2); }}
              className="group p-8 border-2 border-slate-100 rounded-3xl hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left relative overflow-hidden"
            >
              <div className="text-4xl mb-4">🏢</div>
              <div className="font-bold text-xl text-slate-900">Studio Tecnico</div>
              <div className="text-sm text-slate-500 mt-1">Società o Studio Associato</div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 font-bold">→</div>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Catalogo Servizi</h2>
            <p className="text-slate-500 font-medium">Seleziona le tue aree di competenza per il matching.</p>
          </div>

          {fetchingServices ? (
            <div className="py-10 text-center text-slate-400 animate-pulse">Caricamento catalogo...</div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {serviziDatabase.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${
                    selectedTags.includes(tag) 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-6">
            <button 
              onClick={() => setStep(1)} 
              className="px-6 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Indietro
            </button>
            <button 
              onClick={handleSave}
              disabled={loading || selectedTags.length === 0}
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-slate-200 transition-all active:scale-95"
            >
              {loading ? 'Salvataggio...' : 'Attiva Profilo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
