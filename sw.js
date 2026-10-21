const CACHE_NAME = "eco-rider-v4";

const ARCHIVOS_APP = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./iconos E-R/Icono-192.png",
    "./iconos E-R/Icono-512.png"
];


// =========================
// INSTALACIÓN
// =========================

self.addEventListener("install", (evento) => {

    evento.waitUntil(

        caches.open(CACHE_NAME)
            .then((cache) => {

                return cache.addAll(ARCHIVOS_APP);

            })

    );

    self.skipWaiting();

});


// =========================
// ACTIVACIÓN
// =========================

self.addEventListener("activate", (evento) => {

    evento.waitUntil(

        caches.keys()
            .then((nombresCaches) => {

                return Promise.all(

                    nombresCaches
                        .filter((nombre) => {

                            return nombre !== CACHE_NAME;

                        })
                        .map((nombre) => {

                            return caches.delete(nombre);

                        })

                );

            })
            .then(() => {

                return self.clients.claim();

            })

    );

});


// =========================
// SOLICITUDES
// =========================

self.addEventListener("fetch", (evento) => {

    const solicitud = evento.request;

    // Solo trabajamos con solicitudes GET
    if (solicitud.method !== "GET") {

        return;

    }

    // Peticiones de imágenes
    if (solicitud.destination === "image") {

        evento.respondWith(

            caches.match(solicitud)
                .then((respuestaCache) => {

                    if (respuestaCache) {

                        return respuestaCache;

                    }

                    return fetch(solicitud)
                        .then((respuestaRed) => {

                            if (
                                !respuestaRed ||
                                respuestaRed.status !== 200
                            ) {

                                return respuestaRed;

                            }

                            const copia = respuestaRed.clone();

                            caches.open(CACHE_NAME)
                                .then((cache) => {

                                    cache.put(
                                        solicitud,
                                        copia
                                    );

                                });

                            return respuestaRed;

                        });

                })

        );

        return;

    }


    // Navegación HTML
    if (solicitud.mode === "navigate") {

        evento.respondWith(

            fetch(solicitud)
                .catch(() => {

                    return caches.match("./index.html");

                })

        );

        return;

    }


    // CSS, JavaScript y otros recursos
    evento.respondWith(

        caches.match(solicitud)
            .then((respuestaCache) => {

                if (respuestaCache) {

                    return respuestaCache;

                }

                return fetch(solicitud);

            })

    );

});