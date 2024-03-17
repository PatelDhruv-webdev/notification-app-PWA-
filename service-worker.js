const CACHE_NAME = 'notification-app-cache-v1';
const urlsToCache = [
    'home.html',
    'style.css',
    'app.js',
    'icons/icon-192x192.png',
    'icons/icon-512x512.png',
    'manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(response => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

self.addEventListener('notificationclick', event => {
    const action = event.action;

    event.waitUntil(
        clients.matchAll().then(clientsArr => {
            const client = clientsArr.find(c => {
                return c.visibilityState === 'visible';
            });

            if (client !== undefined) {
                if (action === 'agree') {
                    client.postMessage('So we both agree on that!');
                } else {
                    client.postMessage("Let's agree to disagree.");
                }
                client.focus();
            } else {
                clients.openWindow('/');
            }
            event.notification.close();
        })
    );
});

self.addEventListener('notificationclose', event => {
    console.log('Notification was closed', event);
});

self.addEventListener('message', event => {
    console.log('Message received:', event.data);
});
