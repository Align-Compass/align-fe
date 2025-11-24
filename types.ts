export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum TransactionCategory {
  HOUSING = 'Casa Nova',
  LEISURE = 'Lazer',
  WEDDING = 'Casamento',
  TRANSPORT = 'Transporte',
  FOOD = 'Alimentação',
  BILLS = 'Contas Fixas',
  SHOPPING = 'Compras',
  SAVINGS = 'Investimentos',
  UNCATEGORIZED = 'Outros'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  monthlyIncome: number;
  savingsRate: number; // Percentage 0-100
}

export interface Transaction {
  id: string;
  userId: string; // Who made the transaction
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
  institution: 'Nubank' | 'Itaú' | 'Bradesco' | 'Manual';
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon: string; // Emoji
  deadline: string;
}

export interface Task {
  id: string;
  title: string;
  assignedToUserId: string | null; // Null means "Anyone"
  completed: boolean;
  dueDate: string;
}

export interface Reward {
  id: string;
  title: string;
  cost: number; // Cost in "points" or specific savings milestone
  unlocked: boolean;
  icon: string;
}