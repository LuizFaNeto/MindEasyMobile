package com.br.mindeasy.service;

import com.br.mindeasy.dto.request.AvaliacaoRequestDTO;
import com.br.mindeasy.dto.response.AvaliacaoResponseDTO;
import com.br.mindeasy.model.Agendamento;
import com.br.mindeasy.repository.AgendamentoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AvaliacaoService {

    private final AgendamentoRepository agendamentoRepository;

    public AvaliacaoService(AgendamentoRepository agendamentoRepository) {
        this.agendamentoRepository = agendamentoRepository;
    }

    public AvaliacaoResponseDTO getResumoAvaliacoes(Long terapeutaId) {
        List<Object[]> resultadosDoBanco = agendamentoRepository.countAvaliacoesByNota(terapeutaId);

        long contagem1Estrela = 0;
        long contagem2Estrelas = 0;
        long contagem3Estrelas = 0;
        long contagem4Estrelas = 0;
        long contagem5Estrelas = 0;

        for (Object[] resultado : resultadosDoBanco) {
            Integer nota = (Integer) resultado[0];
            Long contagem = (Long) resultado[1];

            if (nota != null && contagem != null) {
                switch (nota) {
                    case 1 -> contagem1Estrela = contagem;
                    case 2 -> contagem2Estrelas = contagem;
                    case 3 -> contagem3Estrelas = contagem;
                    case 4 -> contagem4Estrelas = contagem;
                    case 5 -> contagem5Estrelas = contagem;
                }
            }
        }

        long totalDeAvaliacoes = contagem1Estrela + contagem2Estrelas + contagem3Estrelas + contagem4Estrelas + contagem5Estrelas;

        AvaliacaoResponseDTO resumoDto = new AvaliacaoResponseDTO();
        resumoDto.setTotalAvaliacoes(totalDeAvaliacoes);
        resumoDto.setAvaliacoesDe1Estrela(contagem1Estrela);
        resumoDto.setAvaliacoesDe2Estrelas(contagem2Estrelas);
        resumoDto.setAvaliacoesDe3Estrelas(contagem3Estrelas);
        resumoDto.setAvaliacoesDe4Estrelas(contagem4Estrelas);
        resumoDto.setAvaliacoesDe5Estrelas(contagem5Estrelas);

        return resumoDto;
    }

    public AvaliacaoResponseDTO criarAvaliacao(Long agendamentoId, AvaliacaoRequestDTO dto) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));

        if (agendamento.getAvaliacaoNota() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este agendamento já foi avaliado.");
        }

        validateNota(dto.getNota());

        agendamento.setAvaliacaoNota(dto.getNota());
        agendamento.setAvaliacaoComentario(dto.getComentario());

        agendamentoRepository.save(agendamento);

        return getResumoAvaliacoes(agendamento.getTerapeuta().getId());
    }

    public AvaliacaoResponseDTO atualizarAvaliacao(Long agendamentoId, AvaliacaoRequestDTO dto) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));

        if (agendamento.getAvaliacaoNota() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este agendamento ainda não foi avaliado. Crie uma avaliação antes de atualizar.");
        }

        validateNota(dto.getNota());

        agendamento.setAvaliacaoNota(dto.getNota());
        agendamento.setAvaliacaoComentario(dto.getComentario());

        agendamentoRepository.save(agendamento);

        return getResumoAvaliacoes(agendamento.getTerapeuta().getId());
    }

    public void removerAvaliacao(Long agendamentoId) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));

        agendamento.setAvaliacaoNota(null);
        agendamento.setAvaliacaoComentario(null);

        agendamentoRepository.save(agendamento);
    }

    private void validateNota(Integer nota) {
        if (nota == null || nota < 1 || nota > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nota inválida. Deve ser entre 1 e 5.");
        }
    }
}