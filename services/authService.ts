import { api } from './api';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  nome: string;
  email: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  sexo: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  dataNascimento: string; // YYYY-MM-DD
}

export interface PacienteResponse {
  id: number;
  nome: string;
  email: string;
}

// POST /api/auth/login — retorna JWT + dados do paciente
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/auth/login', payload);
  return response.data;
}

// POST /api/pacientes — cadastra novo paciente
export async function register(payload: RegisterPayload): Promise<PacienteResponse> {
  const response = await api.post<PacienteResponse>('/api/pacientes', payload);
  return response.data;
}
