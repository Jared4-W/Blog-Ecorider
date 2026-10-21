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