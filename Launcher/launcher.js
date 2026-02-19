// Game Launcher System
let userData = {
    username: 'Новичок',
    level: 1,
    gamesOwned: 0,
    playtime: 0,
    likes: 0,
    rank: 'newbie',
    achievements: []
};

let myGames = [];
let storeGames = [];
let currentGame = null;

// Ranks
const ranks = {
    newbie: { name: 'Новичок', minGames: 0, bonus: 1000 },
    legend: { name: 'Легенда', minGames: 1000, bonus: 90 }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    generateStoreGames();
    giveNewbieBonus();
    updateUI();
    setupEventListeners();
});

// Generate 1000+ games for store
function generateStoreGames() {
    const categories = ['action', 'puzzle', 'arcade', 'adventure'];
    const gameTypes = [
        'Runner', 'Shooter', 'Platformer', 'Racing', 'Fighting',
        'Match-3', 'Tetris', 'Sudoku', 'Maze', 'Memory',
        'Clicker', 'Snake', 'Pong', 'Breakout', 'Space Invaders',
        'Tower Defense', 'RPG', 'Strategy', 'Card', 'Board'
    ];
    
    const adjectives = [
        'Super', 'Mega', 'Ultra', 'Epic', 'Crazy', 'Wild', 'Extreme',
        'Turbo', 'Hyper', 'Ninja', 'Zombie', 'Robot', 'Space', 'Pixel',
        'Retro', 'Neon', 'Dark', 'Light', 'Fire', 'Ice'
    ];
    
    storeGames = [];
    
    for (let i = 0; i < 1090; i++) {
        const type = gameTypes[Math.floor(Math.random() * gameTypes.length)];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        storeGames.push({
            id: 'game_' + i,
            name: `${adj} ${type} ${i + 1}`,
            category: category,
            description: `Увлекательная ${type} игра с потрясающим геймплеем!`,
            icon: getGameIcon(category),
            likes: Math.floor(Math.random() * 1000),
            path: `games/${category}/${type.toLowerCase()}_${i}.html`,
            inLibrary: false,
            favorite: false
        });
    }
}

function getGameIcon(category) {
    const icons = {
        action: '⚔️',
        puzzle: '🧩',
        arcade: '🕹️',
        adventure: '🗺️'
    };
    return icons[category] || '🎮';
}

// Give newbie bonus
function giveNewbieBonus() {
    if (userData.gamesOwned === 0) {
        // Добавляем 2 реальные игры
        const realGames = [
            {
                id: 'game_snake',
                name: 'Snake Game',
                category: 'arcade',
                description: 'Классическая змейка! Управление стрелками.',
                icon: '🐍',
                likes: 999,
                path: 'demo-games/snake.html',
                inLibrary: true,
                favorite: false,
                isReal: true
            },
            {
                id: 'game_pong',
                name: 'Pong Game',
                category: 'arcade',
                description: 'Классический пинг-понг! W/S и стрелки.',
                icon: '🏓',
                likes: 888,
                path: 'demo-games/pong.html',
                inLibrary: true,
                favorite: false,
                isReal: true
            }
        ];
        
        realGames.forEach(game => {
            myGames.push(game);
            userData.gamesOwned++;
        });
        
        // Остальные 998 игр - демо версии
        for (let i = 0; i < 998; i++) {
            if (storeGames[i]) {
                storeGames[i].isReal = false;
                addGameToLibrary(storeGames[i]);
            }
        }
        
        showNotification('🎉 Добро пожаловать! Вы получили 1000 игр! 2 реальные игры готовы к запуску!');
        checkRankUp();
    }
}

// Add game to library
function addGameToLibrary(game) {
    if (!game.inLibrary) {
        game.inLibrary = true;
        myGames.push(game);
        userData.gamesOwned++;
        saveUserData();
        updateUI();
    }
}

// Check rank up
function checkRankUp() {
    if (userData.rank === 'newbie' && userData.gamesOwned >= 1000) {
        userData.rank = 'legend';
        userData.level = 10;
        
        // Give 90 bonus games
        let bonusCount = 0;
        for (let i = 1000; i < storeGames.length && bonusCount < 90; i++) {
            if (!storeGames[i].inLibrary) {
                addGameToLibrary(storeGames[i]);
                bonusCount++;
            }
        }
        
        unlockAchievement('legend');
        showNotification('🏆 Поздравляем! Вы стали ЛЕГЕНДОЙ! +90 игр в подарок!');
        saveUserData();
        updateUI();
    }
}

// Achievements
const achievements = [
    { id: 'first_game', name: 'Первая игра', description: 'Добавьте первую игру', icon: '🎮', unlocked: false },
    { id: 'collector', name: 'Коллекционер', description: 'Соберите 100 игр', icon: '📚', unlocked: false },
    { id: 'legend', name: 'Легенда', description: 'Достигните ранга Легенда', icon: '👑', unlocked: false },
    { id: 'liker', name: 'Ценитель', description: 'Поставьте 50 лайков', icon: '❤️', unlocked: false },
    { id: 'gamer', name: 'Геймер', description: 'Играйте 10 часов', icon: '⏰', unlocked: false }
];

function unlockAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        userData.achievements.push(id);
        showNotification(`🏆 Достижение разблокировано: ${achievement.name}!`);
        saveUserData();
    }
}

// UI Updates
function updateUI() {
    // User info
    document.getElementById('username').textContent = userData.username;
    document.getElementById('user-level').textContent = userData.level;
    document.getElementById('library-count').textContent = userData.gamesOwned;
    
    // Profile stats
    document.getElementById('total-games').textContent = userData.gamesOwned;
    document.getElementById('total-playtime').textContent = userData.playtime;
    document.getElementById('total-likes').textContent = userData.likes;
    
    // Rank
    const rankInfo = ranks[userData.rank];
    document.getElementById('rank-name').textContent = rankInfo.name;
    
    const progress = Math.min((userData.gamesOwned / 1000) * 100, 100);
    document.getElementById('rank-progress').style.width = progress + '%';
    
    if (userData.rank === 'legend') {
        document.getElementById('rank-description').textContent = 'Вы достигли максимального ранга!';
    } else {
        document.getElementById('rank-description').textContent = `${userData.gamesOwned}/1000 игр до ранга Легенда`;
    }
    
    // Render games
    renderLibrary();
    renderStore();
    renderAchievements();
}

function renderLibrary() {
    const grid = document.getElementById('games-grid');
    grid.innerHTML = '';
    
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filter = document.getElementById('filter-select').value;
    
    let filteredGames = myGames.filter(game => {
        if (searchTerm && !game.name.toLowerCase().includes(searchTerm)) return false;
        if (filter === 'favorites' && !game.favorite) return false;
        return true;
    });
    
    if (filteredGames.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; font-size: 1.2rem;">Игры не найдены</p>';
        return;
    }
    
    filteredGames.forEach(game => {
        const card = createGameCard(game);
        grid.appendChild(card);
    });
}

function renderStore() {
    const grid = document.getElementById('store-grid');
    grid.innerHTML = '';
    
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    
    let filteredGames = storeGames.filter(game => {
        if (game.inLibrary) return false;
        if (activeCategory !== 'all' && game.category !== activeCategory) return false;
        return true;
    });
    
    filteredGames.slice(0, 50).forEach(game => {
        const card = createGameCard(game, true);
        grid.appendChild(card);
    });
}

function createGameCard(game, isStore = false) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    // Все игры теперь играбельны!
    const realBadge = '<span style="background: #00ff00; color: #000; padding: 3px 8px; border-radius: 10px; font-size: 0.8rem; font-weight: bold;">▶ ИГРАТЬ</span>';
    
    card.innerHTML = `
        <div class="game-thumbnail">${game.icon}</div>
        <div class="game-info">
            <div class="game-title">${game.name}</div>
            <div class="game-category">${getCategoryName(game.category)}</div>
            <div class="game-stats">
                <span>❤️ ${game.likes}</span>
                ${game.favorite ? '<span>⭐</span>' : ''}
                ${!isStore ? realBadge : ''}
            </div>
        </div>
    `;
    
    card.onclick = () => openGameModal(game, isStore);
    
    return card;
}

function getCategoryName(category) {
    const names = {
        action: 'Экшен',
        puzzle: 'Головоломка',
        arcade: 'Аркада',
        adventure: 'Приключение'
    };
    return names[category] || category;
}

function renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';
    
    achievements.forEach(achievement => {
        const unlocked = userData.achievements.includes(achievement.id);
        
        const card = document.createElement('div');
        card.className = 'achievement-card' + (unlocked ? ' unlocked' : '');
        
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
        `;
        
        grid.appendChild(card);
    });
}

// Modal
function openGameModal(game, isStore) {
    currentGame = game;
    
    document.getElementById('modal-game-title').textContent = game.name;
    document.getElementById('modal-game-description').textContent = game.description;
    document.getElementById('like-count').textContent = game.likes;
    
    const playBtn = document.getElementById('play-game-btn');
    const favoriteBtn = document.getElementById('favorite-game-btn');
    
    if (isStore) {
        playBtn.textContent = '➕ Добавить в библиотеку';
        playBtn.onclick = () => {
            addGameToLibrary(game);
            closeModal();
            showNotification(`✅ ${game.name} добавлена в библиотеку!`);
        };
    } else {
        playBtn.textContent = '▶ Играть';
        playBtn.style.background = 'linear-gradient(135deg, #00ff00, #00cc00)';
        playBtn.onclick = () => playGame(game);
    }
    
    favoriteBtn.textContent = game.favorite ? '⭐ Убрать из избранного' : '⭐ В избранное';
    favoriteBtn.onclick = () => toggleFavorite(game);
    
    document.getElementById('game-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('game-modal').classList.remove('active');
}

function playGame(game) {
    // Проверяем, это реальная игра или нужно сгенерировать
    if (game.isReal || game.id.startsWith('custom_')) {
        // Реальная игра - открываем по пути
        const fullPath = game.path.startsWith('http') ? game.path : game.path;
        window.open(fullPath, '_blank');
        userData.playtime++;
        saveUserData();
    } else {
        // Генерируем игру на лету
        generateAndPlayGame(game);
        userData.playtime++;
        saveUserData();
    }
    
    closeModal();
}

function generateAndPlayGame(game) {
    let gameHTML = '';
    
    // Выбираем шаблон игры в зависимости от категории
    if (game.category === 'arcade') {
        gameHTML = generateArcadeGame(game);
    } else if (game.category === 'puzzle') {
        gameHTML = generatePuzzleGame(game);
    } else if (game.category === 'action') {
        gameHTML = generateActionGame(game);
    } else if (game.category === 'adventure') {
        gameHTML = generateAdventureGame(game);
    }
    
    // Открываем игру в новом окне
    const blob = new Blob([gameHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function generateArcadeGame(game) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    const playerColor = colors[Math.floor(Math.random() * colors.length)];
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${game.name}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, ${bgColor}33, #000);
            font-family: Arial, sans-serif;
            overflow: hidden;
        }
        canvas {
            border: 3px solid ${bgColor};
            box-shadow: 0 0 30px ${bgColor}88;
        }
        #score {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: ${bgColor};
            font-size: 2rem;
            font-weight: bold;
            text-shadow: 0 0 10px ${bgColor};
        }
        #info {
            position: absolute;
            bottom: 20px;
            color: white;
            font-size: 1rem;
        }
    </style>
</head>
<body>
    <div id="score">Счёт: 0</div>
    <canvas id="game" width="600" height="400"></canvas>
    <div id="info">Управление: Стрелки или WASD | Собирайте квадраты!</div>
    <script>
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        
        let player = { x: 300, y: 200, size: 20, speed: 5 };
        let targets = [];
        let score = 0;
        let keys = {};
        
        document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
        document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
        
        function spawnTarget() {
            targets.push({
                x: Math.random() * (canvas.width - 20),
                y: Math.random() * (canvas.height - 20),
                size: 15 + Math.random() * 15
            });
        }
        
        function update() {
            if (keys['arrowleft'] || keys['a']) player.x -= player.speed;
            if (keys['arrowright'] || keys['d']) player.x += player.speed;
            if (keys['arrowup'] || keys['w']) player.y -= player.speed;
            if (keys['arrowdown'] || keys['s']) player.y += player.speed;
            
            player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
            player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
            
            targets = targets.filter(target => {
                const dx = player.x - target.x;
                const dy = player.y - target.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < player.size) {
                    score += 10;
                    document.getElementById('score').textContent = 'Счёт: ' + score;
                    return false;
                }
                return true;
            });
            
            if (Math.random() < 0.02) spawnTarget();
        }
        
        function draw() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '${playerColor}';
            ctx.fillRect(player.x, player.y, player.size, player.size);
            
            targets.forEach(target => {
                ctx.fillStyle = '${bgColor}';
                ctx.fillRect(target.x, target.y, target.size, target.size);
            });
        }
        
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
        
        for (let i = 0; i < 5; i++) spawnTarget();
        gameLoop();
    </script>
</body>
</html>`;
}

function generatePuzzleGame(game) {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${game.name}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea, #764ba2);
            font-family: Arial, sans-serif;
        }
        #score {
            color: white;
            font-size: 2rem;
            margin-bottom: 20px;
            text-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        #grid {
            display: grid;
            grid-template-columns: repeat(4, 100px);
            gap: 10px;
        }
        .tile {
            width: 100px;
            height: 100px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
            color: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .tile:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div id="score">Счёт: 0 | Ходов: 0</div>
    <div id="grid"></div>
    <script>
        const colors = ${JSON.stringify(colors)};
        const grid = document.getElementById('grid');
        let tiles = [];
        let score = 0;
        let moves = 0;
        let firstTile = null;
        
        function createTiles() {
            const pairs = [];
            for (let i = 0; i < 8; i++) {
                const emoji = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎤'][i];
                pairs.push(emoji, emoji);
            }
            pairs.sort(() => Math.random() - 0.5);
            
            grid.innerHTML = '';
            tiles = pairs.map((emoji, i) => {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.style.background = colors[i % colors.length];
                tile.dataset.emoji = emoji;
                tile.textContent = '?';
                tile.onclick = () => flipTile(tile);
                grid.appendChild(tile);
                return tile;
            });
        }
        
        function flipTile(tile) {
            if (tile.classList.contains('found') || tile === firstTile) return;
            
            tile.textContent = tile.dataset.emoji;
            
            if (!firstTile) {
                firstTile = tile;
            } else {
                moves++;
                if (firstTile.dataset.emoji === tile.dataset.emoji) {
                    score += 10;
                    firstTile.classList.add('found');
                    tile.classList.add('found');
                    firstTile = null;
                } else {
                    const temp = firstTile;
                    setTimeout(() => {
                        temp.textContent = '?';
                        tile.textContent = '?';
                    }, 500);
                    firstTile = null;
                }
                document.getElementById('score').textContent = \`Счёт: \${score} | Ходов: \${moves}\`;
            }
        }
        
        createTiles();
    </script>
</body>
</html>`;
}

function generateActionGame(game) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${game.name}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #1a1a1a;
            font-family: Arial, sans-serif;
        }
        canvas {
            border: 3px solid #ff0000;
            box-shadow: 0 0 30px #ff000088;
        }
        #hud {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: #ff0000;
            font-size: 1.5rem;
            font-weight: bold;
            text-shadow: 0 0 10px #ff0000;
        }
    </style>
</head>
<body>
    <div id="hud">❤️ HP: 100 | 💀 Убито: 0</div>
    <canvas id="game" width="600" height="400"></canvas>
    <script>
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        
        let player = { x: 300, y: 350, size: 20, hp: 100 };
        let enemies = [];
        let bullets = [];
        let killed = 0;
        let keys = {};
        
        document.addEventListener('keydown', e => {
            keys[e.key.toLowerCase()] = true;
            if (e.key === ' ') shoot();
        });
        document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
        
        function shoot() {
            bullets.push({ x: player.x + 10, y: player.y, speed: 7 });
        }
        
        function spawnEnemy() {
            enemies.push({
                x: Math.random() * canvas.width,
                y: -20,
                size: 15,
                speed: 1 + Math.random() * 2
            });
        }
        
        function update() {
            if (keys['arrowleft'] || keys['a']) player.x -= 5;
            if (keys['arrowright'] || keys['d']) player.x += 5;
            
            player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
            
            bullets = bullets.filter(b => {
                b.y -= b.speed;
                return b.y > 0;
            });
            
            enemies = enemies.filter(e => {
                e.y += e.speed;
                
                if (e.y > canvas.height) return false;
                
                const hitPlayer = Math.abs(e.x - player.x) < 20 && Math.abs(e.y - player.y) < 20;
                if (hitPlayer) {
                    player.hp -= 10;
                    if (player.hp <= 0) {
                        alert('Игра окончена! Убито врагов: ' + killed);
                        location.reload();
                    }
                    return false;
                }
                
                const hitBullet = bullets.some(b => Math.abs(b.x - e.x) < 15 && Math.abs(b.y - e.y) < 15);
                if (hitBullet) {
                    killed++;
                    bullets = bullets.filter(b => !(Math.abs(b.x - e.x) < 15 && Math.abs(b.y - e.y) < 15));
                    return false;
                }
                
                return true;
            });
            
            document.getElementById('hud').textContent = \`❤️ HP: \${player.hp} | 💀 Убито: \${killed}\`;
            
            if (Math.random() < 0.02) spawnEnemy();
        }
        
        function draw() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(player.x, player.y, player.size, player.size);
            
            ctx.fillStyle = '#ffff00';
            bullets.forEach(b => ctx.fillRect(b.x, b.y, 5, 10));
            
            ctx.fillStyle = '#ff0000';
            enemies.forEach(e => ctx.fillRect(e.x, e.y, e.size, e.size));
        }
        
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
        
        gameLoop();
    </script>
</body>
</html>`;
}

function generateAdventureGame(game) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${game.name}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #2c3e50, #34495e);
            font-family: Arial, sans-serif;
        }
        canvas {
            border: 3px solid #3498db;
            box-shadow: 0 0 30px #3498db88;
        }
        #info {
            position: absolute;
            top: 20px;
            color: #3498db;
            font-size: 1.5rem;
            text-shadow: 0 0 10px #3498db;
        }
    </style>
</head>
<body>
    <div id="info">💎 Собрано: 0/10 | 🗝️ Ключи: 0</div>
    <canvas id="game" width="600" height="400"></canvas>
    <script>
        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        
        let player = { x: 50, y: 50, size: 20 };
        let gems = [];
        let keys = {};
        let collected = 0;
        let keysFound = 0;
        
        document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
        document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
        
        for (let i = 0; i < 10; i++) {
            gems.push({
                x: 50 + Math.random() * 500,
                y: 50 + Math.random() * 300,
                type: Math.random() > 0.7 ? 'key' : 'gem'
            });
        }
        
        function update() {
            if (keys['arrowleft'] || keys['a']) player.x -= 3;
            if (keys['arrowright'] || keys['d']) player.x += 3;
            if (keys['arrowup'] || keys['w']) player.y -= 3;
            if (keys['arrowdown'] || keys['s']) player.y += 3;
            
            player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
            player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
            
            gems = gems.filter(gem => {
                const dx = player.x - gem.x;
                const dy = player.y - gem.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 20) {
                    if (gem.type === 'key') keysFound++;
                    else collected++;
                    
                    if (collected >= 10) {
                        alert('Победа! Все алмазы собраны!');
                        location.reload();
                    }
                    return false;
                }
                return true;
            });
            
            document.getElementById('info').textContent = \`💎 Собрано: \${collected}/10 | 🗝️ Ключи: \${keysFound}\`;
        }
        
        function draw() {
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#3498db';
            ctx.fillRect(player.x, player.y, player.size, player.size);
            
            gems.forEach(gem => {
                ctx.fillStyle = gem.type === 'key' ? '#f39c12' : '#e74c3c';
                ctx.beginPath();
                ctx.arc(gem.x, gem.y, 8, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
        
        gameLoop();
    </script>
</body>
</html>`;
}

function showGameDemo(game) {
    // Создаем простую демо-страницу для игры
    const demoHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${game.name}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea, #764ba2);
            font-family: Arial, sans-serif;
            color: white;
        }
        .demo-container {
            text-align: center;
            padding: 40px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 20px;
            max-width: 600px;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        .icon {
            font-size: 5rem;
            margin-bottom: 20px;
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .info {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="demo-container">
        <div class="icon">${game.icon}</div>
        <h1>${game.name}</h1>
        <p>${game.description}</p>
        <div class="info">
            <p><strong>Категория:</strong> ${getCategoryName(game.category)}</p>
            <p><strong>❤️ Лайков:</strong> ${game.likes}</p>
            <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">
                Это демо-версия. Чтобы добавить реальную игру, используйте раздел "Добавить игру" в лаунчере.
            </p>
        </div>
    </div>
</body>
</html>
    `;
    
    const blob = new Blob([demoHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Очищаем URL через 1 секунду
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function toggleFavorite(game) {
    game.favorite = !game.favorite;
    saveUserData();
    updateUI();
    openGameModal(game, false);
}

// Event Listeners
function setupEventListeners() {
    // Menu navigation
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const page = btn.dataset.page;
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(page + '-page').classList.add('active');
        });
    });
    
    // Search
    document.getElementById('search-input').addEventListener('input', renderLibrary);
    document.getElementById('filter-select').addEventListener('change', renderLibrary);
    
    // Store categories
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderStore();
        });
    });
    
    // Profile
    document.getElementById('save-username-btn').addEventListener('click', () => {
        const newName = document.getElementById('username-input').value.trim();
        if (newName) {
            userData.username = newName;
            saveUserData();
            updateUI();
            showNotification('✅ Имя сохранено!');
        }
    });
    
    // Add custom game
    document.getElementById('add-game-btn').addEventListener('click', () => {
        const name = document.getElementById('game-name').value.trim();
        const path = document.getElementById('game-path').value.trim();
        const category = document.getElementById('game-category').value;
        const description = document.getElementById('game-description').value.trim();
        
        if (name && path) {
            const newGame = {
                id: 'custom_' + Date.now(),
                name: name,
                category: category,
                description: description || 'Пользовательская игра',
                icon: getGameIcon(category),
                likes: 0,
                path: path,
                inLibrary: true,
                favorite: false,
                isReal: true
            };
            
            myGames.push(newGame);
            userData.gamesOwned++;
            
            if (userData.gamesOwned === 1) {
                unlockAchievement('first_game');
            }
            
            saveUserData();
            updateUI();
            showNotification('✅ Игра добавлена!');
            
            // Clear form
            document.getElementById('game-name').value = '';
            document.getElementById('game-path').value = '';
            document.getElementById('game-description').value = '';
        } else {
            showNotification('❌ Заполните название и путь!');
        }
    });
    
    // Modal
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('like-game-btn').addEventListener('click', () => {
        if (currentGame) {
            currentGame.likes++;
            userData.likes++;
            
            if (userData.likes >= 50) {
                unlockAchievement('liker');
            }
            
            saveUserData();
            updateUI();
            openGameModal(currentGame, !currentGame.inLibrary);
        }
    });
}

// Notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 1.1rem;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Storage
function saveUserData() {
    localStorage.setItem('gameLauncherUser', JSON.stringify(userData));
    localStorage.setItem('gameLauncherGames', JSON.stringify(myGames));
}

function loadUserData() {
    const savedUser = localStorage.getItem('gameLauncherUser');
    const savedGames = localStorage.getItem('gameLauncherGames');
    
    if (savedUser) {
        userData = JSON.parse(savedUser);
    }
    
    if (savedGames) {
        myGames = JSON.parse(savedGames);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('🎮 Game Launcher loaded!');
