// DOM Elements
const timeDisplay = document.getElementById('clock');
const greetingDisplay = document.getElementById('greeting');

function updateTime() {
    const now = new Date();
    
    // 1. Get hours, minutes, seconds
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 2. Update the Clock HTML
    const timeDisplay = document.getElementById('clock'); // Make sure this matches your ID
    if (timeDisplay) {
        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // 3. FIX: Get the name from storage EVERY SECOND
    const storedName = localStorage.getItem('userName') || 'User';
    const greetingDisplay = document.getElementById('greeting');

    // 4. Update Greeting
    const currentHour = now.getHours();
    if (greetingDisplay) {
        if (currentHour < 12) {
            greetingDisplay.textContent = `Good Morning, ${storedName}.`;
        } else if (currentHour < 18) {
            greetingDisplay.textContent = `Good Afternoon, ${storedName}.`;
        } else {
            greetingDisplay.textContent = `Good Evening, ${storedName}.`;
        }
    }
}

// Run once immediately so we don't wait 1 second for the interval
updateTime();

// Update every 1000 milliseconds (1 second)
setInterval(updateTime, 1000);

/* --- UPGRADED TASK MANAGER (Kanban) --- */

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list'); // Home Widget List
const taskCount = document.getElementById('task-count');

// Kanban Columns
const listTodo = document.getElementById('list-todo');
const listDoing = document.getElementById('list-doing');
const listDone = document.getElementById('list-done');

// 1. Load Tasks (Support for old version + new version)
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

// 2. MIGRATION: Convert old "completed: true" tasks to "status: done"
// This prevents your old tasks from breaking
tasks = tasks.map(t => {
    if (!t.status) {
        return { text: t.text, status: t.completed ? 'done' : 'todo' };
    }
    return t;
});

// 3. Render BOTH views (Home Widget & Kanban Board)
function renderTasks() {
    // A. Clear all lists
    todoList.innerHTML = '';
    listTodo.innerHTML = '';
    listDoing.innerHTML = '';
    listDone.innerHTML = '';

    let activeCount = 0;

    tasks.forEach((task, index) => {
        // --- LOGIC FOR HOME WIDGET (Only shows To-Do) ---
        if (task.status === 'todo') {
            activeCount++;
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.innerHTML = `
                <span onclick="moveTask(${index}, 'doing')">${task.text}</span>
                <button class="delete-btn" onclick="deleteTask(${index})">X</button>
            `;
            todoList.appendChild(li);
        }

        // --- LOGIC FOR KANBAN BOARD (Shows All) ---
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.textContent = task.text;
        
        // Click to cycle status: ToDo -> Doing -> Done -> Delete
        if (task.status === 'todo') {
            card.onclick = () => moveTask(index, 'doing');
            listTodo.appendChild(card);
        } else if (task.status === 'doing') {
            card.onclick = () => moveTask(index, 'done');
            listDoing.appendChild(card);
        } else if (task.status === 'done') {
            card.style.opacity = "0.5";
            card.style.textDecoration = "line-through";
            card.onclick = () => deleteTask(index); // Clicking 'Done' deletes it
            listDone.appendChild(card);
        }
    });

    taskCount.textContent = `${activeCount} remaining`;
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function addTask() {
    const text = todoInput.value.trim();
    if (text === '') return;

    // New tasks always start in 'todo'
    tasks.push({ text: text, status: 'todo' });
    todoInput.value = ''; 
    renderTasks();
}

// Function to move task to a new column
window.moveTask = function(index, newStatus) {
    tasks[index].status = newStatus;
    renderTasks();
}

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    renderTasks();
}

addBtn.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') addTask() });

// Initial Render
renderTasks();
/* --- Weather Logic --- */

const tempDisplay = document.getElementById('temperature');
const windDisplay = document.getElementById('wind-speed');
const humidityDisplay = document.getElementById('humidity');
const cityDisplay = document.getElementById('city-name');

// 1. Configuration (Coordinates for New York City)
// We will change these to YOUR city later
const LAT = 40.71; 
const LON = -74.00;

async function fetchWeather() {
    try {
        // 2. The Waiter runs to the kitchen
        // We ask for: temperature, windspeed, and humidity
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${23.02}&longitude=${72.57}&current_weather=true&hourly=relativehumidity_2m`
        );
        
        const data = await response.json(); // Waiter brings the food (data)
        
        console.log("Weather Data:", data); // Check your Console (F12) to see raw data

        // 3. Update the UI
        const current = data.current_weather;
        tempDisplay.textContent = `${current.temperature}°C`;
        windDisplay.textContent = current.windspeed;
        
        // Note: Open-Meteo gives humidity in a list, we take the first one for now
        // or a default value if unavailable, to keep it simple
        humidityDisplay.textContent = "N/A"; 
        
        cityDisplay.textContent = "Ahmedabad (Approx)";

    } catch (error) {
        console.error("Error fetching weather:", error);
        cityDisplay.textContent = "Error loading";
    }
}

// Fetch on load
fetchWeather();

// Refresh weather every 1 hour (3600000 milliseconds)
setInterval(fetchWeather, 3600000);

/* --- Quick Notes Logic --- */

const noteArea = document.getElementById('quick-note');

// 1. Load saved note from LocalStorage
// If there is no saved note, use an empty string ''
noteArea.value = localStorage.getItem('myNote') || '';

// 2. Auto-Save function
// The 'input' event triggers every time you type or delete a character
noteArea.addEventListener('input', function() {
    localStorage.setItem('myNote', noteArea.value);
});

/* --- Focus Mode Logic --- */

const focusBtn = document.getElementById('focus-toggle');

focusBtn.addEventListener('click', function() {
    // This toggles the class 'focus-active' on the <body> tag
    document.body.classList.toggle('focus-active');
    
    // Optional: Change button text
    if (document.body.classList.contains('focus-active')) {
        focusBtn.textContent = "Exit Focus";
    } else {
        focusBtn.textContent = "👁️ Focus Mode";
    }
});

/* --- UPGRADED WALLPAPER ENGINE --- */

const defaultWallpapers = [
    "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?q=80&w=2022&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1731795316416-cebed208d2ae?q=80&w=2022&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1668119065964-8e78fddc5dfe?q=80&w=2022&auto=format&fit=crop",
    "https://4kwallpapers.com/images/walls/thumbs_2t/24356.jpg?q=80&w=2022&auto=format&fit=crop",
    "https://4kwallpapers.com/images/walls/thumbs_3t/23645.jpg?q=80&w=2022&auto=format&fit=crop",
    "https://4kwallpapers.com/images/walls/thumbs_2t/22988.jpg?q=80&w=2022&auto=format&fit=crop",
    "https://i.pinimg.com/736x/3d/01/7f/3d017f4f7d517ee17018d81515b28b7f.jpg?q=80&w=2022&auto=format&fit=crop",
    "https://i.pinimg.com/1200x/86/bd/56/86bd56a02666e9623bb02a212da98314.jpg?q=80&w=2022&auto=format&fit=crop",
    "https://i.pinimg.com/736x/02/bc/09/02bc09693795d1046eb906cd1a7e49e7.jpg?q=80&w=2022&auto=format&fit=crop",
    "https://i.pinimg.com/736x/ad/3f/2d/ad3f2d3c72246d29e4ed31f33dad2c2d.jpg?q=80&w=2022&auto=format&fit=crop",
    "https://i.pinimg.com/1200x/11/7f/41/117f415875b35318a250ddf801c319b8.jpg?q=80&w=2022&auto=format&fit=crop",
    "https://i.pinimg.com/736x/b8/15/8c/b8158c4edd9a5146c791779cb6596785.jpg?q=80&w=2022&auto=format&fit=crop",
    "https://i.pinimg.com/1200x/5f/4c/ac/5f4cac2628d96fa8fee93565245ee41d.jpg?q=80&w=2022&auto=format&fit=crop",
    "https://i.pinimg.com/1200x/05/c7/21/05c721269ec50303a652364eac0c6e30.jpg?q=80&w=2022&auto=format&fit=crop",
];

function setWallpaper() {
    // Check if user has a custom saved wallpaper
    const customBG = localStorage.getItem('customBG');
    const targetLayer = document.getElementById('wallpaper-layer'); 
    
    // Safety check: if we haven't made the layer yet, fallback to body
    const elementToStyle = targetLayer || document.body;

    if (customBG) {
        elementToStyle.style.backgroundImage = `url('${customBG}')`;
        const bgInput = document.getElementById('bg-input');
        if(bgInput) bgInput.value = customBG;
    } else {
        const randomIndex = Math.floor(Math.random() * defaultWallpapers.length);
        elementToStyle.style.backgroundImage = `url('${defaultWallpapers[randomIndex]}')`;
    }
}

// 2. The Silent Save Function (Only one version!)
function saveWallpaper() {
    const bgInput = document.getElementById('bg-input');
    const url = bgInput.value.trim();
    
    if (url) {
        localStorage.setItem('customBG', url);
        setWallpaper(); // Update immediately
        
        // Visual Feedback (Silent)
        const btn = document.querySelector('#bg-input + button');
        if(btn) {
            btn.textContent = "Saved!";
            setTimeout(() => {
                btn.textContent = "Set Background";
            }, 1500);
        }
    }
}

// 3. THE MISSING RESET FUNCTION
function resetWallpaper() {
    // 1. Clear the saved custom setting
    localStorage.removeItem('customBG');
    
    // 2. Clear the input box so it looks empty
    const bgInput = document.getElementById('bg-input');
    if(bgInput) bgInput.value = '';
    
    // 3. Reroll the random wallpaper immediately
    setWallpaper();
    
    // (No alert needed, it just happens visually)
}

// Run on load
setWallpaper();

/* --- View Switcher Logic --- */

function switchView(viewName) {
    // 1. Hide all views
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.add('hidden');
    });

    // 2. Show the selected view
    document.getElementById(`view-${viewName}`).classList.remove('hidden');

    // 3. Update Sidebar "Active" State
    // (This finds the list item you clicked and highlights it)
    const navItems = document.querySelectorAll('.sidebar li');
    navItems.forEach(item => {
        // If the text matches the view name (Home == home), make it active
        if (item.textContent.toLowerCase() === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/* --- Settings Logic --- */

const nameInput = document.getElementById('name-input');
const greetingElement = document.getElementById('greeting');

// 1. Load Name on Startup
const savedName = localStorage.getItem('userName') || 'User';
nameInput.value = savedName; // Fill the input box
// We also need to update the greeting function to use this saved name
// (We will fix the updateTime function in a second)

// 2. Save Name Function
function saveName() {
    const nameInput = document.getElementById('name-input');
    const newName = nameInput.value.trim();
    
    if (newName) {
        // 1. Save to memory
        localStorage.setItem('userName', newName);
        
        // 2. Refresh the clock immediately so you see the new name
        updateTime(); 
        
        // 3. The "Silent" Visual Trick
        // This line finds the <button> right next to the input box
        const btn = document.querySelector('#name-input + button');
        
        if(btn) {
            const originalText = btn.textContent; // Remember "Save"
            btn.textContent = "Saved!";           // Change to "Saved!"
            
            // Wait 1.5 seconds (1500ms), then change it back
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1500);
        }
    }
}

// 3. Factory Reset Function
function resetSystem() {
    // We removed the 'if (confirm...)' check.
    // Now it just deletes and reloads instantly.
    localStorage.clear();
    location.reload(); 
}
/* --- NEXUS LOCAL (OFFLINE MODE) --- */

const chatWindow = document.getElementById('chat-window');
const aiInput = document.getElementById('ai-input');
const chatMessages = document.getElementById('chat-messages');

// No API Key needed! 🚫🔑

function toggleChat() {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
        aiInput.focus();
    }
}

function sendMessage() {
    const text = aiInput.value.trim();
    if (text === "") return;

    // 1. Show User Message
    addMessage(text, 'user-msg');
    aiInput.value = '';

    // 2. Process Locally (Instant)
    setTimeout(() => {
        processLocalLogic(text);
    }, 200); // Tiny delay to feel natural
}

function addMessage(text, className) {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- THE LOCAL BRAIN ---
function processLocalLogic(input) {
    const lowerInput = input.toLowerCase();

    // --- COMMANDS ---
    if (lowerInput.startsWith('/task ')) {
        const taskText = input.substring(6);
        tasks.push({ text: taskText, status: 'todo' });
        renderTasks();
        addMessage(`✅ System: Added task <b>"${taskText}"</b>`, 'bot-msg');
    } 
    else if (lowerInput.startsWith('/note ')) {
        const noteText = input.substring(6);
        const notePad = document.getElementById('quick-note');
        notePad.value += (notePad.value ? "\n" : "") + "- " + noteText;
        localStorage.setItem('quickNote', notePad.value); 
        addMessage(`📝 System: Note saved to Quick Notes.`, 'bot-msg');
    }
    else if (lowerInput === '/clear') {
        chatMessages.innerHTML = '';
        addMessage('Console cleared.', 'bot-msg');
    }
    
    // --- CHAT RESPONSES ---
    else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        addMessage(`Greetings. Systems are online. Type <b>/help</b> for commands.`, 'bot-msg');
    }
    else if (lowerInput.includes('time')) {
        const now = new Date().toLocaleTimeString();
        addMessage(`Current System Time: <b>${now}</b>`, 'bot-msg');
    }
    else if (lowerInput.includes('date')) {
        const today = new Date().toLocaleDateString();
        addMessage(`Current Date: <b>${today}</b>`, 'bot-msg');
    }
    else if (lowerInput.includes('help') || lowerInput.includes('commands')) {
        addMessage(`
            <b>Available Commands:</b><br>
            • <b>/task [name]</b> - Add to To-Do<br>
            • <b>/note [text]</b> - Add to Notes<br>
            • <b>/clear</b> - Clear chat history<br>
            • <b>time</b> - Show clock
        `, 'bot-msg');
    }
    else if (lowerInput.includes('who are you')) {
        addMessage(`I am Nexus, your local dashboard controller. I operate offline.`, 'bot-msg');
    }
    else {
        addMessage(`Unknown command. Type <b>/help</b> to see what I can do.`, 'bot-msg');
    }
}

// Enter key support
aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
