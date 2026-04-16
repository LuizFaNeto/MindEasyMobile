const BASE_URL = 'http://localhost:8080';

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const formCadastro = document.getElementById('formCadastro');
const formLogin = document.getElementById('formLogin');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

formLogin.addEventListener('submit', e => {
    e.preventDefault(); 
    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;

    const loginData = {
        username: email,
        password: senha
    };

    axios.post(`${BASE_URL}/api/auth/login`, loginData)
      .then(res => {
          localStorage.setItem('mindeasy_token', res.data.token);
          window.location.href = 'menu.html';
      })
      .catch(err => {
          alert('Credenciais inválidas.');
          console.error(err.response || err);
      });
});

formCadastro.addEventListener('submit', e => {
    e.preventDefault(); 

    const cadastroButton = document.getElementById('cadastroButton');
    const originalButtonText = cadastroButton.innerHTML;

    cadastroButton.classList.add('onclic');
    cadastroButton.innerHTML = ''; 

    const data = {
        nome: document.getElementById('nome').value,
        sexo: document.getElementById('sexo').value,
        email: document.getElementById('emailCadastro').value,
        dataNascimento: document.getElementById('dataNascimento').value, 
        senha: document.getElementById('senhaCadastro').value
    };

    const resetButtonStyle = () => {
        setTimeout(() => {
            cadastroButton.classList.remove('validate', 'onclic', 'error');
            cadastroButton.innerHTML = originalButtonText; 
        }, 2000); 
    };

    // Endpoint de cadastro de PACIENTE
    axios.post(`${BASE_URL}/api/pacientes`, data)
      .then(res => {
          alert('Paciente cadastrado com sucesso!');
          console.log(res.data);

          cadastroButton.classList.remove('onclic');
          cadastroButton.classList.add('validate');
          
          resetButtonStyle();
          
          container.classList.remove("right-panel-active");

      })
      .catch(err => {
          alert('Erro ao cadastrar paciente.');
          console.error(err.response || err);

          cadastroButton.classList.remove('onclic');
          cadastroButton.classList.add('error');

          resetButtonStyle();
      });
});