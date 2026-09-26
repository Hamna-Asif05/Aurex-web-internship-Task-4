/* ==========================================================
   Task Ledger — Week 4 Project
   Only vanilla JavaScript, DOM, and localStorage are used.
   ========================================================== */

// ---------- Variables & constants (let / const) ----------
const STORAGE_KEY = "aurex_week4_tasks";
let tasks = [];              // array of task objects
let currentFilter = "all";   // "all" | "active" | "completed"

// ---------- DOM references ----------
const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const priorityInput = document.getElementById("task-priority");
const formError = document.getElementById("form-error");
const taskList = document.getElementById("task-list");
const filterGroup = document.getElementById("filter-group");
const taskCount = document.getElementById("task-count");
const emptyState = document.getElementById("empty-state");

// ---------- localStorage helpers (data persistence) ----------
function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  // Conditional logic: only parse if something was actually saved before
  if (stored) {
    try {
      tasks = JSON.parse(stored);
    } catch (err) {
      tasks = []; // fallback if the saved data was ever corrupted
    }
  } else {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---------- Function: create a new task object ----------
function createTask(title, priority) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: title,
    priority: priority,
    completed: false,
    createdAt: new Date().toISOString()
  };
}

// ---------- Form validation ----------
function validateTitle(rawTitle) {
  const trimmed = rawTitle.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: "Task can't be empty." };
  }
  if (trimmed.length > 120) {
    return { valid: false, message: "Keep it under 120 characters." };
  }
  return { valid: true, message: "" };
}

// ---------- Add task (form submit event) ----------
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const check = validateTitle(titleInput.value);

  if (!check.valid) {
    formError.textContent = check.message;
    titleInput.focus();
    return;
  }

  formError.textContent = "";
  const newTask = createTask(titleInput.value.trim(), priorityInput.value);

  tasks.push(newTask); // array method: add to end
  saveTasks();
  render();

  titleInput.value = "";
  titleInput.focus();
});

// ---------- Filter buttons (event delegation) ----------
filterGroup.addEventListener("click", function (event) {
  const clicked = event.target.closest(".filter-btn");
  if (!clicked) return;

  currentFilter = clicked.dataset.filter;

  // loop over every filter button to update the "active" style
  const allButtons = filterGroup.querySelectorAll(".filter-btn");
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].classList.toggle("active", allButtons[i] === clicked);
  }

  render();
});

// ---------- Task list actions (event delegation for edit/delete/complete) ----------
taskList.addEventListener("click", function (event) {
  const item = event.target.closest(".task-item");
  if (!item) return;
  const id = item.dataset.id;

  if (event.target.classList.contains("task-checkbox")) {
    toggleComplete(id);
  } else if (event.target.classList.contains("delete-btn")) {
    deleteTask(id);
  } else if (event.target.classList.contains("edit-btn")) {
    startEdit(id);
  } else if (event.target.classList.contains("save-btn")) {
    saveEdit(id);
  }
});

// ---------- Core task operations ----------
function toggleComplete(id) {
  // Array method: find matching task and flip its completed flag
  const task = tasks.find(function (t) { return t.id === id; });
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  // Array method: filter out the removed task, keep the rest
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  render();
}

function startEdit(id) {
  const titleEl = taskList.querySelector('.task-item[data-id="' + id + '"] .task-title');
  if (!titleEl) return;
  titleEl.setAttribute("contenteditable", "true");
  titleEl.focus();
  placeCursorAtEnd(titleEl);

  const item = titleEl.closest(".task-item");
  // swap the button role: turn Edit into Save for this item
  const btn = item.querySelector(".task-actions button:first-child");
  btn.classList.remove("edit-btn");
  btn.classList.add("save-btn");
  btn.textContent = "Save";
}

function saveEdit(id) {
  const item = taskList.querySelector('.task-item[data-id="' + id + '"]');
  const titleEl = item.querySelector(".task-title");
  const check = validateTitle(titleEl.textContent);

  if (!check.valid) {
    formError.textContent = check.message;
    return;
  }
  formError.textContent = "";

  const task = tasks.find(function (t) { return t.id === id; });
  if (task) {
    task.title = titleEl.textContent.trim();
    saveTasks();
  }
  render();
}

function placeCursorAtEnd(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

// ---------- Filtering logic ----------
function getVisibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter(function (t) { return !t.completed; });
  } else if (currentFilter === "completed") {
    return tasks.filter(function (t) { return t.completed; });
  }
  return tasks; // "all"
}

// ---------- Render: rebuild the DOM from the tasks array ----------
function render() {
  const visible = getVisibleTasks();
  taskList.innerHTML = "";

  // loop through visible tasks and build one list item per task
  for (let i = 0; i < visible.length; i++) {
    taskList.appendChild(buildTaskElement(visible[i]));
  }

  emptyState.style.display = tasks.length === 0 ? "block" : "none";

  const activeCount = tasks.filter(function (t) { return !t.completed; }).length;
  taskCount.textContent = activeCount + " of " + tasks.length + " tasks left";
}

function buildTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item priority-" + task.priority + (task.completed ? " completed" : "");
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.completed;

  const body = document.createElement("div");
  body.className = "task-body";

  const titleSpan = document.createElement("span");
  titleSpan.className = "task-title";
  titleSpan.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "task-meta";
  meta.textContent = capitalize(task.priority) + " priority";

  body.appendChild(titleSpan);
  body.appendChild(meta);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";
  editBtn.type = "button";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.type = "button";

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(body);
  li.appendChild(actions);

  return li;
}

// ---------- Small helper function ----------
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// ---------- Init ----------
loadTasks();
render();