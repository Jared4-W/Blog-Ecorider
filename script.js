
"use strict";

// ========================================
// MENÚ DE NAVEGACIÓN
// ========================================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

const enlaces = document.querySelectorAll(
    '.nav-links a[href^="#"]'
);

function cerrarMenu() {

    if (!menuToggle || !navLinks) {
        return;
    }

    navLinks.classList.remove("open");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Abrir menú"
    );
}

// ========================================
// ABRIR Y CERRAR MENÚ
// ========================================

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const abierto = navLinks.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(abierto)
        );

        menuToggle.setAttribute(
            "aria-label",
            abierto ? "Cerrar menú" : "Abrir menú"
        );

    });

    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {
            cerrarMenu();
        }

    });

    document.addEventListener("click", (evento) => {

        if (!evento.target.closest(".navbar")) {
            cerrarMenu();
        }

    });

}

// ========================================
// CERRAR MENÚ AL ELEGIR SECCIÓN
// ========================================

enlaces.forEach((enlace) => {

    enlace.addEventListener("click", () => {

        cerrarMenu();

    });

});

// ========================================
// MARCAR SECCIÓN ACTIVA
// ========================================

const secciones = document.querySelectorAll(
    "main section[id]"
);

if ("IntersectionObserver" in window) {

    const observadorMenu = new IntersectionObserver(
        (entradas) => {

            entradas.forEach((entrada) => {

                if (!entrada.isIntersecting) {
                    return;
                }

                enlaces.forEach((enlace) => {

                    const activo =
                        enlace.getAttribute("href") ===
                        `#${entrada.target.id}`;

                    enlace.classList.toggle(
                        "active",
                        activo
                    );

                    if (activo) {

                        enlace.setAttribute(
                            "aria-current",
                            "location"
                        );

                    } else {

                        enlace.removeAttribute(
                            "aria-current"
                        );

                    }

                });

            });

        },
        {
            rootMargin: "-25% 0px -60% 0px"
        }
    );

    secciones.forEach((seccion) => {

        observadorMenu.observe(seccion);

    });

}

// ========================================
// ANIMACIONES AL DESPLAZARSE
// ========================================

const elementosAnimados = document.querySelectorAll(
    ".reveal"
);

const reducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (
    "IntersectionObserver" in window &&
    !reducirMovimiento
) {

    const observador = new IntersectionObserver(
        (entradas, obs) => {

            entradas.forEach((entrada) => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add(
                        "visible"
                    );

                    obs.unobserve(entrada.target);

                }

            });

        },
        {
            threshold: 0.08
        }
    );

    elementosAnimados.forEach((elemento) => {

        observador.observe(elemento);

    });

} else {

    elementosAnimados.forEach((elemento) => {

        elemento.classList.add("visible");

    });

}

// ========================================
// ANIMACIÓN DE LA CAMIONETA
// ========================================

const botonDescarga = document.querySelector(
    ".download-button"
);

const truckTrack = document.getElementById(
    "truckTrack"
);

const truckSprite = document.getElementById(
    "truckSprite"
);

if (
    botonDescarga &&
    truckTrack &&
    truckSprite
) {

    botonDescarga.addEventListener("click", () => {

        // Reiniciar animación
        truckTrack.classList.remove("is-playing");

        // Forzar recálculo del diseño
        void truckTrack.offsetWidth;

        // Iniciar movimiento
        truckTrack.classList.add("is-playing");

    });

    truckSprite.addEventListener(
        "animationend",
        (evento) => {

            if (
                evento.animationName ===
                "camionetaCruzar"
            ) {

                truckTrack.classList.remove(
                    "is-playing"
                );

            }

        }
    );

}

// ========================================
// AÑO AUTOMÁTICO
// ========================================

const year = document.getElementById("year");

if (year) {

    year.textContent = String(
        new Date().getFullYear()
    );

}

// ========================================
// SERVICE WORKER
// ========================================

const entornoSeguro =
    location.protocol === "https:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";

if (
    "serviceWorker" in navigator &&
    entornoSeguro
) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")

            .then(() => {

                console.info(
                    "Service Worker registrado correctamente."
                );

            })

            .catch((error) => {

                console.warn(
                    "Error al registrar Service Worker:",
                    error
                );

            });

    });

}
