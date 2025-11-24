import React, { useState } from 'react';
import { User, TransactionType, TransactionCategory } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    description: string;
    amount: number;
    date: string;
    type: TransactionType;
    category: string;
    userId: string;
  }) => void;
  users: User[];
}

const AddTransactionModal: React.FC<Props> = ({ isOpen, onClose, onSave, users }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<string>(TransactionCategory.UNCATEGORIZED);
  const [userId, setUserId] = useState<string>(users[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      description,
      amount: Number(amount),
      date,
      type,
      category,
      userId
    });
    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setType(TransactionType.EXPENSE);
    setCategory(TransactionCategory.UNCATEGORIZED);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">Adicionar Transação Manual</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input 
              required 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="input-default" 
              placeholder="Ex: Jantar fora, Uber, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input 
                required 
                type="number" 
                step="0.01"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="input-default" 
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input 
                required 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="input-default" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button 
                  type="button"
                  onClick={() => setType(TransactionType.EXPENSE)}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${type === TransactionType.EXPENSE ? 'bg-red-100 text-red-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Despesa
                </button>
                <button 
                  type="button"
                  onClick={() => setType(TransactionType.INCOME)}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${type === TransactionType.INCOME ? 'bg-green-100 text-green-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Receita
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
              <select 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)}
                className="input-default"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="input-default"
            >
              {Object.values(TransactionCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 btn-primary hover:shadow-lg"
            >
              Salvar Transação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;