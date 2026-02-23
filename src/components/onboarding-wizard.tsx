import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const OnboardingWizard = ({ user, onComplete }: any) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [serviziDatabase, setServiziDatabase] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingServices, setFetchingServices] = useState(true);

  // Recupera i servizi dal database all'avvio
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Sostituisci 'servizi' con il nome della tua tabella e 'nome' con la colonna
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
              className="group p-8 border-2 border-slate-10
