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
      const { data, error } = await supabase
        .from('atendimentos')
        .insert([{ servico_id: servico.id }])
        .select('*')
        .single();

      if (error) throw error;

      setFichaAtual({
        nome: servico.nome,
        numero: data.numero_ficha,
        data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });

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
      <p className="mt-2 text-gray-600 font-bold uppercase tracking-widest text-xs">A carregar...</p>
    </div>
  );

  return (
    <div className="p-4">
      {/* CSS DE IMPRESSÃO COMPACTO */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          @page { 
            size: 58mm auto; 
            margin: 0; 
          }
          #area-impressao, #area-impressao * { 
            visibility: visible; 
          }
          #area-impressao {
            position: absolute;
            left: 0;
            top: 0;
            width: 45mm;
            padding: 1mm;
            background: white !important;
            font-family: Arial, sans-serif;
          }
          html, body { margin: 0; padding: 0; }
        }
      ` }} />

      <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center gap-2 no-print">
        <Printer className="text-blue-600" /> EMISSÃO DE SENHAS
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
        {servicos.map((s) => (
          <button
            key={s.id}
            onClick={() => gerarFicha(s)}
            style={{ backgroundColor: s.cor_tema }}
            className="h-32 rounded-3xl shadow-lg text-white flex flex-col items-center justify-center p-4 hover:brightness-90 active:scale-95 transition-all"
          >
            <span className="text-xl font-black uppercase tracking-tighter text-center">{s.nome}</span>
            <span className="mt-1 text-[9px] font-bold opacity-70 uppercase">Imprimir Senha</span>
          </button>
        ))}
      </div>

      {/* ÁREA DE IMPRESSÃO - VERSÃO ECONÓMICA */}
      {fichaAtual && (
        <div id="area-impressao" style={{ color: 'black', lineHeight: '1.1' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid black', paddingBottom: '2px' }}>
            <h1 style={{ fontSize: '13pt', fontWeight: '900', margin: '0' }}>VIVA SOCIAL</h1>
          </div>

          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <p style={{ fontSize: '9pt', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>
              {fichaAtual.nome}
            </p>
          </div>

          <div style={{ textAlign: 'center', border: '1px solid black', margin: '4px 0', padding: '2px' }}>
            <p style={{ fontSize: '32pt', fontWeight: '900', margin: '0', lineHeight: '1' }}>
              #{fichaAtual.numero}
            </p>
          </div>

          <div style={{ textAlign: 'center', fontSize: '7pt' }}>
            <p style={{ margin: '0' }}>{fichaAtual.data} - Aguarde chamada</p>
            <p style={{ fontSize: '6pt', marginTop: '2px' }}>Deus te abençoe!</p>
          </div>
          
          {/* Espaço mínimo para o corte manual da serrilha */}
          <div style={{ height: '4mm' }}></div>
        </div>
      )}
    </div>
  );
}