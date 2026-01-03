
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
  role: UserRole.ORGANIZER, // Mock as organizer for demo
  isVerified: true
};

const MOCK_POOLS: Pool[] = [
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
  },
  {
    id: 'p3',
    name: 'Quina de São João VIP',
    organizerId: 'u1',
    gameType: 'quina',
    totalQuotas: 100,
    availableQuotas: 85,
    pricePerQuota: 50.00,
    status: PoolStatus.OPEN,
    closingDate: '2025-06-20T18:00:00Z',
    drawDate: '2025-06-24T20:00:00Z',
    description: 'Apenas para membros do grupo VIP.',
    isPublic: false,
    accessCode: 'VIP2025'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [pools, setPools] = useState<Pool[]>(MOCK_POOLS);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [isLuckyModalOpen, setIsLuckyModalOpen] = useState(false);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePoolClick = (pool: Pool) => {
    setSelectedPool(pool);
  };

  const handleGenerateLucky = async () => {
    if (!selectedPool) return;
    setIsGenerating(true);
    const nums = await geminiService.generateLuckyNumbers(selectedPool.gameType, 6);
    setLuckyNumbers(nums);
    setIsGenerating(false);
    setIsLuckyModalOpen(true);
  };

  const renderHome = () => (
    <div className="p-4 space-y-6">
      {/* Search & Filters */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Buscar bolão..." 
            className="w-full bg-white border border-slate-200 rounded-xl px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <svg className="absolute left-3 top-3 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <button className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-600 active:bg-slate-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="10" y1="8" x2="14" y2="8"/><line x1="18" y1="16" x2="22" y2="16"/></svg>
        </button>
      </div>

      {/* Featured Games */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Loterias Oficiais</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {LOTTERY_GAMES.slice(0, 5).map(game => (
            <div key={game.id} className="flex-shrink-0 flex flex-col items-center gap-1">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: game.color }}
              >
                <span className="font-bold text-xs">{game.name.substring(0, 2).toUpperCase()}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-600">{game.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Pools */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Bolões Disponíveis</h2>
          <button className="text-xs font-bold text-blue-600">Ver todos</button>
        </div>
        <div className="grid gap-4">
          {pools.filter(p => p.isPublic).map(pool => (
            <PoolCard key={pool.id} pool={pool} onClick={handlePoolClick} />
          ))}
        </div>
      </div>

      {/* Legal & Responsible Gaming */}
      <div className="bg-slate-100 rounded-2xl p-4 mt-8">
        <div className="flex items-center gap-2 mb-2 text-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span className="font-bold text-xs uppercase tracking-wide">Aviso Importante</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
          {APP_MESSAGES.LEGAL_WARNING}
        </p>
        <p className="text-[11px] text-blue-600 font-bold">
          {APP_MESSAGES.RESPONSIBLE_GAMING}
        </p>
      </div>
    </div>
  );

  const renderPoolDetail = () => {
    if (!selectedPool) return null;
    const game = LOTTERY_GAMES.find(g => g.id === selectedPool.gameType);

    return (
      <div className="bg-white min-h-full flex flex-col">
        {/* Header Overlay */}
        <div className="h-32 relative flex items-end px-4 pb-4" style={{ backgroundColor: game?.color || '#333' }}>
          <button 
            onClick={() => setSelectedPool(null)}
            className="absolute top-4 left-4 bg-white/20 p-2 rounded-full text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
               <span className="font-bold text-sm" style={{ color: game?.color }}>{game?.name.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{selectedPool.name}</h2>
              <p className="text-white/80 text-xs">{game?.name} • Concurso #{Math.floor(Math.random() * 3000)}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Cota Individual</p>
              <p className="text-lg font-bold text-slate-800">R$ {selectedPool.pricePerQuota.toFixed(2)}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Cotas Livres</p>
              <p className="text-lg font-bold text-slate-800">{selectedPool.availableQuotas} / {selectedPool.totalQuotas}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm px-1">Progresso do Bolão</h3>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
               <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${((selectedPool.totalQuotas - selectedPool.availableQuotas) / selectedPool.totalQuotas) * 100}%` }}
               ></div>
            </div>
            <p className="text-[11px] text-slate-500 italic text-right">Faltam apenas {selectedPool.availableQuotas} cotas para fechar!</p>
          </div>

          <div className="space-y-3">
             <h3 className="font-bold text-slate-800 text-sm px-1">Sobre este Bolão</h3>
             <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
               {selectedPool.description}
             </p>
          </div>

          {/* AI Feature: Lucky Numbers */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100 space-y-3">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                  <svg className="text-white" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <h3 className="font-bold text-indigo-900 text-sm">Números da Sorte (IA)</h3>
             </div>
             <p className="text-[11px] text-indigo-700/80">Nossa inteligência artificial pode sugerir números baseados em estatísticas históricas fictícias para este bolão.</p>
             <button 
                onClick={handleGenerateLucky}
                disabled={isGenerating}
                className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
             >
                {isGenerating ? 'Consultando IA...' : 'Gerar Palpite da Sorte'}
             </button>
          </div>

          {/* Persistent Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex gap-3 z-50">
             <button className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform">
               Comprar 1 Cota
             </button>
             <button className="w-16 h-14 bg-slate-100 text-slate-600 flex items-center justify-center rounded-2xl border border-slate-200 active:bg-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
             </button>
          </div>
        </div>
        
        {/* Lucky Numbers Modal */}
        {isLuckyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
               <div className="bg-indigo-600 p-6 text-center text-white">
                 <h3 className="text-lg font-bold">Seu Palpite da Sorte!</h3>
                 <p className="text-white/70 text-xs">Sugerido por nossa IA Gemini</p>
               </div>
               <div className="p-8">
                 <div className="flex flex-wrap justify-center gap-3">
                    {luckyNumbers.map((n, i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg bg-indigo-50">
                        {n.toString().padStart(2, '0')}
                      </div>
                    ))}
                 </div>
                 <p className="mt-8 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">Jogue com moderação</p>
                 <button 
                  onClick={() => setIsLuckyModalOpen(false)}
                  className="w-full mt-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl border border-slate-200"
                 >
                   Fechar
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderWallet = () => (
    <div className="p-4 space-y-6">
      <div className="bg-blue-600 rounded-[32px] p-6 text-white shadow-xl shadow-blue-200">
        <p className="text-xs text-blue-100 font-medium mb-1">Saldo Disponível</p>
        <h2 className="text-3xl font-bold mb-6">R$ 1.450,20</h2>
        <div className="flex gap-4">
           <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-xl text-xs font-bold transition-colors">Depositar</button>
           <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-xl text-xs font-bold transition-colors">Sacar</button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 px-1">Últimas Transações</h3>
        <div className="space-y-2">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                <div className="flex gap-3">
                   <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                   </div>
                   <div>
                     <p className="font-bold text-slate-800 text-sm">Resgate de Prêmio</p>
                     <p className="text-[10px] text-slate-400">Ontem às 14:30</p>
                   </div>
                </div>
                <p className="font-bold text-emerald-600">+ R$ 45,00</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userRole={MOCK_USER.role}>
      {selectedPool ? renderPoolDetail() : (
        <>
          {activeTab === 'home' && renderHome()}
          {activeTab === 'wallet' && renderWallet()}
          {activeTab === 'my-pools' && (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Meus Bolões</h2>
              <div className="grid gap-4">
                {pools.filter(p => p.organizerId === MOCK_USER.id).map(pool => (
                  <PoolCard key={pool.id} pool={pool} onClick={handlePoolClick} />
                ))}
              </div>
            </div>
          )}
          {activeTab === 'profile' && (
             <div className="p-4 space-y-6">
                <div className="flex flex-col items-center py-6 gap-3">
                   <div className="relative">
                      <img src="https://picsum.photos/seed/user123/200/200" className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
                      <div className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                   </div>
                   <div className="text-center">
                      <h2 className="font-bold text-xl text-slate-800">{MOCK_USER.name}</h2>
                      <p className="text-slate-500 text-sm">{MOCK_USER.email}</p>
                   </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                   {['Segurança', 'Notificações', 'Documentação (KYC)', 'Sobre o App', 'Sair'].map((item, idx) => (
                     <button key={idx} className="w-full flex justify-between items-center px-6 py-4 border-b border-slate-50 last:border-0 active:bg-slate-50 transition-colors">
                        <span className={`font-semibold text-sm ${item === 'Sair' ? 'text-red-500' : 'text-slate-700'}`}>{item}</span>
                        <svg className="text-slate-300" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                     </button>
                   ))}
                </div>
             </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
