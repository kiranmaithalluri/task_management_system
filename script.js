let tasks = [];
let pendingCount = 0;
let completedCount = 0;
let currentFilter = "all"; // 'all', 'pending', 'completed'

// Handle Username Modal
document.addEventListener("DOMContentLoaded", () => {
  const usernameModal = document.getElementById("username-modal");
  const saveUsernameBtn = document.getElementById("save-username");
  const usernameInput = document.getElementById("username-input");

  // Show modal if username not set
  if (!localStorage.getItem("username")) {
    usernameModal.style.display = "flex";
  } else {
    const storedName = localStorage.getItem("username");
    document.getElementById("username").textContent = storedName;
  }

  saveUsernameBtn.addEventListener("click", () => {
    const userName = usernameInput.value.trim();
    if (userName === "") {
      alert("Name cannot be empty.");
      return;
    }
    document.getElementById("username").textContent = userName;
    localStorage.setItem("username", userName);
    usernameModal.style.display = "none";
    updateStats();
  });

  // Initialize theme based on preference
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }

  displayTasks();
  updateStats();
});

// Add Task
function addTask() {
  const taskInput = document.getElementById("task-input");
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Task cannot be empty.");
    return;
  }

  const task = {
    text: taskText,
    pending: true,
  };
  tasks.push(task);
  pendingCount++;
  taskInput.value = "";
  displayTasks();
  updateStats();
}

// Display Tasks based on current filter
function displayTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "pending") {
    filteredTasks = tasks.filter((task) => task.pending);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => !task.pending);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.toggle(
      "dark-mode",
      document.body.classList.contains("dark-mode")
    );

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !task.pending;
    checkbox.onclick = () => toggleTaskStatus(index);

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => editTask(index);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteTask(index);

    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);

    const taskStatus = document.createElement("span");
    taskStatus.textContent = task.pending ? "Pending" : "Completed";
    taskStatus.style.marginLeft = "10px";

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(taskActions);
    li.appendChild(taskStatus);
    taskList.appendChild(li);
  });
}

// Toggle Task Status
function toggleTaskStatus(index) {
  tasks[index].pending = !tasks[index].pending;
  if (tasks[index].pending) {
    pendingCount++;
    completedCount--;
  } else {
    pendingCount--;
    completedCount++;
  }
  displayTasks();
  updateStats();
}

// Edit Task
function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    displayTasks();
  }
}

// Delete Task
function deleteTask(index) {
  if (tasks[index].pending) {
    pendingCount--;
  } else {
    completedCount--;
  }
  tasks.splice(index, 1);
  displayTasks();
  updateStats();
}

// Update Task Statistics
function updateStats() {
  const totalTasks = tasks.length;
  const pendingPercentage =
    totalTasks === 0 ? 0 : (pendingCount / totalTasks) * 100;
  document.getElementById(
    "pending-tasks"
  ).textContent = `Pending Tasks: ${Math.round(pendingPercentage)}%`;
  document.getElementById(
    "pending-count"
  ).textContent = `Pending Works: ${pendingCount}`;
  document.getElementById(
    "completed-count"
  ).textContent = `Completed Works: ${completedCount}`;
}

// Toggle Theme
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".container").classList.toggle("dark-mode");
  document
    .querySelectorAll(".task-actions button")
    .forEach((btn) => btn.classList.toggle("dark-mode"));
  document.getElementById("theme-toggle").classList.toggle("dark-mode");
  document.getElementById("task-stats").classList.toggle("dark-mode");

  // Save theme preference
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  displayTasks(); // Re-render tasks to apply the theme style
}

// Filter Tasks
function filterTasks(filter) {
  currentFilter = filter;
  displayTasks();

  // Update active button styling
  document
    .querySelectorAll(".filter-buttons button")
    .forEach((btn) => btn.classList.remove("active"));
  if (filter === "all") {
    document.getElementById("show-all").classList.add("active");
  } else if (filter === "pending") {
    document.getElementById("show-pending").classList.add("active");
  } else if (filter === "completed") {
    document.getElementById("show-completed").classList.add("active");
  }
}
