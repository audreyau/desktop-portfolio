// ========================================
// Desktop Portfolio - Main JavaScript
// ========================================
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/desktop-portfolio/',
})

// State management
const state = {
  windows: {},
  activeWindow: null,
  zIndex: 100,
  dragOffset: { x: 0, y: 0 }, 
  isDragging: false,
  currentDragWindow: null,
  idleTimer: null,
};

// Project data - customize this with your own projects!
const projectsData = {
  project1: {
    name: "Lavender",
    icon: "💤",
    description: "A full-stack web application that revolutionizes how users interact with data. Built with modern technologies and best practices, featuring real-time updates, responsive design, and seamless user experience.",
    features: [
      "Real-time data synchronization",
      "Responsive design for all devices",
      "User authentication & authorization",
      "RESTful API integration",
      "Dark/Light mode support"
    ],
    tech: ["React", "Node.js", "MongoDB", "Socket.io", "Tailwind CSS"],
    // Replace with your actual YouTube video ID (the part after v= in the URL)
    youtubeId: "MoNmyTLVFZQ",
    // githubUrl: "https://github.com/yourusername/project-one",
    liveUrl: "https://lavender-sleep.web.app/"
  },
  project2: {
    name: "Project Two",
    icon: "📱",
    description: "A cross-platform mobile application designed to simplify everyday tasks. Features offline-first architecture, push notifications, and seamless cloud sync across all your devices.",
    features: [
      "Cross-platform (iOS & Android)",
      "Offline-first architecture",
      "Push notifications",
      "Cloud sync with Firebase",
      "Biometric authentication"
    ],
    tech: ["React Native", "Firebase", "Redux", "Expo", "TypeScript"],
    youtubeId: "dQw4w9WgXcQ",
    githubUrl: "https://github.com/yourusername/project-two",
    liveUrl: "" // Empty = no live demo
  },
  project3: {
    name: "Project Three",
    icon: "🎮",
    description: "An engaging browser-based game built entirely with vanilla JavaScript and HTML5 Canvas. Features smooth animations, particle effects, and progressive difficulty that keeps players coming back.",
    features: [
      "Smooth 60fps animations",
      "Particle effect system",
      "Local high score storage",
      "Touch & keyboard controls",
      "Progressive difficulty"
    ],
    tech: ["JavaScript", "HTML5 Canvas", "CSS3", "Web Audio API"],
    youtubeId: "dQw4w9WgXcQ",
    githubUrl: "https://github.com/yourusername/project-three",
    liveUrl: "https://project-three-game.netlify.app"
  },
  project4: {
    name: "Project Four",
    icon: "🤖",
    description: "An AI-powered productivity tool that uses machine learning to help users optimize their workflow. Analyzes patterns in your work habits and provides actionable insights.",
    features: [
      "ML-powered insights",
      "Natural language processing",
      "Custom dashboard & reports",
      "API for integrations",
      "Privacy-focused design"
    ],
    tech: ["Python", "TensorFlow", "FastAPI", "PostgreSQL", "Docker"],
    youtubeId: "dQw4w9WgXcQ",
    githubUrl: "https://github.com/yourusername/project-four",
    liveUrl: ""
  }
};

// Initialize the desktop
document.addEventListener('DOMContentLoaded', () => {
  // Initialize lock screen first
  initializeLockScreen();
  
  // Initialize desktop components
  initializeIcons();
  initializeWindows();
  initializeTaskbar();
  initializeTerminal();
  initializeProjectCards();
  initializeWallpaperSettings();
  initializeFinder();
  loadSavedPfp();
  loadSavedWallpaper();
  updateClock();
  setInterval(updateClock, 1000);
  
  // Handle window resize / orientation change
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Re-position open windows for new screen size
      Object.keys(state.windows).forEach(windowId => {
        const windowState = state.windows[windowId];
        if (windowState && windowState.element.style.display !== 'none') {
          positionWindow(windowState.element, windowId);
        }
      });
    }, 250);
  });
});

// ========================================
// Finder / File Browser
// ========================================

function initializeFinder() {
  const finderWindow = document.getElementById('window-finder');
  if (!finderWindow) return;
  
  // Handle file downloads
  const fileItems = finderWindow.querySelectorAll('.file-item[data-file]');
  fileItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const fileType = item.dataset.file;
      handleFileDownload(fileType);
    });
  });
  
  // Handle sidebar navigation (visual only for now)
  const sidebarItems = finderWindow.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function handleFileDownload(fileType) {
  // Configure your actual file URLs here
  const files = {
    'resume': {
      name: 'Resume.pdf',
      // Replace with your actual resume URL or path
      url: './assets/audrey-resume.pdf', 
      message: 'Resume download started!'
    },
    'portfolio': {
      name: 'Portfolio.zip',
      url: '#',
      message: 'Portfolio download started!'
    },
    'cover-letter': {
      name: 'CoverLetter.pdf',
      url: '#',
      message: 'Cover letter download started!'
    },
    'references': {
      name: 'References.pdf',
      url: '#',
      message: 'References download started!'
    }
  };
  
  const file = files[fileType];
  if (file) {
    if (file.url === '#') {
      // Show a friendly message if no real file is configured
      alert(`📁 ${file.name}\n\nTo enable downloads, add your file URLs in the handleFileDownload function in main.js`);
    } else {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

// ========================================
// Lock Screen
// ========================================

function initializeLockScreen() {
  const lockScreen = document.getElementById('lock-screen');
  const lockTime = document.getElementById('lock-time');
  const lockDate = document.getElementById('lock-date');
  
  // Update lock screen time
  function updateLockTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    lockTime.textContent = `${hours}:${minutes}`;

    // const hour12 = hours % 12 || 12;

    // const amPm = hours >= 12 ? 'PM' : 'AM'; 
    // lockTime.textContent = `${hour12}:${minutes}`;

    // lockTime.textContent = `${hour12}:${minutes} ${amPm}`;
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    }
    lockDate.textContent = now.toLocaleDateString('en-US', options)
  }
  
  updateLockTime();
  setInterval(updateLockTime, 1000);
  
  // Click to dismiss lock screen
  lockScreen.addEventListener('click', () => {
    unlockScreen();
  });
  
  // Also allow pressing any key to unlock
  document.addEventListener('keydown', (e) => {
    if (!lockScreen.classList.contains('hidden')) {
      unlockScreen();
    }
  });
}

function unlockScreen() {
  const lockScreen = document.getElementById('lock-screen');
  lockScreen.classList.add('hidden');
  
  // Open About window after unlock
  // setTimeout(() => openWindow('about'), 600);
  
  // // Remove lock screen from DOM after animation
  // setTimeout(() => {
  //   lockScreen.style.display = 'none';
  // }, 500);
}

function lockScreen() {
  const lockScreen = document.getElementById('lock-screen');
  
  // Close all windows first
  Object.keys(state.windows).forEach(windowId => {
    closeWindow(windowId);
  });
  
  // Show lock screen
  lockScreen.style.display = 'flex';
  
  // Small delay to allow display change, then remove hidden class
  setTimeout(() => {
    lockScreen.classList.remove('hidden');
  }, 10);
}

// ========================================
// Icon Handling & Dragging
// ========================================

// Icon drag state
const iconDragState = {
  isDragging: false,
  currentIcon: null,
  startX: 0,
  startY: 0,
  iconStartX: 0,
  iconStartY: 0,
  hasMoved: false
};

function isMobile() {
  return window.innerWidth <= 480;
}

function initializeIcons() {
  const icons = document.querySelectorAll('.icon');
  const desktop = document.getElementById('desktop');
  
  // Load saved positions (only on desktop)
  if (!isMobile()) {
    loadIconPositions();
  }
  
  icons.forEach(icon => {
    // Single click for mobile, double-click for desktop
    icon.addEventListener('click', (e) => {
      if (isMobile()) {
        e.preventDefault();
        const windowId = icon.dataset.window;
        openWindow(windowId);
      }
    });
    
    // Double-click to open (more reliable when dragging is enabled on desktop)
    icon.addEventListener('dblclick', (e) => {
      if (!isMobile()) {
        e.preventDefault();
        const windowId = icon.dataset.window;
        openWindow(windowId);
      }
    });
    
    // Mouse down - start potential drag (desktop only)
    icon.addEventListener('mousedown', (e) => {
      if (isMobile()) return; // No drag on mobile
      if (e.button !== 0) return; // Only left click
      
      iconDragState.isDragging = true;
      iconDragState.currentIcon = icon;
      iconDragState.startX = e.clientX;
      iconDragState.startY = e.clientY;
      iconDragState.hasMoved = false;
      
      // Get current position
      const rect = icon.getBoundingClientRect();
      const desktopRect = desktop.getBoundingClientRect();
      iconDragState.iconStartX = rect.left - desktopRect.left;
      iconDragState.iconStartY = rect.top - desktopRect.top;
      
      icon.classList.add('dragging');
      e.preventDefault();
    });
  });
  
  // Global mouse move for icon dragging
  document.addEventListener('mousemove', handleIconDrag);
  
  // Global mouse up
  document.addEventListener('mouseup', (e) => {
    if (iconDragState.isDragging && iconDragState.currentIcon) {
      const icon = iconDragState.currentIcon;
      icon.classList.remove('dragging');
      
      // If barely moved, treat as click (desktop behavior)
      if (!iconDragState.hasMoved && !isMobile()) {
        const windowId = icon.dataset.window;
        openWindow(windowId);
      } else if (iconDragState.hasMoved) {
        // Save positions after drag
        saveIconPositions();
      }
    }
    
    iconDragState.isDragging = false;
    iconDragState.currentIcon = null;
    iconDragState.hasMoved = false;
  });
}

function handleIconDrag(e) {
  if (!iconDragState.isDragging || !iconDragState.currentIcon) return;
  
  const icon = iconDragState.currentIcon;
  const desktop = document.getElementById('desktop');
  const desktopRect = desktop.getBoundingClientRect();
  
  // Calculate movement
  const deltaX = e.clientX - iconDragState.startX;
  const deltaY = e.clientY - iconDragState.startY;
  
  // Check if moved enough to count as drag (5px threshold)
  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
    iconDragState.hasMoved = true;
  }
  
  if (!iconDragState.hasMoved) return;
  
  // Calculate new position
  let newX = iconDragState.iconStartX + deltaX;
  let newY = iconDragState.iconStartY + deltaY;
  
  // Constrain to desktop bounds
  const iconWidth = icon.offsetWidth;
  const iconHeight = icon.offsetHeight;
  const maxX = desktopRect.width - iconWidth - 10;
  const maxY = desktopRect.height - iconHeight - 80; // Leave room for dock
  
  newX = Math.max(10, Math.min(newX, maxX));
  newY = Math.max(10, Math.min(newY, maxY));
  
  // Apply position
  icon.style.left = newX + 'px';
  icon.style.top = newY + 'px';
}

function saveIconPositions() {
  const icons = document.querySelectorAll('.icon');
  const positions = {};
  
  icons.forEach(icon => {
    const windowId = icon.dataset.window;
    if (windowId && icon.style.left && icon.style.top) {
      positions[windowId] = {
        left: icon.style.left,
        top: icon.style.top
      };
    }
  });
  
  localStorage.setItem('iconPositions', JSON.stringify(positions));
}

function loadIconPositions() {
  const saved = localStorage.getItem('iconPositions');
  if (!saved) return;
  
  try {
    const positions = JSON.parse(saved);
    const icons = document.querySelectorAll('.icon');
    
    icons.forEach(icon => {
      const windowId = icon.dataset.window;
      if (windowId && positions[windowId]) {
        icon.style.left = positions[windowId].left;
        icon.style.top = positions[windowId].top;
      }
    });
  } catch (e) {
    console.warn('Failed to load icon positions');
  }
}

function resetIconPositions() {
  localStorage.removeItem('iconPositions');
  const icons = document.querySelectorAll('.icon');
  icons.forEach(icon => {
    icon.style.left = '';
    icon.style.top = '';
  });
}

// ========================================
// Project Cards
// ========================================

function initializeProjectCards() {
  const projectCards = document.querySelectorAll('.project-card[data-project]');

  projectCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const projectId = card.dataset.project;
      openProjectDetail(projectId);
    });
  });
}

function openProjectDetail(projectId) {
  const project = projectsData[projectId];
  if (!project) return;

  const windowId = `project-${projectId}`;

  // Check if this project window already exists
  if (state.windows[windowId]) {
    // Just focus the existing window
    openWindow(windowId);
    return;
  }

  // Create a new window for this project
  const windowHtml = `
    <div class="window window-large" id="window-${windowId}" style="display: none;">
      <div class="window-header">
        <div class="window-controls">
          <button class="window-btn close" data-action="close"></button>
          <button class="window-btn minimize" data-action="minimize"></button>
          <button class="window-btn maximize" data-action="maximize"></button>
        </div>
        <span class="window-title">${project.icon} ${project.name}</span>
      </div>
      <div class="window-content">
        <div class="project-detail-content">
          <div class="project-detail-video" id="${windowId}-video">
            <iframe 
              src="${project.youtubeId ? `https://www.youtube.com/embed/${project.youtubeId}` : ''}" 
              title="Project Demo"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
          <div class="project-detail-info">
            <button class="video-toggle" id="${windowId}-toggle-button" onclick="toggleProjectVideo('${windowId}')">
              ◀ Hide Video
            </button>

            <h2>${project.name}</h2>
            <p class="project-detail-desc">${project.description}</p>
            
            <div class="project-detail-section">
              <h3>✨ Key Features</h3>
              <ul>
                ${project.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>
            
            <div class="project-detail-section">
              <h3>🛠️ Tech Stack</h3>
              <div class="project-detail-tags">
                ${project.tech.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>
            
            <div class="project-detail-links">
              <a href="${project.githubUrl || '#'}" target="_blank" class="detail-link github-link ${!project.githubUrl ? 'disabled' : ''}">
                <span>🐙</span> View on GitHub
              </a>
              <a href="${project.liveUrl || '#'}" target="_blank" class="detail-link live-link ${!project.liveUrl ? 'disabled' : ''}" style="${!project.liveUrl ? 'display:none' : ''}">
                <span>🚀</span> Live Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add window to container
  const container = document.getElementById('windows-container');
  container.insertAdjacentHTML('beforeend', windowHtml);

  const win = document.getElementById(`window-${windowId}`);

  // Calculate position (cascade from other open windows)
  const openCount = Object.values(state.windows).filter(w => w.element.style.display !== 'none').length;
  const offsetX = 50 + (openCount * 30);
  const offsetY = 50 + (openCount * 30);

  // Position the window
  win.style.top = offsetY + 'px';
  win.style.left = (160 + offsetX) + 'px';
  win.style.width = '800px';
  win.style.height = '500px';

  // Initialize window state
  state.windows[windowId] = {
    element: win,
    isMinimized: false,
    isMaximized: false,
    prevPosition: null,
    prevSize: null
  };

  // Set up window controls
  const controls = win.querySelectorAll('.window-btn');
  controls.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.dataset.action;
      handleWindowAction(windowId, action);
    });
  });

  // Make window draggable
  const header = win.querySelector('.window-header');
  header.addEventListener('mousedown', (e) => startDrag(e, win));

  // Focus window on click
  win.addEventListener('mousedown', () => focusWindow(windowId));

  // Open the window
  openWindow(windowId);
}

// Toggle video for dynamic project windows
function toggleProjectVideo(windowId) {
  const videoContainer = document.getElementById(`${windowId}-video`);
  const toggleButton = document.getElementById(`${windowId}-toggle-button`);

  if (!videoContainer || !toggleButton) return;

  const isHidden = videoContainer.style.display === 'none';

  if (isHidden) {
    videoContainer.style.display = 'block';
    toggleButton.textContent = '◀ Hide Video';
  } else {
    videoContainer.style.display = 'none';
    toggleButton.textContent = '▶ Show Video';
  }
}

window.toggleProjectVideo = toggleProjectVideo;

// ========================================
// Window Management
// ========================================

function initializeWindows() {
  const windows = document.querySelectorAll('.window');
  
  windows.forEach(win => {
    const windowId = win.id.replace('window-', '');
    
    // Initialize window state
    state.windows[windowId] = {
      element: win,
      isMinimized: false,
      isMaximized: false,
      prevPosition: null,
      prevSize: null
    };
    
    // Set initial position
    positionWindow(win, windowId);
    
    // Make window draggable
    const header = win.querySelector('.window-header');
    header.addEventListener('mousedown', (e) => startDrag(e, win));
    
    // Window controls
    const controls = win.querySelectorAll('.window-btn');
    controls.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        handleWindowAction(windowId, action);
      });
    });
    
    // Focus window on click
    win.addEventListener('mousedown', () => focusWindow(windowId));
  });
  
  // Global mouse events for dragging
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
}

function positionWindow(win, windowId) {
  // On mobile, CSS handles fullscreen positioning
  if (isMobile()) {
    win.style.top = '';
    win.style.left = '';
    win.style.width = '';
    win.style.height = '';
    return;
  }
  
  // Window sizes
  const sizes = {
    about: { width: 500, height: 520 },
    projects: { width: 550, height: 450 },
    // skills: { width: 500, height: 400 },
    experience: { width: 550, height: 520 },
    finder: { width: 650, height: 450 },
    terminal: { width: 550, height: 380 },
    settings: { width: 450, height: 520 }
  };
  
  // Cascade offsets for each window type
  const cascadeOffsets = {
    about: { x: 0, y: 0 },
    projects: { x: 30, y: 25 },
    // skills: { x: 60, y: 50 },
    experience: { x: 90, y: 75 },
    finder: { x: -90, y: 50 },
    terminal: { x: -60, y: 30 },
    settings: { x: -30, y: 60 }
  };
  
  const size = sizes[windowId] || { width: 500, height: 400 };
  const offset = cascadeOffsets[windowId] || { x: 0, y: 0 };
  
  // Calculate center position
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Center the window, then apply cascade offset
  let centerX = (screenWidth - size.width) / 2 + offset.x;
  let centerY = (screenHeight - size.height) / 2 - 50 + offset.y; // Slightly above center
  
  // Keep window within screen bounds
  centerX = Math.max(20, Math.min(centerX, screenWidth - size.width - 20));
  centerY = Math.max(20, Math.min(centerY, screenHeight - size.height - 80));
  
  win.style.top = centerY + 'px';
  win.style.left = centerX + 'px';
  win.style.width = size.width + 'px';
  win.style.height = size.height + 'px';
}

function openWindow(windowId) {
  const windowState = state.windows[windowId];
  if (!windowState) return;
  
  const win = windowState.element;
  
  // Show window
  win.style.display = 'block';
  windowState.isMinimized = false;
  win.classList.remove('minimized');
  
  // Focus it
  focusWindow(windowId);
  
  // Add to taskbar
  updateTaskbar();
}

function closeWindow(windowId) {
  const windowState = state.windows[windowId];
  if (!windowState) return;
  
  windowState.element.style.display = 'none';
  windowState.isMinimized = false;
  windowState.isMaximized = false;
  windowState.element.classList.remove('maximized');
  
  // Show dock if no windows are maximized
  const anyMaximized = Object.values(state.windows).some(w => w.isMaximized);
  if (!anyMaximized) {
    const dockContainer = document.getElementById('dock-container');
    if (dockContainer) {
      dockContainer.style.display = 'flex';
    }
  }
  
  updateTaskbar();
}

function minimizeWindow(windowId) {
  const windowState = state.windows[windowId];
  if (!windowState) return;
  
  // If window was maximized, reset maximized state
  if (windowState.isMaximized) {
    windowState.element.classList.remove('maximized');
    windowState.isMaximized = false;
    
    // Show dock since we're no longer maximized
    const anyMaximized = Object.values(state.windows).some(w => w.isMaximized);
    if (!anyMaximized) {
      const dockContainer = document.getElementById('dock-container');
      if (dockContainer) {
        dockContainer.style.display = 'flex';
      }
    }
  }
  
  windowState.element.classList.add('minimized');
  windowState.isMinimized = true;
  
  updateTaskbar();
}

function maximizeWindow(windowId) {
  const windowState = state.windows[windowId];
  if (!windowState) return;
  
  const win = windowState.element;
  const dockContainer = document.getElementById('dock-container');
  const minimizeBtn = document.getElementById(`window-${windowId}`).querySelector('.window-btn.minimize');
  
  if (windowState.isMaximized) {
    // Restore
    win.classList.remove('maximized');
    if (windowState.prevPosition) {
      win.style.top = windowState.prevPosition.top;
      win.style.left = windowState.prevPosition.left;
      win.style.width = windowState.prevSize.width;
      win.style.height = windowState.prevSize.height;
    }
    // Restore normal z-index
    win.style.zIndex = windowState.prevZIndex || state.zIndex;
    windowState.isMaximized = false;
    minimizeBtn.classList.remove('inactive');
    
    // Show dock if no other windows are maximized
    const anyMaximized = Object.values(state.windows).some(w => w.isMaximized);
    if (!anyMaximized && dockContainer) {
      dockContainer.style.display = 'flex';
    }
  } else {
    // Maximize
    windowState.prevPosition = {
      top: win.style.top,
      left: win.style.left
    };
    windowState.prevSize = {
      width: win.style.width,
      height: win.style.height
    };
    // Save current z-index and set very high z-index
    windowState.prevZIndex = win.style.zIndex;
    win.style.zIndex = 500;
    win.classList.add('maximized');
    windowState.isMaximized = true;
    minimizeBtn.classList.add('inactive');
    
    // Hide dock when window is maximized
    if (dockContainer) {
      dockContainer.style.display = 'none';
    }
  }
}

function focusWindow(windowId) {
  // Remove active from all windows
  Object.values(state.windows).forEach(w => {
    w.element.classList.remove('active');
  });
  
  // Set this window as active
  const windowState = state.windows[windowId];
  if (windowState) {
    state.zIndex++;
    windowState.element.style.zIndex = state.zIndex;
    windowState.element.classList.add('active');
    state.activeWindow = windowId;
  }
  
  updateTaskbar();
}

function handleWindowAction(windowId, action) {
  switch (action) {
    case 'close':
      closeWindow(windowId);
      break;
    case 'minimize':
      if (!state.windows[windowId]?.isMaximized) {
        minimizeWindow(windowId);
      }
      break;
    case 'maximize':
      maximizeWindow(windowId);
      break;
  }
}

// ========================================
// Dragging
// ========================================

function startDrag(e, win) {
  // Don't drag on mobile (windows are fullscreen)
  if (isMobile()) return;
  
  // Don't drag if maximized
  const windowId = win.id.replace('window-', '');
  if (state.windows[windowId]?.isMaximized) return;
  
  state.isDragging = true;
  state.currentDragWindow = win;
  state.dragOffset = {
    x: e.clientX - win.offsetLeft,
    y: e.clientY - win.offsetTop
  };
  
  win.style.transition = 'none';
}

function handleDrag(e) {
  if (!state.isDragging || !state.currentDragWindow) return;
  
  const win = state.currentDragWindow;
  let newX = e.clientX - state.dragOffset.x;
  let newY = e.clientY - state.dragOffset.y;
  
  // Keep window within bounds
  const maxX = window.innerWidth - 100;
  const maxY = window.innerHeight - 100;
  
  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));
  
  win.style.left = newX + 'px';
  win.style.top = newY + 'px';
}

function stopDrag() {
  if (state.currentDragWindow) {
    state.currentDragWindow.style.transition = '';
  }
  state.isDragging = false;
  state.currentDragWindow = null;
}

// ========================================
// Dock
// ========================================

function initializeTaskbar() {
  // Initialize dock item clicks
  const dockItems = document.querySelectorAll('.dock-item');
  dockItems.forEach(item => {
    item.addEventListener('click', () => {
      const windowId = item.dataset.window;
      if (windowId) {
        const windowState = state.windows[windowId];
        if (windowState) {
          if (windowState.isMinimized) {
            // Restore from minimized
            windowState.element.classList.remove('minimized');
            windowState.isMinimized = false;
            openWindow(windowId);
          } else if (windowState.element.style.display === 'none') {
            // Open window
            openWindow(windowId);
          } else if (state.activeWindow === windowId) {
            // Minimize if already active
            minimizeWindow(windowId);
          } else {
            // Focus the window
            focusWindow(windowId);
          }
        }
      }
    });
  });
}

function updateTaskbar() {
  // Update dock items to show which windows are open
  const dockItems = document.querySelectorAll('.dock-item');
  dockItems.forEach(item => {
    const windowId = item.dataset.window;
    if (windowId && state.windows[windowId]) {
      const windowState = state.windows[windowId];
      const isOpen = windowState.element.style.display !== 'none' || windowState.isMinimized;
      
      if (isOpen) {
        item.classList.add('has-window');
      } else {
        item.classList.remove('has-window');
      }
    }
  });
  
  // Update minimized windows in the dock's open windows area
  const openWindowsContainer = document.getElementById('dock-open-windows');
  if (openWindowsContainer) {
    openWindowsContainer.innerHTML = '';
    
    // Only show project-detail window here since it's not in the main dock
    Object.entries(state.windows).forEach(([windowId, windowState]) => {
      // Skip windows that already have dock icons
      if (['about', 'projects', 'experience', 'finder', 'terminal', 'settings'].includes(windowId)) {
        return;
      }
      
      const win = windowState.element;
      
      // Show if window is open
      if (win.style.display !== 'none' || windowState.isMinimized) {
        const item = document.createElement('button');
        item.className = 'dock-window-item';
        
        if (state.activeWindow === windowId && !windowState.isMinimized) {
          item.classList.add('active');
        }
        if (windowState.isMinimized) {
          item.classList.add('minimized');
        }
        
        // Get window icon from title
        const title = win.querySelector('.window-title').textContent;
        const icon = title.split(' ')[0]; // Get emoji
        item.textContent = icon;
        item.title = title;
        
        item.addEventListener('click', () => {
          if (windowState.isMinimized) {
            win.classList.remove('minimized');
            windowState.isMinimized = false;
            focusWindow(windowId);
          } else if (state.activeWindow === windowId) {
            minimizeWindow(windowId);
          } else {
            focusWindow(windowId);
          }
          updateTaskbar();
        });
        
        openWindowsContainer.appendChild(item);
      }
    });
  }
}

function updateClock() {
  const clock = document.getElementById('clock');
  const now = new Date();
  const options = { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  };
  clock.textContent = now.toLocaleTimeString('en-US', options);
}

// ========================================
// Terminal
// ========================================

function initializeTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim();
      if (command) {
        processCommand(command);
        input.value = '';
      }
    }
  });
  
  // Focus terminal input when terminal window is clicked
  const terminalWindow = document.getElementById('window-terminal');
  terminalWindow.addEventListener('click', () => {
    input.focus();
  });
}

function processCommand(command) {
  const output = document.getElementById('terminal-output');
  
  // Add command to output
  addTerminalLine(`visitor@portfolio:~$ ${command}`, 'command');
  
  // Process command
  const cmd = command.toLowerCase();
  
  switch (cmd) {
    case 'help':
      addTerminalLine('Available commands:', 'response');
      addTerminalLine('  help        - Show this help message', 'response');
      addTerminalLine('  about       - Learn about me', 'response');
      // addTerminalLine('  skills      - View my skills', 'response');
      addTerminalLine('  experience  - View my work history', 'response');
      addTerminalLine('  files       - Browse downloadable files', 'response');
      addTerminalLine('  projects    - See my projects', 'response');
      addTerminalLine('  settings    - Open settings', 'response');
      addTerminalLine('  clear       - Clear the terminal', 'response');
      addTerminalLine('  date        - Show current date', 'response');
      addTerminalLine('  whoami      - Who are you?', 'response');
      addTerminalLine('  reset-icons - Reset icon positions', 'response');
      addTerminalLine('  lock        - Lock the screen', 'response');
      addTerminalLine('  secret      - ???', 'response');
      break;
      
    case 'about':
      addTerminalLine('Opening About window...', 'response');
      if (state.windows['terminal'] && state.windows['terminal'].isMaximized) { maximizeWindow('terminal'); }
      openWindow('about');
      break;
      
    // case 'skills':
    //   addTerminalLine('Opening Skills window...', 'response');
    //   if (state.windows['terminal'] && state.windows['terminal'].isMaximized) { maximizeWindow('terminal'); }
    //   openWindow('skills');
    //   break;
      
    case 'experience':
    case 'jobs':
    case 'work':
      addTerminalLine('Opening Experience window...', 'response');
      if (state.windows['terminal'] && state.windows['terminal'].isMaximized) { maximizeWindow('terminal'); }
      openWindow('experience');
      break;
    
    case 'files':
    case 'finder':
    case 'documents':
      addTerminalLine('Opening Files window...', 'response');
      if (state.windows['terminal'] && state.windows['terminal'].isMaximized) { maximizeWindow('terminal'); }
      openWindow('finder');
      break;
      
    case 'projects':
      addTerminalLine('Opening Projects window...', 'response');
      if (state.windows['terminal'] && state.windows['terminal'].isMaximized) { maximizeWindow('terminal'); }
      openWindow('projects');
      break;
      
    case 'contact':
      addTerminalLine('Contact info is in the About window!', 'response');
      if (state.windows['terminal'] && state.windows['terminal'].isMaximized) { maximizeWindow('terminal'); }
      openWindow('about');
      break;
      
    case 'settings':
      addTerminalLine('Opening Settings window...', 'response');
      if (state.windows['terminal'] && state.windows['terminal'].isMaximized) { maximizeWindow('terminal'); }
      openWindow('settings');
      break;
      
    case 'clear':
      output.innerHTML = '';
      break;
      
    case 'date':
      addTerminalLine(new Date().toString(), 'response');
      break;
      
    case 'whoami':
      addTerminalLine('You are a curious visitor! Welcome! 🎉', 'response');
      break;
      
    case 'reset-icons':
      resetIconPositions();
      addTerminalLine('Icon positions reset to default! 🔄', 'response');
      break;
      
    case 'lock':
    case 'logout':
      addTerminalLine('Locking screen... 🔒', 'response');
      setTimeout(() => lockScreen(), 500);
      break;
      
    case 'secret':
      // addTerminalLine('🎊 You found the secret! 🎊', 'response');
      // addTerminalLine('Thanks for exploring my portfolio!', 'response');
      // addTerminalLine('Here\'s a virtual cookie: 🍪', 'response');
      break;
      
    case 'sudo':
    case 'sudo rm -rf /':
      addTerminalLine('Nice try! 😄', 'error');
      break;
      
    default:
      addTerminalLine(`Command not found: ${command}`, 'error');
      addTerminalLine('Type "help" for available commands.', 'response');
  }
  
  // Scroll to bottom
  output.scrollTop = output.scrollHeight;
}

function addTerminalLine(text, type = 'response') {
  const output = document.getElementById('terminal-output');
  const line = document.createElement('div');
  line.className = `terminal-line ${type}`;
  line.textContent = text;
  output.appendChild(line);
}


// ========================================
// Wallpaper Settings
// ========================================

const wallpaperGradients = {
  gradient1: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  gradient2: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradient3: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  gradient4: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  gradient5: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  gradient6: 'linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 50%, #2d1b4e 100%)',
  gradient7: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  gradient8: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)'
};

function initializeWallpaperSettings() {
  // Preset buttons
  const presetButtons = document.querySelectorAll('.wallpaper-preset');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const wallpaperId = btn.dataset.wallpaper;
      applyWallpaperPreset(wallpaperId);
      
      // Update active state
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Clear custom image info
      document.getElementById('upload-info').textContent = 'No image selected';
      document.getElementById('clear-wallpaper').style.display = 'none';
    });
  });
  
  // Image upload
  const uploadInput = document.getElementById('wallpaper-upload');
  uploadInput.addEventListener('change', handleWallpaperUpload);
  
  // Clear wallpaper button
  const clearBtn = document.getElementById('clear-wallpaper');
  clearBtn.addEventListener('click', clearCustomWallpaper);
  
  // Reset icons button
  const resetIconsBtn = document.getElementById('reset-icons-btn');
  if (resetIconsBtn) {
    resetIconsBtn.addEventListener('click', () => {
      resetIconPositions();
    });
  }

  // Image upload
  const uploadInputPfp = document.getElementById('pfp-upload');
  uploadInputPfp.addEventListener('change', handlePfpUpload);

  // Clear wallpaper button
  const clearBtnPfp = document.getElementById('clear-pfp');
  clearBtnPfp.addEventListener('click', clearCustomPfp);

  // Logout/Lock screen button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      lockScreen();
    });
  }
}

function applyWallpaperPreset(gradientId) {
  const desktop = document.getElementById('desktop');
  const preview = document.querySelector('.preview-desktop');
  const gradient = wallpaperGradients[gradientId];
  
  if (gradient) {
    desktop.style.backgroundImage = gradient;
    desktop.style.backgroundColor = '';
    preview.style.backgroundImage = gradient;
    preview.style.backgroundColor = '';
    
    // Save to localStorage
    localStorage.setItem('wallpaper', JSON.stringify({ type: 'gradient', value: gradientId }));
  }
}

function handleWallpaperUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image is too large. Please choose an image under 5MB.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const imageData = event.target.result;
    applyCustomWallpaper(imageData, file.name);
  };
  reader.readAsDataURL(file);
}

function applyCustomWallpaper(imageData, fileName) {
  const desktop = document.getElementById('desktop');
  const preview = document.querySelector('.preview-desktop');
  
  desktop.style.backgroundImage = `url(${imageData})`;
  desktop.style.backgroundSize = 'cover';
  desktop.style.backgroundPosition = 'center';
  
  // Remove dark wallpaper class for custom images
  desktop.classList.remove('dark-wallpaper');
  
  preview.style.backgroundImage = `url(${imageData})`;
  preview.style.backgroundSize = 'cover';
  preview.style.backgroundPosition = 'center';
  
  // Update UI
  document.getElementById('upload-info').textContent = fileName || 'Custom image';
  document.getElementById('clear-wallpaper').style.display = 'inline-block';
  
  // Remove active state from presets
  document.querySelectorAll('.wallpaper-preset').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Save to localStorage (note: large images may exceed storage limits)
  try {
    localStorage.setItem('wallpaper', JSON.stringify({ type: 'image', value: imageData, name: fileName }));
  } catch (e) {
    console.warn('Image too large to save to localStorage');
  }
}

function clearCustomWallpaper() {
  // Reset to default gradient
  applyWallpaperPreset('gradient1');
  
  // Update UI
  document.getElementById('upload-info').textContent = 'No image selected';
  document.getElementById('clear-wallpaper').style.display = 'none';
  document.getElementById('wallpaper-upload').value = '';
  
  // Set first preset as active
  const firstPreset = document.querySelector('.wallpaper-preset[data-wallpaper="gradient1"]');
  document.querySelectorAll('.wallpaper-preset').forEach(btn => btn.classList.remove('active'));
  if (firstPreset) firstPreset.classList.add('active');
}

function loadSavedPfp() {
  const savedPfp = localStorage.getItem('pfp');
  
  if (savedPfp) {
    const pfpData = JSON.parse(savedPfp);
    applyCustomPfp(pfpData.value, pfpData.name);
  }
}

function loadSavedWallpaper() {
  const saved = localStorage.getItem('wallpaper');
  if (!saved) return;
  
  try {
    const wallpaper = JSON.parse(saved);
    
    if (wallpaper.type === 'gradient') {
      applyWallpaperPreset(wallpaper.value);
      
      // Update active preset button
      document.querySelectorAll('.wallpaper-preset').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.wallpaper === wallpaper.value) {
          btn.classList.add('active');
        }
      });
    } else if (wallpaper.type === 'image') {
      applyCustomWallpaper(wallpaper.value, wallpaper.name);
    }
  } catch (e) {
    console.warn('Failed to load saved wallpaper');
  }
}

function handlePfpUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image is too large. Please choose an image under 5MB.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const imageData = event.target.result;
    applyCustomPfp(imageData, file.name);
  };
  reader.readAsDataURL(file);
}

function applyCustomPfp(imageData, fileName) {
  const lockScreenPfp = document.getElementById('lock-screen-pfp');
  const pfpImage = lockScreenPfp.querySelector('img');

  if (pfpImage) {
    pfpImage.src = imageData; 
  }
  
  // Update UI
  document.getElementById('upload-info-pfp').textContent = fileName || 'Custom image';
  document.getElementById('clear-pfp').style.display = 'inline-block';

  // Save to localStorage (note: large images may exceed storage limits)
  try {
    localStorage.setItem('pfp', JSON.stringify({ type: 'image', value: imageData, name: fileName }));
  } catch (e) {
    console.warn('Image too large to save to localStorage');
  }
}

function clearCustomPfp() {
  // Reset to default profile picture
  const defaultImg = './assets/ponyo-avatar.png';
  const lockScreenPfp = document.getElementById('lock-screen-pfp');
  const pfpImage = lockScreenPfp.querySelector('img');
  if (pfpImage) pfpImage.src = defaultImg;

  localStorage.removeItem('pfp');
  
  // Update UI
  document.getElementById('upload-info-pfp').textContent = 'No image selected';
  document.getElementById('clear-pfp').style.display = 'none';
  document.getElementById('pfp-upload').value = '';
}