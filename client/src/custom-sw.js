import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// This is injected by vite-plugin-pwa to cache your app shell
precacheAndRoute(self.__WB_MANIFEST);

const TUTORIAL_CACHE_NAME = 'tutorial-media-cache';

// --- UPDATED: More robust message listener ---
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_TUTORIAL') {
        const { id, assets } = event.data.payload;
        console.log(`[SW] Received request to cache tutorial ${id}`);

        event.waitUntil(
            caches.open(TUTORIAL_CACHE_NAME).then(async (cache) => {
                console.log(`[SW] Caching assets:`, assets);
                try {
                    // Use individual fetch and cache.put for resilience
                    for (const url of assets) {
                        const response = await fetch(url, { mode: 'cors' }); // Use CORS mode for external assets
                        if (!response.ok) {
                            throw new Error(`Request for ${url} failed with status ${response.status}`);
                        }
                        await cache.put(url, response);
                    }
                    console.log(`[SW] Caching complete for tutorial ${id}`);
                    // Send a success message back to the app
                    event.ports[0].postMessage({ type: 'CACHE_COMPLETE', payload: { id } });
                } catch (error) {
                    console.error('[SW] Caching failed:', error);
                    // Send a failure message back to the app
                    event.ports[0].postMessage({ type: 'CACHE_FAILED', payload: { id, error: error.message } });
                }
            })
        );
    }
});


// When the app is offline, look in our caches for the video/image files
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
    // Check if the request is for one of the media assets we might have cached
    if (requestUrl.origin === 'https://archive.org' || requestUrl.origin === 'https://i.imgur.com') {
        event.respondWith(
            caches.open(TUTORIAL_CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    // Return from cache if found, otherwise fetch from network
                    return cachedResponse || fetch(event.request);
                });
            })
        );
    }
});