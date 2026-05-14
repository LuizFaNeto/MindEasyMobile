import { api } from './api';

export type StatusAgendamento = 'AGENDADO' | 'CONFIRMADO' | 'CONCLUIDO' | 'REALIZADO' | 'CANCELADO' | 'PENDENTE';

export interface AgendamentoPayload {
  pacienteId: number;
  terapeutaId: number;
  data: string;        // YYYY-MM-DD
  horaInicio: string;  // HH:mm:ss
  status?: StatusAgendamento;
}

// Campos retornados pela API (AgendamentoResponseDTO.java)
export interface AgendamentoResponse {
  id: number;
  nomePaciente: string;
  nomeTerapeuta: string;
  data: string;        // YYYY-MM-DD (serializado pelo Jackson)
  horaInicio: string;  // HH:mm:ss
  status: StatusAgendamento;
  avaliacaoNota?: number;
  avaliacaoComentario?: string;
}

// POST /api/agendamentos
export async function criarAgendamento(payload: AgendamentoPayload): Promise<AgendamentoResponse> {
  const response = await api.post<AgendamentoResponse>('/api/agendamentos', payload);
  return response.data;
}

// GET /api/agendamentos
export async function listarAgendamentos(): Promise<AgendamentoResponse[]> {
  const response = await api.get<AgendamentoResponse[]>('/api/agendamentos');
  return response.data;
}

// GET /api/agendamentos/{id}
export async function buscarAgendamentoPorId(id: number): Promise<AgendamentoResponse> {
  const response = await api.get<AgendamentoResponse>(`/api/agendamentos/${id}`);
  return response.data;
}

// DELETE /api/agendamentos/{id}
export async function cancelarAgendamento(id: number): Promise<void> {
  await api.delete(`/api/agendamentos/${id}`);
}
