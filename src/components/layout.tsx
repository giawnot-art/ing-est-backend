import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">ING-EST</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Professional OS</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="#" className="block px-4 py-2 rounded-lg bg-slate-800 text-white font-medium">Dashboard</a>
          <a href="#" className="block px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Progetti</a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-slate-800">Area Operativa</h2>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {children}
        </div>
      </main>
    </div>
  );
}
