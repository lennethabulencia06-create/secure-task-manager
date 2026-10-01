// DOM Element Selectors
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const loadSamplesBtn = document.getElementById('loadSamplesBtn');
const taskList = document.getElementById('taskList');
const taskMessage = document.getElementById('taskMessage');

const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

let taskCounter = 0;

/**
 * Recalculate and update summary counts based on the live DOM.
 */
function updateTaskCounts() {
  const allTasks = taskList.querySelectorAll('.task-item');
  const total = allTasks.length;
  let pending = 0;
  let completed = 0;

  allTasks.forEach((task) => {
    if (task.dataset.state === 'completed') {
      completed++;
    } else {
      pending++;
    }
  });

  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

/**
 * Creates and returns a single task item DOM element securely.
 */
function createTaskElement(taskText, taskId) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.taskId = taskId;
  li.dataset.state = 'pending';

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = taskText;

  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete-btn';
  completeBtn.textContent = 'Complete';

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit';

  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'Remove';

  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(removeBtn);

  return li;
}

/**
 * Adds a new task from the input field after validation.
 */
function addTask(taskText) {
  const trimmedText = taskText.trim();

  if (!trimmedText) {
    taskMessage.textContent = 'Task cannot be empty';
    return;
  }

  taskMessage.textContent = '';
  taskCounter++;
  const taskId = `task-${taskCounter}`;

  const newTask = createTaskElement(trimmedText, taskId);
  taskList.appendChild(newTask);

  taskInput.value = '';
  updateTaskCounts();
}

/**
 * Toggles completed status of a task item.
 */
function toggleTaskComplete(taskItem) {
  taskItem.classList.toggle('completed');
  const isCompleted = taskItem.classList.contains('completed');
  taskItem.dataset.state = isCompleted ? 'completed' : 'pending';
  updateTaskCounts();
}

/**
 * Replaces task text span with an input for editing.
 */
function beginTaskEdit(taskItem) {
  const taskSpan = taskItem.querySelector('.task-text');
  const editBtn = taskItem.querySelector('.edit-btn');

  if (!taskSpan) return;

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = taskSpan.textContent;

  taskItem.replaceChild(editInput, taskSpan);
  editBtn.textContent = 'Save';
}

/**
 * Saves task edit after validating text and replacing input with a span.
 */
function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector('.edit-input');
  const editBtn = taskItem.querySelector('.edit-btn');

  if (!editInput) return;

  const trimmedText = editInput.value.trim();

  if (!trimmedText) {
    taskMessage.textContent = 'Task cannot be empty';
    return;
  }

  taskMessage.textContent = '';

  const newSpan = document.createElement('span');
  newSpan.className = 'task-text';
  newSpan.textContent = trimmedText;

  taskItem.replaceChild(newSpan, editInput);
  editBtn.textContent = 'Edit';
}

/**
 * Removes a task item from the DOM.
 */
function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

/**
 * Delegated event handler for task list buttons.
 */
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest('.task-item');

  if (!taskItem) return;

  if (target.matches('.complete-btn')) {
    toggleTaskComplete(taskItem);
  } else if (target.matches('.edit-btn')) {
    if (target.textContent === 'Edit') {
      beginTaskEdit(taskItem);
    } else {
      saveTaskEdit(taskItem);
    }
  } else if (target.matches('.remove-btn')) {
    removeTask(taskItem);
  }
}

/**
 * Loads required sample tasks in a batch using DocumentFragment.
 */
function loadSampleTasks() {
  const sampleTasks = [
    'Review DOM selectors',
    'Practice createElement',
    'Study event delegation'
  ];

  const fragment = document.createDocumentFragment();

  sampleTasks.forEach((text) => {
    taskCounter++;
    const taskId = `task-${taskCounter}`;
    const taskElement = createTaskElement(text, taskId);
    fragment.appendChild(taskElement);
  });

  taskList.appendChild(fragment);
  taskMessage.textContent = '';
  updateTaskCounts();
}

// Event Listeners
addTaskBtn.addEventListener('click', () => addTask(taskInput.value));

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener('click', loadSampleTasks);

// Single Delegated Event Listener on #taskList
taskList.addEventListener('click', handleTaskListClick);

// Initial State Setup
updateTaskCounts();