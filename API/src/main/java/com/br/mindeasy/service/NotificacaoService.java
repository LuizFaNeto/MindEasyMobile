package com.br.mindeasy.service;

import com.br.mindeasy.dto.response.NotificacaoResponseDTO;
import com.br.mindeasy.model.Agendamento;
import com.br.mindeasy.model.Notificacao;
import com.br.mindeasy.model.Paciente;
import com.br.mindeasy.repository.NotificacaoRepository;
import com.br.mindeasy.repository.PacienteRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final PacienteRepository pacienteRepository;

    public NotificacaoService(
        NotificacaoRepository notificacaoRepository,
        PacienteRepository pacienteRepository
    ) {
        this.notificacaoRepository = notificacaoRepository;
        this.pacienteRepository = pacienteRepository;
    }

    public NotificacaoResponseDTO criarNotificacaoAgendamento(Agendamento agendamento) {
        DateTimeFormatter dataFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter horaFormatter = DateTimeFormatter.ofPattern("HH:mm");

        String nomeTerapeuta = agendamento.getTerapeuta().getNome();
        String data = agendamento.getData().format(dataFormatter);
        String hora = agendamento.getHoraInicio().format(horaFormatter);

        Notificacao notificacao = new Notificacao();
        notificacao.setPaciente(agendamento.getPaciente());
        notificacao.setAgendamento(agendamento);
        notificacao.setTipo("AGENDAMENTO");
        notificacao.setTitulo("Agendamento confirmado");
        notificacao.setMensagem("Sua consulta com " + nomeTerapeuta + " foi marcada para " + data + " às " + hora + ".");
        notificacao.setLida(false);

        Notificacao salva = notificacaoRepository.save(notificacao);
        return toResponseDTO(salva);
    }

    public List<NotificacaoResponseDTO> listarPorPaciente(Long pacienteId) {
        if (!pacienteRepository.existsById(pacienteId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente não encontrado");
        }

        return notificacaoRepository.findByPacienteIdOrderByCriadaEmDesc(pacienteId).stream()
            .map(this::toResponseDTO)
            .collect(Collectors.toList());
    }

    public long contarNaoLidas(Long pacienteId) {
        if (!pacienteRepository.existsById(pacienteId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente não encontrado");
        }

        return notificacaoRepository.countByPacienteIdAndLidaFalse(pacienteId);
    }

    public NotificacaoResponseDTO marcarComoLida(Long id) {
        Notificacao notificacao = notificacaoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notificação não encontrada"));

        notificacao.setLida(true);
        Notificacao salva = notificacaoRepository.save(notificacao);
        return toResponseDTO(salva);
    }

    public void marcarTodasComoLidas(Long pacienteId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente não encontrado"));

        List<Notificacao> notificacoes = notificacaoRepository.findByPacienteIdOrderByCriadaEmDesc(paciente.getId());
        notificacoes.forEach(notificacao -> notificacao.setLida(true));
        notificacaoRepository.saveAll(notificacoes);
    }

    private NotificacaoResponseDTO toResponseDTO(Notificacao notificacao) {
        Long agendamentoId = notificacao.getAgendamento() != null ? notificacao.getAgendamento().getId() : null;

        return new NotificacaoResponseDTO(
            notificacao.getId(),
            notificacao.getPaciente().getId(),
            agendamentoId,
            notificacao.getTitulo(),
            notificacao.getMensagem(),
            notificacao.getTipo(),
            notificacao.getLida(),
            notificacao.getCriadaEm()
        );
    }
}
