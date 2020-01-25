self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/dist/index.css'
            ]);
        })
    );
});
self.addEventListener('fetch',()=>{});
