const BASE_URL = 'http://localhost:8080';

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const formCadastro = document.getElementById('formCadastro');
const formLogin = document.getElementById('formLogin');

// Adiciona a classe para ativar a animação do painel de cadastro
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

// Remove a classe para ativar a animação do painel de login
signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// === LÓGICA PARA ENVIO DO FORMULÁRIO DE LOGIN (ATUALIZADO COM REDIRECIONAMENTO) ===
formLogin.addEventListener('submit', e => {
    e.preventDefault(); // Impede o recarregamento da página
    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;

    const loginData = {
        username: email,
        password: senha
    };

    // Faz um POST para o novo endpoint /api/auth/login
    axios.post(`${BASE_URL}/api/auth/login`, loginData)
      .then(res => {
          // alert('Login realizado com sucesso!'); (Removido para agilizar)

          // Guarda o token no navegador
          localStorage.setItem('mindeasy_token', res.data.token);

          // ADICIONADO: Redireciona o usuário para o menu principal
          window.location.href = 'menu.html';
      })
      .catch(err => {
          alert('Credenciais inválidas.');
          console.error(err.response || err);
      });
});

// === LÓGICA PARA ENVIO DO FORMULÁRIO DE CADASTRO (EXISTENTE) ===
formCadastro.addEventListener('submit', e => {
    e.preventDefault(); // Impede o recarregamento da página

    const cadastroButton = document.getElementById('cadastroButton');
    const originalButtonText = cadastroButton.innerHTML;

    // 1. Inicia a animação de 'loading'
    cadastroButton.classList.add('onclic');
    cadastroButton.innerHTML = ''; // Limpa o texto "Cadastrar"

    const data = {
        nome: document.getElementById('nome').value,
        sexo: document.getElementById('sexo').value,
        especialidade: document.getElementById('especialidade').value,
        crm: document.getElementById('crm').value,
        email: document.getElementById('emailCadastro').value,
        telefone: document.getElementById('telefone').value,
        senha: document.getElementById('senhaCadastro').value
    };

    const resetButtonStyle = () => {
        setTimeout(() => {
            cadastroButton.classList.remove('validate', 'onclic', 'error');
            cadastroButton.innerHTML = originalButtonText; // Restaura o texto original
        }, 2000); // Reseta o botão após 2 segundos
    };

    // O endpoint de cadastro continua o mesmo (e não precisa de token)
    axios.post(`${BASE_URL}/api/terapeutas`, data)
      .then(res => {
          alert('Terapeuta cadastrado com sucesso!');
          console.log(res.data);

          // 2. Animação de sucesso
          cadastroButton.classList.remove('onclic');
          cadastroButton.classList.add('validate');
          
          resetButtonStyle();
      })
      .catch(err => {
          alert('Erro ao cadastrar terapeuta.');
          console.error(err.response || err);

          // 3. Animação de erro
          cadastroButton.classList.remove('onclic');
          cadastroButton.classList.add('error');

          resetButtonStyle();
      });
});