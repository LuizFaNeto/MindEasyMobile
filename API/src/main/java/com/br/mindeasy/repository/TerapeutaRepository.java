package com.br.mindeasy.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.mindeasy.model.Terapeuta;

public interface TerapeutaRepository extends JpaRepository<Terapeuta, Long>{
    //Consultas simples
    Optional<Terapeuta> findByEmail(String email);

    List<Terapeuta> findByNomeContainingIgnoreCase(String nomeParcial);
}
