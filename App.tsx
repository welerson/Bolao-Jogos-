
import React, { useState, useEffect } from 'react';
import { User, UserRole, Pool, PoolStatus, Participation } from './types';
import Layout from './components/Layout';
import PoolCard from './components/PoolCard';
import { LOTTERY_GAMES, APP_MESSAGES } from './constants';
import { geminiService } from './services/geminiService';

const MOCK_USER: User = {
  id: 'u1',
  name: 'João Silva',
  email: 'joao@email.com',
  role: UserRole.ORGANIZER,
  isVerified: true
};

const INITIAL_POOLS: Pool[] = [
  {
    id: 'p1',
    name: 'Mega da Virada - Bairro X',
    organizerId: 'u1',
    gameType: 'mega-sena',
    totalQuotas: 50,
    availableQuotas: 12,
    pricePerQuota: 25.00,
    status: PoolStatus.OPEN,
    closingDate: '2024-12-30T18:00:00Z',
    drawDate: '2024-12-31T20:00:00Z',
    description: 'Bolão anual do bairro. Muita sorte para todos!',
    isPublic: true
  },
  {
    id: 'p2',
    name: 'Lotofácil Turbo',
    organizerId: 'u2',
    gameType: 'lotofacil',
    totalQuotas: 20,
    availableQuotas: 0,
    pricePerQuota: 15.00,
    status: PoolStatus.CLOSED,
    closingDate: '2024-10-20T18:00:00Z',
    drawDate: '2024-10-20T20:00:00Z',
    description: 'Estratégia de 17 números.',
    isPublic: true
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [pools, setPools] = useState<Pool[]>(INITIAL_POOLS);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [isLuckyModalOpen, setIsLuckyModalOpen] = useState(false);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Create Pool State
  const [newPool, setNewPool] = useState({
    name: '',
    gameType: 'mega-sena',
    totalQuotas: 20,
    pricePerQuota: 10,
    description: ''
  });

  const handlePoolClick = (pool: Pool) => {
    setSelectedPool(pool);
  };

  const handleCreatePool = (e: React.FormEvent) => {
    e.preventDefault();
    const pool: Pool = {
      id: `p${Date.now()}`,
      ...newPool,
      organizerId: MOCK_USER.id,
      availableQuotas: newPool.totalQuotas,
      status: PoolStatus.OPEN,
      closingDate: new Date().toISOString(),
      drawDate: new Date().toISOString(),
      isPublic: true
    };
    setPools([pool, ...pools]);
    setActiveTab('home');
    alert('Bolão criado com sucesso!');
  };

  const handleGenerateLucky = async () => {
    if (!selectedPool) return;
    setIsGenerating(true);
    const game = LOTTERY_GAMES.find(g => g.id === selectedPool.gameType);
    const nums = await geminiService.generateLuckyNumbers(selectedPool.gameType, game?.minNumbers || 6);
    setLuckyNumbers(nums);
    setIsGenerating(false);
    setIsLuckyModalOpen(true);
  };

  const renderHome = () => (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Buscar bolão..." 
            className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
          />
          <svg className="absolute left-3 top-3.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <button className="bg-white border border-slate-200 p-3 rounded-xl text-slate-600 active:bg-slate-50 shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="10" y1="8" x2="14" y2="8"/><line x1="18" y1="16" x2="22" y2="16"/></svg>
        </button>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Loterias Oficiais</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {LOTTERY_GAMES.map(game => (
            <div key={game.id} className="flex-shrink-0 flex flex-col items-center gap-2">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform active:scale-90"
                style={{ backgroundColor: game.color }}
              >
                <span className="font-bold text-sm">{game.name.substring(0, 2).toUpperCase()}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-600">{game.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bolões Disponíveis</h2>
          <button className="text-xs font-bold text-blue-600">Ver todos</button>
        </div>
        <div className="grid gap-4">
          {pools.filter(p => p.isPublic).map(pool => (
            <PoolCard key={pool.id} pool={pool} onClick={handlePoolClick} />
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mt-8">
        <div className="flex items-center gap-2 mb-2 text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span className="font-bold text-xs uppercase tracking-wide">Jogo Responsável</span>
        </div>
        <p className="text-[11px] text-blue-600/80 leading-relaxed">
          {APP_MESSAGES.LEGAL_WARNING}
        </p>
      </div>
    </div>
  );

  const renderPoolDetail = () => {
    if (!selectedPool) return null;
    const game = LOTTERY_GAMES.find(g => g.id === selectedPool.gameType);

    return (
      <div className="bg-white min-h-screen flex flex-col animate-in slide-in-from-right duration-300">
        <div className="h-40 relative flex items-end px-6 pb-6" style={{ backgroundColor: game?.color || '#333' }}>
          <button 
            onClick={() => setSelectedPool(null)}
            className="absolute top-6 left-6 bg-black/20 p-2 rounded-full text-white backdrop-blur-md transition-colors hover:bg-black/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
               <span className="font-bold text-base" style={{ color: game?.color }}>{game?.name.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-xl leading-tight">{selectedPool.name}</h2>
              <p className="text-white/80 text-xs font-medium uppercase tracking-wider">{game?.name} • Concurso #{Math.floor(Math.random() * 3000)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8 flex-1 pb-32">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Cota</p>
              <p className="text-xl font-bold text-slate-800">R$ {selectedPool.pricePerQuota.toFixed(2)}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Livres</p>
              <p className="text-xl font-bold text-slate-800">{selectedPool.availableQuotas} / {selectedPool.totalQuotas}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-bold text-slate-800 text-sm">Progresso</h3>
              <span className="text-xs font-bold text-blue-600">
                {Math.round(((selectedPool.totalQuotas - selectedPool.availableQuotas) / selectedPool.totalQuotas) * 100)}% Preenchido
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
               <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${((selectedPool.totalQuotas - selectedPool.availableQuotas) / selectedPool.totalQuotas) * 100}%` }}
               ></div>
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="font-bold text-slate-800 text-sm px-1">Informações</h3>
             <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed shadow-sm">
               {selectedPool.description || 'Nenhuma descrição fornecida para este bolão.'}
             </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <div>
                   <h3 className="font-bold text-sm">Gerador Inteligente</h3>
                   <p className="text-[10px] text-indigo-100">Consultar IA para números da sorte</p>
                </div>
             </div>
             <button 
                onClick={handleGenerateLucky}
                disabled={isGenerating}
                className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl text-xs hover:bg-indigo-50 active:scale-95 transition-all disabled:opacity-50 shadow-md"
             >
                {isGenerating ? 'Analisando Probabilidades...' : 'Gerar Palpite com IA'}
             </button>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 flex gap-4 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
           <button 
            onClick={() => setShowPaymentModal(true)}
            className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform"
           >
             Garantir Cota • R$ {selectedPool.pricePerQuota.toFixed(2)}
           </button>
           <button className="w-16 h-14 bg-slate-100 text-slate-600 flex items-center justify-center rounded-2xl border border-slate-200 active:bg-slate-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
           </button>
        </div>

        {/* PIX Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-lg rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-500">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8"></div>
                <div className="text-center space-y-2 mb-8">
                   <h3 className="text-xl font-bold text-slate-800">Pagamento PIX</h3>
                   <p className="text-slate-500 text-sm">Escaneie o código abaixo para confirmar sua cota</p>
                </div>
                <div className="bg-slate-50 aspect-square w-64 mx-auto rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-8 relative group">
                   <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BOLAOPIX-MOCK-PAYMENT" className="w-48 h-48 opacity-80" alt="QR Code" />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold">Copiar Código</button>
                   </div>
                </div>
                <div className="space-y-3">
                   <button 
                    onClick={() => {
                      setShowPaymentModal(false);
                      alert('Pagamento enviado para análise do organizador!');
                    }}
                    className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
                   >
                     Já realizei o pagamento
                   </button>
                   <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl transition-colors active:bg-slate-200"
                   >
                     Cancelar
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  };

  const renderCreatePool = () => (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Novo Bolão</h2>
        <p className="text-slate-500 text-sm">Defina as regras e comece a arrecadar</p>
      </div>

      <form onSubmit={handleCreatePool} className="space-y-6 pb-20">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nome do Bolão</label>
            <input 
              required
              value={newPool.name}
              onChange={e => setNewPool({...newPool, name: e.target.value})}
              placeholder="Ex: Mega da Virada VIP"
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Loteria</label>
            <select 
              value={newPool.gameType}
              onChange={e => setNewPool({...newPool, gameType: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none shadow-sm appearance-none"
            >
              {LOTTERY_GAMES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Total de Cotas</label>
              <input 
                type="number"
                value={newPool.totalQuotas}
                onChange={e => setNewPool({...newPool, totalQuotas: parseInt(e.target.value)})}
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">R$ por Cota</label>
              <input 
                type="number"
                value={newPool.pricePerQuota}
                onChange={e => setNewPool({...newPool, pricePerQuota: parseFloat(e.target.value)})}
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Descrição / Regras</label>
            <textarea 
              rows={4}
              value={newPool.description}
              onChange={e => setNewPool({...newPool, description: e.target.value})}
              placeholder="Descreva a estratégia de jogo..."
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none shadow-sm resize-none"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-5 bg-blue-600 text-white font-bold rounded-[24px] shadow-xl shadow-blue-100 active:scale-95 transition-transform"
        >
          Lançar Bolão
        </button>
      </form>
    </div>
  );

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userRole={MOCK_USER.role}>
      {selectedPool ? renderPoolDetail() : (
        <>
          {activeTab === 'home' && renderHome()}
          {activeTab === 'create' && renderCreatePool()}
          {activeTab === 'wallet' && (
            <div className="p-6 space-y-6 animate-in slide-in-from-bottom duration-500">
               <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px]"></div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Saldo Total</p>
                  <h2 className="text-4xl font-bold mb-8">R$ 1.450,20</h2>
                  <div className="grid grid-cols-2 gap-4">
                     <button className="bg-white/10 hover:bg-white/20 py-4 rounded-2xl text-xs font-bold transition-colors border border-white/10">Depositar</button>
                     <button className="bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-xs font-bold transition-colors shadow-lg shadow-blue-500/20">Sacar</button>
                  </div>
               </div>
               <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm px-1">Atividade Recente</h3>
                  <div className="space-y-3">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
                          <div className="flex gap-4 items-center">
                             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                             </div>
                             <div>
                               <p className="font-bold text-slate-800 text-sm">Resgate Lotofácil</p>
                               <p className="text-[10px] text-slate-400 font-medium">Concurso #3245 • 12/10</p>
                             </div>
                          </div>
                          <p className="font-bold text-emerald-600">+ R$ 45,00</p>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
          {activeTab === 'my-pools' && (
            <div className="p-6 space-y-6 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-2xl font-bold text-slate-800">Meus Bolões</h2>
              <div className="grid gap-4">
                {pools.filter(p => p.organizerId === MOCK_USER.id).map(pool => (
                  <PoolCard key={pool.id} pool={pool} onClick={handlePoolClick} />
                ))}
                {pools.filter(p => p.organizerId === MOCK_USER.id).length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">Você ainda não tem bolões.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'profile' && (
             <div className="p-6 space-y-8 animate-in slide-in-from-bottom duration-500">
                <div className="flex flex-col items-center py-8 gap-4">
                   <div className="relative group">
                      <img src="https://picsum.photos/seed/user123/200/200" className="w-28 h-28 rounded-full border-4 border-white shadow-2xl transition-transform group-active:scale-95" />
                      <div className="absolute bottom-1 right-1 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                   </div>
                   <div className="text-center">
                      <h2 className="font-bold text-2xl text-slate-800">{MOCK_USER.name}</h2>
                      <p className="text-slate-400 text-sm font-medium">{MOCK_USER.email}</p>
                   </div>
                </div>
                <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                   {[
                    { label: 'Dados Pessoais', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
                    { label: 'Notificações', icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' },
                    { label: 'Segurança', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
                    { label: 'Ajuda e Suporte', icon: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01' },
                    { label: 'Sair', icon: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9', isDestructive: true }
                   ].map((item, idx) => (
                     <button key={idx} className="w-full flex justify-between items-center px-8 py-5 border-b border-slate-50 last:border-0 active:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                           <svg className={item.isDestructive ? 'text-red-400' : 'text-slate-400'} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                           <span className={`font-bold text-sm ${item.isDestructive ? 'text-red-500' : 'text-slate-700'}`}>{item.label}</span>
                        </div>
                        <svg className="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                     </button>
                   ))}
                </div>
             </div>
          )}
        </>
      )}

      {/* Global Lucky Numbers Modal */}
      {isLuckyModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="bg-indigo-600 p-8 text-center text-white relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <h3 className="text-xl font-bold mb-1">Seu Palpite da Sorte!</h3>
                <p className="text-indigo-100/70 text-xs font-medium uppercase tracking-widest">IA Bolão Premiado</p>
             </div>
             <div className="p-10">
               <div className="flex flex-wrap justify-center gap-4">
                  {luckyNumbers.map((n, i) => (
                    <div key={i} className="w-14 h-14 rounded-full border-2 border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl bg-indigo-50 shadow-inner">
                      {n.toString().padStart(2, '0')}
                    </div>
                  ))}
               </div>
               <div className="mt-10 space-y-4">
                 <p className="text-[10px] text-slate-400 text-center uppercase tracking-[0.2em] font-black">Boa Sorte!</p>
                 <button 
                  onClick={() => setIsLuckyModalOpen(false)}
                  className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-200 transition-colors"
                 >
                   Fechar
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
