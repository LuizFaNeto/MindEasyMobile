# Integração MindEasy Front + API

## 1. Backend
Arquivos alterados:

- `API/src/main/java/com/br/mindeasy/repository/AgendamentoRepository.java`
- `API/src/main/java/com/br/mindeasy/service/AgendamentoService.java`
- `API/src/main/java/com/br/mindeasy/controller/AgendamentoController.java`
- `API/src/main/java/com/br/mindeasy/security/WebConfig.java`

Novo endpoint criado:

```http
GET /api/agendamentos/pacientes/{idPaciente}
Authorization: Bearer SEU_TOKEN
```

Esse endpoint permite que o app mobile mostre apenas as consultas do paciente logado.

## 2. Frontend
Arquivos alterados:

- `services/api.ts`
- `services/agendamentoService.ts`
- `store/userStore.ts`
- `app/_layout.tsx`
- `app/index.tsx`
- `app/(tabs)/calendar.tsx`
- `package.json`

## 3. Instalar nova dependência
Rode no frontend:

```bash
npm install @react-native-async-storage/async-storage
```

## 4. URL da API
O arquivo `services/api.ts` tenta detectar automaticamente o IP do Expo.

Se quiser forçar manualmente, rode o app assim:

```bash
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8080 npx expo start
```

Exemplo:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080 npx expo start
```

## 5. Ordem de teste

1. Suba a API Spring Boot.
2. Cadastre um paciente no app.
3. Faça login.
4. Veja a lista de terapeutas na Home.
5. Agende uma consulta.
6. Abra a aba Calendário para ver apenas os agendamentos do paciente logado.
