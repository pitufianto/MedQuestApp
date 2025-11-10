document.addEventListener('DOMContentLoaded', () => {
    const playerLevelSpan = document.getElementById('player-level');
    const playerTitleSpan = document.getElementById('player-title');
    const xpBarFill = document.getElementById('xp-bar-fill');
    const xpText = document.getElementById('xp-text');
    const newQuestTextInput = document.getElementById('new-quest-text');
    const difficultyButtons = document.querySelectorAll('.btn-difficulty');
    const questList = document.getElementById('quest-list');
    const trophyDisplay = document.getElementById('trophy-display');

    // Modal de subida de nivel
    const levelUpModal = document.getElementById('level-up-modal');
    const modalNewLevel = document.getElementById('modal-new-level');
    const modalNewTitle = document.getElementById('modal-new-title');
    const closeButtons = document.querySelectorAll('.close-button');

    let player = {
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        quests: [],
        trophies: {} // Objeto para guardar el estado de los trofeos
    };

    const levelTitles = [
        "Estudiante Novato", // Nivel 1
        "Aspirante a Interno", // Nivel 2
        "Residente de Anatomía", // Nivel 3
        "Maestro de Fisiología", // Nivel 4
        "Explorador Patológico", // Nivel 5
        "Conocedor Farmacológico", // Nivel 6
        "Clínico Principiante", // Nivel 7
        "Médico en Formación", // Nivel 8
        "Cirujano de Sillón", // Nivel 9
        "Guardián del Conocimiento", // Nivel 10
        "Eminencia Médica" // Nivel 11 y más allá
    ];

    const allTrophies = [
        { id: 'rookie', name: '¡Rookie!', description: 'Alcanza el Nivel 2.', icon: '🏅', minLevel: 2 },
        { id: 'anatomist', name: 'Anatomista', description: 'Alcanza el Nivel 3.', icon: '💀', minLevel: 3 },
        { id: 'physiologist', name: 'Fisiólogo', description: 'Alcanza el Nivel 4.', icon: '❤️', minLevel: 4 },
        { id: 'pathfinder', name: 'Explorador Patológico', description: 'Alcanza el Nivel 5.', icon: '🦠', minLevel: 5 },
        { id: 'pharmacist', name: 'Farmaceuta Novato', description: 'Alcanza el Nivel 6.', icon: '💊', minLevel: 6 },
        { id: 'clinician', name: 'Clínico en Ciernes', description: 'Alcanza el Nivel 7.', icon: '🩺', minLevel: 7 },
        { id: 'wise_one', name: 'Sabio', description: 'Alcanza el Nivel 10.', icon: '🧠', minLevel: 10 },
        // Puedes añadir más trofeos aquí
    ];

    // --- Funciones de Guardado/Carga ---
    function saveGame() {
        localStorage.setItem('medQuestPlayer', JSON.stringify(player));
    }

    function loadGame() {
        const savedPlayer = localStorage.getItem('medQuestPlayer');
        if (savedPlayer) {
            player = JSON.parse(savedPlayer);
            // Asegurarse de que 'trophies' exista
            if (!player.trophies) {
                player.trophies = {};
            }
        }
    }

    // --- Funciones de Actualización de UI ---
    function updatePlayerInfo() {
        playerLevelSpan.textContent = `Nivel ${player.level}`;
        playerTitleSpan.textContent = levelTitles[player.level - 1] || levelTitles[levelTitles.length - 1]; // Usa el último título si se supera el array
        
        const xpPercentage = (player.xp / player.xpToNextLevel) * 100;
        xpBarFill.style.width = `${xpPercentage}%`;
        xpText.textContent = `${player.xp}/${player.xpToNextLevel} XP`;
    }

    function renderQuests() {
        questList.innerHTML = '';
        player.quests.forEach((quest, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('quest-item');
            if (quest.completed) {
                listItem.classList.add('completed');
            }
            listItem.innerHTML = `
                <span>${quest.text} (+${quest.xp} XP)</span>
                <button class="complete-quest-btn" data-index="${index}" ${quest.completed ? 'disabled' : ''}>${quest.completed ? 'Completada' : 'Completar'}</button>
            `;
            questList.appendChild(listItem);
        });
    }

    function renderTrophies() {
        trophyDisplay.innerHTML = '';
        allTrophies.forEach(trophy => {
            const trophyItem = document.createElement('div');
            trophyItem.classList.add('trophy-item');
            
            const isUnlocked = player.trophies[trophy.id] || false;
            if (isUnlocked) {
                trophyItem.classList.add('unlocked');
            }

            trophyItem.innerHTML = `
                <span class="trophy-icon">${trophy.icon}</span>
                <div class="trophy-name">${trophy.name}</div>
                <div class="trophy-desc">${trophy.description}</div>
            `;
            trophyDisplay.appendChild(trophyItem);
        });
    }

    // --- Lógica del Juego ---
    function addXP(amount) {
        player.xp += amount;
        
        // Comprobar si sube de nivel
        while (player.xp >= player.xpToNextLevel) {
            player.xp -= player.xpToNextLevel; // Resta el XP del nivel actual
            player.level++;
            player.xpToNextLevel = Math.floor(player.xpToNextLevel * 1.5); // Siguiente nivel requiere más XP
            showLevelUpModal(); // Mostrar modal de subida de nivel
            checkTrophyUnlock(); // Comprobar nuevos trofeos al subir de nivel
        }
        updatePlayerInfo();
        saveGame();
    }

    function addQuest(text, xp) {
        if (text.trim() === '') return;
        player.quests.push({ text, xp, completed: false });
        renderQuests();
        saveGame();
        newQuestTextInput.value = ''; // Limpiar el input
    }

    function completeQuest(index) {
        if (player.quests[index] && !player.quests[index].completed) {
            player.quests[index].completed = true;
            addXP(player.quests[index].xp);
            renderQuests(); // Actualizar la lista para mostrar la tarea como completada
            saveGame();
        }
    }

    function checkTrophyUnlock() {
        allTrophies.forEach(trophy => {
            if (player.level >= trophy.minLevel && !player.trophies[trophy.id]) {
                player.trophies[trophy.id] = true; // Desbloquear trofeo
                // Opcional: Mostrar una notificación de trofeo desbloqueado
                console.log(`¡Trofeo desbloqueado: ${trophy.name}!`);
            }
        });
        renderTrophies();
        saveGame();
    }

    function showLevelUpModal() {
        modalNewLevel.textContent = `Nivel ${player.level}`;
        modalNewTitle.textContent = levelTitles[player.level - 1] || levelTitles[levelTitles.length - 1];
        levelUpModal.style.display = 'flex'; // Mostrar el modal
    }

    function hideLevelUpModal() {
        levelUpModal.style.display = 'none'; // Ocultar el modal
    }

    // --- Event Listeners ---
    difficultyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const questText = newQuestTextInput.value;
            const xpValue = parseInt(e.target.dataset.xp);
            addQuest(questText, xpValue);
        });
    });

    questList.addEventListener('click', (e) => {
        if (e.target.classList.contains('complete-quest-btn')) {
            const index = parseInt(e.target.dataset.index);
            completeQuest(index);
        }
    });

    // Cerrar modal al hacer click en el botón o fuera de él
    closeButtons.forEach(button => {
        button.addEventListener('click', hideLevelUpModal);
    });
    window.addEventListener('click', (e) => {
        if (e.target == levelUpModal) {
            hideLevelUpModal();
        }
    });


    // --- Inicialización ---
    loadGame(); // Cargar datos al inicio
    updatePlayerInfo(); // Actualizar la UI del jugador
    renderQuests(); // Renderizar las misiones
    renderTrophies(); // Renderizar los trofeos
});