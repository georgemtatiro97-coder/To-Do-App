const form = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector(".task-list");
const progress = document.querySelector("#progress");
const numbers = document.querySelector("#numbers");
const encouragement = document.querySelector(".details p");
const storageKey = "todo-app-tasks";

let tasks = loadTasks();

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = taskInput.value.trim();

     

    tasks.push({ id: crypto.randomUUID(), text, completed: false });
    taskInput.value = "";
    saveAndRender();
    taskInput.focus();
});

taskList.addEventListener("change", (event) => {
    if (!event.target.matches(".task-toggle")) return;

    const task = tasks.find(({ id }) => id === event.target.closest("li").dataset.id);
    if (task) {
        task.completed = event.target.checked;
        saveAndRender();
    }
});

taskList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-task");
    if (!deleteButton) return;

    tasks = tasks.filter(({ id }) => id !== deleteButton.closest("li").dataset.id);
    saveAndRender();
});

function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem(storageKey));
        return Array.isArray(savedTasks) ? savedTasks : [];
    } catch {
        return [];
    }
}

function saveAndRender() {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.replaceChildren();

    if (!tasks.length) {
        const emptyState = document.createElement("li");
        emptyState.className = "empty-state";
        emptyState.textContent = "No tasks yet. Add one to get started.";
        taskList.append(emptyState);
    } else {
        tasks.forEach((task) => taskList.append(createTaskElement(task)));
    }

    const completed = tasks.filter((task) => task.completed).length;
    const percentage = tasks.length ? (completed / tasks.length) * 100 : 0;
    progress.style.width = `${percentage}%`;
    numbers.textContent = `${completed} / ${tasks.length}`;
    encouragement.textContent = tasks.length && completed === tasks.length ? "All done!" : "Keep it up!";
}

function createTaskElement(task) {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;
    item.dataset.id = task.id;

    const toggle = document.createElement("input");
    toggle.className = "task-toggle";
    toggle.type = "checkbox";
    toggle.checked = task.completed;
    toggle.setAttribute("aria-label", `Mark ${task.text} as complete`);

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-task";
    deleteButton.type = "button";
    deleteButton.textContent = "x";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.title = "Delete task";

    item.append(toggle, text, deleteButton);
    return item;
}

renderTasks();
