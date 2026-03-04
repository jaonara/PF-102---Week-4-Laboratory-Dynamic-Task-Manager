// Application state
let tasks = [];

// DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// 1. Add Task Functionality
function addTask() {
    const text = taskInput.value.trim();
    
    if (text === '') return;
    
    // Add to state
    tasks.push({
        text: text,
        completed: false
    });
    
    // Clear input
    taskInput.value = '';
    
    // Re-render
    renderTasks();
}

// 2. Render Tasks Function (Clears and rebuilds entire list)
function renderTasks() {
    // Clear the list container
    taskList.innerHTML = '';
    
    // Check for empty state
    if (tasks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-state';
        emptyMessage.textContent = 'No tasks available';
        taskList.appendChild(emptyMessage);
        return;
    }
    
    // Loop through tasks and create elements
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.index = index;
        
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">Delete</button>
        `;
        
        taskList.appendChild(li);
    });
}

// 3. Event Delegation (Single listener on container)
taskList.addEventListener('click', function(event) {
    const taskItem = event.target.closest('.task-item');
    
    if (!taskItem) return;
    
    const index = parseInt(taskItem.dataset.index);
    
    // Check if task text was clicked (toggle complete)
    if (event.target.classList.contains('task-text')) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }
    
    // Check if delete button was clicked
    if (event.target.classList.contains('delete-btn')) {
        tasks.splice(index, 1);
        renderTasks();
    }
});

// 4. Add task button and Enter key support
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Initial render
renderTasks();

/* Reflection Answers

1. How does your application manage state?
    - The app uses a single tasks array as the source of truth. Each task is an object with text and completed properties. State changes trigger renderTasks(), which rebuilds the entire UI from the array.

2. Why is renderTasks() necessary after updating the array?
    - JavaScript arrays and the DOM are separate. Updating the array doesn't automatically update the UI. renderTasks() reads the current state and rebuilds DOM elements to reflect changes.

3. What is event delegation and why is it efficient?
    - Event delegation attaches one listener to the parent <ul> instead of individual listeners on each task. It's efficient because:
        - Better performance (fewer listeners)
        - Works with dynamically added elements
        - Less memory usage

4. What happens if you manipulate the DOM but not the state?
    - The UI updates temporarily, but state is lost. Page refresh loses all changes. Future renders ignore DOM changes since they rebuild from state only */ 