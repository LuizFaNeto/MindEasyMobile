package com.br.mindeasy.service;

import com.br.mindeasy.dto.request.AgendamentoRequestDTO;
import com.br.mindeasy.dto.response.AgendamentoResponseDTO;
import com.br.mindeasy.enums.StatusAgendamento;
import com.br.mindeasy.model.Agendamento;
import com.br.mindeasy.model.Paciente;
import com.br.mindeasy.model.Terapeuta;
import com.br.mindeasy.repository.AgendamentoRepository;
import com.br.mindeasy.repository.PacienteRepository;
import com.br.mindeasy.repository.TerapeutaRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final PacienteRepository pacienteRepository;
    private final TerapeutaRepository terapeutaRepository;

    public AgendamentoService(
        AgendamentoRepository agendamentoRepository,
        PacienteRepository pacienteRepository,
        TerapeutaRepository terapeutaRepository
    ) {
        this.agendamentoRepository = agendamentoRepository;
        this.pacienteRepository = pacienteRepository;
        this.terapeutaRepository = terapeutaRepository;
    }

    private AgendamentoResponseDTO toResponseDTO(Agendamento agendamento, Paciente paciente, Terapeuta terapeuta) {
        return new AgendamentoResponseDTO(
            agendamento.getId(),
            paciente.getNome(),
            terapeuta.getNome(),
            agendamento.getData(),
            agendamento.getHoraInicio(),
            agendamento.getStatus(),
            agendamento.getAvaliacaoNota(),
            agendamento.getAvaliacaoComentario()
        );
    }

    public AgendamentoResponseDTO agendar(AgendamentoRequestDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente não encontrado"));

        Terapeuta terapeuta = terapeutaRepository.findById(dto.getTerapeutaId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Terapeuta não encontrado"));

        boolean conflito = agendamentoRepository.existsByTerapeutaIdAndDataAndHoraInicio(
            terapeuta.getId(), dto.getData(), dto.getHoraInicio()
        );

        if (conflito) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Horário já está ocupado para esse terapeuta");
        }

        long agendamentosNoDia = agendamentoRepository.countByPacienteIdAndData(
            paciente.getId(), dto.getData()
        );

        if (agendamentosNoDia >= 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Paciente já possui 2 agendamentos nesse dia");
        }

        Agendamento agendamento = new Agendamento();
        agendamento.setPaciente(paciente);
        agendamento.setTerapeuta(terapeuta);
        agendamento.setData(dto.getData());
        agendamento.setHoraInicio(dto.getHoraInicio());
        agendamento.setStatus(StatusAgendamento.AGENDADO);

        agendamentoRepository.save(agendamento);

        return toResponseDTO(agendamento, paciente, terapeuta);
    }

    public AgendamentoResponseDTO buscarPorId(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));

        return toResponseDTO(agendamento, agendamento.getPaciente(), agendamento.getTerapeuta());
    }

    public List<AgendamentoResponseDTO> listarTodos() {
        return agendamentoRepository.findAll().stream()
            .map(a -> toResponseDTO(a, a.getPaciente(), a.getTerapeuta()))
            .collect(Collectors.toList());
    }

    public List<AgendamentoResponseDTO> listarPorTerapeuta(Long idTerapeuta) {
        return agendamentoRepository.findByTerapeutaId(idTerapeuta).stream()
            .map(a -> toResponseDTO(a, a.getPaciente(), a.getTerapeuta()))
            .collect(Collectors.toList());
    }

    public AgendamentoResponseDTO atualizar(Long id, AgendamentoRequestDTO dto) {
        Agendamento agendamento = agendamentoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente não encontrado"));

        Terapeuta terapeuta = terapeutaRepository.findById(dto.getTerapeutaId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Terapeuta não encontrado"));

        agendamento.setPaciente(paciente);
        agendamento.setTerapeuta(terapeuta);
        agendamento.setData(dto.getData());
        agendamento.setHoraInicio(dto.getHoraInicio());
        if (dto.getStatus() != null) {
            agendamento.setStatus(dto.getStatus());
        }

        agendamentoRepository.save(agendamento);

        return toResponseDTO(agendamento, paciente, terapeuta);
    }

    public AgendamentoResponseDTO atualizarParcial(Long id, AgendamentoRequestDTO dto) {
        Agendamento agendamento = agendamentoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));

        if (dto.getData() != null) agendamento.setData(dto.getData());
        if (dto.getHoraInicio() != null) agendamento.setHoraInicio(dto.getHoraInicio());
        if (dto.getPacienteId() != null) {
            Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente não encontrado"));
            agendamento.setPaciente(paciente);
        }
        if (dto.getTerapeutaId() != null) {
            Terapeuta terapeuta = terapeutaRepository.findById(dto.getTerapeutaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Terapeuta não encontrado"));
            agendamento.setTerapeuta(terapeuta);
        }
        if (dto.getStatus() != null) {
            agendamento.setStatus(dto.getStatus());
        }

        agendamentoRepository.save(agendamento);

        return toResponseDTO(agendamento, agendamento.getPaciente(), agendamento.getTerapeuta());
    }

    public void deletar(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));

        agendamentoRepository.delete(agendamento);
    }

    public long contarAtendimentosConcluidosPorMes(Long terapeutaId, int mes, int ano) {
        if (terapeutaId == null) {
            throw new IllegalArgumentException("terapeutaId é obrigatório");
        }

        if (mes < 1 || mes > 12) {
            throw new IllegalArgumentException("mes deve estar entre 1 e 12");
        }

        int anoMinimo = 2000;
        int anoMaximo = Year.now().getValue() + 1;
        if (ano < anoMinimo || ano > anoMaximo) {
            throw new IllegalArgumentException("ano deve estar entre " + anoMinimo + " e " + anoMaximo);
        }

        if (!terapeutaRepository.existsById(terapeutaId)) {
            throw new EntityNotFoundException("Terapeuta não encontrado");
        }

        LocalDate inicio = LocalDate.of(ano, mes, 1);
        LocalDate fim = inicio.withDayOfMonth(inicio.lengthOfMonth());

        return agendamentoRepository.countByTerapeutaIdAndStatusAndDataBetween(
            terapeutaId,
            StatusAgendamento.REALIZADO,
            inicio,
            fim
        );
    }
}