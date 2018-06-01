/**
 * Cache all the assets of application to serve them from cache and get really fast start time for the
 * application so we can display something when user is offiline
 */ 
const staticAssets = [
    './',
    './styles.css',
    './app.js',
    './fallback.json',
    './images/fallback.png'
];

/**
 * install events triggers when we install app
 */
self.addEventListener('install',  async event => {
    const cache = await caches.open('news-static');
    cache.addAll(staticAssets);
});

/**
 * Fetch event triggers when service worker intercept any request going from your app
 */
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) { // Fetching from own site
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req))
    }
    
});

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open('news-dynamic');
    try {
        const res = await fetch(req);
        // Cloning the response because it can read only once
        cache.put(req, res.clone());
        return res;
    } catch(error) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || caches.match('./fallback.json');
    }
}