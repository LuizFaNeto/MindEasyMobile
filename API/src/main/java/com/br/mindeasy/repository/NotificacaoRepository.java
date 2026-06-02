package com.br.mindeasy.repository;

import com.br.mindeasy.model.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    List<Notificacao> findByPacienteIdOrderByCriadaEmDesc(Long pacienteId);

    long countByPacienteIdAndLidaFalse(Long pacienteId);
}
