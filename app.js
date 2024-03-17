// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function(error) {
            console.error('Service Worker registration failed:', error);
        });
}

// Request notification permission
function requestNotificationPermission() {
    return Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
            return true;
        }
        return false;
    });
}

// Display notification
function displayNotification(title, body) {
    if (!('Notification' in window)) {
        alert('This browser does not support notifications.');
        return;
    }

    // Check if notification permissions have been granted
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
            reg.showNotification(title, {
                body: body,
                icon: 'icons/icon-192x192.png',
                vibrate: [100, 50, 100],
                actions: [
                    { action: 'agree', title: 'Agree' },
                    { action: 'disagree', title: 'Disagree' }
                ]
            });
        });
    } else {
        alert('Notifications have been blocked. Please enable them in your browser settings.');
    }
}

// Handle notification action clicks
document.addEventListener('notificationclick', function(event) {
    const action = event.action;
    if (action === 'agree') {
        console.log('User agreed');
    } else if (action === 'disagree') {
        console.log('User disagreed');
    }
    event.notification.close();
});
