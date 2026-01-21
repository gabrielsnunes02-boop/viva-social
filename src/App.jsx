// @ts-nocheck
import React, { useState } from "react";
import Recepcao from "./components/Recepcao.jsx";
import Evangelismo from "./components/Evangelismo.jsx";
import PainelAdmin from "./components/PainelAdmin.jsx";

export default function App() {
  const [aba, setAba] = useState("recepcao");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* MENU SUPERIOR (Já ajustado por você) */}
      <header className="bg-blue-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-white text-2xl font-black tracking-tighter uppercase">
            VIVA <span className="text-blue-200">SOCIAL</span>
          </h1>
          
          <nav className="flex gap-2 bg-blue-700/50 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            <button 
              onClick={() => setAba('recepcao')} 
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${aba === 'recepcao' ? 'bg-white text-blue-600 shadow' : 'text-white'}`}
            >
              Recepção
            </button>
            <button 
              onClick={() => setAba('evangelismo')} 
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${aba === 'evangelismo' ? 'bg-white text-blue-600 shadow' : 'text-white'}`}
            >
              Evangelismo
            </button>
            <button 
              onClick={() => setAba('painel')} 
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${aba === 'painel' ? 'bg-white text-blue-600 shadow' : 'text-white'}`}
            >
              Painel
            </button>
          </nav>
        </div>
      </header>

      {/* CONTEÚDO DAS ABAS COM ESPAÇAMENTO RESPONSIVO */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {aba === "recepcao" && <Recepcao />}
        {aba === "evangelismo" && <Evangelismo />}
        {aba === "painel" && <PainelAdmin />}
      </main>
    </div>
  );
}