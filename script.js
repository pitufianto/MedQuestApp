document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡ IMPORTANTE !!!!!!!!!!!!!!!!!!!!!!!
    // ¡PEGA TUS LLAVES DE SUPABASE AQUÍ!
    // =========================================================================
    const SUPABASE_URL = 'https://jiqljxlxlhtalpcfyezm.supabase.co'; 
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcWxqeGx4bGh0YWxwY2Z5ZXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODg2OTUsImV4cCI6MjA3ODM2NDY5NX0.TN90wsD9pMHR6g_haoYf0kym4aukVLwuazE5sXG7c9g'; 

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
    
    // --- Autenticación
    const authSection = document.getElementById('auth-section');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const authEmailInput = document.getElementById('auth-email');
    const authPasswordInput = document.getElementById('auth-password');
    const authMessage = document.getElementById('auth-message');

    // --- Elementos App
    const appSection = document.getElementById('app-section');
    
    // --- Página Home
    const playerLevelSpan = document.getElementById('player-level');
    const xpBarFill = document.getElementById('xp-bar-fill');
    const xpText = document.getElementById('xp-text');
    const logStudyForm = document.querySelector('.log-study-form');
    const selectMateria = document.getElementById('select-materia');
    const selectTema = document.getElementById('select-tema');
    const logMinutesInput = document.getElementById('log-minutes');
    const logStudyTypeInput = document.getElementById('log-study-type'); 
    const logStudyBtn = document.getElementById('log-study-btn');
    const recentActivityList = document.getElementById('recent-activity-list');
    
    // --- Página Perfil
    const trophyDisplay = document.getElementById('trophy-display');
    const totalMinutesDisplay = document.getElementById('total-minutes-display'); 
    const totalSessionsDisplay = document.getElementById('total-sessions-display'); 
    const streakDisplay = document.getElementById('streak-display'); 
    const studyTypeChartCtx = document.getElementById('study-type-chart'); 
    let studyTypeChart = null; 
    const materiaMinutesChartCtx = document.getElementById('materia-minutes-chart'); 
    let materiaMinutesChart = null; 
    const studyHourChartCtx = document.getElementById('study-hour-chart'); 
    let studyHourChart = null; 

    // --- Página Habilidades (Materias)
    const materiasListContainer = document.getElementById('materias-list-container');
    const showAddMateriaBtn = document.getElementById('show-add-materia-btn');
    const addMateriaModal = document.getElementById('add-materia-modal');
    const saveMateriaBtn = document.getElementById('save-materia-btn');
    const newMateriaNameInput = document.getElementById('new-materia-name');

    // --- Página Temas
    const temasPage = document.getElementById('page-temas');
    const temasPageTitle = document.getElementById('temas-page-title');
    const temasListContainer = document.getElementById('temas-list-container');
    const showAddTemaBtn = document.getElementById('show-add-tema-btn');
    const addTemaModal = document.getElementById('add-tema-modal');
    const saveTemaBtn = document.getElementById('save-tema-btn');
    const newTemaNameInput = document.getElementById('new-tema-name');
    const newTemaGoalInput = document.getElementById('new-tema-goal');
    const backToMateriasBtn = document.getElementById('back-to-materias-btn');

    // --- Modales
    const levelUpModal = document.getElementById('level-up-modal');
    const modalNewLevel = document.getElementById('modal-new-level');
    const modalNewTitle = document.getElementById('modal-new-title');
    const closeButtons = document.querySelectorAll('.close-button'); 
    const mainCloseButtons = document.querySelectorAll('.close-button-main'); // ¡ARREGLO! (Ahora son varios)
    const trophyDetailsModal = document.getElementById('trophy-details-modal');
    const trophyModalIcon = document.getElementById('trophy-modal-icon');
    const trophyModalName = document.getElementById('trophy-modal-name');
    const trophyModalDesc = document.getElementById('trophy-modal-desc');
    const trophyModalStatus = document.getElementById('trophy-modal-status');
    const trophyModalContent = trophyDetailsModal.querySelector('.modal-content');
    const badgeUnlockedModal = document.getElementById('badge-unlocked-modal');
    const badgeModalIcon = document.getElementById('badge-modal-icon');
    const badgeModalName = document.getElementById('badge-modal-name');


    // --- Navegación
    const bottomNav = document.querySelector('.bottom-nav');
    const navHomeBtn = document.getElementById('nav-home');
    const navSkillsBtn = document.getElementById('nav-skills');
    const navProfileBtn = document.getElementById('nav-profile');
    const navButtons = document.querySelectorAll('.nav-button');
    const pageContents = document.querySelectorAll('.page-content');

    // --- Estado del Jugador (Datos locales)
    let player = { id: null, level: 1, xp: 0, xp_to_next_level: 100 };
    let localTrophies = []; 
    let localMaterias = []; 
    let localTemas = []; 
    let currentMateria = null; 
    let allLogs = []; 

    // --- ¡LISTA MAESTRA DE TROFEOS! (Sin cambios)
    const levelTitles = [ "Estudiante Novato", "Aspirante a Interno", "Residente de Anatomía", "Maestro de Fisiología", "Explorador Patológico", "Conocedor Farmacológico", "Clínico Principiante", "Médico en Formación", "Cirujano de Sillón", "Guardián del Conocimiento", "Eminencia Médica" ];
    const allTrophies = [
        { id: 'level_10', name: '¡Ya no soy Rookie!', description: 'Alcanza Nivel 10 de Jugador', icon: '🔥' },
        { id: 'level_25', name: 'Poder sobre 9.000', description: 'Alcanza Nivel 25 de Jugador', icon: '💥' },
        { id: 'level_50', name: 'Eminencia Médica', description: 'Alcanza Nivel 50 de Jugador', icon: '👑' },
        { id: 'first_log', name: 'Baby Steps', description: 'Completa tu primer registro', icon: '👣' },
        { id: 'minutes_1k', name: 'Ratón de Biblioteca I', description: 'Registra 1.000 minutos', icon: '📚' },
        { id: 'minutes_5k', name: 'Ratón de Biblioteca II', description: 'Registra 5.000 minutos', icon: '📖' },
        { id: 'minutes_10k', name: '¡La Meta de Tool!', description: '¡Registra 10.000 minutos!', icon: '🤘' },
        { id: 'sessions_100', name: 'El Coleccionista', description: 'Registra 100 sesiones', icon: '🗂️' },
        { id: 'materia_lvl_1', name: 'Padawan', description: 'Sube una materia de Nivel', icon: '🌱' },
        { id: 'materia_lvl_10', name: 'Jedi', description: 'Lleva una Materia a Nivel 10', icon: '🎓' },
        { id: 'materia_lvl_10_x5', name: 'Hermione Granger', description: 'Lleva 5 Materias a Nivel 10', icon: '🧠' },
        { id: 'tema_100', name: 'Dominación', description: 'Completa un Tema al 100%', icon: '🎯' },
        { id: 'tema_1k_mins', name: 'My precious...', description: 'Registra 1.000 minutos en un solo tema', icon: '💍' },
        { id: 'streak_5', name: 'El constante', description: 'Registra estudio 5 días seguidos', icon: '🗓️' },
        { id: 'streak_30', name: 'Perseverancia', description: 'Registra estudio 30 días seguidos', icon: '📅' },
        { id: 'streak_365', name: 'El monje budista', description: '¡365 días seguidos!', icon: '🧘' },
        { id: 'night_owl', name: 'Night Owl', description: 'Registra 10 sesiones post 10 PM', icon: '🦉' },
        { id: 'early_bird', name: 'Early Bird', description: 'Registra 10 sesiones antes de las 8 AM', icon: '🐦' },
        { id: 'dracula', name: '¿Drácula?', description: 'Registra estudio entre 2 AM y 4 AM', icon: '🧛' },
        { id: 'marathon', name: 'Maratonista', description: 'Registra una sesión de +200 min', icon: '🏃' },
        { id: 'sprint', name: 'Velocista', description: '5 sesiones de 25 min en un día', icon: '👟' },
        { id: 'weekender', name: 'Guerrero de Fin de Semana', description: 'Estudia un Sábado y Domingo', icon: '⚔️' },
        { id: 'work_week', name: 'Días Hábiles', description: 'Estudia 2 semanas (solo Lun-Vie)', icon: '💼' },
        { id: 'welcome_back', name: '¿Dónde estabas?', description: 'Vuelve a estudiar después de 15 días', icon: '👋' },
        { id: 'multitask_5', name: 'Multitask', description: 'Estudia 5 materias en 1 día', icon: '🌪️' },
        { id: 'poliglota_5', name: 'Políglota', description: 'Estudia 5 materias diferentes', icon: '🌍' },
        { id: 'micro_dose', name: 'Micro-Dosis', description: 'Registra una sesión de 15 min o menos', icon: '🔬' },
        { id: 'focused', name: 'Enfocado', description: '3 sesiones seguidas del mismo tema', icon: '🧘‍♀️' },
        { id: 'chaos', name: 'Caos Controlado', description: '3 materias distintas en 90 min', icon: '🤯' },
        { id: 'archivist', name: 'El Archivista', description: 'Registra 10 temas diferentes', icon: '🗄️' },
        { id: 'specialist_1k', name: 'Especialista', description: 'Registra 1.000 minutos en una materia', icon: '🧑‍🏫' },
        { id: 'anki_king', name: 'Anki King', description: 'Registra 50 sesiones de "Anki"', icon: '👑' },
        { id: 'lector', name: 'El Lector', description: 'Registra 20 sesiones de "Libro"', icon: '👓' },
        { id: 'cinefilo', name: 'Cinéfilo', description: 'Registra 30 sesiones de "Video"', icon: '🍿' },
    ];


    // =========================================================================
    // FUNCIONES DE AUTENTICACIÓN (Sin cambios)
    // =========================================================================
    async function handleSignUp() {
        const email = authEmailInput.value; const password = authPasswordInput.value;
        authMessage.textContent = '';
        if (!email || !password) { authMessage.textContent = 'Email y contraseña son necesarios.'; return; }
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) { authMessage.textContent = `Error: ${error.message}`; } 
        else { authMessage.textContent = '¡Registro exitoso! Revisa tu email para confirmar.'; }
    }
    async function handleLogin() {
        const email = authEmailInput.value; const password = authPasswordInput.value;
        authMessage.textContent = '';
        if (!email || !password) { authMessage.textContent = 'Email y contraseña son necesarios.'; return; }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { authMessage.textContent = `Error: ${error.message}`; }
        else if (data.user) { await loadInitialData(data.user.id); showApp(); }
    }
    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) { console.error('Error al cerrar sesión:', error); } 
        else { showAuth(); }
    }

    // =========================================================================
    // FUNCIONES DE DATOS (Cargan la app)
    // =========================================================================
    async function loadInitialData(userId) {
        console.log("Cargando datos para el usuario:", userId);
        
        let { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (profileError && profileError.code === 'PGRST116') {
            console.log('Perfil no encontrado, creándolo...');
            const { data: newProfile, error: createError } = await supabase.from('profiles').insert({ id: userId }).select().single();
            if (createError) { console.error("Error creando perfil:", createError); return; }
            player = newProfile;
        } else if (profileError) { console.error("Error cargando perfil:", profileError); return; } 
        else { player = profile; }

        const { data: trophies, error: trophiesError } = await supabase.from('trophies_unlocked').select('*').eq('user_id', userId);
        if (trophiesError) console.error("Error cargando trofeos:", trophiesError);
        else localTrophies = trophies || [];

        const { data: logs, error: logsError } = await supabase.from('study_logs').select('*').eq('user_id', player.id);
        if (logsError) { console.error("Error cargando todos los logs:", logsError); }
        else { allLogs = logs || []; }

        updatePlayerInfo();
        renderTrophies(); 
        await loadHomeData();
    }

    // =========================================================================
    // SECCIÓN DE HOME (REGISTRO DE ESTUDIO)
    // =========================================================================
    async function loadHomeData() {
        console.log("Cargando datos de Home...");
        const { data: materias, error } = await supabase.from('materias').select('id, name').eq('user_id', player.id);
        if (error) { console.error("Error cargando materias para dropdown:", error); } 
        else { 
            localMaterias = materias || [];
            populateMateriaDropdown(localMaterias); 
        }
        
        const { data: temas, error: temasError } = await supabase.from('temas').select('id, name, materia_id').eq('user_id', player.id);
        if (temasError) console.error("Error cargando todos los temas:", temasError);
        else localTemas = temas || [];

        await loadRecentActivity();
    }
    function populateMateriaDropdown(materias) {
        selectMateria.innerHTML = '<option value="">-- Elige una materia --</option>'; 
        materias.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.id;
            option.textContent = materia.name;
            selectMateria.appendChild(option);
        });
    }
    async function handleMateriaSelect() {
        const materiaId = selectMateria.value;
        if (!materiaId) {
            selectTema.innerHTML = '<option value="">-- Primero elige una materia --</option>';
            selectTema.disabled = true;
            return;
        }
        const temasDeMateria = localTemas.filter(t => t.materia_id == materiaId);
        populateTemaDropdown(temasDeMateria);
    }
    function populateDropdown(selectElement, items, defaultText) {
        selectElement.innerHTML = `<option value="">-- ${defaultText} --</option>`;
        if (items.length === 0) {
            selectElement.innerHTML = `<option value="">-- No hay opciones --</option>`;
            selectElement.disabled = true;
            return;
        }
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            selectElement.appendChild(option);
        });
        selectElement.disabled = false;
    }
    function populateTemaDropdown(temas) {
        if (temas.length === 0) {
            selectTema.innerHTML = '<option value="">-- Añade temas en Habilidades --</option>';
            selectTema.disabled = true;
            return;
        }
        populateDropdown(selectTema, temas, 'Elige un tema');
    }
    async function handleLogStudy() {
        logStudyBtn.disabled = true; 
        const materiaId = selectMateria.value;
        const temaId = selectTema.value;
        const minutes = parseInt(logMinutesInput.value) || 0;
        const studyType = logStudyTypeInput.value; 

        if (!materiaId || !temaId || minutes <= 0 || !studyType) {
            alert("Por favor, completa todos los campos.");
            logStudyBtn.disabled = false;
            return;
        }
        const { data: newLog, error: logError } = await supabase.from('study_logs').insert({ user_id: player.id, materia_id: materiaId, tema_id: temaId, study_type: studyType, minutes: minutes }).select().single();
        if (logError) {
            console.error("Error al guardar el log de estudio:", logError);
            logStudyBtn.disabled = false;
            return;
        }
        
        allLogs.push(newLog); 
        const xpAmount = minutes;
        
        await addPlayerXP(xpAmount);
        await addSkillXP(materiaId, temaId, xpAmount); 
        await loadRecentActivity();
        
        await checkEventBadges(newLog); 

        logMinutesInput.value = '';
        logStudyTypeInput.selectedIndex = 0;
        logStudyBtn.disabled = false;
    }
    async function loadRecentActivity() {
        const recentLogs = allLogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
        
        const materiasMap = localMaterias.reduce((acc, m) => ({...acc, [m.id]: m.name}), {});
        const temasMap = localTemas.reduce((acc, t) => ({...acc, [t.id]: t.name}), {});
        
        renderRecentActivity(recentLogs, materiasMap, temasMap);
    }
    function renderRecentActivity(logs, materiasMap, temasMap) {
        recentActivityList.innerHTML = ''; 
        if (!logs || logs.length === 0) {
            recentActivityList.innerHTML = '<li class="log-item" style="justify-content: center; color: #aaa;">¡Registra tu primera sesión de estudio!</li>';
            return;
        }
        logs.forEach(log => {
            const li = document.createElement('li');
            li.classList.add('log-item');
            const materiaName = materiasMap[log.materia_id] || 'Materia';
            const temaName = temasMap[log.tema_id] || 'Tema';
            li.innerHTML = `
                <div class="log-item-details">
                    <span class="log-item-main">${materiaName} → ${temaName}</span>
                    <span class="log-item-sub">${log.study_type}</span>
                </div>
                <span class="log-item-xp">+${log.minutes} XP</span>
            `;
            recentActivityList.appendChild(li);
        });
    }

    // =========================================================================
    // LÓGICA DE XP Y SKILLS (Sin cambios)
    // =========================================================================
    async function addPlayerXP(amount) {
        let currentXp = player.xp + amount; let currentLevel = player.level; let currentXpToNext = player.xp_to_next_level; let levelUp = false;
        while (currentXp >= currentXpToNext) {
            currentXp -= currentXpToNext;
            currentLevel++;
            currentXpToNext = Math.floor(currentXpToNext * 1.5);
            levelUp = true;
        }
        player.xp = currentXp; player.level = currentLevel; player.xp_to_next_level = currentXpToNext;
        const { error } = await supabase.from('profiles').update({ xp: player.xp, level: player.level, xp_to_next_level: player.xp_to_next_level }).eq('id', player.id);
        if (error) console.error("Error al guardar XP/Nivel:", error);
        updatePlayerInfo();
        if (levelUp) { 
            showLevelUpModal(); 
            await checkPlayerLevelBadges(); 
        }
    }
    async function addSkillXP(materiaId, temaId, amount) {
        try {
            let { data: tema, error: temaFetchError } = await supabase.from('temas').select('xp, xp_goal').eq('id', temaId).single();
            if (temaFetchError) throw temaFetchError;
            const newTemaXp = Math.min(tema.xp + amount, tema.xp_goal);
            const { error: temaUpdateError } = await supabase.from('temas').update({ xp: newTemaXp }).eq('id', temaId);
            if (temaUpdateError) throw temaUpdateError;
            
            let { data: materia, error: materiaFetchError } = await supabase.from('materias').select('name, level, xp, xp_to_next_level').eq('id', materiaId).single();
            if (materiaFetchError) throw materiaFetchError;
            let currentXp = materia.xp + amount; let currentLevel = materia.level; let currentXpToNext = materia.xp_to_next_level; let levelUp = false;
            while (currentXp >= currentXpToNext) {
                currentXp -= currentXpToNext;
                currentLevel++;
                currentXpToNext = Math.floor(currentXpToNext * 1.5); 
                levelUp = true;
            }
            const { error: materiaUpdateError } = await supabase.from('materias').update({ level: currentLevel, xp: currentXp, xp_to_next_level: currentXpToNext }).eq('id', materiaId);
            if (materiaUpdateError) throw materiaUpdateError;
            
            if (levelUp) { 
                console.log(`¡SUBIDA DE NIVEL DE MATERIA: ${materia.name} es ahora Nivel ${currentLevel}!`);
                await unlockTrophy('materia_lvl_1'); 
            }
        } catch (error) {
            console.error("Error al añadir XP a las habilidades:", error);
        }
    }
    
    // =========================================================================
    // ¡MOTOR DE LOGROS ACTUALIZADO!
    // =========================================================================
    function hasTrophy(trophyId) {
        return localTrophies.some(t => t.trophy_id === trophyId);
    }
    function showBadgeUnlockModal(trophy) {
        badgeModalIcon.textContent = trophy.icon;
        badgeModalName.textContent = trophy.name;
        badgeUnlockedModal.style.display = 'flex';
    }
    async function unlockTrophy(trophyId) {
        if (hasTrophy(trophyId)) { return; }
        console.log(`¡DESBLOQUEANDO TROFEO: ${trophyId}!`);
        const trophy = allTrophies.find(t => t.id === trophyId);
        if (!trophy) { console.error(`Error: Trofeo con ID ${trophyId} no encontrado.`); return; }
        const { data: newTrophy, error } = await supabase.from('trophies_unlocked').insert({ user_id: player.id, trophy_id: trophy.id }).select().single();
        if (error) { console.error("Error al guardar trofeo en Supabase:", error); return; }
        localTrophies.push(newTrophy); // ¡Importante! Actualizar la lista local
        showBadgeUnlockModal(trophy);
    }

    // Revisa badges de evento (al registrar)
    async function checkEventBadges(newLog) {
        if (allLogs.length === 1) { await unlockTrophy('first_log'); }
        if (newLog.minutes >= 200) { await unlockTrophy('marathon'); }
        if (newLog.minutes <= 15) { await unlockTrophy('micro_dose'); }
        const hour = new Date(newLog.created_at).getHours();
        if (hour >= 2 && hour < 4) { await unlockTrophy('dracula'); }
        // (Faltan: sprint, focused, chaos, multitask)
    }
    
    // Revisa badges de Nivel de Jugador (al subir de nivel)
    async function checkPlayerLevelBadges() {
        let newTrophiesUnlocked = false;
        const levelTrophies = allTrophies.filter(t => t.id.startsWith('level_')); 
        for (const trophy of levelTrophies) {
            const requiredLevel = parseInt(trophy.id.split('_')[1]); 
            if (player.level >= requiredLevel && !hasTrophy(trophy.id)) {
                await unlockTrophy(trophy.id); 
                newTrophiesUnlocked = true;
            }
        }
        if (newTrophiesUnlocked) { 
            renderTrophies(); 
        }
    }

    // ¡NUEVO! Revisa badges de Estadísticas (al ver el perfil)
    async function checkStatsBadges(logs, streak) {
        console.log("Revisando badges de estadísticas...");
        let newTrophiesUnlocked = false; // Para saber si re-dibujamos
        const totalMinutes = logs.reduce((sum, log) => sum + log.minutes, 0);
        const totalSessions = logs.length;

        // --- Badges de Minutos ---
        if (totalMinutes >= 1000 && !hasTrophy('minutes_1k')) { await unlockTrophy('minutes_1k'); newTrophiesUnlocked = true; }
        if (totalMinutes >= 5000 && !hasTrophy('minutes_5k')) { await unlockTrophy('minutes_5k'); newTrophiesUnlocked = true; }
        if (totalMinutes >= 10000 && !hasTrophy('minutes_10k')) { await unlockTrophy('minutes_10k'); newTrophiesUnlocked = true; }
        
        // --- Badges de Sesiones ---
        if (totalSessions >= 100 && !hasTrophy('sessions_100')) { await unlockTrophy('sessions_100'); newTrophiesUnlocked = true; }

        // --- Badges de Racha ---
        if (streak >= 5 && !hasTrophy('streak_5')) { await unlockTrophy('streak_5'); newTrophiesUnlocked = true; }
        if (streak >= 30 && !hasTrophy('streak_30')) { await unlockTrophy('streak_30'); newTrophiesUnlocked = true; }
        if (streak >= 365 && !hasTrophy('streak_365')) { await unlockTrophy('streak_365'); newTrophiesUnlocked = true; }
        
        // --- Badges de Tipo de Estudio ---
        const typeCounts = logs.reduce((acc, log) => {
            acc[log.study_type] = (acc[log.study_type] || 0) + 1;
            return acc;
        }, {});
        if (typeCounts['Anki'] >= 50 && !hasTrophy('anki_king')) { await unlockTrophy('anki_king'); newTrophiesUnlocked = true; }
        if (typeCounts['Libro'] >= 20 && !hasTrophy('lector')) { await unlockTrophy('lector'); newTrophiesUnlocked = true; }
        if (typeCounts['Video'] >= 30 && !hasTrophy('cinefilo')) { await unlockTrophy('cinefilo'); newTrophiesUnlocked = true; }

        // --- Badges de Hora del Día ---
        const hourCounts = logs.reduce((acc, log) => {
            const hour = new Date(log.created_at).getHours();
            if (hour >= 22) acc.night_owl = (acc.night_owl || 0) + 1; // 10 PM en adelante
            if (hour < 8) acc.early_bird = (acc.early_bird || 0) + 1; // Antes de las 8 AM
            return acc;
        }, {});
        if (hourCounts.night_owl >= 10 && !hasTrophy('night_owl')) { await unlockTrophy('night_owl'); newTrophiesUnlocked = true; }
        if (hourCounts.early_bird >= 10 && !hasTrophy('early_bird')) { await unlockTrophy('early_bird'); newTrophiesUnlocked = true; }

        // --- Badges de Minutos por Tema/Materia ---
        const materiaMinutes = logs.reduce((acc, log) => {
            acc[log.materia_id] = (acc[log.materia_id] || 0) + log.minutes;
            return acc;
        }, {});
        const temaMinutes = logs.reduce((acc, log) => {
            acc[log.tema_id] = (acc[log.tema_id] || 0) + log.minutes;
            return acc;
        }, {});

        if (Object.values(materiaMinutes).some(min => min >= 1000) && !hasTrophy('specialist_1k')) {
            await unlockTrophy('specialist_1k'); newTrophiesUnlocked = true;
        }
        if (Object.values(temaMinutes).some(min => min >= 1000) && !hasTrophy('tema_1k_mins')) {
            await unlockTrophy('tema_1k_mins'); newTrophiesUnlocked = true;
        }
        
        // (Faltan: weekender, work_week, poliglota, archivist, tema_100, materia_lvl_10_x5)

        if (newTrophiesUnlocked) {
            renderTrophies(); // Re-dibuja la lista de trofeos si ganamos algo
        }
    }


    // =========================================================================
    // SECCIÓN DE SKILL TREE (MATERIAS Y TEMAS) - (Sin cambios)
    // =========================================================================
    async function loadMaterias() {
        const { data, error } = await supabase.from('materias').select('*').eq('user_id', player.id).order('name', { ascending: true });
        if (error) { console.error("Error cargando materias:", error); } 
        else { localMaterias = data || []; renderMaterias(); }
    }
    async function handleSaveMateria() {
        const newName = newMateriaNameInput.value;
        if (newName.trim() === '') { alert("Escribe un nombre para la materia."); return; }
        const { data, error } = await supabase.from('materias').insert({ user_id: player.id, name: newName }).select().single();
        if (error) { console.error("Error guardando materia:", error); } 
        else {
            localMaterias.push(data); 
            renderMaterias();
            addMateriaModal.style.display = 'none'; 
            newMateriaNameInput.value = '';
        }
    }
    function renderMaterias() {
        materiasListContainer.innerHTML = ''; 
        if (localMaterias.length === 0) {
            materiasListContainer.innerHTML = '<p style="text-align: center; color: #888;">¡Añade tu primera materia con el botón +!</p>';
            return;
        }
        localMaterias.forEach(materia => {
            const materiaElement = document.createElement('div');
            materiaElement.classList.add('materia-item');
            materiaElement.dataset.id = materia.id; 
            materiaElement.dataset.name = materia.name;
            const xpPercentage = (materia.xp / materia.xp_to_next_level) * 100;
            materiaElement.innerHTML = `
                <div class="materia-header">
                    <span class="materia-name">${materia.name}</span>
                    <span class="materia-level">Nivel ${materia.level}</span>
                </div>
                <div class="materia-xp-bar-container">
                    <div class="materia-xp-bar-fill" style="width: ${xpPercentage}%;"></div>
                    <span class="materia-xp-text">${materia.xp}/${materia.xp_to_next_level} XP</span>
                </div>
            `;
            materiaElement.addEventListener('click', () => { showTemasPage(materia); });
            materiasListContainer.appendChild(materiaElement);
        });
    }
    function showTemasPage(materia) {
        currentMateria = materia;
        temasPageTitle.textContent = materia.name;
        showPage('page-temas'); 
        loadTemas(materia.id); 
    }
    async function loadTemas(materiaId) {
        const { data, error } = await supabase.from('temas').select('*').eq('user_id', player.id).eq('materia_id', materiaId).order('name', { ascending: true });
        if (error) { console.error("Error cargando temas:", error); } 
        else { localTemas = data || []; renderTemas(); }
    }
    async function handleSaveTema() {
        const newName = newTemaNameInput.value;
        const newGoal = parseInt(newTemaGoalInput.value) || 100;
        if (newName.trim() === '') { alert("Escribe un nombre para el tema."); return; }
        if (!currentMateria) { alert("Error: No se ha seleccionado ninguna materia."); return; }
        const { data, error } = await supabase.from('temas').insert({ user_id: player.id, materia_id: currentMateria.id, name: newName, xp_goal: newGoal }).select().single();
        if (error) { console.error("Error guardando tema:", error); } 
        else {
            localTemas.push(data);
            renderTemas();
            addTemaModal.style.display = 'none';
            newTemaNameInput.value = '';
            newTemaGoalInput.value = '';
        }
    }
    function renderTemas() {
        temasListContainer.innerHTML = '';
        if (localTemas.length === 0) {
            temasListContainer.innerHTML = '<p style="text-align: center; color: #888;">¡Añade tu primer tema (Cardio, Renal...) con el botón +!</p>';
            return;
        }
        localTemas.forEach(tema => {
            const temaElement = document.createElement('div');
            temaElement.classList.add('tema-item');
            temaElement.dataset.id = tema.id;
            const xpPercentage = (tema.xp / tema.xp_goal) * 100;
            temaElement.innerHTML = `
                <div class="tema-header">
                    <span class="tema-name">${tema.name}</span>
                </div>
                <div class="tema-xp-bar-container">
                    <div class="tema-xp-bar-fill" style="width: ${xpPercentage}%;"></div>
                    <span class="tema-xp-text">${tema.xp}/${tema.xp_goal} XP</span>
                </div>
            `;
            temasListContainer.appendChild(temaElement);
        });
    }

    // =========================================================================
    // SECCIÓN DE PERFIL (ESTADÍSTICAS)
    // =========================================================================
    async function loadProfileStats() {
        console.log("Cargando estadísticas del perfil...");

        // 1. Cargar todos los logs de estudio
        const { data: logs, error } = await supabase
            .from('study_logs')
            .select('minutes, study_type, created_at, materia_id, tema_id, materias ( name )') 
            .eq('user_id', player.id);
        if (error) {
            console.error("Error cargando estadísticas:", error);
            totalMinutesDisplay.textContent = '-'; totalSessionsDisplay.textContent = '-'; streakDisplay.textContent = '🔥 -'; 
            return;
        }
        allLogs = logs || []; 
        const totalMinutes = allLogs.reduce((sum, log) => sum + log.minutes, 0);
        totalMinutesDisplay.textContent = totalMinutes;
        totalSessionsDisplay.textContent = allLogs.length; 
        
        // 2. Calcular Racha de Días
        const { data: streak, error: streakError } = await supabase.rpc('get_current_streak', { p_user_id: player.id });
        let currentStreak = 0;
        if (streakError) {
            console.error("Error calculando racha:", streakError);
            streakDisplay.textContent = '🔥 -';
        } else {
            currentStreak = streak;
            streakDisplay.textContent = `🔥 ${currentStreak}`; 
            streakDisplay.classList.add('streak'); 
        }

        // 3. Renderizar gráficos
        renderStudyTypeChart(allLogs);
        renderMateriaMinutesChart(allLogs); 
        renderStudyHourChart(allLogs); 

        // 4. Renderizar Trofeos
        renderTrophies();

        // 5. ¡REVISAR TODOS LOS BADGES AHORA QUE TENEMOS LOS DATOS!
        await checkStatsBadges(allLogs, currentStreak);
    }

    function renderStudyTypeChart(logs) {
        const stats = {}; 
        logs.forEach(log => {
            const type = log.study_type;
            const minutes = log.minutes;
            if (stats[type]) { stats[type] += minutes; } else { stats[type] = minutes; }
        });
        const labels = Object.keys(stats); 
        const data = Object.values(stats); 
        const colors = [ '#A7D8F9', '#C2F0C2', '#FDFD96', '#FAD1E6', '#BDB2FF', '#FFDAB9' ];

        if (studyTypeChart) { studyTypeChart.destroy(); }
        studyTypeChart = new Chart(studyTypeChartCtx, {
            type: 'doughnut', 
            data: {
                labels: labels,
                datasets: [{
                    label: 'Minutos por Tipo',
                    data: data,
                    backgroundColor: colors,
                    borderColor: '#FFFBF5',
                    borderWidth: 3
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'top', labels: { font: { family: "'Nunito', sans-serif", weight: '700' } } } } }
        });
    }
    
    function renderMateriaMinutesChart(logs) {
        const stats = {}; 
        logs.forEach(log => {
            const materiaName = log.materias ? log.materias.name : 'Otra';
            const minutes = log.minutes;
            if (stats[materiaName]) { stats[materiaName] += minutes; } 
            else { stats[materiaName] = minutes; }
        });
        const labels = Object.keys(stats); 
        const data = Object.values(stats); 
        const colors = [ '#FAD1E6', '#BDB2FF', '#FFDAB9', '#A7D8F9', '#C2F0C2', '#FDFD96' ];
        if (materiaMinutesChart) { materiaMinutesChart.destroy(); }
        materiaMinutesChart = new Chart(materiaMinutesChartCtx, {
            type: 'doughnut', 
            data: {
                labels: labels,
                datasets: [{
                    label: 'Minutos por Materia',
                    data: data,
                    backgroundColor: colors,
                    borderColor: '#FFFBF5',
                    borderWidth: 3
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'top', labels: { font: { family: "'Nunito', sans-serif", weight: '700' } } } } }
        });
    }

    function renderStudyHourChart(logs) {
        const stats = Array(24).fill(0);
        logs.forEach(log => {
            const hour = new Date(log.created_at).getHours(); 
            stats[hour] += log.minutes; 
        });
        const labels = [
            '12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
            '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'
        ];
        const data = stats; 
        
        if (studyHourChart) {
            studyHourChart.destroy();
        }
        studyHourChart = new Chart(studyHourChartCtx, {
            type: 'bar', 
            data: {
                labels: labels,
                datasets: [{
                    label: 'Minutos Estudiados',
                    data: data,
                    backgroundColor: '#A7D8F9', 
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { font: { family: "'Nunito', sans-serif", weight: '700' } } },
                    x: { ticks: { font: { family: "'Nunito', sans-serif", weight: '700' } } }
                }
            }
        });
    }

    // =========================================================================
    // FUNCIONES DE UI (RENDERIZADO)
    // =========================================================================
    function showApp() { authSection.style.display = 'none'; appSection.style.display = 'block'; showPage('page-home'); }
    function showAuth() { authSection.style.display = 'block'; appSection.style.display = 'none'; }
    function updatePlayerInfo() {
        playerLevelSpan.textContent = `Nvl ${player.level}`; 
        const xpPercentage = (player.xp / player.xp_to_next_level) * 100;
        xpBarFill.style.width = `${xpPercentage}%`;
        xpText.textContent = `${player.xp}/${player.xp_to_next_level} XP`;
    }
    
    function renderTrophies() {
        trophyDisplay.innerHTML = ''; 
        const trophyElements = allTrophies.map(trophy => {
            const isUnlocked = localTrophies.some(unlocked => unlocked.trophy_id === trophy.id);
            const element = document.createElement('div');
            element.classList.add('trophy-item');
            if (isUnlocked) {
                element.classList.add('unlocked');
            }
            element.innerHTML = `
                <span class="trophy-icon">${trophy.icon}</span>
                <div class="trophy-name">${trophy.name}</div>
            `;
            element.addEventListener('click', () => showTrophyDetails(trophy, isUnlocked));
            return element;
        });
        const unlockedTrophies = trophyElements.filter(el => el.classList.contains('unlocked'));
        const lockedTrophies = trophyElements.filter(el => !el.classList.contains('unlocked'));
        unlockedTrophies.forEach(el => trophyDisplay.appendChild(el));
        lockedTrophies.forEach(el => trophyDisplay.appendChild(el));
    }

    function showTrophyDetails(trophy, isUnlocked) {
        trophyModalIcon.textContent = trophy.icon;
        trophyModalName.textContent = trophy.name;
        trophyModalDesc.textContent = trophy.description;
        trophyModalContent.classList.remove('unlocked', 'locked');
        
        if (isUnlocked) {
            trophyModalContent.classList.add('unlocked');
            trophyModalStatus.textContent = '¡GANADO!';
            trophyModalStatus.className = 'trophy-status-unlocked';
        } else {
            trophyModalContent.classList.add('locked');
            trophyModalStatus.textContent = 'BLOQUEADO';
            trophyModalStatus.className = 'trophy-status-locked';
        }
        trophyDetailsModal.style.display = 'flex';
    }

    function showLevelUpModal() { levelUpModal.style.display = 'flex'; modalNewLevel.textContent = `Nivel ${player.level}`; modalNewTitle.textContent = levelTitles[player.level - 1] || levelTitles[levelTitles.length - 1]; }


    function showPage(pageId) {
        pageContents.forEach(page => { page.classList.remove('active'); });
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) { pageToShow.classList.add('active'); }
        if (pageId === 'page-temas') { bottomNav.classList.add('hidden'); } 
        else { bottomNav.classList.remove('hidden'); }
        if (pageId !== 'page-temas') {
            navButtons.forEach(button => { button.classList.remove('active'); });
            const pageName = pageId.split('-')[1];
            const activeButton = document.getElementById(`nav-${pageName}`);
            if (activeButton) { activeButton.classList.add('active'); }
        }
    }


    // =========================================================================
    // EVENT LISTENERS
    // =========================================================================
    // --- Autenticación
    loginBtn.addEventListener('click', handleLogin);
    signupBtn.addEventListener('click', handleSignUp);
    logoutBtn.addEventListener('click', handleLogout);
    // --- Página Home (Registro)
    selectMateria.addEventListener('change', handleMateriaSelect);
    logStudyBtn.addEventListener('click', handleLogStudy);
    
    // --- ¡ARREGLO DEL BUG DEL BOTÓN! ---
    closeButtons.forEach(button => { button.addEventListener('click', (e) => e.target.closest('.modal').style.display = 'none'); });
    mainCloseButtons.forEach(button => { button.addEventListener('click', (e) => e.target.closest('.modal').style.display = 'none'); });
    window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) { e.target.style.display = 'none'; } });
    
    // --- Navegación
    navHomeBtn.addEventListener('click', () => { showPage('page-home'); loadHomeData(); });
    navSkillsBtn.addEventListener('click', () => { showPage('page-skills'); loadMaterias(); });
    navProfileBtn.addEventListener('click', () => {
        showPage('page-profile');
        loadProfileStats(); 
    });
    // --- Listeners de Skill Tree (Materias)
    showAddMateriaBtn.addEventListener('click', () => addMateriaModal.style.display = 'flex');
    saveMateriaBtn.addEventListener('click', handleSaveMateria);
    // --- Listeners de Temas
    backToMateriasBtn.addEventListener('click', () => { showPage('page-skills'); loadMaterias(); });
    showAddTemaBtn.addEventListener('click', () => addTemaModal.style.display = 'flex');
    saveTemaBtn.addEventListener('click', handleSaveTema);
    // =========================================================================
    // INICIALIZACIÓN (Sin cambios)
    // =========================================================================
    async function checkUserSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) { console.error("Error al obtener sesión:", error); showAuth(); return; }
        if (session && session.user) { await loadInitialData(session.user.id); showApp(); } 
        else { showAuth(); }
    }
    checkUserSession();
});