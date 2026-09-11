/**
 * Territory Capture — Core Game Engine
 * Inspired by Qix / Xonix
 * Pure Vanilla HTML5 Canvas 2D API (No frameworks, No external assets)
 */

'use strict';

// ==========================================
// 1. CONFIGURATION & CONSTANTS (9:16 RATIO)
// ==========================================
const levelConfig = {
  width: 45,           // Grid columns (9:16 ratio)
  height: 80,          // Grid rows
  cellSize: 10,        // Pixels per cell (45 * 10 = 450, 80 * 10 = 800)
  targetPercent: 80,   // Clear condition percentage
  bossSpeed: 85,       // Boss movement speed in pixels per second
  playerSpeed: 24,     // Player grid steps per second
  bossRadius: 15,      // Boss collision radius in pixels (large and menacing)
  minionSpeed: 48,     // Minion movement speed in pixels per second (slower than boss)
  minionRadius: 8      // Minion collision radius in pixels (smaller than boss)
};

// Stories Collection (assets/scene/1/, assets/scene/2/, ...)
// The first image 1.jpeg in each folder is used as the cover preview
const STORIES = [
  {
    id: 1,
    folder: '1',
    title: 'เรื่องราวที่ 1',
    description: '4 ฉากการผจญภัย',
    cover: 'assets/scene/1/1.jpeg',
    scenes: [
      { stage: 1, title: 'ฉากที่ 1', imageSrc: 'assets/scene/1/1.jpeg' },
      { stage: 2, title: 'ฉากที่ 2', imageSrc: 'assets/scene/1/2.jpeg' },
      { stage: 3, title: 'ฉากที่ 3', imageSrc: 'assets/scene/1/3.jpeg' },
      { stage: 4, title: 'ฉากที่ 4', imageSrc: 'assets/scene/1/4.jpeg' }
    ]
  },
  {
    id: 2,
    folder: '2',
    title: 'เรื่องราวที่ 2',
    description: '4 ฉากการผจญภัย',
    cover: 'assets/scene/2/1.jpeg',
    scenes: [
      { stage: 1, title: 'ฉากที่ 1', imageSrc: 'assets/scene/2/1.jpeg' },
      { stage: 2, title: 'ฉากที่ 2', imageSrc: 'assets/scene/2/2.jpeg' },
      { stage: 3, title: 'ฉากที่ 3', imageSrc: 'assets/scene/2/3.jpeg' },
      { stage: 4, title: 'ฉากที่ 4', imageSrc: 'assets/scene/2/4.jpeg' }
    ]
  }
];

let currentStoryIndex = 0;
let currentStory = STORIES[0];
let STORY_STAGES = currentStory.scenes;
let currentStageIndex = 0;
const loadedStageImages = [];

function preloadStageImages() {
  loadedStageImages.length = 0;
  STORY_STAGES.forEach((stage, idx) => {
    const img = new Image();
    img.src = stage.imageSrc;
    loadedStageImages[idx] = img;
  });
}

const CELL_TYPE = {
  EMPTY: 0,
  CLAIMED: 1,
  TRAIL: 2
};

const GameState = {
  READY: 'READY',
  PLAYING: 'PLAYING',
  DRAWING: 'DRAWING',
  CAPTURING: 'CAPTURING',
  DEAD: 'DEAD',
  WIN: 'WIN',
  PAUSED: 'PAUSED'
};

const PlayerState = {
  ON_BORDER: 'ON_BORDER',
  DRAWING: 'DRAWING',
  DEAD: 'DEAD'
};

// ==========================================
// 2. CORE GAME VARIABLES
// ==========================================
let canvas, ctx;
let currentState = GameState.READY;
let previousState = GameState.READY; // For pause toggle
let DEBUG = false;

// Performance & Timing
let lastTimestamp = 0;
let fps = 60;
let frameCount = 0;
let fpsTimer = 0;

// Grid Data: 1D flat array for optimal performance (width * height)
const totalCells = levelConfig.width * levelConfig.height;
let grid = new Uint8Array(totalCells);

// Total playable inner cells (excluding outer 1-cell border)
const totalPlayableCells = (levelConfig.width - 2) * (levelConfig.height - 2);
let currentCapturedPercent = 0;

// Player Entity
const player = {
  x: Math.floor(levelConfig.width / 2),
  y: 0,
  state: PlayerState.ON_BORDER,
  dx: 0,
  dy: 0,
  inputDx: 0,
  inputDy: 0,
  stepCooldown: 0
};

// Trail array: list of {x, y} coordinates of current drawn path
let trail = [];

// Boss Entity
const boss = {
  x: 225,
  y: 400,
  vx: 0,
  vy: 0,
  radius: levelConfig.bossRadius
};

// Minions (Dynamic count: Stage 1 has 2, each subsequent stage adds 1 minion)
let minions = [];

// Defeat particle effects (when minions are trapped/enclosed)
let defeatParticles = [];

// DOM Elements
let elCapturedPercent, elTargetPercent, elStageIndicator;
let elModalOverlay, elGameOverModal, elLevelClearModal, elPauseModal, elStoryCompleteModal;
let elGameOverCaptured, elLevelClearCaptured;
let elSceneClearTitle, elSceneClearSubtitle;
let btnRestart, btnNextScene, btnReplayStory;
let btnMobilePause, btnMobileRestart;
let dpadBtns = {};

// Stage Select Elements
let elStageSelectScreen, elStoryCardsGrid, btnBackToSelect;
let btnGameOverBack, btnStoryCompleteBack, btnPauseResume, btnPauseBack;

// ==========================================
// 3. INITIALIZATION & RESET
// ==========================================
function initGame() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d', { alpha: false });

  // Preload story stage images
  preloadStageImages();

  // Bind DOM elements
  elCapturedPercent = document.getElementById('capturedPercent');
  elTargetPercent = document.getElementById('targetPercent');
  elStageIndicator = document.getElementById('stageIndicator');
  elModalOverlay = document.getElementById('modalOverlay');
  elGameOverModal = document.getElementById('gameOverModal');
  elLevelClearModal = document.getElementById('levelClearModal');
  elPauseModal = document.getElementById('pauseModal');
  elStoryCompleteModal = document.getElementById('storyCompleteModal');
  elGameOverCaptured = document.getElementById('gameOverCaptured');
  elLevelClearCaptured = document.getElementById('levelClearCaptured');
  elSceneClearTitle = document.getElementById('sceneClearTitle');
  elSceneClearSubtitle = document.getElementById('sceneClearSubtitle');

  btnRestart = document.getElementById('btnRestart');
  btnNextScene = document.getElementById('btnNextScene');
  btnReplayStory = document.getElementById('btnReplayStory');
  btnMobilePause = document.getElementById('btnMobilePause');
  btnMobileRestart = document.getElementById('btnMobileRestart');

  // Stage Select Elements
  elStageSelectScreen = document.getElementById('stageSelectScreen');
  elStoryCardsGrid = document.getElementById('storyCardsGrid');
  btnBackToSelect = document.getElementById('btnBackToSelect');
  btnGameOverBack = document.getElementById('btnGameOverBack');
  btnStoryCompleteBack = document.getElementById('btnStoryCompleteBack');
  btnPauseResume = document.getElementById('btnPauseResume');
  btnPauseBack = document.getElementById('btnPauseBack');

  // Render Story Cards on the Selection Screen
  renderStoryCards();

  // Button Listeners
  btnRestart.addEventListener('click', resetGame);
  if (btnNextScene) btnNextScene.addEventListener('click', handleNextSceneClick);
  if (btnReplayStory) btnReplayStory.addEventListener('click', replayStory);
  if (btnMobilePause) btnMobilePause.addEventListener('click', togglePause);
  if (btnMobileRestart) btnMobileRestart.addEventListener('click', resetGame);

  // Back to Stage Select Listeners
  if (btnBackToSelect) btnBackToSelect.addEventListener('click', returnToStageSelect);
  if (btnGameOverBack) btnGameOverBack.addEventListener('click', returnToStageSelect);
  if (btnStoryCompleteBack) btnStoryCompleteBack.addEventListener('click', returnToStageSelect);
  if (btnPauseBack) btnPauseBack.addEventListener('click', (e) => {
    e.stopPropagation();
    returnToStageSelect();
  });
  if (btnPauseResume) btnPauseResume.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePause();
  });
  if (elPauseModal) elPauseModal.addEventListener('click', (e) => {
    if (e.target === elPauseModal) togglePause();
  });

  // Allow clicking/tapping the cleared full image on canvas to proceed to next scene
  canvas.addEventListener('click', () => {
    if (currentState === GameState.WIN) {
      handleNextSceneClick();
    }
  });

  // Setup Keyboard Input
  window.addEventListener('keydown', handleKeyDown);

  // Setup Mobile Touch Controls
  initTouchControls();

  // Initialize UI text
  elTargetPercent.textContent = `${levelConfig.targetPercent}%`;

  // Start in READY state on the Stage Selection screen
  currentState = GameState.READY;
  resetGame();
  currentState = GameState.READY;

  // Start game loop
  lastTimestamp = performance.now();
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  hideAllModals();

  if (elStageIndicator) {
    elStageIndicator.textContent = `${currentStageIndex + 1}/${STORY_STAGES.length}`;
  }

  // 1. Initialize Grid (45x80)
  grid.fill(CELL_TYPE.EMPTY);
  for (let x = 0; x < levelConfig.width; x++) {
    setCell(x, 0, CELL_TYPE.CLAIMED);
    setCell(x, levelConfig.height - 1, CELL_TYPE.CLAIMED);
  }
  for (let y = 0; y < levelConfig.height; y++) {
    setCell(0, y, CELL_TYPE.CLAIMED);
    setCell(levelConfig.width - 1, y, CELL_TYPE.CLAIMED);
  }

  // 2. Reset Player
  player.x = Math.floor(levelConfig.width / 2);
  player.y = 0;
  player.state = PlayerState.ON_BORDER;
  player.dx = 0;
  player.dy = 0;
  player.inputDx = 0;
  player.inputDy = 0;
  player.stepCooldown = 0;

  // 3. Reset Trail
  trail = [];

  // 4. Reset Boss (Place in middle of 450x800 empty territory with angle)
  boss.x = (levelConfig.width / 2) * levelConfig.cellSize;
  boss.y = (levelConfig.height / 2) * levelConfig.cellSize;
  const angle = (Math.PI / 4) * (Math.random() < 0.5 ? 1 : 3) * (Math.random() < 0.5 ? 1 : -1);
  boss.vx = Math.cos(angle) * levelConfig.bossSpeed;
  boss.vy = Math.sin(angle) * levelConfig.bossSpeed;
  boss.radius = levelConfig.bossRadius;

  // 4.1 Reset Minions (Stage 1 has 2 minions, each subsequent stage adds 1 minion)
  const minionCount = 2 + currentStageIndex;
  minions = [];
  for (let i = 0; i < minionCount; i++) {
    const angleOffset = (Math.PI * 2 * i) / minionCount;
    const dist = 75 + (i % 2 === 0 ? 15 : -15);
    const mAngle = angle + angleOffset + Math.PI / 6;
    minions.push({
      id: i + 1,
      x: boss.x + Math.cos(angleOffset) * dist,
      y: boss.y + Math.sin(angleOffset) * dist,
      vx: Math.cos(mAngle) * levelConfig.minionSpeed,
      vy: Math.sin(mAngle) * levelConfig.minionSpeed,
      radius: levelConfig.minionRadius,
      alive: true
    });
  }
  defeatParticles = [];

  // 5. Reset Percentage & State
  currentCapturedPercent = 0;
  updateHUD();
  currentState = GameState.PLAYING;
}

function handleNextSceneClick() {
  if (currentStageIndex < STORY_STAGES.length - 1) {
    nextStage();
  } else {
    showModal(elStoryCompleteModal);
  }
}

function nextStage() {
  if (currentStageIndex < STORY_STAGES.length - 1) {
    currentStageIndex++;
    resetGame();
  } else {
    showModal(elStoryCompleteModal);
  }
}

function replayStory() {
  currentStageIndex = 0;
  resetGame();
}

function renderStoryCards() {
  if (!elStoryCardsGrid) return;
  elStoryCardsGrid.innerHTML = '';

  STORIES.forEach((story, idx) => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="story-cover-container">
        <img class="story-cover-img" src="${story.cover}" alt="${story.title}" loading="lazy">
        <div class="story-badge">${story.scenes.length} ฉาก</div>
      </div>
      <div class="story-info">
        <div class="story-title">${story.title}</div>
        <div class="story-desc">${story.description}</div>
        <button class="story-play-btn">▶ เริ่มเล่น</button>
      </div>
    `;

    card.addEventListener('click', () => {
      selectStory(idx);
    });

    elStoryCardsGrid.appendChild(card);
  });
}

function selectStory(storyIdx) {
  currentStoryIndex = storyIdx;
  currentStory = STORIES[storyIdx];
  STORY_STAGES = currentStory.scenes;
  currentStageIndex = 0;
  preloadStageImages();

  if (elStageSelectScreen) {
    elStageSelectScreen.classList.add('hidden');
  }

  resetGame();
  currentState = GameState.PLAYING;
}

function returnToStageSelect() {
  currentState = GameState.READY;
  hideAllModals();
  if (elStageSelectScreen) {
    elStageSelectScreen.classList.remove('hidden');
  }
}

// Helper: Grid cell indexing
function getCell(x, y) {
  if (x < 0 || x >= levelConfig.width || y < 0 || y >= levelConfig.height) {
    return CELL_TYPE.CLAIMED; // Outside is treated as solid wall
  }
  return grid[y * levelConfig.width + x];
}

function setCell(x, y, value) {
  if (x >= 0 && x < levelConfig.width && y >= 0 && y < levelConfig.height) {
    grid[y * levelConfig.width + x] = value;
  }
}

// ==========================================
// 4. INPUT HANDLING (KEYBOARD & TOUCH)
// ==========================================
function setPlayerDirection(nextX, nextY) {
  if (currentState === GameState.DEAD || currentState === GameState.WIN || currentState === GameState.PAUSED || currentState === GameState.READY) {
    return;
  }

  // Rule: While DRAWING, disallow immediate 180-degree reversal
  if (player.state === PlayerState.DRAWING && trail.length > 0) {
    if (nextX !== 0 && nextX === -player.dx) return;
    if (nextY !== 0 && nextY === -player.dy) return;
  }

  player.inputDx = nextX;
  player.inputDy = nextY;
}

function handleKeyDown(e) {
  if (currentState === GameState.READY) {
    return;
  }

  // Prevent page scroll for game keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();
  }

  // Debug toggle: ` (Backquote)
  if (e.code === 'Backquote' || e.key === '`') {
    DEBUG = !DEBUG;
    return;
  }

  // Restart key: R
  if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') {
    resetGame();
    return;
  }

  // Pause key: P
  if (e.code === 'KeyP' || e.key === 'p' || e.key === 'P') {
    togglePause();
    return;
  }

  let nextX = 0;
  let nextY = 0;

  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW':
      nextX = 0;
      nextY = -1;
      break;
    case 'ArrowDown':
    case 'KeyS':
      nextX = 0;
      nextY = 1;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      nextX = -1;
      nextY = 0;
      break;
    case 'ArrowRight':
    case 'KeyD':
      nextX = 1;
      nextY = 0;
      break;
    default:
      return;
  }

  setPlayerDirection(nextX, nextY);
}

function initTouchControls() {
  // 1. Virtual D-Pad buttons
  const dpadConfigs = [
    { id: 'dpadUp', dx: 0, dy: -1 },
    { id: 'dpadDown', dx: 0, dy: 1 },
    { id: 'dpadLeft', dx: -1, dy: 0 },
    { id: 'dpadRight', dx: 1, dy: 0 }
  ];

  dpadConfigs.forEach(({ id, dx, dy }) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    dpadBtns[id] = btn;

    const trigger = (e) => {
      e.preventDefault();
      btn.classList.add('active');
      setPlayerDirection(dx, dy);
    };

    const release = (e) => {
      e.preventDefault();
      btn.classList.remove('active');
    };

    btn.addEventListener('touchstart', trigger, { passive: false });
    btn.addEventListener('touchend', release, { passive: false });
    btn.addEventListener('touchcancel', release, { passive: false });
    btn.addEventListener('mousedown', trigger);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
  });

  // 2. Swipe Gesture Detection directly on Canvas
  let touchStartX = 0;
  let touchStartY = 0;
  const minSwipeDist = 18; // pixels

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    // Prevent mobile pull-to-refresh or page bouncing
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (Math.max(absX, absY) >= minSwipeDist) {
        if (absX > absY) {
          // Horizontal swipe
          setPlayerDirection(deltaX > 0 ? 1 : -1, 0);
        } else {
          // Vertical swipe
          setPlayerDirection(0, deltaY > 0 ? 1 : -1);
        }
      }
    }
  }, { passive: true });
}

function togglePause() {
  if (currentState === GameState.DEAD || currentState === GameState.WIN) return;

  if (currentState === GameState.PAUSED) {
    currentState = previousState;
    hideAllModals();
  } else {
    previousState = currentState;
    currentState = GameState.PAUSED;
    showModal(elPauseModal);
  }
}

// ==========================================
// 5. GAME LOOP & UPDATE
// ==========================================
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1); // Cap delta to avoid large jump
  lastTimestamp = timestamp;

  // Calculate FPS for debug
  fpsTimer += dt;
  frameCount++;
  if (fpsTimer >= 0.5) {
    fps = Math.round((frameCount / fpsTimer));
    frameCount = 0;
    fpsTimer = 0;
  }

  if (currentState !== GameState.PAUSED && currentState !== GameState.DEAD && currentState !== GameState.WIN && currentState !== GameState.READY) {
    updateGame(dt);
  }

  renderGame();

  requestAnimationFrame(gameLoop);
}

function updateGame(dt) {
  updatePlayer(dt);
  updateBoss(dt);
  updateMinions(dt);
  checkCollisions();
  updateParticles(dt);
}

// Helper: Check if a cell is an active walkable border (borders at least one EMPTY cell)
function isBorderCell(x, y) {
  if (getCell(x, y) !== CELL_TYPE.CLAIMED) {
    return false;
  }

  // A border cell must have at least one neighbor (8-way) that is EMPTY
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < levelConfig.width && ny >= 0 && ny < levelConfig.height) {
        if (getCell(nx, ny) === CELL_TYPE.EMPTY) {
          return true;
        }
      }
    }
  }
  return false;
}

// ==========================================
// 6. PLAYER LOGIC & MOVEMENT
// ==========================================
function updatePlayer(dt) {
  player.stepCooldown -= dt;
  const stepDuration = 1 / levelConfig.playerSpeed;

  if (player.stepCooldown > 0) {
    return;
  }

  // Attempt movement if input is active
  if (player.inputDx === 0 && player.inputDy === 0) {
    return;
  }

  const targetX = player.x + player.inputDx;
  const targetY = player.y + player.inputDy;

  // Boundary check
  if (targetX < 0 || targetX >= levelConfig.width || targetY < 0 || targetY >= levelConfig.height) {
    return;
  }

  const targetCell = getCell(targetX, targetY);

  if (player.state === PlayerState.ON_BORDER) {
    if (targetCell === CELL_TYPE.CLAIMED) {
      // Must only walk on active border cells (boundary of empty area)
      // Disallows walking into the interior of cut-away territory or inactive outer walls
      if (!isBorderCell(targetX, targetY)) {
        return;
      }

      player.x = targetX;
      player.y = targetY;
      player.dx = player.inputDx;
      player.dy = player.inputDy;
      player.stepCooldown = stepDuration;
    } else if (targetCell === CELL_TYPE.EMPTY) {
      // Leave border into empty space -> Start Drawing Trail
      player.state = PlayerState.DRAWING;
      currentState = GameState.DRAWING;
      player.x = targetX;
      player.y = targetY;
      player.dx = player.inputDx;
      player.dy = player.inputDy;
      setCell(targetX, targetY, CELL_TYPE.TRAIL);
      trail.push({ x: targetX, y: targetY });
      player.stepCooldown = stepDuration;
    }
  } else if (player.state === PlayerState.DRAWING) {
    if (targetCell === CELL_TYPE.TRAIL) {
      // Self-collision: Stepped onto own trail!
      killPlayer();
      return;
    } else if (targetCell === CELL_TYPE.EMPTY) {
      // Continue drawing trail
      player.x = targetX;
      player.y = targetY;
      player.dx = player.inputDx;
      player.dy = player.inputDy;
      setCell(targetX, targetY, CELL_TYPE.TRAIL);
      trail.push({ x: targetX, y: targetY });
      player.stepCooldown = stepDuration;
    } else if (targetCell === CELL_TYPE.CLAIMED) {
      // Reconnected with border! Capture territory!
      player.x = targetX;
      player.y = targetY;
      player.dx = player.inputDx;
      player.dy = player.inputDy;
      player.state = PlayerState.ON_BORDER;
      player.stepCooldown = stepDuration;

      captureTerritory();
    }
  }
}

// ==========================================
// 7. ENEMY LOGIC & BOUNCE PHYSICS (BOSS & MINIONS)
// ==========================================
function updateBouncingEntity(entity, dt) {
  // Candidate next position
  const nextX = entity.x + entity.vx * dt;
  const nextY = entity.y + entity.vy * dt;
  const r = entity.radius;

  // Collision with horizontal boundaries/claimed walls (5-point sampling along leading edge)
  const testPointsX = [
    { x: nextX + (entity.vx > 0 ? r : -r), y: entity.y - r * 0.8 },
    { x: nextX + (entity.vx > 0 ? r : -r), y: entity.y - r * 0.4 },
    { x: nextX + (entity.vx > 0 ? r : -r), y: entity.y },
    { x: nextX + (entity.vx > 0 ? r : -r), y: entity.y + r * 0.4 },
    { x: nextX + (entity.vx > 0 ? r : -r), y: entity.y + r * 0.8 }
  ];

  let collideX = false;
  for (const p of testPointsX) {
    const gx = Math.floor(p.x / levelConfig.cellSize);
    const gy = Math.floor(p.y / levelConfig.cellSize);
    if (getCell(gx, gy) === CELL_TYPE.CLAIMED) {
      collideX = true;
      break;
    }
  }

  // Collision with vertical boundaries/claimed walls (5-point sampling along leading edge)
  const testPointsY = [
    { x: entity.x - r * 0.8, y: nextY + (entity.vy > 0 ? r : -r) },
    { x: entity.x - r * 0.4, y: nextY + (entity.vy > 0 ? r : -r) },
    { x: entity.x,           y: nextY + (entity.vy > 0 ? r : -r) },
    { x: entity.x + r * 0.4, y: nextY + (entity.vy > 0 ? r : -r) },
    { x: entity.x + r * 0.8, y: nextY + (entity.vy > 0 ? r : -r) }
  ];

  let collideY = false;
  for (const p of testPointsY) {
    const gx = Math.floor(p.x / levelConfig.cellSize);
    const gy = Math.floor(p.y / levelConfig.cellSize);
    if (getCell(gx, gy) === CELL_TYPE.CLAIMED) {
      collideY = true;
      break;
    }
  }

  if (collideX) {
    entity.vx = -entity.vx;
  } else {
    entity.x = nextX;
  }

  if (collideY) {
    entity.vy = -entity.vy;
  } else {
    entity.y = nextY;
  }

  // Clamp entity inside canvas boundaries
  entity.x = Math.max(r + levelConfig.cellSize, Math.min(entity.x, canvas.width - r - levelConfig.cellSize));
  entity.y = Math.max(r + levelConfig.cellSize, Math.min(entity.y, canvas.height - r - levelConfig.cellSize));
}

function updateBoss(dt) {
  updateBouncingEntity(boss, dt);
}

function updateMinions(dt) {
  for (const minion of minions) {
    if (minion.alive) {
      updateBouncingEntity(minion, dt);
    }
  }
}

// ==========================================
// 8. COLLISION DETECTION
// ==========================================
function checkEnemyCollision(enemy) {
  const cs = levelConfig.cellSize;
  const r = enemy.radius;

  // 1. Enemy vs Trail Collision
  // Sample a bounding circle around enemy in grid space
  const minGX = Math.max(0, Math.floor((enemy.x - r) / cs));
  const maxGX = Math.min(levelConfig.width - 1, Math.floor((enemy.x + r) / cs));
  const minGY = Math.max(0, Math.floor((enemy.y - r) / cs));
  const maxGY = Math.min(levelConfig.height - 1, Math.floor((enemy.y + r) / cs));

  for (let gy = minGY; gy <= maxGY; gy++) {
    for (let gx = minGX; gx <= maxGX; gx++) {
      if (getCell(gx, gy) === CELL_TYPE.TRAIL) {
        // Circle-rect intersection check
        const closestX = Math.max(gx * cs, Math.min(enemy.x, (gx + 1) * cs));
        const closestY = Math.max(gy * cs, Math.min(enemy.y, (gy + 1) * cs));
        const distSq = (enemy.x - closestX) ** 2 + (enemy.y - closestY) ** 2;

        if (distSq <= r * r) {
          return true;
        }
      }
    }
  }

  // 2. Enemy vs Player Collision (when Player is drawing)
  const playerPixelX = player.x * cs + cs / 2;
  const playerPixelY = player.y * cs + cs / 2;
  const distToPlayerSq = (enemy.x - playerPixelX) ** 2 + (enemy.y - playerPixelY) ** 2;
  const playerRadius = cs / 2;

  if (distToPlayerSq <= (r + playerRadius) ** 2) {
    return true;
  }

  return false;
}

function checkCollisions() {
  if (player.state !== PlayerState.DRAWING) {
    return;
  }

  // Check Boss
  if (checkEnemyCollision(boss)) {
    killPlayer();
    return;
  }

  // Check Minions
  for (const minion of minions) {
    if (minion.alive && checkEnemyCollision(minion)) {
      killPlayer();
      return;
    }
  }
}

// ==========================================
// 9. TERRITORY CAPTURE & BFS FLOOD FILL
// ==========================================
function captureTerritory() {
  currentState = GameState.CAPTURING;

  // 1. Find Boss Grid cell
  let bossGX = Math.floor(boss.x / levelConfig.cellSize);
  let bossGY = Math.floor(boss.y / levelConfig.cellSize);

  // Safety fallback: if boss is directly on a CLAIMED cell or TRAIL, find adjacent EMPTY cell
  if (getCell(bossGX, bossGY) !== CELL_TYPE.EMPTY) {
    const adjacent = [
      { x: bossGX + 1, y: bossGY },
      { x: bossGX - 1, y: bossGY },
      { x: bossGX, y: bossGY + 1 },
      { x: bossGX, y: bossGY - 1 }
    ];
    for (const adj of adjacent) {
      if (getCell(adj.x, adj.y) === CELL_TYPE.EMPTY) {
        bossGX = adj.x;
        bossGY = adj.y;
        break;
      }
    }
  }

  // 2. BFS Flood Fill from Boss position
  // CLAIMED and TRAIL cells act as impassable walls
  const visited = new Uint8Array(totalCells);
  const queueX = [];
  const queueY = [];

  const startIdx = bossGY * levelConfig.width + bossGX;
  if (getCell(bossGX, bossGY) === CELL_TYPE.EMPTY) {
    visited[startIdx] = 1;
    queueX.push(bossGX);
    queueY.push(bossGY);
  }

  let head = 0;
  while (head < queueX.length) {
    const cx = queueX[head];
    const cy = queueY[head];
    head++;

    const neighbors = [
      { x: cx, y: cy - 1 },
      { x: cx, y: cy + 1 },
      { x: cx - 1, y: cy },
      { x: cx + 1, y: cy }
    ];

    for (const nb of neighbors) {
      if (nb.x >= 0 && nb.x < levelConfig.width && nb.y >= 0 && nb.y < levelConfig.height) {
        const nbIdx = nb.y * levelConfig.width + nb.x;
        if (!visited[nbIdx] && grid[nbIdx] === CELL_TYPE.EMPTY) {
          visited[nbIdx] = 1;
          queueX.push(nb.x);
          queueY.push(nb.y);
        }
      }
    }
  }

  // 3. Claim all EMPTY cells unreachable from Boss
  for (let y = 0; y < levelConfig.height; y++) {
    for (let x = 0; x < levelConfig.width; x++) {
      const idx = y * levelConfig.width + x;
      if (grid[idx] === CELL_TYPE.EMPTY && !visited[idx]) {
        grid[idx] = CELL_TYPE.CLAIMED;
      }
    }
  }

  // 3.1 Check and destroy enclosed minions
  const cs = levelConfig.cellSize;
  for (const minion of minions) {
    if (minion.alive) {
      const gx = Math.floor(minion.x / cs);
      const gy = Math.floor(minion.y / cs);
      if (getCell(gx, gy) === CELL_TYPE.CLAIMED) {
        minion.alive = false;
        spawnDefeatParticles(minion.x, minion.y, '#e879f9');
      }
    }
  }

  // 4. Convert all trail cells to CLAIMED
  for (const pt of trail) {
    setCell(pt.x, pt.y, CELL_TYPE.CLAIMED);
  }
  trail = [];

  // 5. Ensure player is strictly positioned on an active walkable border cell
  if (!isBorderCell(player.x, player.y)) {
    let closestDist = Infinity;
    let bestX = player.x;
    let bestY = player.y;
    const maxR = Math.max(levelConfig.width, levelConfig.height);
    for (let r = 1; r < maxR; r++) {
      let found = false;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          const tx = player.x + dx;
          const ty = player.y + dy;
          if (tx >= 0 && tx < levelConfig.width && ty >= 0 && ty < levelConfig.height) {
            if (isBorderCell(tx, ty)) {
              const d = dx * dx + dy * dy;
              if (d < closestDist) {
                closestDist = d;
                bestX = tx;
                bestY = ty;
                found = true;
              }
            }
          }
        }
      }
      if (found) break;
    }
    player.x = bestX;
    player.y = bestY;
  }

  // 6. Calculate new percentage
  currentCapturedPercent = calculateCapturedPercentage();
  updateHUD();

  // 7. Check Win Condition
  if (currentCapturedPercent >= levelConfig.targetPercent) {
    winLevel();
  } else {
    currentState = GameState.PLAYING;
  }
}

function calculateCapturedPercentage() {
  let claimedCount = 0;
  // Calculate only inside playable area (excluding outer 1-cell border)
  for (let y = 1; y < levelConfig.height - 1; y++) {
    for (let x = 1; x < levelConfig.width - 1; x++) {
      if (grid[y * levelConfig.width + x] === CELL_TYPE.CLAIMED) {
        claimedCount++;
      }
    }
  }
  return Math.floor((claimedCount / totalPlayableCells) * 100);
}

// ==========================================
// 10. GAME LIFECYCLE & MODALS
// ==========================================
function updateHUD() {
  elCapturedPercent.textContent = `${currentCapturedPercent}%`;
}

function killPlayer() {
  currentState = GameState.DEAD;
  player.state = PlayerState.DEAD;

  // Revert trail cells back to empty on death
  for (const pt of trail) {
    setCell(pt.x, pt.y, CELL_TYPE.EMPTY);
  }
  trail = [];

  elGameOverCaptured.textContent = `${currentCapturedPercent}%`;
  showModal(elGameOverModal);
}

function winLevel() {
  currentState = GameState.WIN;

  // Uncover 100% of the scene artwork
  grid.fill(CELL_TYPE.CLAIMED);
  currentCapturedPercent = 100;
  updateHUD();

  if (currentStageIndex < STORY_STAGES.length - 1) {
    if (elSceneClearTitle) elSceneClearTitle.textContent = `ผ่านด่านที่ ${currentStageIndex + 1} แล้ว!`;
    if (elSceneClearSubtitle) elSceneClearSubtitle.textContent = `เปิดเผยภาพฉากที่ ${currentStageIndex + 1} ครบถ้วน! แตะภาพหรือกดปุ่มเพื่อไปต่อ`;
    if (btnNextScene) {
      btnNextScene.textContent = `ไปด่านถัดไป (${currentStageIndex + 2}/${STORY_STAGES.length}) ❯`;
    }
  } else {
    if (elSceneClearTitle) elSceneClearTitle.textContent = `ผ่านด่านสุดท้ายแล้ว!`;
    if (elSceneClearSubtitle) elSceneClearSubtitle.textContent = `เปิดเผยภาพครบทั้ง 4 ฉากของเรื่องราวเรียบร้อยแล้ว!`;
    if (btnNextScene) {
      btnNextScene.textContent = `ดูฉากจบเนื้อเรื่อง ❯`;
    }
  }

  showModal(elLevelClearModal);
}

function showModal(modalElement) {
  elModalOverlay.classList.remove('hidden');
  elGameOverModal.classList.add('hidden');
  elLevelClearModal.classList.add('hidden');
  elPauseModal.classList.add('hidden');
  if (elStoryCompleteModal) elStoryCompleteModal.classList.add('hidden');

  // If level clear modal, use clear-reveal style so the full uncovered image is unobstructed!
  if (modalElement === elLevelClearModal) {
    elModalOverlay.classList.add('clear-reveal');
  } else {
    elModalOverlay.classList.remove('clear-reveal');
  }

  if (modalElement) modalElement.classList.remove('hidden');
}

function hideAllModals() {
  elModalOverlay.classList.add('hidden');
  elModalOverlay.classList.remove('clear-reveal');
  elGameOverModal.classList.add('hidden');
  elLevelClearModal.classList.add('hidden');
  elPauseModal.classList.add('hidden');
  if (elStoryCompleteModal) elStoryCompleteModal.classList.add('hidden');
}

// ==========================================
// 11. RENDERING SYSTEM (WITH IMAGE REVEAL)
// ==========================================
function renderGame() {
  const cs = levelConfig.cellSize;
  const currentImg = loadedStageImages[currentStageIndex];

  // 1. Draw Underlying Story Scene Image
  if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
    ctx.drawImage(currentImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // When Stage is Won (LEVEL CLEAR):
  // Reveal the entire picture in 100% full view without any covering overlay!
  if (currentState === GameState.WIN) {
    return;
  }

  // 2. Conceal Unclaimed EMPTY Territory with Dark Fog Overlay
  ctx.fillStyle = '#090d16'; // Deep opaque cover obscuring the unreached scene
  for (let y = 0; y < levelConfig.height; y++) {
    for (let x = 0; x < levelConfig.width; x++) {
      const type = grid[y * levelConfig.width + x];
      if (type === CELL_TYPE.EMPTY) {
        ctx.fillRect(x * cs, y * cs, cs, cs);
      }
    }
  }

  // 3. Highlight Active Perimeter Border (So player clearly sees running boundary)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.45)'; // Vibrant cyan border glow
  for (let y = 0; y < levelConfig.height; y++) {
    for (let x = 0; x < levelConfig.width; x++) {
      const type = grid[y * levelConfig.width + x];
      if (type === CELL_TYPE.CLAIMED && isBorderCell(x, y)) {
        ctx.fillRect(x * cs, y * cs, cs, cs);
      }
    }
  }

  // Render Trail (Luminous laser cutter beam)
  if (trail.length > 0) {
    ctx.save();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#f59e0b';
    for (let i = 0; i < trail.length; i++) {
      ctx.fillRect(trail[i].x * cs, trail[i].y * cs, cs, cs);
    }
    // Bright neon inner core
    ctx.fillStyle = '#fef08a';
    for (let i = 0; i < trail.length; i++) {
      ctx.fillRect(trail[i].x * cs + 2, trail[i].y * cs + 2, cs - 4, cs - 4);
    }
    ctx.restore();
  }

  // Render Boss (Large menacing demonic boss)
  renderBoss(ctx);

  // Render Minions (2 smaller, slower minions)
  renderMinions(ctx);

  // Render Defeat Particles
  renderParticles(ctx);

  // Render Player (Prominent cutting indicator with beacon pulse)
  renderPlayer(ctx);

  // Render Debug Overlay
  if (DEBUG) {
    renderDebugOverlay(ctx);
  }
}

function renderBoss(c) {
  const time = performance.now() * 0.004;
  const pulse = Math.sin(time) * 1.5;
  const r = boss.radius + pulse; // ~15-16.5px base radius

  c.save();
  // Menacing red fiery aura glow
  c.shadowColor = '#ef4444';
  c.shadowBlur = 16 + Math.sin(time * 1.5) * 4;

  // 1. Spikes / Demonic horns radiating from perimeter
  c.fillStyle = '#7f1d1d';
  c.strokeStyle = '#ef4444';
  c.lineWidth = 1.5;
  const spikeCount = 8;
  const rot = time * 0.4;
  for (let i = 0; i < spikeCount; i++) {
    const angle = rot + (i * Math.PI * 2) / spikeCount;
    const spikeLen = r + 6 + Math.sin(time * 2 + i) * 2;
    const baseSpan = 0.28;
    const p1x = boss.x + Math.cos(angle - baseSpan) * (r * 0.85);
    const p1y = boss.y + Math.sin(angle - baseSpan) * (r * 0.85);
    const p2x = boss.x + Math.cos(angle) * spikeLen;
    const p2y = boss.y + Math.sin(angle) * spikeLen;
    const p3x = boss.x + Math.cos(angle + baseSpan) * (r * 0.85);
    const p3y = boss.y + Math.sin(angle + baseSpan) * (r * 0.85);

    c.beginPath();
    c.moveTo(p1x, p1y);
    c.lineTo(p2x, p2y);
    c.lineTo(p3x, p3y);
    c.closePath();
    c.fill();
    c.stroke();
  }

  // 2. Boss Body with 3D radial shading
  const grad = c.createRadialGradient(
    boss.x - r * 0.3, boss.y - r * 0.3, r * 0.1,
    boss.x, boss.y, r
  );
  grad.addColorStop(0, '#f87171');
  grad.addColorStop(0.35, '#dc2626');
  grad.addColorStop(0.75, '#991b1b');
  grad.addColorStop(1, '#450a0a');

  c.beginPath();
  c.arc(boss.x, boss.y, r, 0, Math.PI * 2);
  c.fillStyle = grad;
  c.fill();
  c.lineWidth = 2;
  c.strokeStyle = '#fca5a5';
  c.stroke();

  // Reset shadow for inner facial features
  c.shadowBlur = 0;

  // 3. Predatory slanted glowing yellow eyes with slit pupils
  const eyeOffset = r * 0.42;
  const eyeY = boss.y - r * 0.18;
  const eyeW = r * 0.28;
  const eyeH = r * 0.38;

  // Left Eye (slanted)
  c.save();
  c.translate(boss.x - eyeOffset, eyeY);
  c.rotate(0.25);
  c.beginPath();
  c.ellipse(0, 0, eyeW, eyeH, 0, 0, Math.PI * 2);
  c.fillStyle = '#fde047';
  c.fill();
  c.beginPath();
  c.ellipse(0, 0, eyeW * 0.32, eyeH * 0.85, 0, 0, Math.PI * 2);
  c.fillStyle = '#0f172a';
  c.fill();
  c.restore();

  // Right Eye (slanted opposite)
  c.save();
  c.translate(boss.x + eyeOffset, eyeY);
  c.rotate(-0.25);
  c.beginPath();
  c.ellipse(0, 0, eyeW, eyeH, 0, 0, Math.PI * 2);
  c.fillStyle = '#fde047';
  c.fill();
  c.beginPath();
  c.ellipse(0, 0, eyeW * 0.32, eyeH * 0.85, 0, 0, Math.PI * 2);
  c.fillStyle = '#0f172a';
  c.fill();
  c.restore();

  // 4. Evil Jagged Fanged Smile
  const mouthY = boss.y + r * 0.35;
  const mouthW = r * 0.55;
  c.beginPath();
  c.arc(boss.x, mouthY - 3, mouthW, 0.15 * Math.PI, 0.85 * Math.PI, false);
  c.lineWidth = 2.5;
  c.strokeStyle = '#180303';
  c.stroke();

  // Fangs
  c.fillStyle = '#ffffff';
  c.beginPath();
  // Left fang
  c.moveTo(boss.x - mouthW * 0.45, mouthY);
  c.lineTo(boss.x - mouthW * 0.3, mouthY + 4);
  c.lineTo(boss.x - mouthW * 0.15, mouthY);
  // Right fang
  c.moveTo(boss.x + mouthW * 0.15, mouthY);
  c.lineTo(boss.x + mouthW * 0.3, mouthY + 4);
  c.lineTo(boss.x + mouthW * 0.45, mouthY);
  c.fill();

  c.restore();
}

function renderMinions(c) {
  for (const minion of minions) {
    if (!minion.alive) continue;
    renderMinion(c, minion);
  }
}

function renderMinion(c, minion) {
  const time = performance.now() * 0.005;
  const pulse = Math.sin(time * 2 + minion.id) * 0.7;
  const r = minion.radius + pulse; // ~8px base radius

  c.save();
  // Violet/purple glowing aura
  c.shadowColor = '#c084fc';
  c.shadowBlur = 10;

  // 1. Small flapping bat wings on left and right
  const wingFlap = Math.sin(time * 3 + minion.id * 2) * 0.45;
  c.fillStyle = '#6b21a8';
  c.strokeStyle = '#c084fc';
  c.lineWidth = 1.2;

  // Left Wing
  c.save();
  c.translate(minion.x - r * 0.7, minion.y);
  c.rotate(-0.35 + wingFlap);
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(-r * 1.3, -r * 0.8);
  c.lineTo(-r * 0.8, r * 0.4);
  c.closePath();
  c.fill();
  c.stroke();
  c.restore();

  // Right Wing
  c.save();
  c.translate(minion.x + r * 0.7, minion.y);
  c.rotate(0.35 - wingFlap);
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(r * 1.3, -r * 0.8);
  c.lineTo(r * 0.8, r * 0.4);
  c.closePath();
  c.fill();
  c.stroke();
  c.restore();

  // 2. Body Gradient (Purple Imp)
  const grad = c.createRadialGradient(
    minion.x - r * 0.3, minion.y - r * 0.3, 1,
    minion.x, minion.y, r
  );
  grad.addColorStop(0, '#f0abfc');
  grad.addColorStop(0.4, '#a855f7');
  grad.addColorStop(0.85, '#6b21a8');
  grad.addColorStop(1, '#3b0764');

  c.beginPath();
  c.arc(minion.x, minion.y, r, 0, Math.PI * 2);
  c.fillStyle = grad;
  c.fill();
  c.lineWidth = 1.5;
  c.strokeStyle = '#e879f9';
  c.stroke();

  // 3. Small horns
  c.fillStyle = '#e879f9';
  c.beginPath();
  // Left horn
  c.moveTo(minion.x - r * 0.5, minion.y - r * 0.6);
  c.lineTo(minion.x - r * 0.6, minion.y - r * 1.3);
  c.lineTo(minion.x - r * 0.2, minion.y - r * 0.8);
  // Right horn
  c.moveTo(minion.x + r * 0.2, minion.y - r * 0.8);
  c.lineTo(minion.x + r * 0.6, minion.y - r * 1.3);
  c.lineTo(minion.x + r * 0.5, minion.y - r * 0.6);
  c.fill();

  // 4. Glowing Red Slanted Eyes
  c.shadowBlur = 0;
  const eyeOffset = r * 0.38;
  const eyeY = minion.y - r * 0.12;
  const eyeR = r * 0.22;

  c.fillStyle = '#ef4444';
  c.beginPath();
  c.arc(minion.x - eyeOffset, eyeY, eyeR, 0, Math.PI * 2);
  c.arc(minion.x + eyeOffset, eyeY, eyeR, 0, Math.PI * 2);
  c.fill();

  // Eye highlights
  c.fillStyle = '#fef08a';
  c.beginPath();
  c.arc(minion.x - eyeOffset, eyeY, eyeR * 0.4, 0, Math.PI * 2);
  c.arc(minion.x + eyeOffset, eyeY, eyeR * 0.4, 0, Math.PI * 2);
  c.fill();

  c.restore();
}

function spawnDefeatParticles(x, y, color = '#c084fc') {
  for (let i = 0; i < 18; i++) {
    const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.4;
    const speed = 35 + Math.random() * 65;
    defeatParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.65,
      maxLife: 0.65,
      color,
      size: 2.5 + Math.random() * 2
    });
  }
}

function updateParticles(dt) {
  for (let i = defeatParticles.length - 1; i >= 0; i--) {
    const p = defeatParticles[i];
    p.life -= dt;
    if (p.life <= 0) {
      defeatParticles.splice(i, 1);
      continue;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
}

function renderParticles(c) {
  if (defeatParticles.length === 0) return;
  c.save();
  for (const p of defeatParticles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    c.globalAlpha = alpha;
    c.fillStyle = p.color;
    c.shadowColor = p.color;
    c.shadowBlur = 6;
    c.beginPath();
    c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

function renderPlayer(c) {
  const cs = levelConfig.cellSize;
  const cx = player.x * cs + cs * 0.5;
  const cy = player.y * cs + cs * 0.5;
  const isDrawing = player.state === PlayerState.DRAWING;
  const time = performance.now();

  c.save();

  // 1. Radar Beacon Pulsing Ring (makes player location immediately visible)
  const pulsePhase = (time % 1200) / 1200;
  const pulseR = 8 + pulsePhase * 14;
  const pulseAlpha = (1 - pulsePhase) * 0.85;

  c.beginPath();
  c.arc(cx, cy, pulseR, 0, Math.PI * 2);
  c.strokeStyle = isDrawing ? `rgba(16, 185, 129, ${pulseAlpha})` : `rgba(56, 189, 248, ${pulseAlpha})`;
  c.lineWidth = 2;
  c.stroke();

  // 2. Outer Glow Halo
  c.shadowBlur = 14;
  c.shadowColor = isDrawing ? '#10b981' : '#38bdf8';

  // 3. Player Core Orb (Larger than cell: radius 8.5px, diameter 17px)
  const playerRadius = 8.5;
  const grad = c.createRadialGradient(
    cx - 2, cy - 2, 1,
    cx, cy, playerRadius
  );

  if (isDrawing) {
    // Laser cutter green/emerald mode when drawing
    grad.addColorStop(0, '#d1fae5');
    grad.addColorStop(0.4, '#10b981');
    grad.addColorStop(1, '#065f46');
  } else {
    // Vivid electric cyan mode on border
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(0.4, '#0284c7');
    grad.addColorStop(1, '#0369a1');
  }

  c.beginPath();
  c.arc(cx, cy, playerRadius, 0, Math.PI * 2);
  c.fillStyle = grad;
  c.fill();
  c.lineWidth = 2;
  c.strokeStyle = '#ffffff';
  c.stroke();

  // 4. Cutting Reticle / Crosshair notches when actively cutting
  c.shadowBlur = 0;
  if (isDrawing) {
    const rot = time * 0.005;
    const reticleLen = 13;
    c.strokeStyle = '#fbbf24';
    c.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const angle = rot + (i * Math.PI) / 2;
      c.beginPath();
      c.moveTo(cx + Math.cos(angle) * 7, cy + Math.sin(angle) * 7);
      c.lineTo(cx + Math.cos(angle) * reticleLen, cy + Math.sin(angle) * reticleLen);
      c.stroke();
    }
  }

  // 5. Center Precision Diamond (Bright white center point)
  const dw = 3;
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.moveTo(cx, cy - dw);
  c.lineTo(cx + dw, cy);
  c.lineTo(cx, cy + dw);
  c.lineTo(cx - dw, cy);
  c.closePath();
  c.fill();

  c.restore();
}

function renderDebugOverlay(c) {
  const cs = levelConfig.cellSize;

  c.save();
  // 1. Grid Lines
  c.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  c.lineWidth = 1;
  c.beginPath();
  for (let x = 0; x <= levelConfig.width; x++) {
    c.moveTo(x * cs, 0);
    c.lineTo(x * cs, canvas.height);
  }
  for (let y = 0; y <= levelConfig.height; y++) {
    c.moveTo(0, y * cs);
    c.lineTo(canvas.width, y * cs);
  }
  c.stroke();

  // 2. Info Panel
  c.fillStyle = 'rgba(0, 0, 0, 0.75)';
  c.fillRect(8, 8, 200, 135);
  c.strokeStyle = '#38bdf8';
  c.strokeRect(8, 8, 200, 135);

  c.fillStyle = '#38bdf8';
  c.font = '11px monospace';
  c.fillText(`FPS: ${fps}`, 16, 26);
  c.fillText(`STATE: ${currentState}`, 16, 42);
  c.fillText(`PLAYER: (${player.x}, ${player.y}) [${player.state}]`, 16, 58);
  c.fillText(`BOSS: (${Math.floor(boss.x)}, ${Math.floor(boss.y)})`, 16, 74);
  c.fillText(`MINIONS: ${minions.filter(m => m.alive).length}/2 ALIVE`, 16, 90);
  c.fillText(`TRAIL LENGTH: ${trail.length}`, 16, 106);
  c.fillText(`CAPTURED: ${currentCapturedPercent}%`, 16, 122);

  c.restore();
}

// ==========================================
// 12. RUN ENGINE ON LOAD
// ==========================================
window.addEventListener('DOMContentLoaded', initGame);
