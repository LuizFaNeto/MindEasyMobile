package com.br.mindeasy.dto.response;
public class AvaliacaoResponseDTO {

    private long totalAvaliacoes;
    private long avaliacoesDe1Estrela;
    private long avaliacoesDe2Estrelas;
    private long avaliacoesDe3Estrelas;
    private long avaliacoesDe4Estrelas;
    private long avaliacoesDe5Estrelas;

    public AvaliacaoResponseDTO() {
    }

    public long getTotalAvaliacoes() {
        return totalAvaliacoes;
    }

    public void setTotalAvaliacoes(long totalAvaliacoes) {
        this.totalAvaliacoes = totalAvaliacoes;
    }

    public long getAvaliacoesDe1Estrela() {
        return avaliacoesDe1Estrela;
    }

    public void setAvaliacoesDe1Estrela(long avaliacoesDe1Estrela) {
        this.avaliacoesDe1Estrela = avaliacoesDe1Estrela;
    }

    public long getAvaliacoesDe2Estrelas() {
        return avaliacoesDe2Estrelas;
    }

    public void setAvaliacoesDe2Estrelas(long avaliacoesDe2Estrelas) {
        this.avaliacoesDe2Estrelas = avaliacoesDe2Estrelas;
    }

    public long getAvaliacoesDe3Estrelas() {
        return avaliacoesDe3Estrelas;
    }

    public void setAvaliacoesDe3Estrelas(long avaliacoesDe3Estrelas) {
        this.avaliacoesDe3Estrelas = avaliacoesDe3Estrelas;
    }

    public long getAvaliacoesDe4Estrelas() {
        return avaliacoesDe4Estrelas;
    }

    public void setAvaliacoesDe4Estrelas(long avaliacoesDe4Estrelas) {
        this.avaliacoesDe4Estrelas = avaliacoesDe4Estrelas;
    }

    public long getAvaliacoesDe5Estrelas() {
        return avaliacoesDe5Estrelas;
    }

    public void setAvaliacoesDe5Estrelas(long avaliacoesDe5Estrelas) {
        this.avaliacoesDe5Estrelas = avaliacoesDe5Estrelas;
    }
}