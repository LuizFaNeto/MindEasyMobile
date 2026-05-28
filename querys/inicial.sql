CREATE DATABASE IF NOT EXISTS mindeasy
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mindeasy;

-- =========================
-- PACIENTES
-- =========================
CREATE TABLE IF NOT EXISTS pacientes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  sexo VARCHAR(20) NOT NULL,          
  data_nascimento DATE NOT NULL
) ENGINE=InnoDB;

-- =========================
-- TERAPEUTAS
-- =========================
CREATE TABLE IF NOT EXISTS terapeutas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL UNIQUE,
  sexo VARCHAR(20) NOT NULL,          
  crm VARCHAR(10) NOT NULL,
  especialidade VARCHAR(200) NOT NULL
) ENGINE=InnoDB;

-- =========================
-- AGENDAS 
-- =========================
CREATE TABLE IF NOT EXISTS agendas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  terapeuta_id BIGINT NOT NULL UNIQUE,       
  hora_entrada TIME NOT NULL,
  hora_saida TIME NOT NULL,
  duracao_consulta BIGINT NOT NULL,          
  CONSTRAINT fk_agenda_terapeuta
    FOREIGN KEY (terapeuta_id) REFERENCES terapeutas(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- AGENDA_DIAS 
-- =========================
CREATE TABLE IF NOT EXISTS agenda_dias (
  agenda_id BIGINT NOT NULL,
  dia VARCHAR(20) NOT NULL,                 
  dias_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (agenda_id, dias_order),
  CONSTRAINT fk_agenda_dias_agenda
    FOREIGN KEY (agenda_id) REFERENCES agendas(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- AGENDAMENTOS
-- =========================
CREATE TABLE IF NOT EXISTS agendamentos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  paciente_id BIGINT NOT NULL,
  terapeuta_id BIGINT NOT NULL,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  status VARCHAR(20) NOT NULL,              
  avaliacao_nota INT NULL,
  avaliacao_comentario VARCHAR(500) NULL,

  CONSTRAINT fk_agendamento_paciente
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_agendamento_terapeuta
    FOREIGN KEY (terapeuta_id) REFERENCES terapeutas(id)
    ON DELETE RESTRICT,

  INDEX idx_ag_paciente_data (paciente_id, data, hora_inicio),
  INDEX idx_ag_terapeuta_data (terapeuta_id, data, hora_inicio)
) ENGINE=InnoDB;