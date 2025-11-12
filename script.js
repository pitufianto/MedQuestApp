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

    // --- Página Home (Jefes)
    const showAddJefeBtn = document.getElementById('show-add-jefe-btn');
    const jefesListContainer = document.getElementById('jefes-list-container');
    const addJefeModal = document.getElementById('add-jefe-modal');
    const saveJefeBtn = document.getElementById('save-jefe-btn');
    const newJefeNameInput = document.getElementById('new-jefe-name');
    const selectJefeMateria = document.getElementById('select-jefe-materia');
    const newJefeDateInput = document.getElementById('new-jefe-date');
    const newJefeHpInput = document.getElementById('new-jefe-hp'); // <-- ¡AÑADE ESTA LÍNEA!
    
    // --- Página Perfil
    const trophyDisplay = document.getElementById('trophy-display');
    const totalMinutesDisplay = document.getElementById('total-minutes-display'); 
    const totalSessionsDisplay = document.getElementById('total-sessions-display'); 
    const streakDisplay = document.getElementById('streak-display'); 

    // ¡NUEVO! Perfil
    const profileEditSection = document.getElementById('profile-edit-section');
    const profileUsernameInput = document.getElementById('profile-username');
    const profileAvatarInput = document.getElementById('profile-avatar');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const profileSaveMessage = document.getElementById('profile-save-message');

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
    const mainCloseButtons = document.querySelectorAll('.close-button-main'); 
    const trophyDetailsModal = document.getElementById('trophy-details-modal');
    const trophyModalIcon = document.getElementById('trophy-modal-icon');
    const trophyModalName = document.getElementById('trophy-modal-name');
    const trophyModalDesc = document.getElementById('trophy-modal-desc');
    const trophyModalStatus = document.getElementById('trophy-modal-status');
    const trophyModalContent = trophyDetailsModal.querySelector('.modal-content');
    const badgeUnlockedModal = document.getElementById('badge-unlocked-modal');
    const badgeModalIcon = document.getElementById('badge-modal-icon');
    const badgeModalName = document.getElementById('badge-modal-name');

    const crisisModeModal = document.getElementById('crisis-mode-modal'); // <-- ¡AÑADE ESTA LÍNEA! 

    // ¡NUEVOS!
    const damageToastModal = document.getElementById('damage-toast');
    const damageToastText = document.getElementById('damage-toast-text');
    const confirmKoModal = document.getElementById('confirm-ko-modal');
    const confirmKoText = document.getElementById('confirm-ko-text');
    const confirmKoBtnCancel = document.getElementById('confirm-ko-btn-cancel');
    const confirmKoBtnConfirm = document.getElementById('confirm-ko-btn-confirm');
    const alertModal = document.getElementById('alert-modal');
    const alertModalTitle = document.getElementById('alert-modal-title');
    const alertModalIcon = document.getElementById('alert-modal-icon');
    const alertModalMessage = document.getElementById('alert-modal-message');
    const alertModalContent = alertModal.querySelector('.modal-content');

    // ¡NUEVO! Animación de Golpe
    const damageHitModal = document.getElementById('damage-hit-modal');
    const damageHitText = document.getElementById('damage-hit-text');

    // ¡NUEVO! Página de Amigos
    const searchUserInput = document.getElementById('search-user-input');
    const searchUserBtn = document.getElementById('search-user-btn');
    const searchResultsContainer = document.getElementById('search-results-container');
    const friendRequestsContainer = document.getElementById('friend-requests-container');
    const myFriendsContainer = document.getElementById('my-friends-container');


    // --- Navegación
    const bottomNav = document.querySelector('.bottom-nav');
    const navHomeBtn = document.getElementById('nav-home');
    const navSkillsBtn = document.getElementById('nav-skills');
    const navJefesBtn = document.getElementById('nav-jefes'); // <-- ¡AÑADE ESTA LÍNEA!

    const navFriendsBtn = document.getElementById('nav-friends'); // <-- ¡AÑADE ESTA LÍNEA!

    const navStoreBtn = document.getElementById('nav-store');
    const navProfileBtn = document.getElementById('nav-profile');
    const navButtons = document.querySelectorAll('.nav-button');
    const pageContents = document.querySelectorAll('.page-content');

    // --- Estado del Jugador (Datos locales)
    let player = { id: null, level: 1, xp: 0, xp_to_next_level: 100, sinapsis: 0, sinapsis_progress: 0 }; // ¡AÑADIDO SINAPSIS!
    let localTrophies = []; 
    let localMaterias = []; 
    let localTemas = []; 
    let currentMateria = null; 
    let allLogs = [];
    let localJefes = [];
    let isCrisisModeCurrentlyActive = false; // ¡Variable para el nuevo pop-up!
    let animationQueue = null; // <-- ¡AÑADE ESTA LÍNEA!
    let localAmistades = []; // <-- ¡AÑADE ESTA LÍNEA!

    // --- ¡LISTA MAESTRA DE TROFEOS! (Nombres actualizados)
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
        { id: 'focused', name: 'Locked in', description: '3 sesiones seguidas del mismo tema', icon: '🧘‍♀️' },
        { id: 'chaos', name: 'Caos Controlado', description: '3 materias distintas en 90 min', icon: '🤯' },
        { id: 'archivist', name: 'El Archivista', description: 'Registra 10 temas diferentes', icon: '🗄️' },
        { id: 'specialist_1k', name: 'Especialista', description: 'Registra 1.000 minutos en una materia', icon: '🧑‍🏫' },
        { id: 'anki_king', name: 'Anki King', description: 'Registra 50 sesiones de "Anki"', icon: '👑' },
        { id: 'lector', name: 'El Lector', description: 'Registra 20 sesiones de "Libro"', icon: '👓' },
        { id: 'cinefilo', name: 'Cinéfilo', description: 'Registra 30 sesiones de "Video"', icon: '🍿' },
        { id: 'boss_slayer_1', name: '¡Adiós, Gargamel!', description: 'Completa tu primer Jefe de Nivel (Examen)', icon: '🏆' }
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
        
        // Cargar Perfil (y las nuevas columnas de sinapsis)
        let { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (profileError && profileError.code === 'PGRST116') {
            console.log('Perfil no encontrado, creándolo...');
            const { data: newProfile, error: createError } = await supabase.from('profiles').insert({ id: userId }).select().single();
            if (createError) { console.error("Error creando perfil:", createError); return; }
            player = newProfile;
        } else if (profileError) { console.error("Error cargando perfil:", profileError); return; } 
        else { 
            // Si el perfil ya existe, actualiza las variables locales (incluyendo sinapsis)
            player = profile; 
        }

        const { data: trophies, error: trophiesError } = await supabase.from('trophies_unlocked').select('*').eq('user_id', userId);
        if (trophiesError) console.error("Error cargando trofeos:", trophiesError);
        else localTrophies = trophies || [];

        const { data: logs, error: logsError } = await supabase.from('study_logs').select('*').eq('user_id', player.id);
        if (logsError) { console.error("Error cargando todos los logs:", logsError); }
        else { allLogs = logs || []; }

        const { data: jefesData, error: jefesError } = await supabase
            .from('jefes')
            .select('id, name, materia_id, exam_date, damage_goal, damage_dealt, materias ( name )')
            .eq('user_id', player.id)
            .eq('status', 'activo')
            .order('exam_date', { ascending: true });
            
        if (jefesError) {
            console.error("Error cargando jefes activos:", jefesError);
        } else {
            localJefes = jefesData || [];
            console.log(`Cargados ${localJefes.length} jefes activos.`);
            checkGlobalCrisisMode(); // <-- ¡PÉGALO AQUÍ!
        }
        
        updatePlayerInfo()

    renderTrophies(); 
    await loadHomeData();
    }
    // =BEGGIN: ¡PEGA LAS FUNCIONES QUE FALTABAN AQUÍ! =======================
    
    /**
     * Dibuja la lista de trofeos en la página de perfil.
     * ¡VERSIÓN 2.0: Ordena los desbloqueados primero!
     */
    function renderTrophies() {
        trophyDisplay.innerHTML = ''; // Limpiar la grilla
        if (!allTrophies) {
            console.warn("Lista maestra de trofeos no encontrada.");
            return;
        }

        // ¡NUEVA LÓGICA DE ORDENAMIENTO!
        const sortedTrophies = [...allTrophies].sort((a, b) => {
            const aUnlocked = hasTrophy(a.id);
            const bUnlocked = hasTrophy(b.id);
            // (true se vuelve 1, false se vuelve 0)
            // b - a los pone en orden descendente (desbloqueados primero)
            return bUnlocked - aUnlocked;
        });

        // Usamos la nueva lista ordenada
        sortedTrophies.forEach(trophy => {
            const isUnlocked = hasTrophy(trophy.id); // 'hasTrophy' ya existe :)
            const trophyElement = document.createElement('div');
            trophyElement.classList.add('trophy-item');
            
            if (isUnlocked) {
                trophyElement.classList.add('unlocked');
            }
            
            trophyElement.innerHTML = `
                <span class="trophy-icon">${trophy.icon}</span>
                <span class="trophy-name">${trophy.name}</span>
            `;
            
            // Añadir listener para abrir el modal de detalles
            trophyElement.addEventListener('click', () => {
                showTrophyDetailsModal(trophy, isUnlocked);
            });
            
            trophyDisplay.appendChild(trophyElement);
        });
    }

    /**
     * Muestra el modal con los detalles de un trofeo.
     */
    function showTrophyDetailsModal(trophy, isUnlocked) {
        trophyModalIcon.textContent = trophy.icon;
        trophyModalName.textContent = trophy.name;
        trophyModalDesc.textContent = trophy.description;

        // Quitar clases viejas y poner las nuevas
        trophyModalContent.classList.toggle('unlocked', isUnlocked);

        if (isUnlocked) {
            trophyModalStatus.textContent = 'DESBLOQUEADO';
            trophyModalStatus.className = 'trophy-status-unlocked';
        } else {
            trophyModalStatus.textContent = 'BLOQUEADO';
            trophyModalStatus.className = 'trophy-status-locked';
        }
        
        trophyDetailsModal.style.display = 'flex';
    }

    /**
     * Muestra el modal de "Subiste de Nivel".
     */
    function showLevelUpModal() {
        modalNewLevel.textContent = `Nivel ${player.level}`;
        // Usar la lista de levelTitles. Asegurarse de que no se pase del array.
        const titleIndex = Math.min(player.level - 1, levelTitles.length - 1);
        modalNewTitle.textContent = levelTitles[titleIndex] || "Eminencia Médica";
        levelUpModal.style.display = 'flex';
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
            populateJefeMateriaDropdown(); // <-- ¡AÑADE ESTA LÍNEA!
        }

        const { data: temas, error: temasError } = await supabase.from('temas').select('id, name, materia_id').eq('user_id', player.id);
        if (temasError) console.error("Error cargando todos los temas:", temasError);
        else localTemas = temas || [];

        await loadRecentActivity();
        // await loadJefes(); // <-- ¡AÑADE ESTA LÍNEA!
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

    selectMateria.addEventListener('change', handleMateriaSelect);

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

    /**
     * ¡NUEVO! Muestra el "Toast" de daño
     */
    function showDamageToast(damage, bossName) {
        damageToastText.textContent = `¡Has hecho ${damage} de daño a ${bossName}! ⚔️`;
        damageToastModal.style.display = 'flex';
        
        // Ocultar automáticamente después de 2.5 segundos
        setTimeout(() => {
            damageToastModal.style.display = 'none';
        }, 2500); // 2500ms = 2.5s (dura lo mismo que la animación CSS)
    }
    
    // ¡FUNCIÓN DE REGISTRO ACTUALIZADA CON LÓGICA DE SINAPSIS!
    async function handleLogStudy() {
        let animationData = null; // <-- AÑADE ESTA LÍNEA
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

        // ==================================================
        // ¡NUEVA LÓGICA DE BUFFS!
        // ==================================================
        let xpAmount = minutes;
        let buffGeneral = 1.0; // Para buffs de Tienda (Café, Monster)
        let buffMateria = 1.0; // Para buffs de Materia (Jefe, Especialista)
        const hoy = new Date();
        const CRITIC_DAYS = 7; // "Modo Crisis" = 7 días antes

        // 1. Check Buff de Jefes (Modo Crisis)
        const numMateriaId = parseInt(materiaId);
        const activeJefe = localJefes.find(jefe => {
            if (jefe.materia_id !== numMateriaId) return false;
            
            const examDate = new Date(jefe.exam_date + 'T00:00:00');
            const diffTime = examDate - hoy;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // "Modo Crisis" es desde 7 días antes hasta el día del examen (inclusive)
            return diffDays >= 0 && diffDays <= CRITIC_DAYS;
        });

        if (activeJefe) {
            console.log("¡MODO CRISIS ACTIVADO! (Jefe)");
            buffMateria = 1.25; // ¡El 1.25x!
            // --- ¡NUEVO! Aplicar daño al Jefe ---
            // Usamos 'xpAmount' (los minutos base) como daño
            const damageAmount = xpAmount; 
            const newDamage = Math.min(
                activeJefe.damage_dealt + damageAmount, 
                activeJefe.damage_goal
            );

            // Actualizar en Supabase (sin esperar, "fire and forget")
            supabase.from('jefes')
                .update({ damage_dealt: newDamage })
                .eq('id', activeJefe.id)
                .then(({ error }) => {
                    if (error) console.error("Error al aplicar daño al Jefe:", error);
                    else console.log(`Daño aplicado al Jefe ${activeJefe.id}: ${damageAmount} HP`);
                });

            // Actualizar la lista local al instante (para el renderizado)
            activeJefe.damage_dealt = newDamage; 
            
            // Actualizar la lista local al instante (para el renderizado)
            activeJefe.damage_dealt = newDamage; 

            // ¡NUEVO! Preparar datos de animación
            animationData = { bossId: activeJefe.id, damage: damageAmount }; 

            // --- Fin de aplicar daño ---
        }

        // 2. Check Buffs de la Tienda (del perfil del jugador)
        const storeBuff = player.active_buff; // ej. "cafe_doble", "specialist_34"
        let buffConsumido = false;

        if (storeBuff) {
            if (storeBuff.startsWith('specialist_')) {
                const parts = storeBuff.split('_');
                const buffMateriaId = parseInt(parts[1]);
                
                if (buffMateriaId === numMateriaId) {
                    console.log("¡BUFF DE ESPECIALISTA ACTIVADO! (Tienda)");
                    // El buff de Especialista (3x) es más fuerte que el de Jefe (1.25x)
                    buffMateria = Math.max(buffMateria, 3.0); 
                    buffConsumido = true;
                }
            } else if (storeBuff === 'cafe_doble') {
                buffGeneral = 1.5;
                buffConsumido = true;
            } else if (storeBuff === 'monster') {
                buffGeneral = 2.0;
                buffConsumido = true;
            } else if (storeBuff === 'mix') {
                buffGeneral = 3.0;
                buffConsumido = true;
            }
            
            // ¡Importante! Consumir el buff si se usó
            if (buffConsumido) {
                player.active_buff = null;
                await supabase.from('profiles').update({ active_buff: null }).eq('id', player.id);
                console.log("Buff de la tienda consumido.");
            }
        }

        // 3. Calcular XP Final (Se multiplican!)
        const finalXp = Math.round(xpAmount * buffGeneral * buffMateria);
        console.log(`XP Base: ${xpAmount}, XP Final: ${finalXp} (General: ${buffGeneral}x, Materia: ${buffMateria}x)`);
        // ==================================================
        // FIN LÓGICA DE BUFFS
        // ==================================================

        const { data: newLog, error: logError } = await supabase.from('study_logs').insert({ 
            user_id: player.id, 
            materia_id: materiaId, 
            tema_id: temaId, 
            study_type: studyType, 
            minutes: minutes,
            xp_gained: finalXp // ¡Guardamos el XP final!
        }).select().single();
        
        if (logError) {
            console.error("Error al guardar el log de estudio:", logError);
            logStudyBtn.disabled = false;
            return;
        }
        
        allLogs.push(newLog); 
        
        // 1. Dar XP
        await addPlayerXP(finalXp); // ¡Usamos el XP final!
        await addSkillXP(materiaId, temaId, finalXp); // ¡Usamos el XP final!

        // 2. Dar Sinapsis
        await addSinapsis(minutes); // Las sinapsis se ganan por minutos, no por XP

        // 3. Revisar Badges
        await checkEventBadges(newLog); 

        // 4. Limpiar
        await loadRecentActivity();
        logMinutesInput.value = '';
        logStudyTypeInput.selectedIndex = 0;
        logStudyBtn.disabled = false;

        return animationData; // Devolver los datos de animación
    }

    // --- Página Home (Registro)
    logStudyBtn.addEventListener('click', async () => { // <-- 1. Añadir ASYNC
        const animationData = await handleLogStudy(); // <-- 2. Añadir AWAIT y capturar datos

        // 3. ¡Comprobar si hay que animar!
        if (animationData) {
            // Guardar en la cola global
            animationQueue = animationData; 
            // Navegar
            showPage('page-jefes');
            loadJefes();
        }
    });

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
                <span class="log-item-xp">+${log.xp_gained || log.minutes} XP</span>
            `;
            recentActivityList.appendChild(li);
        });
    }

    // ==================================================
    // ¡NUEVO! FUNCIONES DE JEFES
    // ==================================================

    /**
     * Carga los jefes 'activos' desde Supabase
     */
    // async function loadJefes() {
    //    const { data, error } = await supabase
    //        .from('jefes')
    //        .select('*, materias ( name )') // ¡Hacemos un JOIN para obtener el nombre de la materia!
    //        .eq('user_id', player.id)
    //        .eq('status', 'activo')
    //        .order('exam_date', { ascending: true });
    //
    //    if (error) {
    //        console.error("Error cargando Jefes:", error);
    //        return;
    //    }
    //
    //    renderJefes(data);
    //}

    async function loadJefes() {
        // 1. Renderizar la lista
        console.log("Renderizando jefes desde la lista local...");
        renderJefes(localJefes);

        // 2. ¡NUEVO! Comprobar y ejecutar animación
        if (animationQueue) {
            // Usamos un pequeño delay para que el DOM se actualice
            setTimeout(() => {
                showDamageHitAnimation(animationQueue.bossId, animationQueue.damage);
                animationQueue = null; // Limpiar la cola
            }, 100); // 100ms de delay
        }
    }

    /**
     * Dibuja las tarjetas de los Jefes en la página Home
     */
    function renderJefes(jefes) {
        jefesListContainer.innerHTML = '';
        if (jefes.length === 0) {
            jefesListContainer.innerHTML = '<p style="text-align: center; color: #888;">¡No hay exámenes programados! Añade uno con el botón +.</p>';
            return;
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); 

        jefes.forEach(jefe => {
            const card = document.createElement('div');
            card.classList.add('jefe-item');
            card.dataset.id = jefe.id; // <-- ¡AÑADE ESTA LÍNEA!
            
            // --- Lógica de Fecha (para el texto) ---
            const examDate = new Date(jefe.exam_date + 'T00:00:00'); 
            const diffTime = examDate - hoy;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            let countdownText = `¡EN ${diffDays} DÍAS!`;
            if (diffDays === 1) countdownText = '¡MAÑANA!';
            else if (diffDays === 0) countdownText = '¡HOY!';
            else if (diffDays < 0) countdownText = 'RETRASADO';
            
            const materiaName = jefe.materias ? jefe.materias.name : 'Materia';

            // --- Lógica de HP (para la barra y el botón) ---
            const hp_goal = jefe.damage_goal || 300;
            const hp_dealt = jefe.damage_dealt || 0;
            const currentHP = hp_goal - hp_dealt;
            const hpPercentage = Math.max(0, (currentHP / hp_goal) * 100);

            // 1. Dibuja la tarjeta (CON la barra de HP)
            card.innerHTML = `
                <div class="jefe-details">
                    <span class="jefe-name">${jefe.name}</span>
                    <span class="jefe-sub">Materia: ${materiaName}</span>
                </div>
                <div class="jefe-countdown">
                    <span>${countdownText}</span>
                </div>

                <div class="jefe-hp-bar-container">
                    <div class="jefe-hp-bar-fill" style="width: ${hpPercentage}%;"></div>
                    <span class="jefe-hp-text">HP: ${currentHP} / ${hp_goal}</span>
                </div>
            `;
            
            // 2. ¡NUEVA LÓGICA DEL BOTÓN!
            // ¡Solo muestra el botón si el HP es 0 o menos!
            if (currentHP <= 0) {
                const completeBtn = document.createElement('button');
                completeBtn.classList.add('jefe-complete-btn');
                completeBtn.textContent = '¡K.O.! 💥';
                
                completeBtn.dataset.id = jefe.id; 
                completeBtn.dataset.name = jefe.name;

                completeBtn.addEventListener('click', handleCompleteJefe);
                
                card.appendChild(completeBtn); 
            }
            
            jefesListContainer.appendChild(card);
        });
    }

    /**
     * Rellena el dropdown de materias en el modal de "Añadir Jefe"
     */
    function populateJefeMateriaDropdown() {
        // Usamos las materias que ya cargamos en 'localMaterias'
        selectJefeMateria.innerHTML = '<option value="">-- Elige una materia --</option>';
        localMaterias.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.id;
            option.textContent = materia.name;
            selectJefeMateria.appendChild(option);
        });
    }

    /**
     * Guarda el nuevo Jefe en Supabase
     */
    async function handleSaveJefe() {
        const name = newJefeNameInput.value;
        const materia_id = selectJefeMateria.value;
        const exam_date = newJefeDateInput.value;
        const hp_goal = parseInt(newJefeHpInput.value) || 300; // <-- AÑADE ESTA LÍNEA

        if (!name || !materia_id || !exam_date || hp_goal <= 0) { // <-- MODIFICA ESTA LÍNEA
            alert("Por favor, completa todos los campos (y HP mayor a 0).");
            return;
        }

        // ¡Modificado para que devuelva el objeto creado!
        const { data: newJefe, error } = await supabase
            .from('jefes')
            .insert({
                user_id: player.id,
                name: name,
                materia_id: materia_id,
                exam_date: exam_date,
                damage_goal: hp_goal, // <-- AÑADE ESTA LÍNEA
                damage_dealt: 0      // <-- AÑADE ESTA LÍNEA
            })
            .select('id, name, materia_id, exam_date, damage_goal, damage_dealt, materias ( name )') // <-- MODIFICA
            .single(); // ¡Pedimos el objeto!

        if (error) {
            console.error("Error guardando Jefe:", error);
        } else {
            addJefeModal.style.display = 'none'; // Ocultar modal
            newJefeNameInput.value = '';
            selectJefeMateria.selectedIndex = 0;
            newJefeDateInput.value = '';
            newJefeHpInput.value = ''; // <-- AÑADE ESTA LÍNEA
            
            // ¡NUEVO! Actualizar la lista global y re-renderizar
            localJefes.push(newJefe);
            localJefes.sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date)); // Re-ordenar
            await loadJefes(); // Llama a renderJefes(localJefes)
            checkGlobalCrisisMode(); // <-- ¡AÑADE ESTA LÍNEA!
        }
    }

    // ... aquí termina handleSaveJefe

    /**
     * ¡NUEVO! Se activa al hacer clic en "Completar Jefe"
     */
    async function handleCompleteJefe(event) {
        // Obtenemos los datos guardados en el botón
        const jefeId = parseInt(event.target.dataset.id); 
        const jefeName = event.target.dataset.name;
        
        // ¡NUEVO! Guardamos los datos para usarlos después de confirmar
        confirmKoBtnConfirm.dataset.id = jefeId;
        confirmKoBtnConfirm.dataset.name = jefeName;

        // 1. Mostramos el MODAL de confirmación (en vez de un 'confirm')
        confirmKoText.textContent = `¿Estás segura de que quieres dar el GOLPE FINAL al Jefe "${jefeName}"?`;
        confirmKoModal.style.display = 'flex';
    }

    /**
     * ¡NUEVO! Esta función se activa SÓLO si el usuario
     * hace clic en "¡K.O.!" en el modal de confirmación.
     */
    async function executeKOBoss() {
        // 0. Ocultar modal de confirmación
        confirmKoModal.style.display = 'none';

        // 1. Recuperar los datos del botón
        const jefeId = parseInt(confirmKoBtnConfirm.dataset.id);
        const jefeName = confirmKoBtnConfirm.dataset.name;

        // 2. Definir las Recompensas
        const REWARD_XP = 500;
        const REWARD_SINAPSIS = 10;

        try {
            // 3. Marcar el Jefe como "completado" en Supabase
            const { error: updateError } = await supabase
                .from('jefes')
                .update({ status: 'completado' })
                .eq('id', jefeId);
                
            if (updateError) throw updateError; // ¡El bug debe estar aquí!

            // 4. Dar Recompensas al Jugador
            await addPlayerXP(REWARD_XP);
            await addSinapsis(REWARD_SINAPSIS * 60); 

            // 5. Actualizar la lista local de Jefes
            localJefes = localJefes.filter(jefe => jefe.id !== jefeId);

            // 6. Re-dibujar la lista de Jefes
            renderJefes(localJefes);
            checkGlobalCrisisMode();

            // 7. ¡Revisar trofeo!
            await unlockTrophy('boss_slayer_1');

            // 8. ¡NUEVO! Mensaje de Éxito (Modal)
            alertModalContent.className = 'modal-content card alert-modal-content success';
            alertModalTitle.textContent = '¡K.O.! 💥';
            alertModalIcon.textContent = '🏆';
            alertModalMessage.textContent = `¡Has derrotado al Jefe "${jefeName}"!\n\nRecompensa:\n+${REWARD_XP} XP\n+${REWARD_SINAPSIS} Sinapsis (🧬)`;
            alertModal.style.display = 'flex';

        } catch (error) {
            console.error("Error al completar el Jefe:", error);
            
            // 9. ¡NUEVO! Mensaje de Error (Modal)
            alertModalContent.className = 'modal-content card alert-modal-content error';
            alertModalTitle.textContent = '¡Error!';
            alertModalIcon.textContent = '❌';
            alertModalMessage.textContent = 'Hubo un error al reclamar tu recompensa. (Revisa que RLS esté apagado en todas las tablas e intenta de nuevo).';
            alertModal.style.display = 'flex';
        }
    }

    // ... aquí termina handleCompleteJefe
    

    /**
     * ¡NUEVO! Revisa TODOS los jefes activos
     * y activa o desactiva el "Glow" global (crisis-mode-active)
     */
    function checkGlobalCrisisMode() {
        const hoy = new Date();
        const CRITIC_DAYS = 7;
        let isCrisis = false; // Asumimos que no hay crisis

        // 1. Guardamos el estado anterior
        const wasCrisisActive = isCrisisModeCurrentlyActive;

        // 2. Buscamos si CUALQUIER jefe está en modo crisis
        for (const jefe of localJefes) {
            const examDate = new Date(jefe.exam_date + 'T00:00:00');
            const diffTime = examDate - hoy;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 0 && diffDays <= CRITIC_DAYS) {
                isCrisis = true; 
                break; 
            }
        }

        // 3. Actualizamos el estado global
        isCrisisModeCurrentlyActive = isCrisis;

        // 4. Comparamos el estado anterior con el nuevo
        if (!wasCrisisActive && isCrisisModeCurrentlyActive) {
            // ¡NO estaba activo, PERO AHORA SÍ!
            document.body.classList.add('crisis-mode-active');
            console.log("¡MODO CRISIS GLOBAL ACTIVADO!");
            
            // ¡MOSTRAMOS EL POP-UP!
            // (Usamos un delay para que el glow aparezca primero)
            setTimeout(() => {
                crisisModeModal.style.display = 'flex';
            }, 500);

        } else if (wasCrisisActive && !isCrisisModeCurrentlyActive) {
            // SÍ estaba activo, PERO YA NO
            document.body.classList.remove('crisis-mode-active');
            console.log("Modo crisis global desactivado.");
        } else if (isCrisisModeCurrentlyActive) {
            // SÍ estaba activo y SIGUE activo (no hacemos nada, solo nos aseguramos)
            document.body.classList.add('crisis-mode-active');
        }
    }


    // ... (aquí termina checkGlobalCrisisMode)
    

    /**
     * ¡NUEVO! Muestra la animación de "golpe" sobre la tarjeta del jefe
     */
    function showDamageHitAnimation(bossId, damage) {
        // 1. Encontrar la tarjeta del jefe
        const jefeCard = document.querySelector(`.jefe-item[data-id="${bossId}"]`);
        if (!jefeCard) {
            console.warn("No se encontró la tarjeta del jefe para la animación.");
            return;
        }

        // 2. Obtener la posición de la tarjeta
        const rect = jefeCard.getBoundingClientRect();
        
        // 3. Posicionar el texto de daño
        // (lo centraremos horizontalmente y lo pondremos en medio verticalmente)
        damageHitText.style.left = `${rect.left + (rect.width / 2) - 60}px`; // Ajustado para centrar
        damageHitText.style.top = `${rect.top + (rect.height / 2) - 40}px`; // Ajustado para centrar
        damageHitText.textContent = `-${damage} HP!`;

        // 4. Mostrar el modal de animación
        damageHitModal.style.display = 'flex';

        // 5. Ocultarlo cuando termine la animación (1.5s)
        setTimeout(() => {
            damageHitModal.style.display = 'none';
        }, 1500);
    }

    // =========================================================================
    // LÓGICA DE XP Y SKILLS
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
    // LÓGICA DE SINAPSIS
    // =========================================================================
    const SINAPSIS_PER_MINUTE = 60; // 1 Sinapsis por cada 60 minutos

    async function addSinapsis(minutes) {
        const currentProgress = player.sinapsis_progress;
        const totalMinutes = currentProgress + minutes;
        
        let newSinapsis = 0;
        let remainingProgress = totalMinutes;

        // Calcular cuántas sinapsis completamos
        while (remainingProgress >= SINAPSIS_PER_MINUTE) {
            remainingProgress -= SINAPSIS_PER_MINUTE;
            newSinapsis++;
        }
        
        const newSinapsisCount = player.sinapsis + newSinapsis;

        // Si ganamos algo, actualizar el perfil
        if (newSinapsis > 0 || remainingProgress !== currentProgress) {
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    sinapsis: newSinapsisCount,
                    sinapsis_progress: remainingProgress
                })
                .eq('id', player.id);

            if (error) {
                console.error("Error al guardar sinapsis:", error);
                return;
            }

            // Actualizar el estado local del jugador
            player.sinapsis = newSinapsisCount;
            player.sinapsis_progress = remainingProgress;
            
            console.log(`Ganadas ${newSinapsis} Sinapsis. Total: ${player.sinapsis}`);

            // Actualizar la vista de la tienda (si estamos en ella)
            if (document.getElementById('page-store').classList.contains('active')) {
                renderStore(); 
            }
        }
    }


    // =========================================================================
    // MOTOR DE LOGROS
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
        localTrophies.push(newTrophy);
        showBadgeUnlockModal(trophy);
    }

    async function checkEventBadges(newLog) {
        if (allLogs.length === 1) { await unlockTrophy('first_log'); }
        if (newLog.minutes >= 200) { await unlockTrophy('marathon'); }
        if (newLog.minutes <= 15) { await unlockTrophy('micro_dose'); }
        const hour = new Date(newLog.created_at).getHours();
        if (hour >= 2 && hour < 4) { await unlockTrophy('dracula'); }
    }
    
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
        if (newTrophiesUnlocked) { renderTrophies(); }
    }

    async function checkStatsBadges(logs, streak) {
        // (Lógica de badges basada en estadísticas totales)
        const totalMinutes = logs.reduce((sum, log) => sum + log.minutes, 0);
        const totalSessions = logs.length;
        if (totalMinutes >= 1000 && !hasTrophy('minutes_1k')) { await unlockTrophy('minutes_1k'); }
        if (totalMinutes >= 5000 && !hasTrophy('minutes_5k')) { await unlockTrophy('minutes_5k'); }
        if (totalMinutes >= 10000 && !hasTrophy('minutes_10k')) { await unlockTrophy('minutes_10k'); }
        if (totalSessions >= 100 && !hasTrophy('sessions_100')) { await unlockTrophy('sessions_100'); }
        if (streak >= 5 && !hasTrophy('streak_5')) { await unlockTrophy('streak_5'); }
        if (streak >= 30 && !hasTrophy('streak_30')) { await unlockTrophy('streak_30'); }
        if (streak >= 365 && !hasTrophy('streak_365')) { await unlockTrophy('streak_365'); }

        const typeCounts = logs.reduce((acc, log) => { acc[log.study_type] = (acc[log.study_type] || 0) + 1; return acc; }, {});
        if (typeCounts['Anki'] >= 50) { await unlockTrophy('anki_king'); }
        if (typeCounts['Libro'] >= 20) { await unlockTrophy('lector'); }
        if (typeCounts['Video'] >= 30) { await unlockTrophy('cinefilo'); }

        const materiaMinutes = logs.reduce((acc, log) => { acc[log.materia_id] = (acc[log.materia_id] || 0) + log.minutes; return acc; }, {});
        const temaMinutes = logs.reduce((acc, log) => { acc[log.tema_id] = (acc[log.tema_id] || 0) + log.minutes; return acc; }, {});
        if (Object.values(materiaMinutes).some(min => min >= 1000)) { await unlockTrophy('specialist_1k'); }
        if (Object.values(temaMinutes).some(min => min >= 1000)) { await unlockTrophy('tema_1k_mins'); }

        renderTrophies();
    }


    // =========================================================================
    // SECCIÓN DE TIENDA (NUEVA)
    // =========================================================================
    
    // Lista Maestra de Items
    const storeItems = [
        { id: 'cafe_doble', name: 'Dosis de Cafecito☕️', cost: 5, icon: '☕️', effect: '1.5x XP en tu próxima sesión.', type: 'xp_buff' },
        { id: 'monster', name: 'Dosis de MONSTER⚡️', cost: 7, icon: '⚡️', effect: '2x XP en tu próxima sesión.', type: 'xp_buff' },
        { id: 'mix', name: 'Mix☕️⚡️', cost: 15, icon: '✨', effect: '3x XP en tu próxima sesión.', type: 'xp_buff' },
        { id: 'specialist', name: 'Dosis de Especialista', cost: 12, icon: '🎯', effect: '3x XP en tu próxima sesión, en una Materia a elegir.', type: 'materia_buff' },
        { id: 'frozen_time', name: 'Frozen in Time', cost: 25, icon: '🧊', effect: 'Protege tu racha de una caída (1 uso).', type: 'protection' },
        { id: 'giratiempo', name: 'Giratiempo', cost: 50, icon: '⏳', effect: 'Repara una racha perdida (1 uso).', type: 'repair' },
    ];

    // Carga la página de la tienda
    async function loadStore() {
        console.log("Cargando tienda...");
        // Actualizar la info del jugador para tener las sinapsis actualizadas
        await updatePlayerInfo(); 
        renderStoreDisplay();
        renderStoreItems();
    }

    // Dibuja el contador de sinapsis
    function renderStoreDisplay() {
        const currentSinapsis = player.sinapsis || 0;
        const currentProgress = player.sinapsis_progress || 0;
        const SINAPSIS_GOAL = 60; // 60 minutos para 1 sinapsis

        const progressPercentage = (currentProgress / SINAPSIS_GOAL) * 100;

        document.getElementById('sinapsis-count-display').textContent = currentSinapsis;
        document.getElementById('sinapsis-bar-fill').style.width = `${progressPercentage}%`;
        document.getElementById('sinapsis-bar-text').textContent = `${currentProgress}/${SINAPSIS_GOAL} min para 1 🧬`;
    }

    // Dibuja los items de la tienda
    function renderStoreItems() {
        const container = document.getElementById('store-items-container');
        container.innerHTML = '';
        const currentSinapsis = player.sinapsis || 0;

        storeItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('materia-item');
            itemElement.classList.add('store-item'); // Nuevo estilo
            
            const canAfford = currentSinapsis >= item.cost;
            
            itemElement.innerHTML = `
                <div class="materia-header" style="margin-bottom: 5px;">
                    <span class="materia-name">${item.icon} ${item.name}</span>
                    <span class="materia-level" style="color: ${canAfford ? '#C2F0C2' : '#FAD1E6'};">${item.cost} 🧬</span>
                </div>
                <div style="font-size: 0.9em; color: #777;">${item.effect}</div>
                <button 
                    class="btn-save" 
                    data-id="${item.id}"
                    data-cost="${item.cost}"
                    ${!canAfford ? 'disabled' : ''}
                    style="margin-top: 10px; background-color: ${!canAfford ? '#EEE' : '#A7D8F9'}; color: ${!canAfford ? '#999' : '#fff'};"
                >
                    ${!canAfford ? `Faltan ${item.cost - currentSinapsis} 🧬` : 'Comprar Dosis'}
                </button>
            `;
            container.appendChild(itemElement);
        });
        
        // Añadir el event listener a los botones de compra después de que se dibujen
        container.querySelectorAll('.btn-save').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                const cost = parseInt(e.target.dataset.cost);
                showBuyConfirmation(itemId, cost);
            });
        });
    }

    // Muestra el modal de confirmación de compra
    function showBuyConfirmation(itemId, cost) {
        const item = storeItems.find(i => i.id === itemId);
        
        document.getElementById('buy-modal-title').textContent = `¿Confirmar compra de ${item.name}?`;
        document.getElementById('buy-modal-message').innerHTML = `Esto costará **${cost} Sinapsis (🧬)**. <br><br>Efecto: ${item.effect}`;
        
        const confirmBtn = document.getElementById('confirm-buy-btn');
        confirmBtn.dataset.itemId = itemId;
        confirmBtn.dataset.cost = cost;

        // Lógica especial para el item "Especialista"
        if (item.type === 'materia_buff') {
            document.getElementById('buy-materia-select-container').style.display = 'block';
            const select = document.getElementById('buy-materia-select');
            select.innerHTML = ''; // Limpiar
            localMaterias.forEach(m => {
                const option = document.createElement('option');
                option.value = m.id;
                option.textContent = m.name;
                select.appendChild(option);
            });
        } else {
            document.getElementById('buy-materia-select-container').style.display = 'none';
        }

        document.getElementById('buy-modal').style.display = 'flex';
    }

    // Ejecuta la compra
    async function executeBuy(itemId, cost) {
        const materiaSelect = document.getElementById('buy-materia-select');
        const selectedMateriaId = materiaSelect.value;
        const item = storeItems.find(i => i.id === itemId);

        document.getElementById('buy-modal').style.display = 'none';

        if (player.sinapsis < cost) {
            alertModalContent.className = 'modal-content card alert-modal-content error';
            alertModalTitle.textContent = '¡Fondos Insuficientes!';
            alertModalIcon.textContent = '❌';
            alertModalMessage.textContent = `¡Oops! No tienes suficientes Sinapsis (🧬) para comprar "${item.name}".`;
            alertModal.style.display = 'flex';
            return;
        }

        let buffValue = itemId;
        if (item.type === 'materia_buff') {
            if (!selectedMateriaId) {
                alertModalContent.className = 'modal-content card alert-modal-content error';
                alertModalTitle.textContent = '¡Acción Requerida!';
                alertModalIcon.textContent = '🎯';
                alertModalMessage.textContent = 'Por favor, elige una materia para aplicar este buff de especialista.';
                alertModal.style.display = 'flex';
                 return;
            }
            const selectedMateriaName = localMaterias.find(m => m.id == selectedMateriaId).name;
            buffValue = `specialist_${selectedMateriaId}_${selectedMateriaName}`; // ej. specialist_34_Fisiologia II
        }
        
        // 1. Descontar sinapsis y aplicar el buff
        const newSinapsisCount = player.sinapsis - cost;
        const { error } = await supabase
            .from('profiles')
            .update({ 
                sinapsis: newSinapsisCount,
                active_buff: buffValue,
                // TODO: Añadir lógica para streak_protection y streak_repair
            })
            .eq('id', player.id);

        if (error) {
            console.error('Error al ejecutar compra:', error);
            alertModalContent.className = 'modal-content card alert-modal-content error';
            alertModalTitle.textContent = '¡Error!';
            alertModalIcon.textContent = '❌';
            alertModalMessage.textContent = 'Ocurrió un error al procesar la compra. Revisa tu conexión e intenta de nuevo.';
            alertModal.style.display = 'flex';
        } else {
            // 2. Éxito: Actualizar el estado local y las vistas
            player.sinapsis = newSinapsisCount;
            player.active_buff = buffValue;
            
            alertModalContent.className = 'modal-content card alert-modal-content success';
            alertModalTitle.textContent = '¡Compra Exitosa!';
            alertModalIcon.textContent = '🛒';
            alertModalMessage.textContent = `¡Buff "${item.name}" activado! Se aplicará en tu próxima sesión de estudio.`;
            alertModal.style.display = 'flex';
            renderStoreDisplay();
            renderStoreItems();
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
        // La consulta ahora filtra por materia_id
        const { data, error } = await supabase
            .from('temas')
            .select('*')
            .eq('user_id', player.id)
            .eq('materia_id', materiaId) // <-- ¡ESTA ES LA LÍNEA CLAVE!
            .order('name', { ascending: true });

        if (error) { 
            console.error("Error cargando temas:", error); 
        } else { 
            // Guardamos solo los temas de esta materia en 'localTemas'
            localTemas = data || []; 
            renderTemas(); 
        }
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
    // FUNCIONES DE GRÁFICOS (Chart.js)
    // =========================================================================
    
    // Función de ayuda para los colores
    function getChartColors(count) {
        const colors = [
            '#A7D8F9', '#C2F0C2', '#FAD1E6', '#FDFD96', '#FDBB2D',
            '#FFB347', '#FF6961', '#B19CD9', '#77DD77', '#AEC6CF'
        ];
        // Repetir colores si hay más datos que colores
        return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
    }

    function renderStudyTypeChart(logs) {
        if (!logs || logs.length === 0) return;

        // 1. Agrupar datos
        const minutesPerType = logs.reduce((acc, log) => {
            acc[log.study_type] = (acc[log.study_type] || 0) + log.minutes;
            return acc;
        }, {});

        const labels = Object.keys(minutesPerType);
        const data = Object.values(minutesPerType);
        const colors = getChartColors(labels.length);

        // 2. Destruir gráfico viejo si existe
        if (studyTypeChart) {
            studyTypeChart.destroy();
        }

        // 3. Crear gráfico nuevo
        studyTypeChart = new Chart(studyTypeChartCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: 'Nunito', weight: '700' },
                            color: '#555'
                        }
                    }
                }
            }
        });
    }

    function renderMateriaMinutesChart(logs) {
        if (!logs || logs.length === 0 || !localMaterias) return;

        // 1. Crear un mapa de ID -> Nombre de Materia
        const materiasMap = localMaterias.reduce((acc, m) => {
            acc[m.id] = m.name;
            return acc;
        }, {});

        // 2. Agrupar datos
        const minutesPerMateria = logs.reduce((acc, log) => {
            const materiaName = materiasMap[log.materia_id] || 'Materia Desconocida';
            acc[materiaName] = (acc[materiaName] || 0) + log.minutes;
            return acc;
        }, {});

        // 3. Filtrar materias con 0 minutos
        const labels = Object.keys(minutesPerMateria).filter(label => minutesPerMateria[label] > 0);
        const data = labels.map(label => minutesPerMateria[label]);
        const colors = getChartColors(labels.length);

        // 4. Destruir gráfico viejo
        if (materiaMinutesChart) {
            materiaMinutesChart.destroy();
        }

        // 5. Crear gráfico nuevo
        materiaMinutesChart = new Chart(materiaMinutesChartCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: 'Nunito', weight: '700' },
                            color: '#555'
                        }
                    }
                }
            }
        });
    }

    function renderStudyHourChart(logs) {
        if (!logs || logs.length === 0) return;

        // 1. Crear un array de 24 horas, inicializado en 0
        const hours = Array(24).fill(0);
        
        // 2. Agrupar datos
        logs.forEach(log => {
            const hour = new Date(log.created_at).getHours();
            hours[hour] += log.minutes;
        });

        // 3. Destruir gráfico viejo
        if (studyHourChart) {
            studyHourChart.destroy();
        }

        // 4. Crear gráfico nuevo
        studyHourChart = new Chart(studyHourChartCtx, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                datasets: [{
                    label: 'Minutos Estudiados',
                    data: hours,
                    backgroundColor: '#A7D8F9',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { display: false },
                        ticks: { color: '#888', font: { family: 'Nunito' } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#888', font: { family: 'Nunito' } }
                    }
                }
            }
        });
    }


    // =========================================================================
    // SECCIÓN DE PERFIL (ESTADÍSTICAS)
    // =========================================================================
    async function loadProfileStats() {
        // ¡NUEVO! Cargar datos del perfil en los inputs
        // (Usamos 'player' que es nuestra variable global del perfil)
        if (player.username) {
            profileUsernameInput.value = player.username;
        }
        if (player.avatar_url) {
            profileAvatarInput.value = player.avatar_url;
        }
        profileSaveMessage.textContent = ''; // Limpiar mensaje
        const { data: logs, error } = await supabase.from('study_logs').select('minutes, study_type, created_at, materia_id, tema_id, materias ( name )').eq('user_id', player.id);
        if (error) {
            console.error("Error cargando estadísticas:", error);
            totalMinutesDisplay.textContent = '-'; totalSessionsDisplay.textContent = '-'; streakDisplay.textContent = '🔥 -'; 
            return;
        }
        allLogs = logs || []; 
        const totalMinutes = allLogs.reduce((sum, log) => sum + log.minutes, 0);
        totalMinutesDisplay.textContent = totalMinutes;
        totalSessionsDisplay.textContent = allLogs.length; 
        
        const { data: streak, error: streakError } = await supabase.rpc('get_current_streak', { p_user_id: player.id });
        let currentStreak = 0;
        if (streakError) { console.error("Error calculando racha:", streakError); streakDisplay.textContent = '🔥 -'; } 
        else { currentStreak = streak; streakDisplay.textContent = `🔥 ${currentStreak}`; streakDisplay.classList.add('streak'); }

        renderStudyTypeChart(allLogs);
        renderMateriaMinutesChart(allLogs); 
        renderStudyHourChart(allLogs); 
        renderTrophies();
        await checkStatsBadges(allLogs, currentStreak);
    }

    /**
     * ¡NUEVO! Guarda el username y avatar en la tabla 'profiles'
     */
    async function handleSaveProfile() {
        saveProfileBtn.disabled = true;
        profileSaveMessage.textContent = 'Guardando...';

        const newUsername = profileUsernameInput.value.trim().toLowerCase();
        const newAvatar = profileAvatarInput.value.trim();

        if (newUsername.length < 3) {
            profileSaveMessage.textContent = '❌ Tu username debe tener al menos 3 caracteres.';
            saveProfileBtn.disabled = false;
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({
                username: newUsername,
                avatar_url: newAvatar
            })
            .eq('id', player.id)
            .select() // ¡Pedimos que nos devuelva el perfil actualizado!
            .single();

        if (error) {
            console.error("Error guardando perfil:", error);
            if (error.code === '23505') { // Error de "Unique constraint"
                profileSaveMessage.textContent = '❌ ¡Oops! Ese username ya está tomado.';
            } else {
                profileSaveMessage.textContent = '❌ Error al guardar. Intenta de nuevo.';
            }
        } else {
            // ¡Éxito!
            profileSaveMessage.textContent = '✅ ¡Perfil guardado!';
            // Actualizamos nuestro 'player' local
            player.username = data.username; 
            player.avatar_url = data.avatar_url;
        }

        saveProfileBtn.disabled = false;
    }

    // =========================================================================
    // ¡NUEVO! SECCIÓN SOCIAL (AMIGOS)
    // =========================================================================

    /**
     * ¡NUEVO! Carga la página de Amigos (Solicitudes y Amigos)
     */
    async function loadFriendsPage() {
        // 1. Limpiar las listas (para mostrar "Cargando...")
        friendRequestsContainer.innerHTML = '<p>Cargando...</p>';
        myFriendsContainer.innerHTML = '<p>Cargando...</p>';
        searchResultsContainer.innerHTML = ''; // Limpiar búsquedas viejas
        searchUserInput.value = ''; // Limpiar input

        // 2. Buscar todas las 'amistades' donde yo esté involucrado
        const { data, error } = await supabase
            .from('amistades')
            .select(`
                id,
                status,
                usuario_1_id ( id, username, level, avatar_url ),
                usuario_2_id ( id, username, level, avatar_url )
            `)
            .or(`usuario_1_id.eq.${player.id},usuario_2_id.eq.${player.id}`);
            // .eq('status', 'pendiente'); // <- ¡Error!

        if (error) {
            console.error("Error cargando amistades:", error);
            friendRequestsContainer.innerHTML = '<p>Error al cargar solicitudes.</p>';
            myFriendsContainer.innerHTML = '<p>Error al cargar amigos.</p>';
            return;
        }

        localAmistades = data || [];

        // 3. Separar las listas
        const solicitudesPendientes = [];
        const amigosAceptados = [];

        localAmistades.forEach(amistad => {
            if (amistad.status === 'pendiente') {
                // Si yo soy el receptor (usuario_2), es una solicitud para mí
                if (amistad.usuario_2_id.id === player.id) {
                    solicitudesPendientes.push(amistad);
                }
                // (Si yo soy usuario_1, es una solicitud "enviada" que no mostramos aquí)
            
            } else if (amistad.status === 'aceptada') {
                amigosAceptados.push(amistad);
            }
        });

        // 4. Renderizar las listas
        renderFriendRequests(solicitudesPendientes);
        renderMyFriends(amigosAceptados);
    }

    /**
     * ¡NUEVO! Dibuja las tarjetas de Solicitudes Pendientes
     */
    function renderFriendRequests(solicitudes) {
        if (solicitudes.length === 0) {
            friendRequestsContainer.innerHTML = '<p style="color: #888;">No tienes solicitudes pendientes.</p>';
            return;
        }

        friendRequestsContainer.innerHTML = ''; // Limpiar
        solicitudes.forEach(solicitud => {
            // El perfil del "amigo" es quien la envió (usuario_1)
            const profile = solicitud.usuario_1_id; 
            
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                ${renderUserCardInfo(profile)}
                <div class="user-actions">
                    <button class="btn-friend btn-friend-accept" data-id="${solicitud.id}">Aceptar</button>
                    <button class="btn-friend btn-friend-reject" data-id="${solicitud.id}">Rechazar</button>
                </div>
            `;
            
            // Añadir listeners a los botones
            card.querySelector('.btn-friend-accept').addEventListener('click', handleAcceptFriend);
            card.querySelector('.btn-friend-reject').addEventListener('click', handleRejectFriend);

            friendRequestsContainer.appendChild(card);
        });
    }

    /**
     * ¡NUEVO! Dibuja las tarjetas de Amigos Aceptados
     */
    function renderMyFriends(amigos) {
        if (amigos.length === 0) {
            myFriendsContainer.innerHTML = '<p style="color: #888;">¡Busca un amigo para empezar!</p>';
            return;
        }

        myFriendsContainer.innerHTML = ''; // Limpiar
        amigos.forEach(amistad => {
            // El perfil de mi amigo es el que NO soy yo
            const profile = (amistad.usuario_1_id.id === player.id)
                ? amistad.usuario_2_id // Si yo soy usuario 1, mi amigo es usuario 2
                : amistad.usuario_1_id; // Si yo soy usuario 2, mi amigo es usuario 1
                
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                ${renderUserCardInfo(profile)}
                <div class="user-actions">
                    <button class="btn-friend btn-friend-reject" data-id="${amistad.id}">Eliminar</button>
                </div>
            `;
            
            // Añadir listener al botón
            card.querySelector('.btn-friend-reject').addEventListener('click', handleRejectFriend);

            myFriendsContainer.appendChild(card);
        });
    }

    /**
     * ¡NUEVO! Helper para dibujar la parte izquierda de la tarjeta de usuario
     */
    function renderUserCardInfo(profile) {
        // Usamos el ícono 🧠 si no hay avatar
        const avatarImg = profile.avatar_url
            ? `<img src="${profile.avatar_url}" alt="Avatar">`
            : '🧠';
        
        return `
            <div class="user-info">
                <div class="user-avatar">
                    ${avatarImg}
                </div>
                <div class="user-details">
                    <span class="user-name">${profile.username}</span>
                    <span class="user-level">Nivel ${profile.level || 1}</span>
                </div>
            </div>
        `;
    }

    /**
     * ¡NUEVO! Busca usuarios por 'username'
     */
    async function handleSearchUsers() {
        const searchTerm = searchUserInput.value.trim().toLowerCase();
        if (searchTerm.length < 3) {
            searchResultsContainer.innerHTML = '<p style="color: #d9534f;">Escribe al menos 3 caracteres.</p>';
            return;
        }
        
        searchResultsContainer.innerHTML = '<p>Buscando...</p>';

        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, level, avatar_url')
            .ilike('username', `%${searchTerm}%`) // 'ilike' no es sensible a mayúsculas
            .neq('id', player.id) // No buscarme a mí mismo
            .limit(10); // Limitar a 10 resultados

        if (error) {
            console.error("Error buscando usuarios:", error);
            searchResultsContainer.innerHTML = '<p>Error al buscar.</p>';
            return;
        }

        renderSearchResults(data);
    }

    /**
     * ¡NUEVO! Dibuja los resultados de la búsqueda
     */
    function renderSearchResults(users) {
        if (users.length === 0) {
            searchResultsContainer.innerHTML = '<p style="color: #888;">No se encontraron usuarios.</p>';
            return;
        }
        
        searchResultsContainer.innerHTML = ''; // Limpiar
        users.forEach(profile => {
            const card = document.createElement('div');
            card.className = 'user-card';

            // Revisar si ya somos amigos o hay una solicitud pendiente
            const amistadExistente = localAmistades.find(a =>
                (a.usuario_1_id.id === profile.id || a.usuario_2_id.id === profile.id)
            );

            let actionsHTML = '';
            if (amistadExistente) {
                if (amistadExistente.status === 'aceptada') {
                    actionsHTML = '<span style="font-size: 0.9em; color: #888;">Ya son amigos</span>';
                } else if (amistadExistente.status === 'pendiente') {
                    actionsHTML = '<span style="font-size: 0.9em; color: #888;">Pendiente</span>';
                }
            } else {
                // ¡No hay amistad! Mostrar botón de añadir
                actionsHTML = `<button class="btn-friend btn-friend-add" data-id="${profile.id}">+ Añadir</button>`;
            }

            card.innerHTML = `
                ${renderUserCardInfo(profile)}
                <div class="user-actions">
                    ${actionsHTML}
                </div>
            `;

            // Añadir listener si el botón existe
            if (card.querySelector('.btn-friend-add')) {
                card.querySelector('.btn-friend-add').addEventListener('click', handleAddFriend);
            }

            searchResultsContainer.appendChild(card);
        });
    }

    /**
     * ¡NUEVO! Envía una solicitud de amistad (INSERT)
     */
    async function handleAddFriend(event) {
        const friendId = event.target.dataset.id;
        event.target.disabled = true; // Desactivar botón
        event.target.textContent = 'Enviando...';

        const { error } = await supabase
            .from('amistades')
            .insert({
                usuario_1_id: player.id, // Yo envío
                usuario_2_id: friendId,  // Él recibe
                status: 'pendiente'
            });

        if (error) {
            console.error("Error al añadir amigo:", error);
            event.target.textContent = 'Error';
        } else {
            event.target.textContent = 'Enviado';
            // Recargar la página de amigos para actualizar las listas
            await loadFriendsPage();
        }
    }

    /**
     * ¡NUEVO! Acepta una solicitud (UPDATE)
     */
    async function handleAcceptFriend(event) {
        const amistadId = event.target.dataset.id;
        event.target.disabled = true;

        const { error } = await supabase
            .from('amistades')
            .update({ status: 'aceptada' })
            .eq('id', amistadId);
        
        if (error) {
            console.error("Error al aceptar solicitud:", error);
        } else {
            // Recargar todo para que aparezca en la lista de "Mis Amigos"
            await loadFriendsPage();
        }
    }

    /**
     * ¡NUEVO! Rechaza una solicitud O elimina un amigo (DELETE)
     */
    async function handleRejectFriend(event) {
        const amistadId = event.target.dataset.id;
        event.target.disabled = true;

        const { error } = await supabase
            .from('amistades')
            .delete()
            .eq('id', amistadId);

        if (error) {
            console.error("Error al rechazar/eliminar:", error);
        } else {
            // Recargar todo para que desaparezca de la lista
            await loadFriendsPage();
        }
    }

    // =========================================================================
    // FUNCIONES DE UI (RENDERIZADO)
    // =========================================================================
    function showApp() { authSection.style.display = 'none'; appSection.style.display = 'block'; showPage('page-home'); }
    function showAuth() { authSection.style.display = 'block'; appSection.style.display = 'none'; }

    // =BEGGIN: ¡PEGA LA FUNCIÓN QUE FALTA AQUÍ! =======================

    /**
     * Muestra una página específica y oculta las demás.
     * También actualiza el estado activo de la barra de navegación.
     */
    function showPage(pageId) {
        // 1. Ocultar todas las páginas
        pageContents.forEach(page => {
            page.classList.remove('active');
        });

        // 2. Mostrar la página deseada
        const pageToShow = document.getElementById(pageId);
        if (pageToShow) {
            pageToShow.classList.add('active');
        } else {
            console.warn(`No se encontró la página con id: ${pageId}`);
        }

        // 3. Actualizar los botones de navegación
        // Extraer el nombre de la página (ej. "home" de "page-home")
        let navId = pageId.split('-')[1]; // "home", "skills", "store", "profile"
        
        // Manejar el caso especial de "temas" que usa el nav de "skills"
        let activeNavId = `nav-${navId}`;
        if (pageId === 'page-temas') {
            activeNavId = 'nav-skills';
        }

        navButtons.forEach(button => {
            button.classList.toggle('active', button.id === activeNavId);
        });

        // 4. Ocultar la navegación si estamos en la página de temas
        if (pageId === 'page-temas') {
            bottomNav.classList.add('hidden');
        } else {
            bottomNav.classList.remove('hidden');
        }
    }

    // =END: AQUÍ TERMINA LA NUEVA FUNCIÓN =============================


    function updatePlayerInfo() {
        // 1. Actualizar Nivel y XP
        playerLevelSpan.textContent = `Nvl ${player.level}`; 
        const xpPercentage = (player.xp / player.xp_to_next_level) * 100;
        xpBarFill.style.width = `${xpPercentage}%`;
        xpText.textContent = `${player.xp}/${player.xp_to_next_level} XP`;
        
        // 2. Actualizar Sinapsis (en Home)
        // Buscamos los NUEVOS IDs que pusimos en index.html
        const sinapsisBarFillHome = document.getElementById('sinapsis-bar-fill-home');
        const sinapsisBarTextHome = document.getElementById('sinapsis-bar-text-home');
        
        if (sinapsisBarFillHome && sinapsisBarTextHome) {
             const progressPercentage = (player.sinapsis_progress / 60) * 100;
             sinapsisBarFillHome.style.width = `${progressPercentage}%`;
             sinapsisBarTextHome.textContent = `${player.sinapsis_progress}/60 min para 1 🧬`;
        }
    }
    // ... (renderizado de trofeos y modales) ...
    
    // =========================================================================
    // EVENT LISTENERS
    // =========================================================================
    // --- Autenticación
    loginBtn.addEventListener('click', handleLogin);
    signupBtn.addEventListener('click', handleSignUp);
    logoutBtn.addEventListener('click', handleLogout);

    // --- Modales (Añadir Materia y Tema)
    showAddMateriaBtn.addEventListener('click', () => {
        addMateriaModal.style.display = 'flex';
    });
    
    showAddTemaBtn.addEventListener('click', () => {
        addTemaModal.style.display = 'flex';
    });

    // ¡NUEVO! Listeners para el Modal de Jefes
    showAddJefeBtn.addEventListener('click', () => {
        addJefeModal.style.display = 'flex';
    });
    saveJefeBtn.addEventListener('click', handleSaveJefe);

    // --- Navegación de Temas (Botón "Atrás")
    backToMateriasBtn.addEventListener('click', () => {
        showPage('page-skills'); // La función que ya arreglamos :)
    });
    
    // --- Modales
    closeButtons.forEach(button => { button.addEventListener('click', (e) => e.target.closest('.modal').style.display = 'none'); });
    mainCloseButtons.forEach(button => { button.addEventListener('click', (e) => e.target.closest('.modal').style.display = 'none'); });
    window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) { e.target.style.display = 'none'; } });
    
    // --- Navegación
    navHomeBtn.addEventListener('click', () => { showPage('page-home'); loadHomeData(); });
    navSkillsBtn.addEventListener('click', () => { showPage('page-skills'); loadMaterias(); });
    // ¡NUEVO! Botón de Jefes
    navJefesBtn.addEventListener('click', () => {
        showPage('page-jefes');
        loadJefes(); // Llama a la función que ya existe :)
    });

    // ¡NUEVO! Botón de Amigos
    navFriendsBtn.addEventListener('click', () => {
        showPage('page-friends');
        loadFriendsPage();
    });

    navProfileBtn.addEventListener('click', () => { showPage('page-profile'); loadProfileStats(); });
    // ¡NUEVO! Botón de Tienda
    navStoreBtn.addEventListener('click', () => { showPage('page-store'); loadStore(); });
    
    // --- Listeners de Tienda
    document.getElementById('confirm-buy-btn').addEventListener('click', (e) => {
        const itemId = e.target.dataset.itemId;
        const cost = parseInt(e.target.dataset.cost);
        executeBuy(itemId, cost);
    });

    // ¡NUEVO! Listeners para el Modal de K.O.
    confirmKoBtnCancel.addEventListener('click', () => {
        confirmKoModal.style.display = 'none';
    });
    confirmKoBtnConfirm.addEventListener('click', executeKOBoss);

    // ¡NUEVO! Listener de Guardar Perfil
    saveProfileBtn.addEventListener('click', handleSaveProfile);

    // ¡NUEVO! Listener de Búsqueda de Amigos
    searchUserBtn.addEventListener('click', handleSearchUsers);

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
    // =========================================================================
    // ¡NUEVO! REGISTRAR EL SERVICE WORKER
    // =========================================================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('¡Service Worker registrado con éxito! Alcance:', registration.scope);
                })
                .catch((error) => {
                    console.error('Error al registrar el Service Worker:', error);
                });
        });
    }
});

/*ESTE JS TIENE MAS LINEAS QUE ANTES*/