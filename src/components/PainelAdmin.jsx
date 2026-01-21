// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Settings, MessageCircle, Trash2, ExternalLink, Loader2 } from 'lucide-react';

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
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
      {/* SUB-MENU DO PAINEL */}
      <div className="flex border-b">
        <button 
          onClick={() => setAbaInterna('evangelismo')}
          className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${abaInterna === 'evangelismo' ? 'bg-red-50 text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
        >
          <Users size={20} /> Lista Evangelismo
        </button>
        <button 
          onClick={() => setAbaInterna('servicos')}
          className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${abaInterna === 'servicos' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          <Settings size={20} /> Gerir Serviços
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400" /></div>
        ) : (
          <>
            {/* ABA LISTA DE EVANGELISMO */}
            {abaInterna === 'evangelismo' && (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Pessoas Cadastradas</h3>
                {contatos.length === 0 ? <p className="text-gray-500">Nenhum registro encontrado.</p> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs uppercase text-gray-400 border-b">
                          <th className="pb-2">Nome</th>
                          <th className="pb-2">Telefone</th>
                          <th className="pb-2">Pedido</th>
                          <th className="pb-2 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {contatos.map(c => (
                          <tr key={c.id} className="text-sm hover:bg-gray-50">
                            <td className="py-3 font-bold text-gray-700">{c.nome_pessoa}</td>
                            <td className="py-3 text-gray-600">{c.telefone || '---'}</td>
                            <td className="py-3 text-gray-500 italic max-w-xs truncate">{c.pedido_oracao}</td>
                            <td className="py-3 text-right">
                              {c.telefone && (
                                <a 
                                  href={`https://wa.me/55${c.telefone.replace(/\D/g,'')}`} 
                                  target="_blank" 
                                  className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600"
                                >
                                  <MessageCircle size={14} /> WhatsApp
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ABA GERIR SERVIÇOS */}
            {abaInterna === 'servicos' && (
              <div className="space-y-6">
                <form onSubmit={adicionarServico} className="bg-gray-50 p-4 rounded-2xl flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold mb-1 text-gray-500 uppercase">Novo Serviço</label>
                    <input 
                      type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)}
                      placeholder="Ex: Corte de Cabelo" 
                      className="w-full p-2 border rounded-lg outline-none focus:border-blue-500" required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-gray-500 uppercase">Cor</label>
                    <input type="color" value={novaCor} onChange={e => setNovaCor(e.target.value)} className="h-10 w-16 rounded cursor-pointer" />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">ADICIONAR</button>
                </form>

                <div className="grid grid-cols-1 gap-2">
                  {servicos.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 border rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: s.cor_tema }}></div>
                        <span className="font-bold text-gray-700">{s.nome}</span>
                      </div>
                      <button onClick={() => excluirServico(s.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
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