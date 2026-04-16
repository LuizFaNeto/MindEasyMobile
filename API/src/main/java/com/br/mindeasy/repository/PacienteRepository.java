package com.br.mindeasy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.mindeasy.model.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    //Consultas simples
    Optional<Paciente> findByEmail(String email);

    List<Paciente> findByNomeContainingIgnoreCase(String nomeParcial);
}
