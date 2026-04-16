package com.br.mindeasy.dto.response;

import com.br.mindeasy.enums.Sexo;

public class TerapeutaResponseDTO {
    // Atributos
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private Sexo sexo;
    private String crm;
    private String especialidade;

    //Construtor com parâmetros
    public TerapeutaResponseDTO(Long id, String nome, String email, String telefone, Sexo sexo, String crm, String especialidade) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.sexo = sexo;
        this.crm = crm;
        this.especialidade = especialidade;
    }

    //Getters (Utilizei apenas getters para garantir a segurança da resposta, evitando alterações de dados)
    public Long getId() { return id; }
    
    public String getNome() { return nome; }

    public String getEmail() { return email; }

    public String getTelefone() { return telefone; }

    public Sexo getSexo() { return sexo; }

    public String getCrm() { return crm; }

    public String getEspecialidade() { return especialidade; }
}
