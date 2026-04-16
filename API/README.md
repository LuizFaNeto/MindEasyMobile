# 🧠 MindEasy

## 👥 Equipe

- Caio Costa Csermak - 2412846  
- Carlos Henrique Feijó Luz - 2312700  
- Jean Matheus de Sousa Silva - 2412817  
- Joaquim Oliveira Costa Neto - 2426031
- Levi Menezes De Figueiredo - 2412837  
- Luiz Farias Magalhães Neto - 2422781  

## 🥇 Objetivo do Projeto

Garantir que pessoas tenham acesso aos cuidados com a saúde mental, de forma simples e acessível.

## 📚 Informações Importantes

🔗 [Repositório Git](https://github.com/JeanSilva06/MindEasy)

### ⚙️ Configuração do `application.properties`

Para que o projeto funcione corretamente com o banco de dados MySQL, configure o arquivo `src/main/resources/application.properties` com os seguintes parâmetros:

CONFIG:

spring.application.name=API-MindEasy

spring.datasource.url=jdbc:mysql://localhost:3306/*NOMEDOBANCO*?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=SEUUSUARIO
spring.datasource.password=SUASENHA
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true