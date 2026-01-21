// @ts-nocheck
import React, { useState } from "react";
import Recepcao from "./components/Recepcao.jsx";
import Evangelismo from "./components/Evangelismo.jsx";
import PainelAdmin from "./components/PainelAdmin.jsx";

export default function App() {
  const [aba, setAba] = useState("recepcao");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* MENU SUPERIOR */}
      <nav className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="font-black tracking-tighter text-xl">VIVA SOCIAL</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setAba("recepcao")} 
              className={`px-3 py-1 rounded-lg transition ${aba === 'recepcao' ? 'bg-white text-blue-600' : 'hover:bg-blue-500'}`}
            >
              Recepção
            </button>
            <button 
              onClick={() => setAba("evangelismo")} 
              className={`px-3 py-1 rounded-lg transition ${aba === 'evangelismo' ? 'bg-white text-blue-600' : 'hover:bg-blue-500'}`}
            >
              Evangelismo
            </button>
            <button 
              onClick={() => setAba("admin")} 
              className={`px-3 py-1 rounded-lg transition ${aba === 'admin' ? 'bg-white text-blue-600' : 'hover:bg-blue-500'}`}
            >
              Painel
            </button>
          </div>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-4xl mx-auto p-4">
        {aba === "recepcao" && <Recepcao />}
        {aba === "evangelismo" && <Evangelismo />}
        {aba === "admin" && <PainelAdmin />}
      </main>
    </div>
  );
}