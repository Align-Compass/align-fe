import React, { useState } from 'react';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentProfileName: string;
  onUpdateProfileName: (name: string) => void;
}

type Tab = 'profile' | 'finance' | 'cards';

const ProfileSettingsModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  users, 
  currentProfileName, 
  onUpdateProfileName 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editName, setEditName] = useState(currentProfileName);
  
  // Mock states for toggle switches
  const [banks, setBanks] = useState([
    { id: 1, name: 'Nubank', connected: true, icon: '🟣' },
    { id: 2, name: 'Itaú', connected: true, icon: '🟠' },
    { id: 3, name: 'Bradesco', connected: false, icon: '🔴' },
  ]);

  const [cards, setCards] = useState([
    { id: 1, name: 'Nubank Platinum', last4: '4242', limit: 12000 },
    { id: 2, name: 'Itaú Personalité Black', last4: '8899', limit: 35000 },
  ]);

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    onUpdateProfileName(editName);
    onClose();
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair do perfil conjunto?")) {
      alert("Simulação: Sessão encerrada com sucesso.");
      onClose();
    }
  };

  const toggleBank = (id: number) => {
    setBanks(banks.map(b => b.id === id ? { ...b, connected: !b.connected } : b));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">Configurações</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Perfil
          </button>
          <button 
            onClick={() => setActiveTab('finance')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'finance' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Open Finance
          </button>
          <button 
            onClick={() => setActiveTab('cards')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'cards' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Cartões
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Tab: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="flex -space-x-4 relative">
                   {users.map(u => (
                      <img key={u.id} className="w-16 h-16 rounded-full border-4 border-white shadow-sm" src={u.avatar} alt={u.name} />
                   ))}
                   <div className="absolute -bottom-2 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Perfil Conjunto</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-default"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Membros</label>
                <div className="space-y-2">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} className="w-8 h-8 rounded-full" alt={u.name} />
                        <div>
                           <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                           <p className="text-xs text-gray-500">Renda: R$ {u.monthlyIncome.toLocaleString()}</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">Ativo</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <button onClick={handleSaveProfile} className="btn-primary w-full">
                  Salvar Alterações
                </button>
                <button onClick={handleLogout} className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                  Fazer Logout
                </button>
              </div>
            </div>
          )}

          {/* Tab: Open Finance */}
          {activeTab === 'finance' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                <p className="text-sm text-blue-800">
                  Conecte suas contas bancárias para sincronização automática de transações e saldos.
                </p>
              </div>

              {banks.map(bank => (
                <div key={bank.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl bg-gray-50 w-10 h-10 flex items-center justify-center rounded-lg">{bank.icon}</span>
                    <span className="font-medium text-gray-700">{bank.name}</span>
                  </div>
                  <button 
                    onClick={() => toggleBank(bank.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${bank.connected ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${bank.connected ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}

              <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Conectar Nova Instituição
              </button>
            </div>
          )}

          {/* Tab: Cards */}
          {activeTab === 'cards' && (
            <div className="space-y-4">
               {cards.map(card => (
                 <div key={card.id} className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl text-white shadow-md relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
                   <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl"></div>
                   
                   <div className="flex justify-between items-start mb-6 relative z-10">
                      <span className="text-xs uppercase tracking-widest opacity-75">{card.name}</span>
                      <svg className="w-8 h-5" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="36" height="24" rx="4" fill="white" fillOpacity="0.2"/><circle cx="10" cy="12" r="6" fill="#EB001B"/><circle cx="26" cy="12" r="6" fill="#F79E1B"/><path d="M18 12C18 14.39 16.89 16.52 15.17 17.86C16.9 19.21 19.1 20 21.5 20C25.64 20 29 16.42 29 12C29 7.58 25.64 4 21.5 4C19.09 4 16.9 4.79 15.17 6.14C16.89 7.48 18 9.61 18 12Z" fill="#FF5F00"/></svg>
                   </div>
                   
                   <div className="mb-4 relative z-10">
                      <p className="font-mono text-lg tracking-widest">•••• •••• •••• {card.last4}</p>
                   </div>

                   <div className="flex justify-between items-end relative z-10">
                      <div>
                        <p className="text-[10px] uppercase opacity-75">Limite Disponível</p>
                        <p className="font-bold">R$ {card.limit.toLocaleString()}</p>
                      </div>
                      <button className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors">Gerenciar</button>
                   </div>
                 </div>
               ))}

               <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Adicionar Cartão
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfileSettingsModal;