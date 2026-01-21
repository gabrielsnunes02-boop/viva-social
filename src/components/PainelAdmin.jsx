// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Settings, MessageCircle, Trash2, Loader2, Phone, UserCircle } from 'lucide-react';

export default function PainelAdmin() {
  const [abaInterna, setAbaInterna] = useState('evangelismo');
  const [contatos, setContatos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [novoNome, setNovoNome] = useState('');
  const [novaCor, setNovaCor] = useState('#3b82f6');

  useEffect(() => {
    carregarDados();
  }, [abaInterna]);

  async function carregarDados() {
    setLoading(true);
    try {
      if (abaInterna === 'evangelismo') {
        const { data } = await supabase.from('contatos_evangelismo').select('*').order('created_at', { ascending: false });
        setContatos(data || []);
      } else {
        const { data } = await supabase.from('servicos').select('*').order('nome');
        setServicos(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function adicionarServico(e) {
    e.preventDefault();
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
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200 mb-10">
      {/* SUB-MENU RESPONSIVO */}
      <div className="flex border-b bg-gray-50">
        <button 
          onClick={() => setAbaInterna('evangelismo')}
          className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${abaInterna === 'evangelismo' ? 'bg-white text-red-600 border-b-4 border-red-600' : 'text-gray-400'}`}
        >
          <Users size={18} /> <span className="text-sm md:text-base">Evangelismo</span>
        </button>
        <button 
          onClick={() => setAbaInterna('servicos')}
          className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${abaInterna === 'servicos' ? 'bg-white text-blue-600 border-b-4 border-blue-600' : 'text-gray-400'}`}
        >
          <Settings size={18} /> <span className="text-sm md:text-base">Serviços</span>
        </button>
      </div>

      <div className="p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : (
          <>
            {/* LISTA DE EVANGELISMO EM CARDS (MOBILE FIRST) */}
            {abaInterna === 'evangelismo' && (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Pessoas Cadastradas</h3>
                
                {contatos.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">Nenhum registro encontrado.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contatos.map(c => (
                      <div key={c.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-3 relative overflow-hidden">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded-full text-red-500">
                            <UserCircle size={24} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome</p>
                            <p className="font-bold text-gray-800 leading-tight">{c.nome_pessoa}</p>
                          </div>
                          {c.telefone && (
                            <a 
                              href={`https://wa.me/55${c.telefone.replace(/\D/g,'')}`} 
                              target="_blank" 
                              className="bg-green-500 text-white p-2.5 rounded-xl shadow-lg shadow-green-100 active:scale-90 transition-transform"
                            >
                              <MessageCircle size={20} />
                            </a>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-2 border-t border-gray-200 pt-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-sm">{c.telefone || 'Sem telefone'}</span>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pedido de Oração</p>
                            <p className="text-sm text-gray-700 italic">"{c.pedido_oracao || 'Nenhum pedido registrado'}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* GERIR SERVIÇOS RESPONSIVO */}
            {abaInterna === 'servicos' && (
              <div className="space-y-6">
                <form onSubmit={adicionarServico} className="bg-gray-50 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-stretch md:items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold mb-1 text-gray-500 uppercase">Novo Serviço</label>
                    <input 
                      type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)}
                      placeholder="Ex: Corte de Cabelo" 
                      className="w-full p-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all" required
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-bold mb-1 text-gray-500 uppercase">Cor</label>
                      <input type="color" value={novaCor} onChange={e => setNovaCor(e.target.value)} className="h-12 w-full md:w-16 rounded-xl cursor-pointer border-none p-1 bg-white shadow-sm" />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white h-12 px-6 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 flex-1 md:flex-none">
                      ADICIONAR
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicos.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-white border-2 border-gray-50 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: s.cor_tema }}></div>
                        <span className="font-bold text-gray-700">{s.nome}</span>
                      </div>
                      <button onClick={() => excluirServico(s.id)} className="text-red-300 hover:text-red-500 p-2 transition-colors">
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
  );
}