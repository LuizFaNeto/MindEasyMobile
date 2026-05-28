package com.br.mindeasy.service;

import com.br.mindeasy.dto.response.NotificacaoResponseDTO;
import com.br.mindeasy.enums.TipoNotificacao;
import com.br.mindeasy.model.Notificacao;
import com.br.mindeasy.model.Paciente;
import com.br.mindeasy.repository.NotificacaoRepository;
import com.br.mindeasy.repository.PacienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final PacienteRepository pacienteRepository;

    public NotificacaoService(NotificacaoRepository notificacaoRepository, PacienteRepository pacienteRepository) {
        this.notificacaoRepository = notificacaoRepository;
        this.pacienteRepository = pacienteRepository;
    }

    private NotificacaoResponseDTO toResponseDTO(Notificacao notificacao) {
        return new NotificacaoResponseDTO(
            notificacao.getId(),
            notificacao.getPaciente().getId(),
            notificacao.getTipo(),
            notificacao.getTitulo(),
            notificacao.getDescricao(),
            notificacao.isLida(),
            notificacao.getCriadaEm()
        );
    }

    public NotificacaoResponseDTO criar(Long pacienteId, TipoNotificacao tipo, String titulo, String descricao) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente não encontrado"));

        Notificacao notificacao = new Notificacao();
        notificacao.setPaciente(paciente);
        notificacao.setTipo(tipo);
        notificacao.setTitulo(titulo);
        notificacao.setDescricao(descricao);
        notificacao.setLida(false);

        notificacaoRepository.save(notificacao);
        return toResponseDTO(notificacao);
    }

    public List<NotificacaoResponseDTO> listarPorPaciente(Long pacienteId) {
        return notificacaoRepository.findByPacienteIdOrderByCriadaEmDesc(pacienteId)
            .stream()
            .map(this::toResponseDTO)
            .collect(Collectors.toList());
    }

    public long contarNaoLidas(Long pacienteId) {
        return notificacaoRepository.countByPacienteIdAndLidaFalse(pacienteId);
    }

    public NotificacaoResponseDTO marcarComoLida(Long id) {
        Notificacao notificacao = notificacaoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notificação não encontrada"));

        notificacao.setLida(true);
        notificacaoRepository.save(notificacao);

        return toResponseDTO(notificacao);
    }

    public void marcarTodasComoLidas(Long pacienteId) {
        List<Notificacao> notificacoes = notificacaoRepository.findByPacienteIdOrderByCriadaEmDesc(pacienteId);
        notificacoes.forEach(n -> n.setLida(true));
        notificacaoRepository.saveAll(notificacoes);
    }
}
