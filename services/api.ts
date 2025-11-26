import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach auth token from localStorage if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore (localStorage may be unavailable during SSR)
  }
  return config;
});

// Types
export type RegisterPayload = { name?: string; email: string; password: string };
export type LoginPayload = { email: string; password: string };
export type AuthResponse = { accessToken: string; refreshToken?: string; user?: any };

export type TaskPayload = { title: string; description?: string; assigneeId?: string };
export type RewardPayload = { title: string; cost: number; description?: string };
export type ConsentPayload = { userId: string; consentGiven: boolean; metadata?: any };

// Auth
export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const { data } = await api.post('/api/auth/refresh-token', { refreshToken });
  return data;
};

// Finance
export const addGoalProgress = async (goalId: string, progress: number) => {
  const { data } = await api.patch(`/api/finance/goals/${encodeURIComponent(goalId)}`, { progress });
  return data;
};

// Collaboration - Tasks
export const createTask = async (payload: TaskPayload) => {
  const { data } = await api.post('/api/collab/tasks', payload);
  return data;
};

export const getTasks = async () => {
  const { data } = await api.get('/api/collab/tasks');
  return data as any[];
};

// Collaboration - Rewards
export const createReward = async (payload: RewardPayload) => {
  const { data } = await api.post('/api/collab/rewards', payload);
  return data;
};

export const getRewards = async () => {
  const { data } = await api.get('/api/collab/rewards');
  return data as any[];
};

// Consent / LGPD
export const postConsent = async (payload: ConsentPayload) => {
  const { data } = await api.post('/api/consent', payload);
  return data;
};

export default api;
