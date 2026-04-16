// =======================
// Dashboard – MindEasy (CORRIGIDO COM AUTENTICAÇÃO)
// =======================

// === CONFIG ===
const BASE_URL = 'http://localhost:8080';

// TODO: pegue o id do terapeuta autenticado (ex.: localStorage/session).
// Por enquanto, usamos 1 para testar:
const TERAPEUTA_ID = 1;

// === HELPERS ===
const mesesPt = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const nomeMes = (m) => mesesPt[m - 1];

// Chama: GET /api/agendamentos/terapeutas/{id}/concluidos?mes=..&ano=..
async function getRealizadosMes(terapeutaId, mes, ano, token) {
  const url = `${BASE_URL}/api/agendamentos/terapeutas/${terapeutaId}/concluidos`;
  
  // ADICIONADO: Envia o token no cabeçalho
  const { data } = await axios.get(url, { 
      params: { mes, ano },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  return Number(data) || 0;
}

// Calcula série de 12 meses do ano atual
async function getSerieAnual(terapeutaId, ano, token) {
  // ADICIONADO: Passa o token para a função
  const chamadas = Array.from({ length: 12 }, (_, i) => getRealizadosMes(terapeutaId, i + 1, ano, token));
  return Promise.all(chamadas); // [jan..dez]
}

// Atualiza números de KPI
function atualizarKPIs({ totalMes, mesAtual, anoAtual, totalAno }) {
  const elMes = document.getElementById('kpi-mes');
  const elMesLabel = document.getElementById('kpi-mes-label');
  const elAno = document.getElementById('kpi-ano');

  if (elMes) elMes.textContent = totalMes;
  if (elMesLabel) elMesLabel.textContent = `${nomeMes(mesAtual)} / ${anoAtual}`;
  if (elAno) elAno.textContent = totalAno;
}

// Render simples de barras em SVG (sem libs)
function renderGraficoMensalSVG(svgId, data) {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  // Dimensões (casam com viewBox no HTML)
  const W = 800, H = 360, padL = 48, padR = 16, padT = 16, padB = 40;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  // Limpa
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const max = Math.max(1, ...data);
  const n = data.length; // 12
  const gap = 8;
  const barW = (innerW - gap * (n - 1)) / n;

  // Eixos
  const mkLine = (x1, y1, x2, y2, stroke = '#2a3342', sw = 1) => {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', x1); l.setAttribute('y1', y1);
    l.setAttribute('x2', x2); l.setAttribute('y2', y2);
    l.setAttribute('stroke', stroke); l.setAttribute('stroke-width', sw);
    svg.appendChild(l);
  };
  mkLine(padL, padT, padL, padT + innerH);               // eixo Y
  mkLine(padL, padT + innerH, padL + innerW, padT + innerH); // eixo X

  // Grades horizontais (opcional)
  const linhas = 4;
  for (let i = 1; i <= linhas; i++) {
    const val = (max / (linhas + 0)) * i;
    const y = padT + innerH - (val / max) * (innerH - 8);
    mkLine(padL, y, padL + innerW, y, '#2a334277', 1);
  }

  // Barras + labels
  data.forEach((v, i) => {
    const h = (v / max) * (innerH - 8);
    const x = padL + i * (barW + gap);
    const y = padT + (innerH - h);

    // Barra
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barW);
    rect.setAttribute('height', h);
    rect.setAttribute('fill', '#2685BF'); // cor base do seu tema
    rect.setAttribute('rx', 4);
    svg.appendChild(rect);

    // Label do mês (eixo X)
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', x + barW / 2);
    t.setAttribute('y', padT + innerH + 16);
    t.setAttribute('font-size', '11');
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('fill', '#9aa6b2');
    t.textContent = mesesPt[i];
    svg.appendChild(t);

    // Valor no topo da barra
    const tv = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tv.setAttribute('x', x + barW / 2);
    tv.setAttribute('y', y - 6);
    tv.setAttribute('font-size', '11');
    tv.setAttribute('text-anchor', 'middle');
    tv.setAttribute('fill', '#9aa6b2');
    tv.textContent = v;
    svg.appendChild(tv);
  });
}

// Carrega tudo do dashboard
async function carregarDashboard() {
  // ADICIONADO: Pega o token
  const token = localStorage.getItem('mindeasy_token');
  if (!token) {
      alert("Você não está logado. Redirecionando para o login.");
      window.location.href = 'cadastro.html';
      return;
  }

  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;

  try {
    // ADICIONADO: Passa o token
    const totalMes = await getRealizadosMes(TERAPEUTA_ID, mesAtual, anoAtual, token);
    const serie = await getSerieAnual(TERAPEUTA_ID, anoAtual, token);
    const totalAno = serie.reduce((acc, v) => acc + Number(v || 0), 0);

    atualizarKPIs({ totalMes, mesAtual, anoAtual, totalAno });
    renderGraficoMensalSVG('chart-mensal', serie);
  
  } catch(err) {
      console.error('[Dashboard] Falha ao carregar:', err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          alert("Sua sessão expirou. Faça o login novamente.");
          window.location.href = 'cadastro.html';
      } else {
          alert('Falha ao carregar dados do dashboard.');
      }
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  // Garante que Axios está carregado no HTML antes deste script
  if (typeof axios === 'undefined') {
    console.error('Axios não encontrado. Inclua <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script> antes do dashboard.js.');
    return;
  }

  carregarDashboard();
});