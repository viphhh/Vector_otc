// Vector_OTC Options - Service Worker for Web Push & Background Notifications
const CACHE_NAME = 'vector-otc-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming Web Push notifications
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'إشارة تداول جديدة', body: event.data.text() };
    }
  }

  const title = data.title || '🚨 Vector_OTC: إشارة تداول جديدة';
  const options = {
    body: data.body || 'فرصة تداول جديدة وفق الاستراتيجية الأوروبية.',
    icon: data.icon || '/logo.jpg',
    badge: data.badge || '/favicon.jpg',
    tag: data.tag || `signal-${Date.now()}`,
    renotify: true,
    vibrate: [250, 100, 250, 100, 250],
    data: {
      url: data.url || '/',
      signalId: data.signalId || null,
      timestamp: Date.now()
    },
    dir: 'rtl',
    lang: 'ar',
    requireInteraction: data.strength && data.strength >= 95 ? true : false,
    actions: [
      { action: 'open_app', title: 'فتح الصفقة 📈' },
      { action: 'dismiss', title: 'إغلاق' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle messages sent from client tabs to display background notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    event.waitUntil(
      self.registration.showNotification(title || 'Vector_OTC Options', {
        icon: '/logo.jpg',
        badge: '/favicon.jpg',
        dir: 'rtl',
        lang: 'ar',
        vibrate: [200, 100, 200],
        ...options
      })
    );
  }
});

// Handle notification click to bring app to foreground
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
