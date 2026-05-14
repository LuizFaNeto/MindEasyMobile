import { api } from './api';

export interface TerapeutaResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  sexo: string;
  crm: string;
  especialidade: string;
}

// GET /api/terapeutas — lista todos os terapeutas
export async function listarTerapeutas(): Promise<TerapeutaResponse[]> {
  const response = await api.get<TerapeutaResponse[]>('/api/terapeutas');
  return response.data;
}

// GET /api/terapeutas/{id} — busca terapeuta por ID
export async function buscarTerapeutaPorId(id: number): Promise<TerapeutaResponse> {
  const response = await api.get<TerapeutaResponse>(`/api/terapeutas/${id}`);
  return response.data;
}
