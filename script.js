// Application state
let tasks = [];
let currentFilter = 'all';

// DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const filterBtns = document.querySelectorAll('.filter-btn');
const loadingSpinner = document.getElementById('loadingSpinner');

// BONUS: Load from localStorage on start
loadTasks();

// 1. Add Task (with loading)
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    
    showLoading();
    
    setTimeout(() => {
        tasks.push({ text, completed: false });
        taskInput.value = '';
        renderTasks();
        saveTasks();
    }, 1000); // 1-second loading
}

// 2. BONUS: Filter tasks
function getFilteredTasks() {
    if (currentFilter === 'pending') return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
}

// 3. BONUS: Update counter
function updateCounter() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    taskCounter.textContent = `${total} total tasks (${completed} completed)`;
}

// 4. Render with loading + filter + counter
function renderTasks() {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        const filteredTasks = getFilteredTasks();
        taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-state';
            emptyMessage.textContent = `No ${currentFilter} tasks`;
            taskList.appendChild(emptyMessage);
            updateCounter();
            return;
        }
        
        filteredTasks.forEach((task, index) => {
            // Map filtered index back to original
            const originalIndex = tasks.indexOf(task);
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.index = originalIndex;
            
            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <button class="delete-btn">Delete</button>
            `;
            taskList.appendChild(li);
        });
        
        updateCounter();
    }, 1000);
}

// 5. Show/Hide loading
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// 6. Event Delegation (unchanged + filter clicks)
taskList.addEventListener('click', function(event) {
    const taskItem = event.target.closest('.task-item');
    if (!taskItem) return;
    
    const index = parseInt(taskItem.dataset.index);
    
    if (event.target.classList.contains('task-text')) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
        saveTasks();
    }
    
    if (event.target.classList.contains('delete-btn')) {
        tasks.splice(index, 1);
        renderTasks();
        saveTasks();
    }
});

// BONUS: Filter button handlers
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        renderTasks();
    });
});

// Add task + Enter key
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
});

// BONUS: localStorage functions
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
        tasks = JSON.parse(saved);
        renderTasks();
    }
}

// Initial render
renderTasks();

// Reflection:
//    1. How does your application manage state?
//        - The app uses a single tasks array as the source of truth. Each task is an object with text and completed properties. State changes trigger renderTasks(), which rebuilds the entire UI from the array.
//    2. Why is renderTasks() necessary after updating the array?
//        - JavaScript arrays and the DOM are separate. Updating the array doesn't automatically update the UI. renderTasks() reads the current state and rebuilds DOM elements to reflect changes.
//    3. What is event delegation and why is it efficient?
//        - Event delegation attaches one listener to the parent <ul> instead of individual listeners on each task. It's efficient because:
//            - Better performance (fewer listeners)
//            - Works with dynamically added elements
//            - Less memory usage
//    4. What happens if you manipulate the DOM but not the state?
//        - The UI updates temporarily, but state is lost. Page refresh loses all changes. Future renders ignore DOM changes since they rebuild from state only.