"use strict";

// =========================
// NAVEGACIÓN
// =========================

const enlaces = document.querySelectorAll(".nav-links a");

enlaces.forEach((enlace) => {

    enlace.addEventListener("click", () => {

        console.log(
            "Navegando a:",
            enlace.getAttribute("href")
        );

    });

});


// =========================
// ANIMACIÓN DE LA CAMIONETA
// =========================

const botonDescarga = document.querySelector(".download-button");
const truckTrack = document.getElementById("truckTrack");
const truckSprite = document.getElementById("truckSprite");

if (botonDescarga && truckTrack && truckSprite) {

    // Iniciar o reiniciar la animación al pulsar Descargar.

    botonDescarga.addEventListener("click", () => {

        // Eliminar la clase para permitir que la animación
        // vuelva a empezar si el usuario hace clic otra vez.

        truckTrack.classList.remove("is-playing");

        // Forzar el recálculo del diseño para reiniciar
        // la animación CSS desde el principio.

        void truckTrack.offsetWidth;

        // Activar la animación de la camioneta.

        truckTrack.classList.add("is-playing");

    });


    // Ocultar la camioneta al terminar los 15 segundos.

    truckSprite.addEventListener("animationend", (evento) => {

        if (evento.animationName === "camionetaCruzar") {

            truckTrack.classList.remove("is-playing");

        }

    });

}


// =========================
// SERVICE WORKER
// =========================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .then((registro) => {

                console.log(
                    "Service Worker registrado correctamente.",
                    registro
                );

            })
            .catch((error) => {

                console.error(
                    "Error al registrar Service Worker:",
                    error
                );

            });

    });

}
