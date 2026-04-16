package com.br.mindeasy.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import com.br.mindeasy.enums.StatusAgendamento;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

public class AgendamentoRequestDTO {

    @NotNull
    private Long pacienteId;

    @NotNull
    private Long terapeutaId;

    @NotNull
    @FutureOrPresent
    private LocalDate data;

    @NotNull
    private LocalTime horaInicio;

    @NotNull
    private StatusAgendamento status;


    // Getters e Setters
    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public Long getTerapeutaId() {
        return terapeutaId;
    }

    public void setTerapeutaId(Long terapeutaId) {
        this.terapeutaId = terapeutaId;
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
}
