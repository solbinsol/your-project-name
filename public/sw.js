var title = 'Simple Title';
var options = {
  body: 'Simple piece of body text.\nSecond line of body text :)'
};
registration.showNotification(title, options);


self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        // return cache.addAll(['/api/daytoon?day=All']);
        return cache.addAll(['/']);
                // return cache.addAll(['/api/daytoon?day=All', '/']);

      })
    );
  });
  self.addEventListener('push', event => {
    const options = {
      body: 'PWA TEST~~~!', // 푸시 알림에 표시될 메시지
      icon: '/icons/apple-touch-icon-144x144.png', // 알림에 표시될 아이콘 이미지
    };
  
    event.waitUntil(
      self.registration.showNotification('PWA Test Notification', options)
    );
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
        // return response || fetch(event.request).then((res) => {
        //   return caches.open(CACHE_NAME).then((cache) => {
        //     cache.put(event.request, res.clone());
        //     return res;
        //   });
        // });
      }).catch(() => {
        // If both the cache and network fail, return a fallback response here
        return new Response("Fallback response content here", { headers: { "Content-Type": "text/plain" } });
      })
    );
  });