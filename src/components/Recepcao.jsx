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
      // 1. Define o início do dia atual para filtrar as fichas de hoje
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      // 2. Busca a última ficha gerada para ESTE serviço HOJE
      const { data: ultimasFichas, error: erroBusca } = await supabase
        .from('atendimentos')
        .select('numero_ficha')
        .eq('servico_id', servico.id)
        .gte('created_at', hoje.toISOString())
        .order('numero_ficha', { ascending: false })
        .limit(1);

      if (erroBusca) throw erroBusca;

      // 3. Calcula o próximo número (se não houver fichas hoje, começa em 1)
      const proximoNumero = (ultimasFichas && ultimasFichas.length > 0) 
        ? ultimasFichas[0].numero_ficha + 1 
        : 1;

      // 4. Salva o atendimento com o número individualizado
      const { data, error: erroInsert } = await supabase
        .from('atendimentos')
        .insert([{ 
          servico_id: servico.id, 
          numero_ficha: proximoNumero 
        }])
        .select('*')
        .single();

      if (erroInsert) throw erroInsert;

      // 5. Prepara os dados para a impressão
      setFichaAtual({
        nome: servico.nome,
        numero: proximoNumero,
        data: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });

      // 6. Chama a impressão
      setTimeout(() => {
        window.print();
        setFichaAtual(null);
      }, 500);

    } catch (err) {
      console.error(err);
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
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          @page { size: 58mm auto; margin: 0; }
          #area-impressao, #area-impressao * { visibility: visible; }
          #area-impressao {
            position: absolute; left: 0; top: 0;
            width: 45mm; padding: 1mm;
            background: white !important;
            font-family: Arial, sans-serif;
          }
        }
      ` }} />

      <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center gap-2 no-print uppercase tracking-tighter">
        <Printer className="text-blue-600" /> Emissão de Senhas
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

      {fichaAtual && (
        <div id="area-impressao" style={{ color: 'black', lineHeight: '1.1' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid black', paddingBottom: '2px' }}>
            <h1 style={{ fontSize: '13pt', fontWeight: '900', margin: '0' }}>VIVA SOCIAL</h1>
          </div>
          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <p style={{ fontSize: '9pt', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>{fichaAtual.nome}</p>
          </div>
          <div style={{ textAlign: 'center', border: '1px solid black', margin: '4px 0', padding: '2px' }}>
            <p style={{ fontSize: '32pt', fontWeight: '900', margin: '0', lineHeight: '1' }}>#{fichaAtual.numero}</p>
          </div>
          <div style={{ textAlign: 'center', fontSize: '7pt' }}>
            <p style={{ margin: '0' }}>{fichaAtual.data} - Aguarde chamada</p>
            <p style={{ fontSize: '6pt', marginTop: '2px' }}>Deus te abençoe!</p>
          </div>
          <div style={{ height: '4mm' }}></div>
        </div>
      )}
    </div>
  );
}