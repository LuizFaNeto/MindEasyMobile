package com.br.mindeasy.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import com.br.mindeasy.enums.StatusAgendamento;

@Entity
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "terapeuta_id", nullable = false)
    private Terapeuta terapeuta;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusAgendamento status = StatusAgendamento.AGENDADO;

    @Column(name = "avaliacao_nota")
    private Integer avaliacaoNota;

    @Column(name = "avaliacao_comentario", length = 500)
    private String avaliacaoComentario;

    // Construtor padrão
    public Agendamento() {}

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Terapeuta getTerapeuta() {
        return terapeuta;
    }

    public void setTerapeuta(Terapeuta terapeuta) {
        this.terapeuta = terapeuta;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public StatusAgendamento getStatus() {
        return status;
    }

    public void setStatus(StatusAgendamento status) {
        this.status = status;
    }

    public Integer getAvaliacaoNota() {
        return avaliacaoNota;
    }

    public void setAvaliacaoNota(Integer avaliacaoNota) {
        this.avaliacaoNota = avaliacaoNota;
    }

    public String getAvaliacaoComentario() {
        return avaliacaoComentario;
    }

    public void setAvaliacaoComentario(String avaliacaoComentario) {
        this.avaliacaoComentario = avaliacaoComentario;
    }
}