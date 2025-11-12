// Lista de archivos para guardar en caché
const CACHE_NAME = 'medquest-v4'; // <-- ¡Cambiado a v4!
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    // ¡LINKS DE ÍCONOS ARREGLADOS (OTRA VEZ)!
    'https://img.icons8.com/nolan/192/brain.png',
    'https://img.icons8.com/nolan/512/brain.png',
    
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap',
    'https://fonts.gstatic.com/s/nunito/v26/XRXV3I6Li01BKofINeaB.woff2'
];

// Evento de Instalación: Se guarda todo en caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de Fetch: Intenta ir a la red primero (Network-First)
self.addEventListener('fetch', (event) => {
    // ¡NUEVO! Solo nos importan las solicitudes GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // ¡Éxito! Lo obtuvimos de internet.
                // Ahora, guardémoslo en la caché para la próxima vez
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // ¡Falló Internet! El teléfono está offline.
                // No hay problema, ahora sí, buscamos en la caché.
                return caches.match(event.request);
            })
    );
});