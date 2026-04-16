package com.br.mindeasy.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.br.mindeasy.dto.request.TerapeutaRequestDTO;
import com.br.mindeasy.dto.response.TerapeutaResponseDTO;
import com.br.mindeasy.model.Terapeuta;
import com.br.mindeasy.service.TerapeutaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/terapeutas")
public class TerapeutaController {
    private final TerapeutaService service;

    public TerapeutaController(TerapeutaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TerapeutaResponseDTO> cadastrar(@Valid @RequestBody TerapeutaRequestDTO requestDTO) {
        TerapeutaResponseDTO responseDTO = service.cadastrarTerapeuta(requestDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
            .buildAndExpand(responseDTO.getId()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.removerTerapeuta(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TerapeutaResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody TerapeutaRequestDTO dto) {
        TerapeutaResponseDTO terapeutaAtualizado = service.atualizarTerapeuta(id, dto);
        return ResponseEntity.ok(terapeutaAtualizado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TerapeutaResponseDTO> buscarPorId(@PathVariable Long id) {
        Terapeuta terapeuta = service.buscarPorId(id);
        TerapeutaResponseDTO responseDTO = toResponseDTO(terapeuta);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<TerapeutaResponseDTO>> listarTodos() {
        List<TerapeutaResponseDTO> terapeutas = service.listarTerapeutas();
        return ResponseEntity.ok(terapeutas);
    }

    private TerapeutaResponseDTO toResponseDTO(Terapeuta terapeuta) {
        return new TerapeutaResponseDTO(
                terapeuta.getId(),
                terapeuta.getNome(),
                terapeuta.getEmail(),
                terapeuta.getTelefone(),
                terapeuta.getSexo(),
                terapeuta.getCrm(),
                terapeuta.getEspecialidade());
    }
}

