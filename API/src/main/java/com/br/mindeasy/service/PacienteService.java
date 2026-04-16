package com.br.mindeasy.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.br.mindeasy.dto.request.PacienteRequestDTO;
import com.br.mindeasy.dto.response.PacienteResponseDTO;
import com.br.mindeasy.model.Paciente;
import com.br.mindeasy.repository.PacienteRepository;

@Service
public class PacienteService {
    private final PacienteRepository repository;
    private final PasswordEncoder passwordEncoder;

    public PacienteService(PacienteRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Paciente buscarPorEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Paciente com este email " + email + " nao encontrado"));
    }

    public Paciente buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Paciente com este id " + id + " nao encontrado"));
    }

    @Transactional(readOnly = true)
    public List<PacienteResponseDTO> listarPacientes() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PacienteResponseDTO cadastrarPaciente(PacienteRequestDTO dto) {
        Paciente paciente = new Paciente();
        paciente.setNome(dto.getNome());
        paciente.setEmail(dto.getEmail());
        paciente.setSenha(passwordEncoder.encode(dto.getSenha()));
        paciente.setSexo(dto.getSexo());
        paciente.setDataNascimento(dto.getDataNascimento());

        Paciente pacienteSalvo = repository.save(paciente);
        return toResponseDTO(pacienteSalvo);
    }

    @Transactional
    public void removerPaciente(Long id) {
        Paciente paciente = buscarPorId(id);
        repository.delete(paciente);
    }

    @Transactional
    public PacienteResponseDTO atualizarPaciente(Long id, PacienteRequestDTO dto) {
        Paciente pacienteExistente = buscarPorId(id);

        pacienteExistente.setNome(dto.getNome());
        pacienteExistente.setEmail(dto.getEmail());
        pacienteExistente.setSenha(passwordEncoder.encode(dto.getSenha()));
        pacienteExistente.setSexo(dto.getSexo());
        pacienteExistente.setDataNascimento(dto.getDataNascimento());

        Paciente salvo = repository.save(pacienteExistente);
        return toResponseDTO(salvo);
    }

    private PacienteResponseDTO toResponseDTO(Paciente paciente) {
        return new PacienteResponseDTO(
                paciente.getId(),
                paciente.getNome(),
                paciente.getEmail(),
                paciente.getSexo(),
                paciente.getDataNascimento());
    }
}
