package com.br.mindeasy.dto.request;

import java.time.Duration;
import java.time.LocalTime;
import java.util.List;

import com.br.mindeasy.enums.DiaAtendimento;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class AgendaRequestDTO {
    @NotNull
    private Long idTerapeuta;

    @NotNull
    private LocalTime horaEntrada;

    @NotNull
    private LocalTime horaSaida;

    @NotNull
    private Duration duracaoConsulta;

    @NotEmpty
    private List<DiaAtendimento> dias;

    //Getters e Setters

    public Long getIdTerapeuta() {
        return idTerapeuta;
    }

    public void setIdTerapeuta(Long idTerapeuta) {
        this.idTerapeuta = idTerapeuta;
    }

    public LocalTime getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(LocalTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public LocalTime getHoraSaida() {
        return horaSaida;
    }

    public void setHoraSaida(LocalTime horaSaida) {
        this.horaSaida = horaSaida;
    }

    public Duration getDuracaoConsulta() {
        return duracaoConsulta;
    }

    public void setDuracaoConsulta(Duration duracaoConsulta) {
        this.duracaoConsulta = duracaoConsulta;
    }

    public List<DiaAtendimento> getDias() {
        return dias;
    }

    public void setDias(List<DiaAtendimento> dias) {
        this.dias = dias;
    }
    
}
