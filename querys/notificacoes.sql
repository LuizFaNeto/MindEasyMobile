USE mind_easy;

CREATE TABLE IF NOT EXISTS notificacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    criada_em DATETIME(6) NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    lida BIT(1) NOT NULL,
    tipo ENUM('ALERT', 'APPOINTMENT', 'MESSAGE', 'SUCCESS') NOT NULL,
    titulo VARCHAR(120) NOT NULL,
    paciente_id BIGINT NOT NULL,
    agendamento_id BIGINT NULL,

    CONSTRAINT fk_notificacoes_paciente
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id),

    CONSTRAINT fk_notificacoes_agendamento
        FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id)
);