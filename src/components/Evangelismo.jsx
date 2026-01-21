// @ts-nocheck
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, User, MessageCircle, Save, Loader2, Phone } from 'lucide-react';

export default function Evangelismo() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [pedido, setPedido] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  async function salvarPedido(e) {
    e.preventDefault(); 
    if (!nome.trim()) return alert("Por favor, digite o nome da pessoa.");

    setSalvando(true);
    setMensagem(null);

    try {
      const { error } = await supabase
        .from('contatos_evangelismo') 
        .insert([{ 
          nome_pessoa: nome, 
          telefone: telefone, // Adicionado de volta
          pedido_oracao: pedido
        }]);

      if (error) throw error;

      setMensagem({ tipo: 'sucesso', texto: 'Dados salvos com sucesso!' });
      setNome('');
      setTelefone('');
      setPedido('');
      
      setTimeout(() => setMensagem(null), 3000);

    } catch (err) {
      console.error("Erro ao salvar:", err);
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar: ' + err.message });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mt-4">
      <div className="bg-red-500 p-6 text-white text-center">
        <Heart className="mx-auto mb-2 fill-current" size={32} />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Evangelismo</h2>
        <p className="text-red-100 text-sm">Cadastro de pedidos de oração</p>
      </div>

      <form onSubmit={salvarPedido} className="p-6 space-y-4">
        {mensagem && (
          <div className={`p-3 rounded-xl text-center text-sm font-bold ${
            mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {mensagem.texto}
          </div>
        )}

        {/* CAMPO NOME */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">Nome da Pessoa</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-400 focus:bg-white rounded-xl outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* CAMPO TELEFONE (VOLTOU!) */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">WhatsApp / Telefone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-400 focus:bg-white rounded-xl outline-none transition-all"
            />
          </div>
        </div>

        {/* CAMPO PEDIDO */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase ml-1 mb-1">Pedido de Oração</label>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea
              value={pedido}
              onChange={(e) => setPedido(e.target.value)}
              placeholder="Motivo da oração..."
              rows="3"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-400 focus:bg-white rounded-xl outline-none transition-all resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {salvando ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {salvando ? 'SALVANDO...' : 'SALVAR NO SISTEMA'}
        </button>
      </form>
    </div>
  );
}