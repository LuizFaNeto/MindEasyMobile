package com.br.mindeasy.dto.request;

public class AvaliacaoRequestDTO {

    private Integer nota;
    private String comentario;

    public AvaliacaoRequestDTO() {
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}