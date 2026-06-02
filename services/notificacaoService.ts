import { api } from './api';

export interface NotificacaoResponse {
  id: number;
  pacienteId: number;
  mensagem: string;
  lida: boolean;
  dataCriacao: string;
}

class NotificacaoService {
  async listarPorPaciente(pacienteId: number): Promise<NotificacaoResponse[]> {
    const response = await api.get<NotificacaoResponse[]>(
      `/api/notificacoes/pacientes/${pacienteId}`
    );

    return response.data;
  }

  async listarTodas(): Promise<NotificacaoResponse[]> {
    const response = await api.get<NotificacaoResponse[]>('/api/notificacoes');

    return response.data;
  }

  async buscarPorId(id: number): Promise<NotificacaoResponse> {
    const response = await api.get<NotificacaoResponse>(
      `/api/notificacoes/${id}`
    );

    return response.data;
  }

  async marcarComoLida(id: number): Promise<void> {
    await api.put(`/api/notificacoes/${id}/lida`);
  }

  async contarNaoLidas(pacienteId: number): Promise<number> {
    const notificacoes = await this.listarPorPaciente(pacienteId);

    return notificacoes.filter((n) => !n.lida).length;
  }
}

export const notificacaoService = new NotificacaoService();
export default notificacaoService;