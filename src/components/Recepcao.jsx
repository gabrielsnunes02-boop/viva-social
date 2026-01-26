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
      // 1. Salva o atendimento no Supabase usando o servico_id
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

      // 3. Aguarda o React desenhar e chama a impressão
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
      {/* CSS DE IMPRESSÃO - ESTE BLOCO É O QUE RESOLVE O PAPEL EM BRANCO */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Esconde tudo que não for a ficha */
          body * { visibility: hidden; }
          
          /* Configura o papel térmico 58mm */
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
            width: 48mm; /* Um pouco menor que 58 para segurança */
            padding: 2mm;
            background: white !important;
            font-family: 'Courier New', Courier, monospace;
          }

          /* Remove margens forçadas pelo navegador */
          html, body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
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
            className="h-40 rounded-3xl shadow-xl text-white flex flex-col items-center justify-center p-6 hover:brightness-90 active:scale-95 transition-all"
          >
            <span className="text-2xl font-black uppercase tracking-tighter text-center">{s.nome}</span>
            <span className="mt-2 text-[10px] font-bold opacity-80 bg-black/20 px-3 py-1 rounded-full uppercase italic">Tocar para Imprimir</span>
          </button>
        ))}
      </div>

      {/* ÁREA DE IMPRESSÃO (ESTRUTURA PARA DRIVER ORIGINAL) */}
      {fichaAtual && (
        <div id="area-impressao">
          <div style={{ textAlign: 'center', borderBottom: '1px dashed black', paddingBottom: '5px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '18pt', fontWeight: 'bold', margin: '0' }}>VIVA SOCIAL</h1>
            <p style={{ fontSize: '9pt', margin: '0' }}>Ação Comunitária</p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <p style={{ fontSize: '10pt', margin: '0', fontWeight: 'bold' }}>SERVIÇO:</p>
            <p style={{ fontSize: '14pt', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>{fichaAtual.nome}</p>
          </div>

          <div style={{ textAlign: 'center', border: '2px solid black', padding: '10px', margin: '5px 0' }}>
            <p style={{ fontSize: '10pt', margin: '0' }}>SUA SENHA É:</p>
            <p style={{ fontSize: '42pt', fontWeight: '900', margin: '0', lineHeight: '1' }}>#{fichaAtual.numero}</p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '9pt' }}>
            <p>{fichaAtual.data}</p>
            <p style={{ fontWeight: 'bold', marginTop: '5px', fontSize: '11pt' }}>AGUARDE CHAMADA</p>
            <p style={{ marginTop: '10px', fontSize: '8pt' }}>---------------------------</p>
            <p style={{ fontSize: '8pt', marginTop: '5px' }}>Deus te abençoe!</p>
          </div>
        </div>
      )}
    </div>
  );
}