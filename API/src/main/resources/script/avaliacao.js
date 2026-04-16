// Sidebar comportamento
const sidebar = document.querySelector('.sidebar');
const handle = document.getElementById('sidebar-handle');

handle.addEventListener('mouseenter', () => {
  sidebar.classList.add('shown');
});

sidebar.addEventListener('mouseleave', () => {
  sidebar.classList.remove('shown');
});

// Avaliação com estrelas + envio via Axios
const stars = document.querySelectorAll(".star");
const ratingValue = document.getElementById("ratingValue");
const btnAvaliar = document.getElementById("btnAvaliar");
const selectCliente = document.getElementById("selectCliente");
const mensagem = document.getElementById("mensagem");
const erro = document.getElementById("erro");
let rating = 0;

function highlightStars(count) {
  stars.forEach((s, i) => {
    if (i < count) s.classList.add("checked");
    else s.classList.remove("checked");
  });
}

stars.forEach(star => {
  star.addEventListener("click", () => {
    rating = parseInt(star.dataset.value);
    highlightStars(rating);
    ratingValue.textContent = `Nota: ${rating}/5`;
  });
});

btnAvaliar.addEventListener("click", async () => {
  const cliente = selectCliente.value;
  const comentario = document.getElementById("comentario").value;

  if (!cliente) return alert("Selecione um cliente.");
  if (rating === 0) return alert("Selecione uma nota.");

  const avaliacao = { cliente, nota: rating, comentario };

  try {
    const response = await axios.post("http://localhost:8080/avaliacoes", avaliacao, {
      headers: { "Content-Type": "application/json" }
    });

    console.log(response.data);
    mensagem.classList.remove("d-none");
    erro.classList.add("d-none");

    selectCliente.value = "";
    rating = 0;
    highlightStars(0);
    ratingValue.textContent = "Nota: 0/5";
    document.getElementById("comentario").value = "";

    setTimeout(() => mensagem.classList.add("d-none"), 3000);
  } catch (e) {
    console.error("Erro:", e);
    erro.classList.remove("d-none");
    mensagem.classList.add("d-none");
  }
});
