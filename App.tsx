import React, { useState } from 'react';
import { User, UserRole, Pool, PoolStatus } from './types';
import Layout from './components/Layout';
import PoolCard from './components/PoolCard';
import { LOTTERY_GAMES, APP_MESSAGES } from './constants';
import './firebase';

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
            
            <div className="bg-slate-100 rounded-3xl p-6 text-slate-800 space-y-2 border border-slate-200">
              <h3 className="font-bold text-sm">Informações do Sorteio</h3>
              <p className="text-xs text-slate-500">
                Os sorteios ocorrem de acordo com o cronograma oficial da Caixa Econômica Federal. 
                Os resultados e comprovantes serão publicados pelo organizador após o fechamento.
              </p>
            </div>

            <button 
              onClick={() => setShowPaymentModal(true)}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              Comprar Cota R$ {selectedPool.pricePerQuota.toFixed(2)}
            </button>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'home' && renderHome()}
          {activeTab === 'create' && (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-2xl font-bold text-slate-800">Criar Bolão</h2>
              <form onSubmit={handleCreatePool} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Informações Básicas</label>
                  <input required placeholder="Nome do Bolão" className="w-full p-4 border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500/20" onChange={e => setNewPool({...newPool, name: e.target.value})} />
                  <textarea placeholder="Descrição curta para os participantes" className="w-full p-4 border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500/20 h-24" onChange={e => setNewPool({...newPool, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">TOTAL DE COTAS</label>
                    <input type="number" placeholder="Ex: 50" className="w-full p-4 border rounded-xl shadow-sm" onChange={e => setNewPool({...newPool, totalQuotas: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400">VALOR POR COTA (R$)</label>
                    <input type="number" placeholder="Ex: 25" className="w-full p-4 border rounded-xl shadow-sm" onChange={e => setNewPool({...newPool, pricePerQuota: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg mt-4 transition-all active:scale-95">Lançar Bolão</button>
              </form>
            </div>
          )}
          {activeTab === 'wallet' && <div className="p-20 text-center text-slate-400 font-medium">Carteira disponível em breve.</div>}
          {activeTab === 'my-pools' && <div className="p-20 text-center text-slate-400 font-medium">Seus bolões aparecerão aqui após a compra.</div>}
          {activeTab === 'profile' && <div className="p-20 text-center text-slate-400 font-medium">Configurações de perfil e segurança.</div>}
        </>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white p-8 rounded-[40px] w-full max-w-sm text-center space-y-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Pagamento PIX</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="bg-slate-50 aspect-square w-full rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BOLAO_PIX_PAYMENT_MOCK" className="w-48 h-48 opacity-90" alt="QR" />
              <button className="text-xs font-bold text-blue-600 hover:underline">Copiar código PIX</button>
            </div>
            <button className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95" onClick={() => setShowPaymentModal(false)}>Confirmar Pagamento</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;