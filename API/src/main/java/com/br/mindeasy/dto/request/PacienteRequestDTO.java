package com.br.mindeasy.dto.request;

import java.time.LocalDate;

import com.br.mindeasy.enums.Sexo;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public class PacienteRequestDTO {
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

    @NotNull(message = "Sexo nao pode estar vazio")
    private Sexo sexo;

    @NotBlank(message = "Data de nascimento nao pode estar vazia")
    @Past(message = "data de nascimento invalida")
    private LocalDate dataNascimento;

    //Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public Sexo getSexo() { return sexo; }
    public void setSexo(Sexo sexo) { this.sexo = sexo; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
}
