
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: UserRole;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, userRole }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          <h1 className="font-bold text-lg text-slate-800 tracking-tight">Bolão Premiado</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <img 
            src="https://picsum.photos/seed/user123/100/100" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-slate-200 object-cover"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-slate-200 px-6 py-2 flex justify-between items-center z-50">
        <button 
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-[10px] font-medium uppercase tracking-wider">Início</span>
        </button>

        <button 
          onClick={() => onTabChange('my-pools')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'my-pools' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span className="text-[10px] font-medium uppercase tracking-wider">Meus Bolões</span>
        </button>

        {userRole === UserRole.ORGANIZER && (
          <button 
            onClick={() => onTabChange('create')}
            className="flex flex-col items-center -mt-8"
          >
            <div className="w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-200 flex items-center justify-center text-white transition-transform active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <span className="text-[10px] mt-2 font-medium uppercase tracking-wider text-blue-600">Criar</span>
          </button>
        )}

        <button 
          onClick={() => onTabChange('wallet')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'wallet' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          <span className="text-[10px] font-medium uppercase tracking-wider">Carteira</span>
        </button>

        <button 
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-[10px] font-medium uppercase tracking-wider">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
