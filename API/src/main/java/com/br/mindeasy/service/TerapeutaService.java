package com.br.mindeasy.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.br.mindeasy.dto.request.TerapeutaRequestDTO;
import com.br.mindeasy.dto.response.TerapeutaResponseDTO;
import com.br.mindeasy.model.Terapeuta;
import com.br.mindeasy.repository.TerapeutaRepository;

@Service
public class TerapeutaService {
    private final TerapeutaRepository repository;
    private final PasswordEncoder passwordEncoder;

    public TerapeutaService(TerapeutaRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Terapeuta buscarPorEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Terapeuta com este email " + email + " nao encontrado"));
    }

    public Terapeuta buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Terapeuta com este id " + id + " nao encontrado"));
    }

    @Transactional(readOnly = true)
    public List<TerapeutaResponseDTO> listarTerapeutas() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TerapeutaResponseDTO cadastrarTerapeuta(TerapeutaRequestDTO dto) {
        Terapeuta terapeuta = new Terapeuta();
        terapeuta.setNome(dto.getNome());
        terapeuta.setEmail(dto.getEmail());
        terapeuta.setSenha(passwordEncoder.encode(dto.getSenha()));
        terapeuta.setTelefone(dto.getTelefone());
        terapeuta.setSexo(dto.getSexo());
        terapeuta.setCrm(dto.getCrm());
        terapeuta.setEspecialidade(dto.getEspecialidade());

        Terapeuta terapeutaSalvo = repository.save(terapeuta);

        TerapeutaResponseDTO response = toResponseDTO(terapeutaSalvo);
        return response;
    }

    @Transactional
    public void removerTerapeuta(Long id) {
        Terapeuta terapeuta = buscarPorId(id);
        repository.delete(terapeuta);
    }

    @Transactional
    public TerapeutaResponseDTO atualizarTerapeuta(Long id, TerapeutaRequestDTO dto) {
        Terapeuta terapeuta = buscarPorId(id);

        terapeuta.setNome(dto.getNome());
        terapeuta.setEmail(dto.getEmail());
        terapeuta.setSenha(passwordEncoder.encode(dto.getSenha()));
        terapeuta.setTelefone(dto.getTelefone());
        terapeuta.setSexo(dto.getSexo());
        terapeuta.setCrm(dto.getCrm());
        terapeuta.setEspecialidade(dto.getEspecialidade());

        Terapeuta atualizado = repository.save(terapeuta);
        return toResponseDTO(atualizado);
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
