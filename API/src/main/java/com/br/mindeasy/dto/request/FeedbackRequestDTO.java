package com.br.mindeasy.dto.request;

import jakarta.validation.constraints.NotBlank;

public class FeedbackRequestDTO {
    
    @NotBlank(message = "A mensagem não pode ser vazia")
    private String mensagem;

    public FeedbackRequestDTO() {}

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
}
