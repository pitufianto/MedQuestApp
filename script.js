document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡ IMPORTANTE !!!!!!!!!!!!!!!!!!!!!!!
    // ¡PEGA TUS LLAVES DE SUPABASE AQUÍ!
    // (Las encontraste en Configuración -> API)
    // =========================================================================
    const SUPABASE_URL = 'https://jiqljxlxlhtalpcfyezm.supabase.co'; // Ej: 'https://xxxxxxxx.supabase.co'
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcWxqeGx4bGh0YWxwY2Z5ZXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODg2OTUsImV4cCI6MjA3ODM2NDY5NX0.TN90wsD9pMHR6g_haoYf0kym4aukVLwuazE5sXG7c9g'; // Ej: 'eyJhbGciOi...

    // =========================================================================
    // INICIALIZACIÓN DE SUPABASE
    // =========================================================================
    let supabase;
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) {
        console.error("Error inicializando Supabase:", error);
        alert("Error al conectar con la base de datos. Revisa las llaves en script.js");
        return;
    }

    // =========================================================================
    // CONSTANTES Y VARIABLES GLOBALES
    // =========================================================================
    
    // --- Elementos de Autenticación
    const authSection = document.getElementById('auth-section');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const authEmailInput = document.getElementById('auth-email');
    const authPasswordInput = document.getElementById('auth-password');
    const authMessage = document.getElementById('auth-message');

    // --- Elementos de la App
    const appSection = document.getElementById('app-section');
    const playerLevelSpan = document.getElementById('player-level');
    const playerTitleSpan = document.getElementById('player-title');
    const xpBarFill = document.getElementById('xp-bar-fill');
    const xpText = document.getElementById('xp-text');
    const newQuestTextInput = document.getElementById('new-quest-text');
    const difficultyButtons = document.querySelectorAll('.btn-difficulty');
    const questList = document.getElementById('quest-list');
    const trophyDisplay = document.getElementById('trophy-display');

    // --- Modal de subida de nivel
    const levelUpModal = document.getElementById('level-up-modal');
    const modalNewLevel = document.getElementById('modal-new-level');
    const modalNewTitle = document.getElementById('modal-new-title');
    const closeButtons = document.querySelectorAll('.close-button');

    // --- Estado del Jugador (ahora se carga desde la DB)
    let player = {
        id: null,
        level: 1,
        xp: 0,
        xp_to_next_level: 100
    };
    let localQuests = [];
    let localTrophies = [];

    // --- Datos estáticos del juego
    const levelTitles = [
        "Estudiante Novato", "Aspirante a Interno", "Residente de Anatomía", "Maestro de Fisiología", 
        "Explorador Patológico", "Conocedor Farmacológico", "Clínico Principiante", 
        "Médico en Formación", "Cirujano de Sillón", "Guardián del Conocimiento", "Eminencia Médica"
    ];

    const allTrophies = [
        { id: 'rookie', name: '¡Rookie!', description: 'Alcanza el Nivel 2.', icon: '🏅', minLevel: 2 },
        { id: 'anatomist', name: 'Anatomista', description: 'Alcanza el Nivel 3.', icon: '💀', minLevel: 3 },
        { id: 'physiologist', name: 'Fisiólogo', description: 'Alcanza el Nivel 4.', icon: '❤️', minLevel: 4 },
        { id: 'pathfinder', name: 'Explorador Patológico', description: 'Alcanza el Nivel 5.', icon: '🦠', minLevel: 5 },
        { id: 'pharmacist', name: 'Farmaceuta Novato', description: 'Alcanza el Nivel 6.', icon: '💊', minLevel: 6 },
        { id: 'clinician', name: 'Clínico en Ciernes', description: 'Alcanza el Nivel 7.', icon: '🩺', minLevel: 7 },
        { id: 'wise_one', name: 'Sabio', description: 'Alcanza el Nivel 10.', icon: '🧠', minLevel: 10 },
    ];

    // =========================================================================
    // FUNCIONES DE AUTENTICACIÓN
    // =========================================================================

    async function handleSignUp() {
        const email = authEmailInput.value;
        const password = authPasswordInput.value;
        authMessage.textContent = '';

        if (!email || !password) {
            authMessage.textContent = 'Por favor, ingresa email y contraseña.';
            return;
        }

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            authMessage.textContent = `Error: ${error.message}`;
        } else {
            authMessage.textContent = '¡Registro exitoso! Revisa tu email para confirmar tu cuenta.';
            // Nota: Supabase puede requerir confirmación de email.
            // Para este tutorial, asumimos que podemos iniciar sesión de inmediato.
            // En un caso real, el usuario debe confirmar su email.
            // Por ahora, llamaremos a handleLogin para simplificar.
            await handleLogin();
        }
    }

    async function handleLogin() {
        const email = authEmailInput.value;
        const password = authPasswordInput.value;
        authMessage.textContent = '';

        if (!email || !password) {
            authMessage.textContent = 'Por favor, ingresa email y contraseña.';
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            authMessage.textContent = `Error: ${error.message}`;
        } else if (data.user) {
            // ¡Inicio de sesión exitoso!
            await loadInitialData(data.user.id);
            showApp();
        }
    }

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error al cerrar sesión:', error);
        } else {
            showAuth();
        }
    }

    // =========================================================================
    // FUNCIONES DE DATOS (COMUNICACIÓN CON SUPABASE)
    // =========================================================================

    async function loadInitialData(userId) {
        console.log("Cargando datos para el usuario:", userId);
        
        // 1. Obtener perfil (o crearlo si no existe)
        let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError && profileError.code === 'PGRST116') { // "PGRST116" = Fila no encontrada
            console.log('Perfil no encontrado, creándolo...');
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({ 
                    id: userId, 
                    level: 1, 
                    xp: 0, 
                    xp_to_next_level: 100 
                })
                .select()
                .single();
            
            if (createError) {
                console.error("Error creando perfil:", createError);
                return;
            }
            player = newProfile;
        } else if (profileError) {
            console.error("Error cargando perfil:", profileError);
            return;
        } else {
            player = profile;
        }

        // 2. Cargar Misiones
        const { data: quests, error: questsError } = await supabase
            .from('quests')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (questsError) console.error("Error cargando misiones:", questsError);
        else localQuests = quests || [];

        // 3. Cargar Trofeos
        const { data: trophies, error: trophiesError } = await supabase
            .from('trophies_unlocked')
            .select('*')
            .eq('user_id', userId);
        
        if (trophiesError) console.error("Error cargando trofeos:", trophiesError);
        else localTrophies = trophies || [];

        // 4. Renderizar todo
        updatePlayerInfo();
        renderQuests();
        renderTrophies();
    }

    async function addQuest(text, xp) {
        if (text.trim() === '') return;

        const { data: newQuest, error } = await supabase
            .from('quests')
            .insert({ 
                text: text, 
                xp: xp,
                completed: false,
                user_id: player.id // ¡Importante!
            })
            .select()
            .single();

        if (error) {
            console.error('Error al añadir misión:', error);
        } else {
            localQuests.unshift(newQuest); // Añadir al inicio de la lista
            renderQuests();
        }
        newQuestTextInput.value = '';
    }

    async function completeQuest(questId, xp) {
        // Marcar como completada en la UI
        const questItem = document.querySelector(`[data-id="${questId}"]`);
        if (questItem) questItem.classList.add('completed');
        
        const btn = questItem.querySelector('.complete-quest-btn');
        if(btn) {
            btn.textContent = 'Completada';
            btn.disabled = true;
        }

        // Actualizar en la base de datos
        const { error } = await supabase
            .from('quests')
            .update({ completed: true })
            .eq('id', questId);
        
        if (error) {
            console.error('Error al completar misión:', error);
            // Revertir en la UI si falla (opcional)
        } else {
            // Si tiene éxito, añade XP
            addXP(xp);
        }
    }

    async function addXP(amount) {
        let currentXp = player.xp + amount;
        let currentLevel = player.level;
        let currentXpToNext = player.xp_to_next_level;
        let levelUp = false;

        // Comprobar si sube de nivel
        while (currentXp >= currentXpToNext) {
            currentXp -= currentXpToNext;
            currentLevel++;
            currentXpToNext = Math.floor(currentXpToNext * 1.5);
            levelUp = true;
        }

        // Actualizar el estado local del jugador
        player.xp = currentXp;
        player.level = currentLevel;
        player.xp_to_next_level = currentXpToNext;

        // Actualizar la base de datos
        const { error } = await supabase
            .from('profiles')
            .update({
                xp: player.xp,
                level: player.level,
                xp_to_next_level: player.xp_to_next_level
            })
            .eq('id', player.id);
        
        if (error) console.error("Error al guardar XP/Nivel:", error);

        // Actualizar UI
        updatePlayerInfo();

        if (levelUp) {
            showLevelUpModal();
            await checkTrophyUnlock(); // Comprobar nuevos trofeos al subir de nivel
        }
    }

    async function checkTrophyUnlock() {
        let newTrophiesUnlocked = false;
        
        for (const trophy of allTrophies) {
            const isUnlocked = localTrophies.some(t => t.trophy_id === trophy.id);
            if (player.level >= trophy.minLevel && !isUnlocked) {
                // ¡Nuevo trofeo!
                newTrophiesUnlocked = true;
                
                // Guardar en la DB
                const { data, error } = await supabase
                    .from('trophies_unlocked')
                    .insert({
                        user_id: player.id,
                        trophy_id: trophy.id
                    })
                    .select()
                    .single();

                if (error) {
                    console.error("Error al desbloquear trofeo:", error);
                } else {
                    localTrophies.push(data);
                }
            }
        }
        
        if (newTrophiesUnlocked) {
            renderTrophies();
        }
    }


    // =========================================================================
    // FUNCIONES DE UI (RENDERIZADO)
    // =========================================================================

    function showApp() {
        authSection.style.display = 'none';
        appSection.style.display = 'block';
    }

    function showAuth() {
        authSection.style.display = 'block';
        appSection.style.display = 'none';
    }

    function updatePlayerInfo() {
        playerLevelSpan.textContent = `Nivel ${player.level}`;
        playerTitleSpan.textContent = levelTitles[player.level - 1] || levelTitles[levelTitles.length - 1];
        
        const xpPercentage = (player.xp / player.xp_to_next_level) * 100;
        xpBarFill.style.width = `${xpPercentage}%`;
        xpText.textContent = `${player.xp}/${player.xp_to_next_level} XP`;
    }

    function renderQuests() {
        questList.innerHTML = '';
        if (!localQuests) return;
        
        const questsToShow = localQuests.filter(q => !q.completed);

        if (questsToShow.length === 0) {
            questList.innerHTML = '<li class="quest-item" style="justify-content: center; color: #aaa;">¡Añade tu primera misión!</li>';
        }

        questsToShow.forEach(quest => {
            const listItem = document.createElement('li');
            listItem.classList.add('quest-item');
            listItem.dataset.id = quest.id; // Guardar el ID de la DB
            
            listItem.innerHTML = `
                <span>${quest.text} (+${quest.xp} XP)</span>
                <button class="complete-quest-btn" data-xp="${quest.xp}">Completar</button>
            `;
            questList.appendChild(listItem);
        });
    }

    function renderTrophies() {
        trophyDisplay.innerHTML = '';
        allTrophies.forEach(trophy => {
            const trophyItem = document.createElement('div');
            trophyItem.classList.add('trophy-item');
            
            const isUnlocked = localTrophies.some(t => t.trophy_id === trophy.id);
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

    function showLevelUpModal() {
        modalNewLevel.textContent = `Nivel ${player.level}`;
        modalNewTitle.textContent = levelTitles[player.level - 1] || levelTitles[levelTitles.length - 1];
        levelUpModal.style.display = 'flex';
    }

    function hideLevelUpModal() {
        levelUpModal.style.display = 'none';
    }

    // =========================================================================
    // EVENT LISTENERS
    // =========================================================================

    // --- Autenticación
    loginBtn.addEventListener('click', handleLogin);
    signupBtn.addEventListener('click', handleSignUp);
    logoutBtn.addEventListener('click', handleLogout);

    // --- Añadir Misión
    difficultyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const questText = newQuestTextInput.value;
            const xpValue = parseInt(e.target.dataset.xp);
            addQuest(questText, xpValue);
        });
    });

    // --- Completar Misión
    questList.addEventListener('click', (e) => {
        if (e.target.classList.contains('complete-quest-btn')) {
            const questItem = e.target.closest('.quest-item');
            const questId = parseInt(questItem.dataset.id);
            const xpValue = parseInt(e.target.dataset.xp);
            completeQuest(questId, xpValue);
        }
    });

    // --- Modal
    closeButtons.forEach(button => {
        button.addEventListener('click', hideLevelUpModal);
    });
    window.addEventListener('click', (e) => {
        if (e.target == levelUpModal) {
            hideLevelUpModal();
        }
    });

    // =========================================================================
    // INICIALIZACIÓN AL CARGAR LA PÁGINA
    // =========================================================================
    async function checkUserSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error al obtener sesión:", error);
            showAuth();
            return;
        }

        if (session && session.user) {
            // Usuario ya tiene sesión, cargar sus datos
            await loadInitialData(session.user.id);
            showApp();
        } else {
            // No hay sesión, mostrar pantalla de login
            showAuth();
        }
    }

    checkUserSession(); // Iniciar la app

});