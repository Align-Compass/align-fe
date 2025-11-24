import React, { useState, useEffect, useCallback } from 'react';
import { USERS, MOCK_TRANSACTIONS, INITIAL_GOALS, INITIAL_TASKS, INITIAL_REWARDS, NEW_BANK_TRANSACTIONS } from './constants';
import { User, Transaction, Goal, Task, Reward, TransactionType } from './types';
import { categorizeTransaction, generateEmpatheticAlert } from './services/geminiService';
import GoalThermometer from './components/GoalThermometer';
import AntiConflictAlert from './components/AntiConflictAlert';
import SharedTasks from './components/SharedTasks';
import RewardSystem from './components/RewardSystem';
import AddTransactionModal from './components/AddTransactionModal';
import ProfileSettingsModal from './components/ProfileSettingsModal';

const App: React.FC = () => {
  // State
  const [users, setUsers] = useState<User[]>(USERS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [rewards] = useState<Reward[]>(INITIAL_REWARDS);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [aiAlert, setAiAlert] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Profile & Settings State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState('Ana & João');

  // Smart Savings Config
  const updateSavingsRate = (userId: string, rate: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, savingsRate: rate } : u));
  };

  // Total Income & Balance Calculation
  const totalIncome = users.reduce((acc, u) => acc + u.monthlyIncome, 0);
  const currentMonthExpenses = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);
  
  const balance = totalIncome - currentMonthExpenses;
  const totalSavings = goals.reduce((acc, g) => acc + g.currentAmount, 0);

  // Open Finance Simulation
  const handleSyncBank = async () => {
    setIsSyncing(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newTransactions: Transaction[] = [];
    
    // Process each mock "new" transaction through Gemini
    for (const raw of NEW_BANK_TRANSACTIONS) {
       const category = await categorizeTransaction(raw.description, raw.amount);
       
       // Logic to assign user randomly for demo
       const user = Math.random() > 0.5 ? users[0] : users[1];

       newTransactions.push({
         id: Math.random().toString(36).substr(2, 9),
         userId: user.id,
         description: raw.description,
         amount: raw.amount,
         date: new Date().toISOString().split('T')[0],
         type: TransactionType.EXPENSE,
         category,
         institution: raw.institution
       });
    }

    setTransactions(prev => [...newTransactions, ...prev]);
    setIsSyncing(false);

    // Trigger Anti-Conflict AI check on the largest new transaction
    const largestTx = newTransactions.sort((a, b) => b.amount - a.amount)[0];
    if (largestTx && largestTx.amount > 200) {
      const message = await generateEmpatheticAlert(
        users.find(u => u.id === largestTx.userId)?.name || 'Alguém',
        largestTx.category,
        largestTx.amount,
        totalIncome * 0.1 // 10% threshold
      );
      setAiAlert(message);
    }
  };

  // Manual Transaction Handler
  const handleManualTransaction = (data: any) => {
    const newTx: Transaction = {
      id: 'manual_' + Date.now(),
      userId: data.userId,
      description: data.description,
      amount: data.amount,
      date: data.date,
      type: data.type,
      category: data.category,
      institution: 'Manual'
    };
    setTransactions(prev => [newTx, ...prev]);
    setIsAddModalOpen(false);
  };

  // Task Handlers
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (title: string, assigneeId: string | null) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      assignedToUserId: assigneeId,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [...prev, newTask]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Header / Joint Profile */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                {/* Align Logo */}
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-md transform transition-transform hover:rotate-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                   <h1 className="text-xl font-extrabold text-gray-900 leading-none tracking-tight">Align</h1>
                   <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">Finanças a Dois</p>
                </div>
             </div>
             
             <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>

             {/* Interactive Profile Section */}
             <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="hidden sm:flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
             >
                <div className="flex -space-x-3 relative">
                    {users.map(u => (
                      <img key={u.id} className="w-9 h-9 rounded-full border-2 border-white ring-1 ring-gray-200 shadow-sm" src={u.avatar} alt={u.name} />
                    ))}
                    <div className="absolute -bottom-0.5 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                </div>
                <div className="text-left">
                   <p className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors leading-tight">{profileName}</p>
                   <p className="text-[10px] text-gray-400 font-medium">Perfil Conjunto</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
             </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-primary bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Adicionar Manual
            </button>

            <button 
              onClick={handleSyncBank}
              disabled={isSyncing}
              className={`btn-primary ${isSyncing ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`}
            >
              {isSyncing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Sincronizando...</span>
                  <span className="sm:hidden">Sync</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  <span className="hidden sm:inline">Sincronizar Bancos</span>
                  <span className="sm:hidden">Sync</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Anti-Conflict Alert Area */}
        {aiAlert && <AntiConflictAlert message={aiAlert} onDismiss={() => setAiAlert(null)} />}

        {/* Mobile Add Button (Visible only on small screens) */}
        <div className="sm:hidden mb-6 flex gap-3">
           {/* Mobile Profile Access */}
           <button 
             onClick={() => setIsProfileModalOpen(true)}
             className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 bg-white border border-gray-200 shadow-sm"
           >
             <div className="flex -space-x-2">
                {users.map(u => (
                  <img key={u.id} className="w-5 h-5 rounded-full border border-white" src={u.avatar} alt={u.name} />
                ))}
             </div>
             Perfil
           </button>
           
           <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-primary bg-blue-50 border border-blue-100 active:bg-blue-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Add Transação
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Finances */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-5 text-white shadow-lg transform hover:scale-[1.02] transition-transform">
                <p className="text-blue-100 text-sm font-medium">Saldo Atual</p>
                <h2 className="text-3xl font-bold mt-1">R$ {balance.toLocaleString('pt-BR')}</h2>
                <div className="mt-4 flex items-center text-xs text-blue-100 bg-white bg-opacity-20 w-fit px-2 py-1 rounded">
                  <span>Receita: R$ {totalIncome.toLocaleString('pt-BR')}</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                 <p className="text-gray-500 text-sm font-medium">Gastos do Mês</p>
                 <h2 className="text-3xl font-bold mt-1 text-gray-800">R$ {currentMonthExpenses.toLocaleString('pt-BR')}</h2>
                 <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-red-500" style={{ width: `${Math.min((currentMonthExpenses/totalIncome)*100, 100)}%` }}></div>
                 </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                 <p className="text-gray-500 text-sm font-medium">Economia Total</p>
                 <h2 className="text-3xl font-bold mt-1 text-secondary">R$ {totalSavings.toLocaleString('pt-BR')}</h2>
                 <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                   <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                   Em crescimento
                 </p>
              </div>
            </div>

            {/* Goals Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-gray-800">Termômetro de Metas</h3>
                 <button className="text-sm text-primary font-medium hover:underline">+ Nova Meta</button>
              </div>
              <div className="space-y-3">
                {goals.map(goal => (
                  <GoalThermometer key={goal.id} goal={goal} />
                ))}
              </div>
            </section>

            {/* Transactions List */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Extrato Unificado</h3>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{transactions.length} lançamentos</span>
              </div>
              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto custom-scrollbar">
                {transactions.map(tx => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${tx.type === TransactionType.INCOME ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                         {tx.category === 'Transporte' ? '🚗' : 
                          tx.category === 'Alimentação' ? '🍔' :
                          tx.category === 'Casamento' ? '💍' :
                          tx.category === 'Casa Nova' ? '🏠' : 
                          tx.category === 'Lazer' ? '🎉' :
                          tx.category === 'Contas Fixas' ? '💡' :
                          tx.category === 'Compras' ? '🛍️' :
                          tx.type === TransactionType.INCOME ? '💰' : '💸'}
                       </div>
                       <div>
                         <p className="font-semibold text-gray-800">{tx.description}</p>
                         <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">{tx.category}</span>
                            <span>• {new Date(tx.date).toLocaleDateString('pt-BR')}</span>
                            <span>• {tx.institution}</span>
                         </div>
                       </div>
                     </div>
                     <div className="text-right">
                        <p className={`font-bold ${tx.type === TransactionType.INCOME ? 'text-green-600' : 'text-gray-800'}`}>
                          {tx.type === TransactionType.INCOME ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1" title={`Responsável: ${users.find(u => u.id === tx.userId)?.name}`}>
                          <img 
                            src={users.find(u => u.id === tx.userId)?.avatar} 
                            alt="user" 
                            className="w-4 h-4 rounded-full border border-gray-200" 
                          />
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Social & Tools */}
          <div className="space-y-8">
            
            {/* Smart Savings Mode */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="font-bold text-gray-800">Poupança Inteligente</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">Percentual do salário destinado automaticamente para as metas.</p>
              
              <div className="space-y-4">
                {users.map(user => (
                  <div key={user.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{user.name}</span>
                      <span className="text-secondary font-bold">{user.savingsRate}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      value={user.savingsRate}
                      onChange={(e) => updateSavingsRate(user.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Reward System */}
            <RewardSystem rewards={rewards} totalSavings={totalSavings} />

            {/* Shared Tasks */}
            <div className="h-96">
              <SharedTasks 
                tasks={tasks} 
                users={users} 
                onToggleTask={toggleTask} 
                onAddTask={addTask} 
              />
            </div>

          </div>
        </div>
      </main>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleManualTransaction}
        users={users}
      />

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        users={users}
        currentProfileName={profileName}
        onUpdateProfileName={setProfileName}
      />
    </div>
  );
};

export default App;