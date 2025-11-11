// Lista de archivos para guardar en caché
const CACHE_NAME = 'medquest-v2'; // <-- ¡Cambiado a v2!
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    // ¡LINKS DE ÍCONOS ARREGLADOS!
    'https://cdn-icons-png.flaticon.com/192/869/869636.png',
    'https://cdn-icons-png.flaticon.com/512/869/869636.png',
    
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

// Evento de Fetch: Responde desde el caché (offline-first)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en caché, lo devuelve
                if (response) {
                    return response;
                }
                // Si no, va a internet
                return fetch(event.request);
            })
    );
});