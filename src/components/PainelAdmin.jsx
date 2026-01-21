// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Settings, MessageCircle, Trash2, Loader2, Phone, UserCircle, Ticket, RefreshCw } from 'lucide-react';

export default function PainelAdmin() {
  const [abaInterna, setAbaInterna] = useState('evangelismo');
  const [contatos, setContatos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [contagemPorServico, setContagemPorServico] = useState({});
  const [totalFichas, setTotalFichas] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estados para novo serviço
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

      // 3. Carregar Atendimentos com relacionamento para contar por NOME
      const { data: dataAtendimentos, error: erroFichas } = await supabase
        .from('atendimentos')
        .select(`
          id,
          servico_id,
          servicos (
            nome
          )
        `);

      if (erroFichas) throw erroFichas;

      if (dataAtendimentos) {
        setTotalFichas(dataAtendimentos.length);
        
        // Agrupar contagem pelo nome do serviço que vem da relação
        const contagem = {};
        dataAtendimentos.forEach(item => {
          const nomeRelacionado = item.servicos?.nome;
          if (nomeRelacionado) {
            contagem[nomeRelacionado] = (contagem[nomeRelacionado] || 0) + 1;
          }
        });
        setContagemPorServico(contagem);
      }

    } catch (err) {
      console.error("Erro ao carregar dados do painel:", err);
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
    if (confirm("Deseja excluir este serviço?")) {
      await supabase.from('servicos').delete().eq('id', id);
      carregarDados();
    }
  }

  return (
    <div className="flex flex-col gap-4 mb-20 animate-in fade-in duration-500">
      
      {/* 1. DASHBOARD DE RESUMO */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-100">
          <p className="text-[10px] uppercase font-black opacity-70 tracking-widest leading-none">Abordagens</p>
          <p className="text-3xl font-black mt-2 leading-none">{contatos.length}</p>
        </div>
        
        <div className="bg-orange-500 p-5 rounded-3xl text-white shadow-lg shadow-orange-100">
          <p className="text-[10px] uppercase font-black opacity-70 tracking-widest leading-none">Total Fichas</p>
          <p className="text-3xl font-black mt-2 leading-none">{totalFichas}</p>
        </div>

        <div className="bg-emerald-500 p-5 rounded-3xl text-white shadow-lg shadow-emerald-100 hidden md:block">
          <p className="text-[10px] uppercase font-black opacity-70 tracking-widest leading-none">Serviços</p>
          <p className="text-3xl font-black mt-2 leading-none">{servicos.length}</p>
        </div>
      </div>

      {/* 2. ÁREA DE ABAS */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        
        <div className="flex bg-gray-50/50 border-b border-gray-100">
          <button 
            onClick={() => setAbaInterna('evangelismo')}
            className={`flex-1 py-5 font-bold flex items-center justify-center gap-2 transition-all ${abaInterna === 'evangelismo' ? 'bg-white text-red-600 border-b-4 border-red-600' : 'text-gray-400'}`}
          >
            <Users size={20} /> <span className="text-sm uppercase tracking-tight">Evangelismo</span>
          </button>
          <button 
            onClick={() => setAbaInterna('servicos')}
            className={`flex-1 py-5 font-bold flex items-center justify-center gap-2 transition-all ${abaInterna === 'servicos' ? 'bg-white text-blue-600 border-b-4 border-blue-600' : 'text-gray-400'}`}
          >
            <Settings size={20} /> <span className="text-sm uppercase tracking-tight">Serviços</span>
          </button>
        </div>

        <div className="p-4 md:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="text-xs font-bold uppercase tracking-widest">Sincronizando Banco...</p>
            </div>
          ) : (
            <>
              {/* ABA EVANGELISMO */}
              {abaInterna === 'evangelismo' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800 tracking-tighter">PÁTIO</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Registros de abordagem</p>
                    </div>
                    <button onClick={carregarDados} className="bg-gray-100 p-2 rounded-xl text-gray-500 hover:bg-gray-200 transition-colors">
                      <RefreshCw size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contatos.map(c => (
                      <div key={c.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="bg-red-50 p-3 rounded-2xl text-red-500"><UserCircle size={32} /></div>
                          <div className="flex-1">
                            <p className="font-black text-gray-800 text-xl leading-tight mb-1 uppercase tracking-tighter">{c.nome_pessoa}</p>
                            <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                              <Phone size={14} /> <span>{c.telefone || 'Sem Telefone'}</span>
                            </div>
                          </div>
                          {c.telefone && (
                            <a href={`https://wa.me/55${c.telefone.replace(/\D/g,'')}`} target="_blank" className="bg-green-500 text-white p-4 rounded-2xl shadow-lg shadow-green-100 active:scale-90 transition-transform">
                              <MessageCircle size={24} />
                            </a>
                          )}
                        </div>
                        <div className="mt-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Observação / Oração</p>
                          <p className="text-gray-600 font-medium leading-relaxed italic">"{c.pedido_oracao || 'Nenhuma observação registrada.'}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA SERVIÇOS */}
              {abaInterna === 'servicos' && (
                <div className="space-y-8">
                  <form onSubmit={adicionarServico} className="bg-gray-900 p-6 rounded-[2rem] shadow-2xl text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-4 text-blue-400">Novo Serviço do Evento</p>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input 
                        type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)}
                        placeholder="Ex: Assessoria Jurídica" 
                        className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-2xl outline-none focus:border-blue-500 font-bold" required
                      />
                      <div className="flex gap-4">
                        <input type="color" value={novaCor} onChange={e => setNovaCor(e.target.value)} className="h-14 w-20 rounded-2xl cursor-pointer bg-gray-800 border border-gray-700 p-1" />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 rounded-2xl uppercase tracking-tighter transition-all">Criar</button>
                      </div>
                    </div>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {servicos.map(s => (
                      <div key={s.id} className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:border-blue-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-12 rounded-full" style={{ backgroundColor: s.cor_tema }}></div>
                          <div>
                            <span className="font-black text-gray-800 text-lg tracking-tighter uppercase block leading-none">{s.nome}</span>
                            <div className="flex items-center gap-1.5 mt-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full w-fit">
                               <Ticket size={12} strokeWidth={3} />
                               <span className="text-[10px] font-black uppercase tracking-widest">{contagemPorServico[s.nome] || 0} Fichas</span>
                            </div>
                          </div>
                        </div>
                        
                        <button onClick={() => excluirServico(s.id)} className="text-gray-200 group-hover:text-red-400 p-2 transition-colors">
                          <Trash2 size={20} />
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