/**
 * Tasks Module
 * Handles the task management functionality
 */

const Tasks = (() => {
    // Private variables
    let tasks = [];
    let currentFilter = 'all';
    let currentEditingTaskId = null;

    // DOM Elements
    let taskInput;
    let addTaskButton;
    let taskList;
    let filterButtons;
    let taskModal;
    let editTaskNameInput;
    let editTaskPomodorosInput;
    let editTaskPrioritySelect;
    let editTaskNotesTextarea;
    let saveTaskButton;
    let deleteTaskButton;

    /**
     * Initialize the tasks module
     */
    function init() {
        // Get DOM elements
        taskInput = document.getElementById('task-input');
        addTaskButton = document.getElementById('add-task');
        taskList = document.getElementById('task-list');
        filterButtons = document.querySelectorAll('.filter-btn');
        taskModal = document.getElementById('task-modal');
        editTaskNameInput = document.getElementById('edit-task-name');
        editTaskPomodorosInput = document.getElementById('edit-task-pomodoros');
        editTaskPrioritySelect = document.getElementById('edit-task-priority');
        editTaskNotesTextarea = document.getElementById('edit-task-notes');
        saveTaskButton = document.getElementById('save-task');
        deleteTaskButton = document.getElementById('delete-task');

        // Set up event listeners
        addTaskButton.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentFilter = button.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                renderTasks();
            });
        });

        saveTaskButton.addEventListener('click', saveEditedTask);
        deleteTaskButton.addEventListener('click', deleteEditedTask);

        // Load tasks from storage
        loadTasks();

        // Initial render
        renderTasks();
    }

    /**
     * Load tasks from storage
     */
    function loadTasks() {
        const storedTasks = Storage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
    }

    /**
     * Save tasks to storage
     */
    function saveTasks() {
        Storage.setItem('tasks', JSON.stringify(tasks));

        // Update statistics
        Statistics.updateTaskStats(tasks);
    }

    /**
     * Add a new task
     */
    function addTask() {
        const taskName = taskInput.value.trim();
        if (taskName) {
            const newTask = {
                id: generateId(),
                name: taskName,
                completed: false,
                estimatedPomodoros: 1,
                completedPomodoros: 0,
                priority: 'medium',
                notes: '',
                createdAt: new Date().toISOString(),
                completedAt: null
            };

            tasks.unshift(newTask);
            saveTasks();
            renderTasks();

            // Clear input
            taskInput.value = '';
            taskInput.focus();
        }
    }

    /**
     * Delete a task
     * @param {string} taskId - ID of the task to delete
     */
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }

    /**
     * Toggle task completion
     * @param {string} taskId - ID of the task to toggle
     */
    function toggleTaskCompletion(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;

            // Set or clear completion timestamp
            if (tasks[taskIndex].completed) {
                tasks[taskIndex].completedAt = new Date().toISOString();

                // Check for achievements when a task is completed
                Achievements.checkAchievements();
            } else {
                tasks[taskIndex].completedAt = null;
            }

            saveTasks();
            renderTasks();
        }
    }

    /**
     * Increment completed pomodoros for a task
     * @param {string} taskId - ID of the task
     */
    function incrementTaskPomodoro(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1 && tasks[taskIndex].completedPomodoros < tasks[taskIndex].estimatedPomodoros) {
            tasks[taskIndex].completedPomodoros++;
            saveTasks();
            renderTasks();
        }
    }

    /**
     * Open the edit task modal
     * @param {string} taskId - ID of the task to edit
     */
    function openEditTaskModal(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            currentEditingTaskId = taskId;

            // Populate form fields
            editTaskNameInput.value = task.name;
            editTaskPomodorosInput.value = task.estimatedPomodoros;
            editTaskPrioritySelect.value = task.priority;
            editTaskNotesTextarea.value = task.notes;

            // Show modal
            taskModal.classList.remove('hidden');
        }
    }

    /**
     * Save the edited task
     */
    function saveEditedTask() {
        if (currentEditingTaskId) {
            const taskIndex = tasks.findIndex(task => task.id === currentEditingTaskId);
            if (taskIndex !== -1) {
                // Update task properties
                tasks[taskIndex].name = editTaskNameInput.value.trim();
                tasks[taskIndex].estimatedPomodoros = parseInt(editTaskPomodorosInput.value, 10);
                tasks[taskIndex].priority = editTaskPrioritySelect.value;
                tasks[taskIndex].notes = editTaskNotesTextarea.value.trim();

                // Ensure completedPomodoros doesn't exceed estimatedPomodoros
                if (tasks[taskIndex].completedPomodoros > tasks[taskIndex].estimatedPomodoros) {
                    tasks[taskIndex].completedPomodoros = tasks[taskIndex].estimatedPomodoros;
                }

                saveTasks();
                renderTasks();

                // Close modal
                taskModal.classList.add('hidden');
                currentEditingTaskId = null;
            }
        }
    }

    /**
     * Delete the currently edited task
     */
    function deleteEditedTask() {
        if (currentEditingTaskId) {
            deleteTask(currentEditingTaskId);

            // Close modal
            taskModal.classList.add('hidden');
            currentEditingTaskId = null;
        }
    }

    /**
     * Render tasks based on current filter
     */
    function renderTasks() {
        // Clear task list
        taskList.innerHTML = '';

        // Filter tasks
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        // Render tasks
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
            taskItem.setAttribute('data-priority', task.priority);

            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

            // Create task name
            const taskName = document.createElement('span');
            taskName.className = 'task-name';
            taskName.textContent = task.name;

            // Create pomodoro indicators
            const pomodoroIndicators = document.createElement('div');
            pomodoroIndicators.className = 'task-pomodoros';

            for (let i = 0; i < task.estimatedPomodoros; i++) {
                const indicator = document.createElement('span');
                indicator.className = `pomodoro-indicator ${i < task.completedPomodoros ? 'completed' : ''}`;
                pomodoroIndicators.appendChild(indicator);
            }

            // Create task actions
            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            // Add pomodoro button
            const addPomodoroBtn = document.createElement('button');
            addPomodoroBtn.innerHTML = '<i class="fas fa-plus-circle"></i>';
            addPomodoroBtn.title = 'Add completed pomodoro';
            addPomodoroBtn.addEventListener('click', () => incrementTaskPomodoro(task.id));
            addPomodoroBtn.disabled = task.completedPomodoros >= task.estimatedPomodoros;

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Edit task';
            editBtn.addEventListener('click', () => openEditTaskModal(task.id));

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Delete task';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            // Add buttons to actions
            taskActions.appendChild(addPomodoroBtn);
            taskActions.appendChild(editBtn);
            taskActions.appendChild(deleteBtn);

            // Add elements to task item
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskName);
            taskItem.appendChild(pomodoroIndicators);
            taskItem.appendChild(taskActions);

            // Add task item to list
            taskList.appendChild(taskItem);
        });

        // Show empty state if no tasks
        if (filteredTasks.length === 0) {
            const emptyState = document.createElement('li');
            emptyState.className = 'empty-state';
            emptyState.textContent = currentFilter === 'all' ?
                'No tasks yet. Add your first task!' :
                currentFilter === 'active' ?
                    'No active tasks. Great job!' :
                    'No completed tasks yet.';
            taskList.appendChild(emptyState);
        }
    }

    // Public API
    return {
        init,
        addTask,
        deleteTask,
        toggleTaskCompletion,
        incrementTaskPomodoro
    };
})();
