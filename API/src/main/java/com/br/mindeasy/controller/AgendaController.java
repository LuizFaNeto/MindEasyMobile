package com.br.mindeasy.controller;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.br.mindeasy.dto.request.AgendaRequestDTO;
import com.br.mindeasy.dto.response.AgendaResponseDTO;
import com.br.mindeasy.enums.DiaAtendimento;
import com.br.mindeasy.service.AgendaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/agendas")
public class AgendaController {
    private final AgendaService service;

    public AgendaController(AgendaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<AgendaResponseDTO> criar(@Valid @RequestBody AgendaRequestDTO dto) {
        AgendaResponseDTO resp = service.criarAgenda(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
            .buildAndExpand(resp.getId()).toUri();
        return ResponseEntity.created(location).body(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendaResponseDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<AgendaResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/terapeutas/{terapeutaId}")
    public ResponseEntity<List<AgendaResponseDTO>> buscarPorTerapeuta(@PathVariable Long terapeutaId) {
        List<AgendaResponseDTO> agendas = service.listarPorTerapeuta(terapeutaId);
        return ResponseEntity.ok(agendas);
    }

    @GetMapping("/search")
    public ResponseEntity<List<AgendaResponseDTO>> buscar(
            @RequestParam(required = false) List<DiaAtendimento> dias,
            @RequestParam(required = false) Duration duracao) {
        List<AgendaResponseDTO> resultados = service.buscarPorDiasOuDuracao(dias, duracao);
        return ResponseEntity.ok(resultados);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendaResponseDTO> atualizar(
            @PathVariable Long id, @Valid @RequestBody AgendaRequestDTO dto) {
        return ResponseEntity.ok(service.atualizarAgenda(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletarAgenda(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AgendaResponseDTO> patchAgenda(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        AgendaResponseDTO atualizado = service.atualizarParcial(id, updates);
        return ResponseEntity.ok(atualizado);
    }
}
