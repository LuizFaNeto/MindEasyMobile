package com.br.mindeasy.controller;

import com.br.mindeasy.dto.request.AgendamentoRequestDTO;
import com.br.mindeasy.dto.response.AgendamentoResponseDTO;
import com.br.mindeasy.service.AgendamentoService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendamentoResponseDTO> buscarPorId(@PathVariable Long id) {
        AgendamentoResponseDTO dto = agendamentoService.buscarPorId(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponseDTO>> listarTodos() {
        List<AgendamentoResponseDTO> lista = agendamentoService.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/terapeutas/{idTerapeuta}")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarPorTerapeuta(@PathVariable Long idTerapeuta) {
        List<AgendamentoResponseDTO> lista = agendamentoService.listarPorTerapeuta(idTerapeuta);
        return ResponseEntity.ok(lista);
    }

    // GET: agendamentos realizados por um terapeuta específico no período selecionado
    @GetMapping("/terapeutas/{terapeutaId}/concluidos")
    public ResponseEntity<Long> contarConcluidosPorMes(
        @PathVariable Long terapeutaId,
        @RequestParam int mes,
        @RequestParam int ano
    ) {
        try {
            long total = agendamentoService.contarAtendimentosConcluidosPorMes(terapeutaId, mes, ano);
            return ResponseEntity.ok(total);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        } catch (jakarta.persistence.EntityNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }


    // POST: criação de agendamento
    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criar(@Valid @RequestBody AgendamentoRequestDTO dto) {
        AgendamentoResponseDTO criado = agendamentoService.agendar(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(criado.getId())
            .toUri();
        return ResponseEntity.created(location).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendamentoResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody AgendamentoRequestDTO dto) {
        AgendamentoResponseDTO atualizado = agendamentoService.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AgendamentoResponseDTO> atualizarParcial(@PathVariable Long id, @RequestBody AgendamentoRequestDTO dto) {
        AgendamentoResponseDTO atualizado = agendamentoService.atualizarParcial(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        agendamentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}