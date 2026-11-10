
"use strict";

// ========================================
// CONFIGURACIÓN DEL SERVICE WORKER
// ========================================

const CACHE_NAME = "eco-rider-v5";
const CACHE_IMAGES = "eco-rider-images-v5";

// Archivos esenciales de la aplicación
const ARCHIVOS_APP = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

// Imágenes que se almacenarán al visitarlas
const IMAGENES = [
    "./images/Fondo.png",
    "./images/conduce.png",
    "./images/esquiva.png",
    "./images/puntos.png",
    "./images/ruta1.png",
    "./images/ruta2.png",
    "./images/ruta3.png",
    "./images/Moto.png",
    "./images/Auto_4.png",
    "./images/Auto_5.png",
    "./images/record1.png",
    "./images/record2.png",
    "./images/record3.png",
    "./images/camioneta.png",
    "./iconos E-R/Icono-192.png",
    "./iconos E-R/Icono-512.png"
];

// ========================================
// INSTALACIÓN
// ========================================

self.addEventListener("install", (evento) => {

    evento.waitUntil(
        (async () => {

            const cache = await caches.open(CACHE_NAME);

            // Los archivos esenciales deben existir
            await cache.addAll(ARCHIVOS_APP);

            // Las imágenes se guardan individualmente.
            // Si alguna falta, no bloquea la instalación.
            const cacheImagenes = await caches.open(
                CACHE_IMAGES
            );

            await Promise.allSettled(
                IMAGENES.map(async (ruta) => {

                    try {
                        await cacheImagenes.add(ruta);
                    } catch (error) {
                        console.warn(
                            "Imagen no disponible:",
                            ruta,
                            error
                        );
                    }

                })
            );

            await self.skipWaiting();

        })()
    );

});

// ========================================
// ACTIVACIÓN
// ========================================

self.addEventListener("activate", (evento) => {

    evento.waitUntil(
        (async () => {

            const nombres = await caches.keys();

            const cachesActuales = [
                CACHE_NAME,
                CACHE_IMAGES
            ];

            await Promise.all(
                nombres
                    .filter((nombre) => {

                        return (
                            nombre.startsWith("eco-rider-") &&
                            !cachesActuales.includes(nombre)
                        );

                    })
                    .map((nombre) => {

                        return caches.delete(nombre);

                    })
            );

            await self.clients.claim();

        })()
    );

});

// ========================================
// SOLICITUDES DE RECURSOS
// ========================================

self.addEventListener("fetch", (evento) => {

    const solicitud = evento.request;

    // Solo solicitudes GET
    if (solicitud.method !== "GET") {
        return;
    }

    const url = new URL(solicitud.url);

    // No interceptar recursos externos
    if (url.origin !== self.location.origin) {
        return;
    }

    // ====================================
    // VIDEO Y AUDIO
    // ====================================

    // Permitir que el navegador gestione
    // directamente las solicitudes Range.
    // Evita devolver un MP4 completo cuando
    // se espera una respuesta parcial 206.

    if (
        solicitud.destination === "video" ||
        solicitud.destination === "audio" ||
        solicitud.headers.has("range") ||
        /\.(mp4|webm|mp3|wav|ogg)$/i.test(
            url.pathname
        )
    ) {
        return;
    }

    // ====================================
    // NAVEGACIÓN HTML
    // ====================================

    if (solicitud.mode === "navigate") {

        evento.respondWith(
            (async () => {

                try {

                    // Priorizar versión actualizada
                    const respuesta = await fetch(
                        solicitud
                    );

                    if (respuesta.ok) {

                        const cache = await caches.open(
                            CACHE_NAME
                        );

                        await cache.put(
                            solicitud,
                            respuesta.clone()
                        );

                    }

                    return respuesta;

                } catch (error) {

                    // Utilizar versión sin conexión
                    const respuestaCache =
                        await caches.match(solicitud);

                    return (
                        respuestaCache ||
                        await caches.match("./index.html") ||
                        Response.error()
                    );

                }

            })()
        );

        return;
    }

    // ====================================
    // IMÁGENES
    // ====================================

    if (solicitud.destination === "image") {

        evento.respondWith(
            (async () => {

                const cache = await caches.open(
                    CACHE_IMAGES
                );

                const respuestaCache =
                    await cache.match(solicitud);

                if (respuestaCache) {
                    return respuestaCache;
                }

                try {

                    const respuestaRed =
                        await fetch(solicitud);

                    if (respuestaRed.ok) {

                        await cache.put(
                            solicitud,
                            respuestaRed.clone()
                        );

                    }

                    return respuestaRed;

                } catch (error) {

                    return Response.error();

                }

            })()
        );

        return;
    }

    // ====================================
    // CSS, JAVASCRIPT Y MANIFEST
    // ====================================

    evento.respondWith(
        (async () => {

            try {

                // Buscar primero versión nueva
                const respuesta = await fetch(
                    solicitud
                );

                if (respuesta.ok) {

                    const cache = await caches.open(
                        CACHE_NAME
                    );

                    await cache.put(
                        solicitud,
                        respuesta.clone()
                    );

                }

                return respuesta;

            } catch (error) {

                // Si no hay conexión, usar caché
                const respuestaCache =
                    await caches.match(solicitud);

                return respuestaCache || Response.error();

            }

        })()
    );

});
