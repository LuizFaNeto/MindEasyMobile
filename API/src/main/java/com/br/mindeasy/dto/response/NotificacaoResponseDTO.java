package com.br.mindeasy.dto.response;

import java.time.LocalDateTime;

public class NotificacaoResponseDTO {

    private Long id;
    private Long pacienteId;
    private Long agendamentoId;
    private String titulo;
    private String mensagem;
    private String tipo;
    private Boolean lida;
    private LocalDateTime criadaEm;

    public NotificacaoResponseDTO() {}

    public NotificacaoResponseDTO(
        Long id,
        Long pacienteId,
        Long agendamentoId,
        String titulo,
        String mensagem,
        String tipo,
        Boolean lida,
        LocalDateTime criadaEm
    ) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.agendamentoId = agendamentoId;
        this.titulo = titulo;
        this.mensagem = mensagem;
        this.tipo = tipo;
        this.lida = lida;
        this.criadaEm = criadaEm;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public Long getAgendamentoId() { return agendamentoId; }
    public void setAgendamentoId(Long agendamentoId) { this.agendamentoId = agendamentoId; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Boolean getLida() { return lida; }
    public void setLida(Boolean lida) { this.lida = lida; }

    public LocalDateTime getCriadaEm() { return criadaEm; }
    public void setCriadaEm(LocalDateTime criadaEm) { this.criadaEm = criadaEm; }
}
