package com.br.mindeasy.dto.response;

import java.time.Duration;
import java.time.LocalTime;
import java.util.List;

import com.br.mindeasy.enums.DiaAtendimento;

public class AgendaResponseDTO {

    private Long id;
    private Long idTerapeuta;
    private String nomeTerapeuta;
    private LocalTime horaEntrada;
    private LocalTime horaSaida;
    private Duration duracaoConsulta;
    private List<DiaAtendimento> dias;

    //Construtor com parâmetros
    public AgendaResponseDTO(Long id, Long idTerapeuta, String nomeTerapeuta, LocalTime horaEntrada,
        LocalTime horaSaida, Duration duracaoConsulta, List<DiaAtendimento> dias) {
        this.id = id;
        this.idTerapeuta = idTerapeuta;
        this.nomeTerapeuta = nomeTerapeuta;
        this.horaEntrada = horaEntrada;
        this.horaSaida = horaSaida;
        this.duracaoConsulta = duracaoConsulta;
        this.dias = dias;
    }
    
    //Getters e Setters
    public Long getId() {
        return id;
    }

    public Long getIdTerapeuta() {
        return idTerapeuta;
    }

    public String getNomeTerapeuta() {
        return nomeTerapeuta;
    }

    public LocalTime getHoraEntrada() {
        return horaEntrada;
    }

    public LocalTime getHoraSaida() {
        return horaSaida;
    }

    public Duration getDuracaoConsulta() {
        return duracaoConsulta;
    }

    public List<DiaAtendimento> getDias() {
        return dias;
    }
    
}
