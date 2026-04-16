package com.br.mindeasy.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import com.br.mindeasy.enums.StatusAgendamento;

public class AgendamentoResponseDTO {
    
    private Long id;
    private String nomePaciente;
    private String nomeTerapeuta;
    private LocalDate data;
    private LocalTime horaInicio;
    private StatusAgendamento status;
    private Integer avaliacaoNota;
    private String avaliacaoComentario;

        public AgendamentoResponseDTO(
        Long id,
        String nomePaciente,
        String nomeTerapeuta,
        LocalDate data,
        LocalTime horaInicio,
        StatusAgendamento status,
        Integer avaliacaoNota,
        String avaliacaoComentario
    ) {
        this.id = id;
        this.nomePaciente = nomePaciente;
        this.nomeTerapeuta = nomeTerapeuta;
        this.data = data;
        this.horaInicio = horaInicio;
        this.status = status;
        this.avaliacaoNota = avaliacaoNota;
        this.avaliacaoComentario = avaliacaoComentario;
    }


    //Getters e Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNomePaciente() {
        return nomePaciente;
    }
    public void setNomePaciente(String nomePaciente) {
        this.nomePaciente = nomePaciente;
    }
    public String getNomeTerapeuta() {
        return nomeTerapeuta;
    }
    public void setNomeTerapeuta(String nomeTerapeuta) {
        this.nomeTerapeuta = nomeTerapeuta;
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
