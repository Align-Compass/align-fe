import { User, Goal, Task, Reward, Transaction, TransactionType, TransactionCategory } from './types';

export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Ana',
    avatar: 'https://picsum.photos/seed/ana/200/200',
    monthlyIncome: 5500,
    savingsRate: 10,
  },
  {
    id: 'u2',
    name: 'João',
    avatar: 'https://picsum.photos/seed/joao/200/200',
    monthlyIncome: 6200,
    savingsRate: 10,
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g1',
    title: 'Lua de Mel (Maldivas)',
    targetAmount: 25000,
    currentAmount: 17500,
    icon: '🏖️',
    deadline: '2024-12-01'
  },
  {
    id: 'g2',
    title: 'Entrada Apartamento',
    targetAmount: 100000,
    currentAmount: 42000,
    icon: '🔑',
    deadline: '2025-06-01'
  },
  {
    id: 'g3',
    title: 'Reserva de Emergência',
    targetAmount: 30000,
    currentAmount: 28500,
    icon: '🛡️',
    deadline: '2024-08-01'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Pagar o DJ do casamento',
    assignedToUserId: 'u2',
    completed: false,
    dueDate: '2024-05-20'
  },
  {
    id: 't2',
    title: 'Comprar passagens aéreas',
    assignedToUserId: 'u1',
    completed: true,
    dueDate: '2024-05-10'
  },
  {
    id: 't3',
    title: 'Agendar visita no cartório',
    assignedToUserId: null,
    completed: false,
    dueDate: '2024-06-01'
  }
];

export const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', title: 'Noite de Pizza', cost: 1000, unlocked: true, icon: '🍕' },
  { id: 'r2', title: 'Cinema Premium', cost: 2000, unlocked: false, icon: '🎬' },
  { id: 'r3', title: 'Jantar Romântico', cost: 5000, unlocked: false, icon: '🍷' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tr1', userId: 'u1', description: 'Uber para o trabalho', amount: 24.90, date: '2024-05-15', type: TransactionType.EXPENSE, category: TransactionCategory.TRANSPORT, institution: 'Nubank' },
  { id: 'tr2', userId: 'u2', description: 'Supermercado Semanal', amount: 450.00, date: '2024-05-14', type: TransactionType.EXPENSE, category: TransactionCategory.FOOD, institution: 'Itaú' },
  { id: 'tr3', userId: 'u1', description: 'Zara - Vestido Madrinha', amount: 399.90, date: '2024-05-12', type: TransactionType.EXPENSE, category: TransactionCategory.WEDDING, institution: 'Nubank' },
  { id: 'tr4', userId: 'u2', description: 'Salário Mensal', amount: 6200.00, date: '2024-05-05', type: TransactionType.INCOME, category: TransactionCategory.UNCATEGORIZED, institution: 'Itaú' },
  { id: 'tr5', userId: 'u1', description: 'Salário Mensal', amount: 5500.00, date: '2024-05-05', type: TransactionType.INCOME, category: TransactionCategory.UNCATEGORIZED, institution: 'Nubank' },
];

// Mock raw bank data for "Open Finance" simulation
export const NEW_BANK_TRANSACTIONS = [
  { description: 'Netflix Mensal', amount: 55.90, institution: 'Nubank' as const },
  { description: 'Outback Jantar', amount: 280.00, institution: 'Itaú' as const },
  { description: 'Leroy Merlin - Tintas', amount: 450.50, institution: 'Itaú' as const },
  { description: 'Posto Ipiranga', amount: 150.00, institution: 'Nubank' as const },
];