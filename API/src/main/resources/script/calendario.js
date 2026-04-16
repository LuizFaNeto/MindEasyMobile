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
  const tasks = JSON.parse(localStorage.getItem("tasks")) || {};

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function openModal(dateKey) {
    modalContent.innerHTML = `
      <h3>Adicionar tarefa para ${dateKey}</h3>

      <input id="task-input" class="form-control mt-2" placeholder="Descrição da tarefa">

      <button id="add-task-btn" class="btn btn-primary mt-3 w-100">
        Adicionar
      </button>

      <hr>

      <h4>Tarefas</h4>
      <div id="task-list"></div>
    `;

    loadTaskList(dateKey);

    document.getElementById("add-task-btn").addEventListener("click", () => {
      const input = document.getElementById("task-input");
      const text = input.value.trim();
      if (!text) return;

      if (!tasks[dateKey]) tasks[dateKey] = [];
      tasks[dateKey].push(text);

      input.value = "";
      saveTasks();
      loadTaskList(dateKey);
      renderCalendar();
    });

    taskModal.style.display = "block";
  }

  function loadTaskList(dateKey) {
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    if (!tasks[dateKey] || tasks[dateKey].length === 0) {
      list.innerHTML = "<p class='text-muted'>Nenhuma tarefa.</p>";
      return;
    }

    tasks[dateKey].forEach((task, index) => {
      const card = document.createElement("div");
      card.classList.add("task-card");

      card.innerHTML = `
        <span>${task}</span>
        <button class="delete-task-btn">&times;</button>
      `;

      card.querySelector(".delete-task-btn").addEventListener("click", () => {
        tasks[dateKey].splice(index, 1);
        if (tasks[dateKey].length === 0) delete tasks[dateKey];
        saveTasks();
        loadTaskList(dateKey);
        renderCalendar();
      });

      list.appendChild(card);
    });
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

      if (tasks[dateKey]) {
        tasks[dateKey].forEach((t) => {
          const badge = document.createElement("span");
          badge.classList.add("task-badge");
          badge.textContent = "• " + t;
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
});
