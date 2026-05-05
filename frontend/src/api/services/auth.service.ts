import api from '../axios';
import type { User } from '../../types';
import { APP_CONFIG } from '../../constants';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/user');
    return response.data;
  },

  getStoredToken(): string | null {
    return localStorage.getItem(APP_CONFIG.TOKEN_KEY);
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem(APP_CONFIG.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setAuthData(token: string, user: User): void {
    localStorage.setItem(APP_CONFIG.TOKEN_KEY, token);
    localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(user));
  },

  clearAuthData(): void {
    localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    localStorage.removeItem(APP_CONFIG.USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },
};
