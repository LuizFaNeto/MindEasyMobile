# 🧠 MindEasy

Bem-vindo ao **MindEasy**, um aplicativo mobile desenvolvido para tornar o acesso à saúde mental mais simples, intuitivo e eficiente. 

Este projeto faz parte do **Projeto Aplicado** da faculdade e tem como objetivo conectar pacientes a profissionais especializados, facilitando o agendamento e o acompanhamento de consultas.

---

## 🌟 Principais Funcionalidades

O MindEasy foi projetado com foco na experiência do usuário (UX), garantindo que a jornada pela saúde mental seja o mais tranquila possível.

- **🔐 Autenticação Segura**: Fluxo completo de login para garantir a privacidade dos dados.
- **🏠 Dashboard de Início**: Visualização rápida de profissionais recomendados e status atual.
- **📅 Gestão de Consultas**: Calendário integrado para agendamento e visualização de sessões futuras.
- **👩‍⚕️ Perfil de Especialistas**: Informações detalhadas sobre terapeutas, especialidades e avaliações.
- **🔔 Central de Notificações**: Lembretes de consultas e atualizações importantes em tempo real.
- **👤 Perfil do Usuário**: Personalização de dados e histórico de atendimento.

---

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza o que há de mais moderno no ecossistema mobile para garantir performance e escalabilidade.

### **Frontend (Mobile)**
- **[React Native](https://reactnative.dev/)** + **[Expo](https://expo.dev/)**: Desenvolvimento híbrido de alta performance.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para maior segurança e manutenção.
- **[Expo Router](https://docs.expo.dev/router/introduction/)**: Sistema de roteamento moderno baseado em arquivos.
- **[Zustand](https://github.com/pmndrs/zustand)**: Gerenciamento de estado leve e eficiente.
- **[React Native Paper](https://reactnativepaper.com/)**: Biblioteca de componentes UI seguindo o Material Design.
- **[Lucide React Native](https://lucide.dev/)**: Ícones elegantes e personalizáveis.

### **Backend & Banco de Dados**
- **[Node.js](https://nodejs.org/)**: Ambiente de execução para o servidor.
- **[Prisma ORM](https://www.prisma.io/)**: Interface moderna para interagir com o banco de dados.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (v18+)
- Expo Go instalado no smartphone (opcional, para testes físicos)
- Git para clonagem

### Passos para instalação

1. **Clone o repositório:**
   ```bash
   git clone [url-do-repositorio]
   cd MindEasy
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npx expo start
   ```

4. **Abra o projeto:**
   - Use o **Expo Go** para ler o QR Code no seu celular.
   - Ou pressione `a` para abrir no emulador Android ou `i` para simulador iOS.

---

## 📁 Estrutura de Pastas

```text
MindEasy/
├── app/             # Rotas e telas (Expo Router)
│   ├── (auth)/      # Telas de autenticação (Login)
│   ├── (tabs)/      # Navegação principal (Início, Calendário, Perfil)
│   └── therapist/   # Perfil detalhado do profissional
├── backend/         # Lógica do servidor e banco de dados
│   ├── prisma/      # Schema e migrações
│   └── src/         # Controladores, rotas e modelos
├── components/      # Componentes reutilizáveis
├── constants/       # Cores, estilos e configurações globais
├── store/           # Estados globais (Zustand)
└── assets/          # Imagens, fontes e ícones
```
