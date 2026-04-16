const sidebar = document.querySelector('.sidebar');
const handle = document.getElementById('sidebar-handle');

handle.addEventListener('mouseenter', () => {
  sidebar.classList.add('shown'); // abre a sidebar
});

sidebar.addEventListener('mouseleave', () => {
  sidebar.classList.remove('shown'); // fecha ao tirar o mouse
});
