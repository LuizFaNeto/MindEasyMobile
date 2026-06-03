package com.br.mindeasy.controller;

import com.br.mindeasy.dto.request.NotificacaoRequestDTO;
import com.br.mindeasy.dto.response.NotificacaoResponseDTO;
import com.br.mindeasy.service.NotificacaoService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    public NotificacaoController(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @PostMapping
    public ResponseEntity<NotificacaoResponseDTO> criar(@Valid @RequestBody NotificacaoRequestDTO dto) {
        NotificacaoResponseDTO criada = notificacaoService.criar(
            dto.getPacienteId(),
            dto.getTipo(),
            dto.getTitulo(),
            dto.getDescricao()
        );
        return ResponseEntity.status(201).body(criada);
    }

    @GetMapping("/pacientes/{pacienteId}")
    public ResponseEntity<List<NotificacaoResponseDTO>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(notificacaoService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/pacientes/{pacienteId}/nao-lidas")
    public ResponseEntity<Map<String, Long>> contarNaoLidas(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(Map.of("total", notificacaoService.contarNaoLidas(pacienteId)));
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<NotificacaoResponseDTO> marcarComoLida(@PathVariable Long id) {
        return ResponseEntity.ok(notificacaoService.marcarComoLida(id));
    }

    @PatchMapping("/pacientes/{pacienteId}/lidas")
    public ResponseEntity<Void> marcarTodasComoLidas(@PathVariable Long pacienteId) {
        notificacaoService.marcarTodasComoLidas(pacienteId);
        return ResponseEntity.noContent().build();
    }
}
