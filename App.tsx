
import React, { useState } from 'react';
import { User, UserRole, Pool, PoolStatus } from './types.ts';
import Layout from './components/Layout.tsx';
import PoolCard from './components/PoolCard.tsx';
import { LOTTERY_GAMES, APP_MESSAGES } from './constants.tsx';
import { geminiService } from './services/geminiService.ts';

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
    <div className="p-4 space-y-6">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Buscar bolão..." 
            className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
          />
          <svg className="absolute left-3 top-3.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Loterias Oficiais</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {LOTTERY_GAMES.map(game => (
            <div key={game.id} className="flex-shrink-0 flex flex-col items-center gap-2">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-md"
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
        <div className="grid gap-4">
          {pools.filter(p => p.isPublic).map(pool => (
            <PoolCard key={pool.id} pool={pool} onClick={handlePoolClick} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userRole={MOCK_USER.role}>
      {selectedPool ? (
        <div className="bg-white min-h-screen">
          <button onClick={() => setSelectedPool(null)} className="p-4 text-blue-600 font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Voltar
          </button>
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">{selectedPool.name}</h2>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm text-slate-600">
              {selectedPool.description}
            </div>
            
            <div className="bg-indigo-600 rounded-3xl p-6 text-white space-y-4">
              <h3 className="font-bold text-sm">Palpite da IA (Gemini)</h3>
              <button 
                onClick={handleGenerateLucky}
                disabled={isGenerating}
                className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl text-xs disabled:opacity-50"
              >
                {isGenerating ? 'Gerando...' : 'Sugerir Números da Sorte'}
              </button>
            </div>

            <button 
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg"
            >
              Comprar Cota R$ {selectedPool.pricePerQuota.toFixed(2)}
            </button>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'home' && renderHome()}
          {activeTab === 'create' && (
            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Criar Bolão</h2>
              <form onSubmit={handleCreatePool} className="space-y-4">
                <input required placeholder="Nome do Bolão" className="w-full p-4 border rounded-xl" onChange={e => setNewPool({...newPool, name: e.target.value})} />
                <textarea placeholder="Descrição" className="w-full p-4 border rounded-xl" onChange={e => setNewPool({...newPool, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Cotas" className="w-full p-4 border rounded-xl" onChange={e => setNewPool({...newPool, totalQuotas: parseInt(e.target.value)})} />
                  <input type="number" placeholder="Preço" className="w-full p-4 border rounded-xl" onChange={e => setNewPool({...newPool, pricePerQuota: parseFloat(e.target.value)})} />
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Lançar Bolão</button>
              </form>
            </div>
          )}
          {activeTab === 'wallet' && <div className="p-20 text-center text-slate-400 font-medium">Carteira disponível em breve.</div>}
          {activeTab === 'my-pools' && <div className="p-20 text-center text-slate-400 font-medium">Seus bolões aparecerão aqui.</div>}
          {activeTab === 'profile' && <div className="p-20 text-center text-slate-400 font-medium">Configurações de perfil.</div>}
        </>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white p-8 rounded-[40px] w-full max-w-sm text-center space-y-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-800">Pagamento PIX</h3>
            <div className="bg-slate-50 aspect-square w-full rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BOLAO_MOCK" className="w-48 h-48 opacity-80" alt="QR" />
            </div>
            <p className="text-xs text-slate-400">Escaneie o QR Code para pagar a cota via PIX.</p>
            <button className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl" onClick={() => setShowPaymentModal(false)}>Confirmar Pagamento</button>
          </div>
        </div>
      )}

      {isLuckyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-[40px] w-full max-w-sm text-center">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Números Sugeridos</h3>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {luckyNumbers.map((n, i) => (
                <span key={i} className="w-12 h-12 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-full font-bold text-lg border border-indigo-100 shadow-sm">{n}</span>
              ))}
            </div>
            <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl" onClick={() => setIsLuckyModalOpen(false)}>Fechar</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
