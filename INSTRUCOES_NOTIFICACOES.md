# Integração de Notificações - MindEasy

## Arquivos do frontend
Substitua/crie estes arquivos:

- `app/notifications.tsx`
- `services/notificacaoService.ts`

## Arquivos do backend
Crie/substitua estes arquivos dentro da pasta `API`:

- `src/main/java/com/br/mindeasy/enums/TipoNotificacao.java`
- `src/main/java/com/br/mindeasy/model/Notificacao.java`
- `src/main/java/com/br/mindeasy/dto/request/NotificacaoRequestDTO.java`
- `src/main/java/com/br/mindeasy/dto/response/NotificacaoResponseDTO.java`
- `src/main/java/com/br/mindeasy/repository/NotificacaoRepository.java`
- `src/main/java/com/br/mindeasy/service/NotificacaoService.java`
- `src/main/java/com/br/mindeasy/controller/NotificacaoController.java`
- `src/main/java/com/br/mindeasy/service/AgendamentoService.java`

## O que foi implementado

- Tela de notificações consumindo a API real.
- Listagem de notificações por paciente logado.
- Marcar uma notificação como lida.
- Marcar todas como lidas.
- Contador de notificações não lidas no backend.
- Salvamento da notificação no banco pela tabela `notificacoes`.
- Endpoint `POST` para criar uma notificação manualmente quando necessário.
- Quando um agendamento é criado, o backend cria automaticamente uma notificação para o paciente.

## Endpoints criados

- `POST /api/notificacoes`
- `GET /api/notificacoes/pacientes/{pacienteId}`
- `GET /api/notificacoes/pacientes/{pacienteId}/nao-lidas`
- `PATCH /api/notificacoes/{id}/lida`
- `PATCH /api/notificacoes/pacientes/{pacienteId}/lidas`

## Como testar

1. Rode o MySQL.
2. Rode o backend:

```bash
cd API
.\mvnw spring-boot:run
```

3. Rode o app:

```bash
npx expo start -c
```

4. Faça login no app.
5. Crie um agendamento.
6. Abra a tela de notificações.

A notificação do agendamento deverá aparecer automaticamente.


## Script do banco

Se você criou as tabelas manualmente usando `querys/inicial.sql`, rode também no mesmo banco configurado em `application.properties` (`mind_easy`):

```sql
source querys/notificacoes.sql;
```

Ou copie o bloco `CREATE TABLE IF NOT EXISTS notificacoes` que foi adicionado no final do arquivo `querys/inicial.sql`.

> Observação: com `spring.jpa.hibernate.ddl-auto=update`, o Hibernate também consegue criar a tabela automaticamente ao iniciar a API. Mesmo assim, o script SQL foi atualizado para deixar o banco completo.
