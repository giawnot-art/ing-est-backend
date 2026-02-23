import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const SERVIZI_CATALOGO = [
  'Strutture CA', 'Strutture Legno', 'Acciaio', 'BIM Authoring', 
  'Efficientamento Energetico', 'Pratiche Edilizie', 'Direzione Lavori',
  'Collaudi', 'Antincendio', 'Acustica', 'Geotecnica'
];

export const OnboardingWizard = ({ user, onComplete }: any) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        role: role,
        specialization: selectedTags,
        updated_at: new Date()
      });

    if (!error) onComplete();
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-100'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-100'}`} />
      </div>

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl font-bold mb-2">Benvenuto! Chi sei?</h2>
          <p className="text-slate-500 mb-8">Seleziona il tuo profilo principale.</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { setRole('engineer'); setStep(2); }}
              className="p-6 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <div className="text-2xl mb-2">🏗️</div>
              <div className="font-bold">Professionista</div>
              <div className="text-xs text-slate-500">Ingegnere o Architetto</div>
            </button>
            <button 
              onClick={() => { setRole('studio'); setStep(2); }}
              className="p-6 border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <div className="text-2xl mb-2">🏢</div>
              <div className="font-bold">Studio Tecnico</div>
              <div className="text-xs text-slate-500">Società o studio associato</div>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4">
          <h2 className="text-3xl font-bold mb-2">Cosa sai fare?</h2>
          <p className="text-slate-500 mb-6">Seleziona le tue specializzazioni dal catalogo.</p>
          <div className="flex flex-wrap gap-2 mb-10">
            {SERVIZI_CATALOGO.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  selectedTags.includes(tag) 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-slate-400">Indietro</button>
            <button 
              onClick={handleSave}
              disabled={loading || selectedTags.length === 0}
              className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 disabled:opacity-50 transition-all"
            >
              {loading ? 'Salvataggio...' : 'Completa Profilo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
