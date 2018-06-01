importScripts('./node_modules/workbox-sw/build/workbox-sw.js');

const staticAssets = ['./', './styles.css', './app.js', './fallback.json', './images/fallback.png'];

workbox.precaching.precacheAndRoute(staticAssets);

workbox.routing.registerRoute(
    new RegExp('https://newsapi.org/(.*)'),
    workbox.strategies.networkFirst(),
  );

workbox
    .routing
    .registerRoute(new RegExp('.*\.js'), workbox.strategies.networkFirst());

workbox
    .routing
    .registerRoute(
    // Cache CSS files
    /.*\.css/,
    // Use cache but update in the background ASAP
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'css-cache'
    }));

workbox
    .routing
    .registerRoute(
    // Cache image files
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    // Use the cache if it's available
    workbox.strategies.cacheFirst({
        // Use a custom cache name
        cacheName: 'image-cache',
        plugins: [
            new workbox
                .expiration
                .Plugin({
                    // Cache only 60 images
                    maxEntries: 60,
                    // Cache for a maximum of a week
                    maxAgeSeconds: 7 * 24 * 60 * 60
                })
        ]
    }));