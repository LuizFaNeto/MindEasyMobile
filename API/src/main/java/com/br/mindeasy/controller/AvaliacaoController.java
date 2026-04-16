package com.br.mindeasy.controller;

import com.br.mindeasy.dto.request.AvaliacaoRequestDTO;
import com.br.mindeasy.dto.response.AvaliacaoResponseDTO;
import com.br.mindeasy.service.AvaliacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @GetMapping("/resumo/terapeutas/{idTerapeuta}")
    public ResponseEntity<AvaliacaoResponseDTO> getResumo(@PathVariable Long idTerapeuta) {
        AvaliacaoResponseDTO resumo = avaliacaoService.getResumoAvaliacoes(idTerapeuta);
        return ResponseEntity.ok(resumo);
    }

    @PostMapping("/agendamentos/{id}/avaliacao")
    public ResponseEntity<AvaliacaoResponseDTO> criarAvaliacao(
            @PathVariable Long id,
            @Valid @RequestBody AvaliacaoRequestDTO dto) {
        AvaliacaoResponseDTO resumoAtualizado = avaliacaoService.criarAvaliacao(id, dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();
        return ResponseEntity.created(location).body(resumoAtualizado);
    }

    @PutMapping("/agendamentos/{id}/avaliacao")
    public ResponseEntity<AvaliacaoResponseDTO> atualizarAvaliacao(
            @PathVariable Long id,
            @Valid @RequestBody AvaliacaoRequestDTO dto) {
        AvaliacaoResponseDTO resumoAtualizado = avaliacaoService.atualizarAvaliacao(id, dto);
        return ResponseEntity.ok(resumoAtualizado);
    }

    @DeleteMapping("/agendamentos/{id}/avaliacao")
    public ResponseEntity<Void> removerAvaliacao(@PathVariable Long id) {
        avaliacaoService.removerAvaliacao(id);
        return ResponseEntity.noContent().build();
    }
}