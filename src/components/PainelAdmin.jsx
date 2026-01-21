// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Settings, MessageCircle, Trash2, Loader2, Phone, UserCircle, Ticket } from 'lucide-react';

export default function PainelAdmin() {
  const [abaInterna, setAbaInterna] = useState('evangelismo');
  const [contatos, setContatos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [contagemPorServico, setContagemPorServico] = useState({});
  const [totalFichas, setTotalFichas] = useState(0);
  const [loading, setLoading] = useState(true);

  const [novoNome, setNovoNome] = useState('');
  const [novaCor, setNovaCor] = useState('#3b82f6');

  useEffect(() => {
    carregarDados();
  }, [abaInterna]);

  async function carregarDados() {
    setLoading(true);
    try {
      // 1. Carregar Contatos de Evangelismo
      const { data: dataContatos } = await supabase
        .from('contatos_evangelismo')
        .select('*')
        .order('created_at', { ascending: false });
      setContatos(dataContatos || []);

      // 2. Carregar Serviços
      const { data: dataServicos } = await supabase
        .from('servicos')
        .select('*')
        .order('nome');
      setServicos(dataServicos || []);

      // 3. Carregar Atendimentos (Fichas) para contagem
      const { data: dataAtendimentos } = await supabase
        .from('atendimentos')
        .select('servico');
      
      if (dataAtendimentos) {
        setTotalFichas(dataAtendimentos.length);
        
        // Agrupar contagem por nome do serviço
        const contagem = dataAtendimentos.reduce((acc, curr) => {
          const nome = curr.servico;
          acc[nome] = (acc[nome] || 0) + 1;
          return acc;
        }, {});
        setContagemPorServico(contagem);
      }

    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  async function adicionarServico(e) {
    e.preventDefault();
    if(!novoNome) return;
    await supabase.from('servicos').insert([{ nome: novoNome, cor_tema: novaCor }]);
    setNovoNome('');
    carregarDados();
  }

  async function excluirServico(id) {
    if (confirm("Deseja excluir este serviço? Todos os dados vinculados podem ser afetados.")) {
      await supabase.from('servicos').delete().eq('id', id);
      carregarDados();
    }
  }

  return (
    <div className="flex flex-col gap-4 mb-20">
      
      {/* 1. DASHBOARD DE RESUMO RESPONSIVO */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-200">
          <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Abordagens</p>
          <p className="text-3xl font-black leading-none mt-1">{contatos.length}</p>
        </div>
        
        <div className="bg-orange-500 p-5 rounded-3xl text-white shadow-lg shadow-orange-200">
          <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Total Fichas</p>
          <p className="text-3xl font-black leading-none mt-1">{totalFichas}</p>
        </div>

        <div className="bg-emerald-500 p-5 rounded-3xl text-white shadow-lg shadow-emerald-200 hidden md:block">
          <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Serviços Ativos</p>
          <p className="text-3xl font-black leading-none mt-1">{servicos.length}</p>
        </div>
      </div>

      {/* 2. AREA DE CONTEÚDO */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        
        {/* SUB-MENU */}
        <div className="flex bg-gray-50/50 border-b border-gray-100">
          <button 
            onClick={() => setAbaInterna('evangelismo')}
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${abaInterna === 'evangelismo' ? 'bg-white text-red-600 border-b-4 border-red-600' : 'text-gray-400'}`}
          >
            <Users size={18} /> <span className="text-sm">Evangelismo</span>
          </button>
          <button 
            onClick={() => setAbaInterna('servicos')}
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${abaInterna === 'servicos' ? 'bg-white text-blue-600 border-b-4 border-blue-600' : 'text-gray-400'}`}
          >
            <Settings size={18} /> <span className="text-sm">Serviços / Fichas</span>
          </button>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : (
            <>
              {/* ABA EVANGELISMO */}
              {abaInterna === 'evangelismo' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Pessoas no Pátio</h3>
                    <button onClick={carregarDados} className="text-blue-500 text-[10px] font-black border border-blue-200 px-3 py-1 rounded-full">ATUALIZAR</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contatos.map(c => (
                      <div key={c.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-50 p-2 rounded-xl text-red-500"><UserCircle size={28} /></div>
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Nome</p>
                            <p className="font-bold text-gray-800 leading-tight">{c.nome_pessoa}</p>
                          </div>
                          {c.telefone && (
                            <a href={`https://wa.me/55${c.telefone.replace(/\D/g,'')}`} target="_blank" className="bg-green-500 text-white p-3 rounded-2xl shadow-lg shadow-green-100"><MessageCircle size={20} /></a>
                          )}
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <p className="text-[9px] font-bold text-gray-400 uppercase">Pedido</p>
                          <p className="text-sm text-gray-600 italic truncate">"{c.pedido_oracao || 'Sem observações'}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA SERVIÇOS COM CONTADOR POR TIPO */}
              {abaInterna === 'servicos' && (
                <div className="space-y-6">
                  {/* Formulário compactado para mobile */}
                  <form onSubmit={adicionarServico} className="bg-gray-50 p-4 rounded-2xl space-y-3">
                    <input 
                      type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)}
                      placeholder="Nome do Serviço" 
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold" required
                    />
                    <div className="flex gap-2">
                      <input type="color" value={novaCor} onChange={e => setNovaCor(e.target.value)} className="h-12 w-20 rounded-xl cursor-pointer bg-white border border-gray-200 p-1" />
                      <button type="submit" className="flex-1 bg-blue-600 text-white font-black rounded-xl uppercase tracking-tighter shadow-md">Adicionar</button>
                    </div>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {servicos.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm relative overflow-hidden">
                        {/* Indicador visual de cor na lateral */}
                        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: s.cor_tema }}></div>
                        
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700">{s.nome}</span>
                          <div className="flex items-center gap-1 mt-1 text-orange-600 font-black">
                             <Ticket size={12} />
                             <span className="text-xs uppercase">{contagemPorServico[s.nome] || 0} Fichas</span>
                          </div>
                        </div>
                        
                        <button onClick={() => excluirServico(s.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}