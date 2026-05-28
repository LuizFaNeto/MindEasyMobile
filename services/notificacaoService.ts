import { api } from './api';

export type NotificationType = 'APPOINTMENT' | 'MESSAGE' | 'ALERT' | 'SUCCESS';

export interface NotificacaoDTO {
  id: number;
  pacienteId: number;
  tipo: NotificationType;
  titulo: string;
  descricao: string;
  lida: boolean;
  criadaEm: string;
}

export const notificacaoService = {
  async listarPorPaciente(pacienteId: number): Promise<NotificacaoDTO[]> {
    const { data } = await api.get<NotificacaoDTO[]>(`/api/notificacoes/pacientes/${pacienteId}`);
    return data;
  },

  async contarNaoLidas(pacienteId: number): Promise<number> {
    const { data } = await api.get<{ total: number }>(`/api/notificacoes/pacientes/${pacienteId}/nao-lidas`);
    return data.total;
  },

  async marcarComoLida(id: number): Promise<NotificacaoDTO> {
    const { data } = await api.patch<NotificacaoDTO>(`/api/notificacoes/${id}/lida`);
    return data;
  },

  async marcarTodasComoLidas(pacienteId: number): Promise<void> {
    await api.patch(`/api/notificacoes/pacientes/${pacienteId}/lidas`);
  },
};
