document.addEventListener("DOMContentLoaded", () => {
  feather.replace();

  const calendarDaysGrid = document.getElementById("calendar-days-grid");
  const currentMonthYear = document.getElementById("current-month-year");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");

  const taskModal = document.getElementById("event-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const modalContent = document.getElementById("event-modal-content");

  const currentDate = new Date();
  
  // Agendamentos mapeados por data
  let appointmentsByDate = {};

  async function fetchAgendamentos() {
      const token = localStorage.getItem('mindeasy_token');
      const terapeutaId = localStorage.getItem('mindeasy_user_id');

      if (!token || !terapeutaId) {
          alert('Sessão inválida. Faça login novamente.');
          window.location.href = 'cadastro.html';
          return;
      }

      try {
          const response = await axios.get(`http://localhost:8080/api/agendamentos/terapeutas/${terapeutaId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          
          const agendamentos = response.data;
          appointmentsByDate = {}; // reseta
          
          agendamentos.forEach(app => {
              if (app.data) {
                  // data formato: "YYYY-MM-DD"
                  const [ano, mes, dia] = app.data.split('-');
                  // dateKey = "D/M/YYYY" para combinar com a lógica existente
                  const dateKey = `${parseInt(dia)}/${parseInt(mes)}/${ano}`;
                  
                  if (!appointmentsByDate[dateKey]) {
                      appointmentsByDate[dateKey] = [];
                  }
                  appointmentsByDate[dateKey].push(app);
              }
          });
          
          renderCalendar();
      } catch (error) {
          console.error("Erro ao buscar agendamentos", error);
      }
  }

  function openModal(dateKey) {
    const apps = appointmentsByDate[dateKey] || [];
    
    let html = `<h3>Consultas em ${dateKey}</h3>`;
    
    if (apps.length === 0) {
        html += `<p class='text-muted'>Nenhuma consulta para este dia.</p>`;
    } else {
        html += `<div id="task-list">`;
        apps.forEach(app => {
            let statusCor = "#64748B";
            if(app.status === 'AGENDADO') statusCor = '#3B82F6';
            if(app.status === 'REALIZADO') statusCor = '#10B981';
            if(app.status === 'CANCELADO') statusCor = '#EF4444';
            
            html += `
                <div class="task-card" style="border-left: 4px solid ${statusCor}; display: flex; flex-direction: column; align-items: flex-start; padding: 10px; margin-bottom: 10px;">
                    <strong>${app.horaInicio ? app.horaInicio.slice(0,5) : '--:--'} - Paciente: ${app.nomePaciente || 'Desconhecido'}</strong>
                    <span style="color: ${statusCor}; font-size: 12px; font-weight: bold; margin-top: 5px;">${app.status || 'INDETERMINADO'}</span>
                </div>
            `;
        });
        html += `</div>`;
    }

    modalContent.innerHTML = html;
    taskModal.style.display = "block";
  }

  closeModalBtn.onclick = () => {
    taskModal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === taskModal) taskModal.style.display = "none";
  };

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    currentMonthYear.textContent = currentDate.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = (firstDay + 6) % 7;
    const lastDay = new Date(year, month + 1, 0).getDate();

    calendarDaysGrid.innerHTML = "";

    // Espaços em branco
    for (let i = 0; i < adjustedFirstDay; i++) {
      const empty = document.createElement("div");
      empty.classList.add("empty");
      calendarDaysGrid.appendChild(empty);
    }

    // Dias do mês
    for (let day = 1; day <= lastDay; day++) {
      const dateKey = `${day}/${month + 1}/${year}`;
      const div = document.createElement("div");
      div.classList.add("calendar-day");

      div.innerHTML = `
        <span class="day-number">${day}</span>
        <div class="day-tasks"></div>
      `;

      const taskContainer = div.querySelector(".day-tasks");

      if (appointmentsByDate[dateKey]) {
        appointmentsByDate[dateKey].forEach((app) => {
          const badge = document.createElement("span");
          badge.classList.add("task-badge");
          badge.style.backgroundColor = app.status === 'AGENDADO' ? '#e0f2fe' : '#f1f5f9';
          badge.style.color = app.status === 'AGENDADO' ? '#0369a1' : '#475569';
          badge.textContent = `• ${app.horaInicio ? app.horaInicio.slice(0,5) : ''} - ${app.nomePaciente || 'Paciente'}`;
          taskContainer.appendChild(badge);
        });
      }

      div.addEventListener("click", () => openModal(dateKey));

      calendarDaysGrid.appendChild(div);
    }
  }

  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
  fetchAgendamentos(); // Busca os dados da API ao carregar
});
