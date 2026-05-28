import { api } from './api';

export type StatusAgendamento = 'AGENDADO' | 'CONFIRMADO' | 'CONCLUIDO' | 'REALIZADO' | 'CANCELADO' | 'PENDENTE';

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
  data: string;
  horaInicio: string;
  status: StatusAgendamento;
  avaliacaoNota?: number;
  avaliacaoComentario?: string;
}

export async function criarAgendamento(payload: AgendamentoPayload): Promise<AgendamentoResponse> {
  const response = await api.post<AgendamentoResponse>('/api/agendamentos', payload);
  return response.data;
}

export async function listarAgendamentos(): Promise<AgendamentoResponse[]> {
  const response = await api.get<AgendamentoResponse[]>('/api/agendamentos');
  return response.data;
}

export async function listarAgendamentosPorPaciente(pacienteId: number): Promise<AgendamentoResponse[]> {
  const response = await api.get<AgendamentoResponse[]>(`/api/agendamentos/pacientes/${pacienteId}`);
  return response.data;
}

export async function buscarAgendamentoPorId(id: number): Promise<AgendamentoResponse> {
  const response = await api.get<AgendamentoResponse>(`/api/agendamentos/${id}`);
  return response.data;
}

export async function cancelarAgendamento(id: number): Promise<void> {
  await api.delete(`/api/agendamentos/${id}`);
}
