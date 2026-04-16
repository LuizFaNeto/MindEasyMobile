// ========= Sidebar hover =========
const sidebar = document.querySelector('.sidebar');
const handle  = document.getElementById('sidebar-handle');
handle?.addEventListener('mouseenter', () => sidebar?.classList.add('shown'));
sidebar?.addEventListener('mouseleave', () => sidebar?.classList.remove('shown'));

// ========= Config =========
const BASE_URL = 'http://localhost:8080';
const token = localStorage.getItem('mindeasy_token');
const auth = token ? { Authorization: `Bearer ${token}` } : {};
const TERAPEUTA_ID = 1; 

//Sem token volta para o Login
if (!token) {
  alert('Faça login para ver o perfil.');
  window.location.href = 'cadastro.html';
}

// injeta token salvo no login
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// ========= Helpers =========
function renderStars(container, media, max = 5) {
  container.innerHTML = '';
  const full = Math.floor(media);
  const half = media - full >= 0.5 ? 1 : 0;
  const empty = max - full - half;
  const mk = (cls) => {
    const i = document.createElement('i');
    i.className = cls;
    i.style.color = '#f8b84a';
    i.style.fontSize = '18px';
    i.style.marginRight = '2px';
    return i;
  };
  for (let i = 0; i < full; i++) container.appendChild(mk('fa-solid fa-star'));
  if (half) container.appendChild(mk('fa-regular fa-star-half-stroke'));
  for (let i = 0; i < empty; i++) container.appendChild(mk('fa-regular fa-star'));
}

// ========= API =========
async function getTerapeuta(id) {
  const { data } = await axios.get(`${BASE_URL}/api/terapeutas/${id}`, {
    headers: { auth }
  });
  return data;
}

async function getAgendamentosPorTerapeuta(id) {
  const { data } = await axios.get(`${BASE_URL}/api/agendamentos/terapeutas/${id}`, {
    headers: { auth }
  });
  return data;
}

//Teste de log, mostra o token que foi carregado
console.log('Token?', token && token.slice(0,20) + '...');

axios.interceptors.request.use(cfg => {
  console.log('➡️', cfg.method?.toUpperCase(), cfg.url, 'Auth?', !!cfg.headers?.Authorization);
  return cfg;
});

// ========= Preenche tela =========
async function carregarPerfil() {
  try {
    const t = await getTerapeuta(TERAPEUTA_ID);

    // Header
    document.getElementById('terapeuta-nome').textContent = t.nome || 'Terapeuta';
    const desc = t.especialidade
      ? `Especialista em ${t.especialidade}${t.crm ? ` • CRM ${t.crm}` : ''}`
      : (t.crm ? `CRM ${t.crm}` : 'Profissional da saúde');
    document.getElementById('terapeuta-descricao').textContent = desc;

    // Especialidades
    const espWrap = document.getElementById('especialidades');
    espWrap.innerHTML = '';
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = t.especialidade || 'Sem especialidade cadastrada';
    espWrap.appendChild(badge);

    // Sobre mim (placeholder por enquanto)
    document.getElementById('sobre-mim').textContent =
      'Informações do perfil ainda não preenchidas. Edite seu perfil para adicionar uma descrição.';

    // Média de avaliações
    const ags = await getAgendamentosPorTerapeuta(TERAPEUTA_ID);
    const comNota = ags.filter(a => a.avaliacaoNota != null /* && a.status === 'REALIZADO' */);
    let media = 0;
    if (comNota.length) {
      media = comNota.reduce((acc, cur) => acc + Number(cur.avaliacaoNota), 0) / comNota.length;
    }
    renderStars(document.getElementById('stars'), media, 5);
    document.getElementById('rating-text').textContent =
      comNota.length ? `${media.toFixed(1)} (${comNota.length} avaliações)` : 'Sem avaliações';

  } catch (e) {
    console.error(e);
    alert('Falha ao carregar perfil do terapeuta.');
  }
}

// boot
carregarPerfil();
