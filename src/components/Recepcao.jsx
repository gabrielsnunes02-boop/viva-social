// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Printer, Loader2 } from 'lucide-react';

export default function Recepcao() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fichaAtual, setFichaAtual] = useState(null);

  useEffect(() => {
    fetchServicos();
  }, []);

  async function fetchServicos() {
    try {
      const { data, error } = await supabase.from('servicos').select('*').order('nome');
      if (error) throw error;
      setServicos(data || []);
    } catch (err) {
      alert("Erro ao carregar serviços: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function gerarFicha(servico) {
    try {
      // 1. Salva o atendimento no Supabase
      const { data, error } = await supabase
        .from('atendimentos')
        .insert([{ servico_id: servico.id }])
        .select('*')
        .single();

      if (error) throw error;

      // 2. Prepara os dados para a ficha
      setFichaAtual({
        nome: servico.nome,
        numero: data.numero_ficha,
        data: new Date().toLocaleString('pt-BR')
      });

      // 3. Aguarda o React desenhar a ficha e chama a impressão
      setTimeout(() => {
        window.print();
        setFichaAtual(null);
      }, 500);

    } catch (err) {
      alert("Erro ao gerar ficha: " + err.message);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center p-10">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="mt-2 text-gray-600">Carregando recepção...</p>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center gap-2">
        <Printer className="text-blue-600" /> EMISSÃO DE SENHAS
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicos.map((s) => (
          <button
            key={s.id}
            onClick={() => gerarFicha(s)}
            style={{ backgroundColor: s.cor_tema }}
            className="h-40 rounded-3xl shadow-xl text-white flex flex-col items-center justify-center p-6 hover:brightness-90 active:scale-95 transition-all"
          >
            <span className="text-2xl font-black uppercase tracking-tighter">{s.nome}</span>
            <span className="mt-2 text-xs opacity-80 bg-black/20 px-3 py-1 rounded-full">CLIQUE PARA IMPRIMIR</span>
          </button>
        ))}
      </div>

      {/* ÁREA DE IMPRESSÃO (O que sai no papel) */}
      {fichaAtual && (
        <div id="area-impressao" className="print-only">
          <div style={{ textAlign: 'center', borderBottom: '2px solid black', paddingBottom: '10px' }}>
            <h1 style={{ fontSize: '22pt', margin: 0 }}>VIVA SOCIAL</h1>
            <p style={{ fontSize: '10pt' }}>Ação Social Comunitária</p>
          </div>
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <p style={{ fontSize: '14pt', margin: 0 }}>SERVIÇO:</p>
            <p style={{ fontSize: '20pt', fontWeight: 'bold', margin: 0 }}>{fichaAtual.nome}</p>
          </div>
          <div style={{ textAlign: 'center', border: '3px solid black', padding: '10px' }}>
            <p style={{ fontSize: '12pt', margin: 0 }}>SUA SENHA É:</p>
            <p style={{ fontSize: '50pt', fontWeight: 'black', margin: 0 }}>#{fichaAtual.numero}</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '10pt' }}>
            <p>{fichaAtual.data}</p>
            <p style={{ fontWeight: 'bold', marginTop: '5px' }}>Deus te abençoe!</p>
          </div>
        </div>
      )}
    </div>
  );
}