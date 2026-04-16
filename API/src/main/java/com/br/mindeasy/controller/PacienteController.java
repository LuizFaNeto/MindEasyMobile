package com.br.mindeasy.controller;

import java.net.URI;
import java.util.List;

import com.br.mindeasy.dto.request.PacienteRequestDTO;
import com.br.mindeasy.dto.response.PacienteResponseDTO;
import com.br.mindeasy.model.Paciente;
import com.br.mindeasy.service.PacienteService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {
    private final PacienteService service;

    public PacienteController(PacienteService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PacienteResponseDTO> cadastrar(@Valid @RequestBody PacienteRequestDTO requestDTO) {
        PacienteResponseDTO responseDTO = service.cadastrarPaciente(requestDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(responseDTO.getId()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PacienteRequestDTO requestDTO) {
        PacienteResponseDTO updated = service.atualizarPaciente(id, requestDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.removerPaciente(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> buscarPorId(@PathVariable Long id) {
        Paciente paciente = service.buscarPorId(id);
        return ResponseEntity.ok(toResponseDTO(paciente));
    }

    @GetMapping
    public ResponseEntity<List<PacienteResponseDTO>> listarTodos() {
        List<PacienteResponseDTO> pacientes = service.listarPacientes();
        return ResponseEntity.ok(pacientes);
    }

    private PacienteResponseDTO toResponseDTO(Paciente p) {
        return new PacienteResponseDTO(
                p.getId(),
                p.getNome(),
                p.getEmail(),
                p.getSexo(),
                p.getDataNascimento());
    }
}
