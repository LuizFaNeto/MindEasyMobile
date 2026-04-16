package com.br.mindeasy.dto.request;

import com.br.mindeasy.enums.Sexo;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TerapeutaRequestDTO {
    // Atributos
    @NotBlank(message = "Nome nao pode estar vazio.")
    private String nome;

    @Email
    @NotBlank(message = "Email obrigatorio")
    private String email;

    @NotBlank
    @Size(min = 8, max = 12, 
    message = "Senha deve conter de 8 a 12 caracteres")
    private String senha;

    @NotBlank(message = "Telefone obrigatorio")
    private String telefone;

    @NotNull(message = "Sexo nao pode estar vazio")
    private Sexo sexo;

    @NotBlank(message = "CRM obrigatorio")
    private String crm;

    @NotBlank(message = "Especialidade obrigatoria")
    private String especialidade;

    //Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public Sexo getSexo() { return sexo; }
    public void setSexo(Sexo sexo) { this.sexo = sexo; }

    public String getCrm() { return crm; }
    public void setCrm(String crm) { this.crm = crm; }

    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
}
