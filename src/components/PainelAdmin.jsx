// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Settings, MessageCircle, Trash2, Loader2, Phone, UserCircle, LayoutDashboard } from 'lucide-react';

export default function PainelAdmin() {
  const [abaInterna, setAbaInterna] = useState('evangelismo');
  const [contatos, setContatos] = useState([]);
  const [servicos, setServicos] = useState([]);
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
      // Carrega contatos
      const { data: dataContatos } = await supabase
        .from('contatos_evangelismo')
        .select('*')
        .order('created_at', { ascending: false });
      setContatos(dataContatos || []);

      // Carrega serviços
      const { data: dataServicos } = await supabase
        .from('servicos')
        .select('*')
        .order('nome');
      setServicos(dataServicos || []);
      
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
    if (confirm("Deseja excluir este serviço?")) {
      await supabase.from('servicos').delete().eq('id', id);
      carregarDados();
    }
  }

  return (
    <div className="flex flex-col gap-4 mb-20">
      
      {/* 1. DASHBOARD DE RESUMO (Sempre visível) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-lg shadow-blue-200">
          <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Abordagens</p>
          <p className="text-3xl font-black leading-none mt-1">{contatos.length}</p>
          <div className="mt-3 bg-blue-500 h-1 w-10 rounded-full"></div>
        </div>
        
        <div className="bg-emerald-500 p-5 rounded-3xl text-white shadow-lg shadow-emerald-200">
          <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Serviços</p>
          <p className="text-3xl font-black leading-none mt-1">{servicos.length}</p>
          <div className="mt-3 bg-emerald-400 h-1 w-10 rounded-full"></div>
        </div>
      </div>

      {/* 2. AREA DE CONTEÚDO COM ABAS INTERNAS */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        
        {/* SUB-MENU */}
        <div className="flex bg-gray-50/50 border-b border-gray-100">
          <button 
            onClick={() => setAbaInterna('evangelismo')}
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${abaInterna === 'evangelismo' ? 'bg-white text-red-600 border-b-4 border-red-600' : 'text-gray-400'}`}
          >
            <Users size={18} /> <span className="text-sm">Lista Evangelismo</span>
          </button>
          <button 
            onClick={() => setAbaInterna('servicos')}
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${abaInterna === 'servicos' ? 'bg-white text-blue-600 border-b-4 border-blue-600' : 'text-gray-400'}`}
          >
            <Settings size={18} /> <span className="text-sm">Gerir Serviços</span>
          </button>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : (
            <>
              {/* ABA EVANGELISMO (CARDS RESPONSIVOS) */}
              {abaInterna === 'evangelismo' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Pessoas no Pátio</h3>
                    <button onClick={carregarDados} className="text-blue-500 text-xs font-bold">ATUALIZAR</button>
                  </div>
                  
                  {contatos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 font-medium">Nenhum registro até o momento.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contatos.map(c => (
                        <div key={c.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-red-50 p-2 rounded-xl text-red-500">
                              <UserCircle size={28} />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome Completo</p>
                              <p className="font-bold text-gray-800 text-lg leading-tight">{c.nome_pessoa}</p>
                            </div>
                            {c.telefone && (
                              <a 
                                href={`https://wa.me/55${c.telefone.replace(/\D/g,'')}`} 
                                target="_blank" 
                                className="bg-green-500 text-white p-3 rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-transform"
                              >
                                <MessageCircle size={20} />
                              </a>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-2 border-t border-gray-50 pt-3">
                            <div className="flex items-center gap-2 text-gray-500 px-1">
                              <Phone size={14} />
                              <span className="text-xs font-medium">{c.telefone || 'Sem contato'}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                              <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Pedido de Oração / Observação</p>
                              <p className="text-sm text-gray-600 italic">"{c.pedido_oracao || 'Apenas visita'}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ABA GERIR SERVIÇOS */}
              {abaInterna === 'servicos' && (
                <div className="space-y-6">
                  <form onSubmit={adicionarServico} className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-bold mb-1 text-gray-400 uppercase">Novo Serviço</label>
                      <input 
                        type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)}
                        placeholder="Ex: Consultoria Jurídica" 
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-blue-500 font-bold" required
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold mb-1 text-gray-400 uppercase">Cor do Tema</label>
                        <input type="color" value={novaCor} onChange={e => setNovaCor(e.target.value)} className="h-12 w-full rounded-xl cursor-pointer bg-white border border-gray-200 p-1" />
                      </div>
                      <button type="submit" className="bg-blue-600 text-white h-12 px-8 rounded-2xl font-black uppercase tracking-tighter hover:bg-blue-700 shadow-lg shadow-blue-100 mt-5">
                        ADICIONAR
                      </button>
                    </div>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {servicos.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-lg shadow-inner" style={{ backgroundColor: s.cor_tema }}></div>
                          <span className="font-bold text-gray-700">{s.nome}</span>
                        </div>
                        <button onClick={() => excluirServico(s.id)} className="text-red-200 hover:text-red-500 p-2 transition-colors">
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