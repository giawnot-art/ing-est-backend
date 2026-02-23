import React from 'react';

export const MatchingCard = ({ name, score, aiInsight, experience, software }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-blue-400 transition-all group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
              {name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{name}</h3>
              <p className="text-xs text-slate-500 font-medium">{experience} anni • {software}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-blue-600 leading-none">{score}%</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">AI Match Score</div>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
          <p className="text-xs text-slate-600 leading-relaxed italic">
            <span className="font-bold text-blue-600 not-italic uppercase text-[10px] block mb-1">Analisi IA di Matching:</span>
            "{aiInsight}"
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
            Ingaggia
          </button>
          <button className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50">
            Dettagli
          </button>
        </div>
      </div>
    </div>
  );
};
