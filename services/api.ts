import axios from 'axios';
import { useUserStore } from '../store/userStore';

// =====================================================================
// BASE URL
// Use 10.0.2.2 no Android Emulator (aponta para o localhost do PC)
// Use localhost no iOS Simulator
// Em dispositivo físico, use o IP local da máquina (ex: 192.168.1.100)
// =====================================================================
export const BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o JWT em todas as requisições autenticadas
api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado — faz logout automático
      useUserStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
