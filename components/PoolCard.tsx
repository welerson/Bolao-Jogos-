
import React from 'react';
import { Pool, PoolStatus } from '../types';
import { LOTTERY_GAMES } from '../constants';

interface PoolCardProps {
  pool: Pool;
  onClick: (pool: Pool) => void;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, onClick }) => {
  const game = LOTTERY_GAMES.find(g => g.id === pool.gameType);
  const progress = ((pool.totalQuotas - pool.availableQuotas) / pool.totalQuotas) * 100;

  const getStatusBadge = (status: PoolStatus) => {
    switch (status) {
      case PoolStatus.OPEN: return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">ABERTO</span>;
      case PoolStatus.CLOSED: return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">FECHADO</span>;
      case PoolStatus.BET_PLACED: return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">APOSTADO</span>;
      case PoolStatus.WINNING: return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full">PREMIADO</span>;
      default: return <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">{status}</span>;
    }
  };

  return (
    <div 
      onClick={() => onClick(pool)}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: game?.color || '#333' }}
          >
            <span className="font-bold text-xs">{game?.name.substring(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 line-clamp-1 leading-tight">{pool.name}</h3>
            <p className="text-xs text-slate-500">{game?.name}</p>
          </div>
        </div>
        {getStatusBadge(pool.status)}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Cota</p>
            <p className="font-bold text-blue-600">R$ {pool.pricePerQuota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Sorteio</p>
            <p className="text-xs font-medium text-slate-700">{new Date(pool.drawDate).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1 text-[10px] font-semibold">
            <span className="text-slate-500">{pool.totalQuotas - pool.availableQuotas}/{pool.totalQuotas} cotas</span>
            <span className="text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
