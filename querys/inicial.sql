CREATE DATABASE IF NOT EXISTS mind_easy
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mind_easy;

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

-- =========================
-- FEEDBACKS
-- =========================
CREATE TABLE IF NOT EXISTS feedbacks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  paciente_id BIGINT NOT NULL,
  mensagem VARCHAR(1000) NOT NULL,
  CONSTRAINT fk_feedback_paciente
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
-- =========================
-- NOTIFICAÇÕES
-- =========================
CREATE TABLE IF NOT EXISTS notificacoes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  paciente_id BIGINT NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  descricao VARCHAR(500) NOT NULL,
  lida BOOLEAN NOT NULL DEFAULT FALSE,
  criada_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notificacao_paciente
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    ON DELETE CASCADE,

  INDEX idx_notificacoes_paciente_criada (paciente_id, criada_em),
  INDEX idx_notificacoes_paciente_lida (paciente_id, lida)
) ENGINE=InnoDB;

