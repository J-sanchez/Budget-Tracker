const APP_PREFIX = 'budget_tracker';
const FILES_TO_CACHE = [
    "/",
    "./index.html",
    "./css/styles.css",
    //"./js/index.js",
    "./js/idb.js",
    /*"./icons/icon-72x72.png",
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-152x152.png",*/

    //192X192 is only being used
    "./icons/icon-192x192.png",
    /*
    "./icons/icon-384x384.png",

    "./icons/icon-512x512.png",*/
    "./manifest.json",
];

// Respond with cached resources
self.addEventListener('fetch', function (event) {
    console.log('fetch request : ' + event.request.url)
    event.respondWith(
        caches.match(event.request).then(function (request) {
            if (request) {
                console.log('responding with cache : ' + event.request.url)
                return request
            } else {
                console.log('file is not cached, fetching : ' + event.request.url)
                return fetch(event.request)
            }
        })
    )
})

// Cache the resources
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(event.request).then(function (cache) {
            console.log('installing cache : ' + event.request)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

// Delete outdated caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            // add current cache name to keeplist
            cacheKeeplist.push(event.request);

            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});