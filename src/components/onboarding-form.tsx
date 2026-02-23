import React from 'react';

export const OnboardingForm = () => {
  const categories = ['Strutture', 'BIM', 'Acustica', 'Antincendio', 'Geotecnica', 'Impianti', 'Idraulica'];
  
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Completa il tuo Profilo Tecnico</h2>
        <p className="text-slate-500 mt-1">Queste informazioni verranno usate dall'AI per il matching dei progetti.</p>
      </div>
      
      <div className="space-y-8">
        {/* Specializzazioni */}
        <section>
          <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
            Specializzazioni Tecniche (Allegato A)
          </label>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button key={cat} className="px-5 py-2 rounded-full border border-slate-200 text-sm font-medium hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all">
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Esperienza e Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Anni di Esperienza</label>
            <input type="number" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Es. 10" />
          </section>
          <section>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Livello Software (BIM/CAD)</label>
            <select className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Base</option>
              <option>Intermedio</option>
              <option>Avanzato</option>
            </select>
          </section>
        </div>

        <section>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Bio Professionale</label>
          <textarea className="w-full border border-slate-200 rounded-xl p-4 h-32 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Descrivi i tuoi progetti più rilevanti..."></textarea>
        </section>

        <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg">
          Salva Competenze
        </button>
      </div>
    </div>
  );
};
