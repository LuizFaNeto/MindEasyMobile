import { api } from './api';

// Valores exatos do enum StatusAgendamento.java
export type StatusAgendamento = 'AGENDADO' | 'CANCELADO' | 'REALIZADO' | 'FALTOU';

export interface AgendamentoPayload {
  pacienteId: number;
  terapeutaId: number;
  data: string;
  horaInicio: string;
  status?: StatusAgendamento;
}

export interface AgendamentoResponse {
  id: number;
  nomePaciente: string;
  nomeTerapeuta: string;
  data: string;        // YYYY-MM-DD (serializado pelo Jackson)
  horaInicio: string;  // HH:mm
  status: StatusAgendamento;
  avaliacaoNota?: number;
  avaliacaoComentario?: string;
}

export async function criarAgendamento(payload: AgendamentoPayload): Promise<AgendamentoResponse> {
  const response = await api.post<AgendamentoResponse>('/api/agendamentos', payload);
  return response.data;
}

// GET /api/agendamentos — lista todos (admin)
export async function listarAgendamentos(): Promise<AgendamentoResponse[]> {
  const response = await api.get<AgendamentoResponse[]>('/api/agendamentos');
  return response.data;
}

// GET /api/agendamentos/pacientes/{id} — agendamentos do paciente logado
export async function listarAgendamentosPorPaciente(pacienteId: number): Promise<AgendamentoResponse[]> {
  const response = await api.get<AgendamentoResponse[]>(`/api/agendamentos/pacientes/${pacienteId}`);
  return response.data;
}

// GET /api/agendamentos/terapeutas/{id}
export async function listarAgendamentosPorTerapeuta(terapeutaId: number): Promise<AgendamentoResponse[]> {
  const response = await api.get<AgendamentoResponse[]>(`/api/agendamentos/terapeutas/${terapeutaId}`);
  return response.data;
}

// GET /api/agendamentos/{id}
export async function buscarAgendamentoPorId(id: number): Promise<AgendamentoResponse> {
  const response = await api.get<AgendamentoResponse>(`/api/agendamentos/${id}`);
  return response.data;
}

export async function cancelarAgendamento(id: number): Promise<void> {
  await api.delete(`/api/agendamentos/${id}`);
}
