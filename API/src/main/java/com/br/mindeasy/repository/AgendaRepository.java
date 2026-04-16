package com.br.mindeasy.repository;

import java.time.Duration;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.br.mindeasy.enums.DiaAtendimento;
import com.br.mindeasy.model.Agenda;
import com.br.mindeasy.model.Terapeuta;

public interface AgendaRepository extends JpaRepository<Agenda, Long> {
    List<Agenda> findAllByTerapeutaId(Long terapeutaId);

    @Query("""
              SELECT DISTINCT a.terapeuta
              FROM Agenda a
              JOIN a.dias d
              WHERE d IN :dias
            """)
    List<Terapeuta> findTerapeutasByDias(@Param("dias") List<DiaAtendimento> dias);

    @Query("""
                    SELECT a.terapeuta
                    FROM Agenda a
                    WHERE a.duracaoConsulta = :duracao
            """)
    List<Terapeuta> findTerapeutasByDuracaoConsulta(@Param("duracao") Duration duracao);

    List<Agenda> findDistinctByDiasIn(List<DiaAtendimento> dias);

    List<Agenda> findByDuracaoConsulta(Duration duracao);
}
