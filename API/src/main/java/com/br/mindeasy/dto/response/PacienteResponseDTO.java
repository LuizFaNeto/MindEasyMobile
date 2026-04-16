package com.br.mindeasy.dto.response;

import java.time.LocalDate;

import com.br.mindeasy.enums.Sexo;

public class PacienteResponseDTO {
    //Atributos
    private Long id;
    private String nome;
    private String email;
    private Sexo sexo;
    private LocalDate dataNascimento;

    //Contrutor com parâmetros
    public PacienteResponseDTO(Long id, String nome, String email, Sexo sexo, LocalDate dataNascimento) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.sexo = sexo;
        this.dataNascimento = dataNascimento;
    }

    //Getters (Utilizei apenas getters para garantir a segurança da resposta, evitando alterações de dados)
    public Long getId() { return id; }

    public String getNome() { return nome; }

    public String getEmail() { return email; }

    public Sexo getSexo() { return sexo; }

    public LocalDate getDataNascimento() { return dataNascimento; }
}
