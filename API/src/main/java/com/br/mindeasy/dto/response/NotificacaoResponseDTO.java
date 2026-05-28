package com.br.mindeasy.dto.response;

import com.br.mindeasy.enums.TipoNotificacao;

import java.time.LocalDateTime;

public class NotificacaoResponseDTO {

    private Long id;
    private Long pacienteId;
    private TipoNotificacao tipo;
    private String titulo;
    private String descricao;
    private boolean lida;
    private LocalDateTime criadaEm;

    public NotificacaoResponseDTO(
        Long id,
        Long pacienteId,
        TipoNotificacao tipo,
        String titulo,
        String descricao,
        boolean lida,
        LocalDateTime criadaEm
    ) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.tipo = tipo;
        this.titulo = titulo;
        this.descricao = descricao;
        this.lida = lida;
        this.criadaEm = criadaEm;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public TipoNotificacao getTipo() { return tipo; }
    public void setTipo(TipoNotificacao tipo) { this.tipo = tipo; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public boolean isLida() { return lida; }
    public void setLida(boolean lida) { this.lida = lida; }

    public LocalDateTime getCriadaEm() { return criadaEm; }
    public void setCriadaEm(LocalDateTime criadaEm) { this.criadaEm = criadaEm; }
}
