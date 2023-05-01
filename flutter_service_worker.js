'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "2efbb41d7877d10aac9d091f58ccd7b9",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "139cabcbcc9e1393a0e6c57984cec2b9",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"canvaskit-wasm/bin/canvaskit.js": "492d074c2afe1f2d8ad0990cda0f6738",
"canvaskit-wasm/bin/canvaskit.wasm": "6972cd6e8f48c5f3c027416c7b2443a6",
"canvaskit-wasm/bin/full/canvaskit.js": "30d35fc14cf973ec18a0a2e8aa787eff",
"canvaskit-wasm/bin/full/canvaskit.wasm": "f5a00d34cb2010b280b6918e6e135e38",
"canvaskit-wasm/bin/profiling/canvaskit.js": "d4f1235d38aeb32455867847ce05e74f",
"canvaskit-wasm/bin/profiling/canvaskit.wasm": "09aacbc0d8b20c7ee684e310703e2d86",
"canvaskit-wasm/CHANGELOG.md": "5aaca35406dde76b631be0a168c704ed",
"canvaskit-wasm/CODE_OF_CONDUCT.md": "70daba1f94c1e200490ce43b53d8b05b",
"canvaskit-wasm/CONTRIBUTING.md": "0f844d2159511f929c46961dcb160c8a",
"canvaskit-wasm/example.html": "68baf7347ce8b1ba9c668800fa800403",
"canvaskit-wasm/extra.html": "75d3ac2f6cad1f9f1282021d270d8cd7",
"canvaskit-wasm/LICENSE": "4076a811038c1af033d5d2a5b7177510",
"canvaskit-wasm/multicanvas.html": "d06579c87de2ddc7ef4cf5bf957a832d",
"canvaskit-wasm/node.example.js": "7c82893a3b66d27985f8a8d3f22c960a",
"canvaskit-wasm/package.json": "2081fa42fc39cc18ff81ae83116c3598",
"canvaskit-wasm/paragraphs.html": "85f7988fa41d3e2573fa80ce7799250f",
"canvaskit-wasm/README.md": "c9e0dab1a9ec3837f484dd64af2e05b9",
"canvaskit-wasm/shaping.html": "10cd22a2ae74de63aa6d40f19cc31234",
"canvaskit-wasm/textapi_utils.js": "7b64dd4cbb42b8d1e2e1b8b513833738",
"canvaskit-wasm/types/canvaskit-wasm-tests.ts": "a9d1ce00d0f5fa0af30532f152fd2f14",
"canvaskit-wasm/types/index.d.ts": "52492580bc1a565b0ca4416d3589103f",
"canvaskit-wasm/types/README.md": "2a91ac84310fa639142d1c51efeb6ed1",
"canvaskit-wasm/types/tsconfig.json": "f4b68442f162b52f5cb49cbf635a8671",
"canvaskit-wasm/types/tslint.json": "3ac9869a2886c08a6a68b98d85fd6478",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "a85fcf6324d3c4d3ae3be1ae4931e9c5",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "ebb3ff6b2ae71bba9d80f4c82429b14c",
"/": "ebb3ff6b2ae71bba9d80f4c82429b14c",
"main.dart.js": "da1bbfca45fc5c1e48f44fcd589395c5",
"manifest.json": "11f01a83af7e6402fe350833686b1005",
"version.json": "6e502247b813c9e8e96d7f7c5f7b90c2"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
