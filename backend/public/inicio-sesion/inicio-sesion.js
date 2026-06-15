document.addEventListener("DOMContentLoaded", () => {
    const botonInicioRapido = document.getElementById("btnInicioRapido");
    const inputCorreo = document.getElementById("emailAdmin");
    const inputClave = document.getElementById("passwordAdmin");
    const mensajeError = document.getElementById("mensajeError");

    function ocultarError() {
        if (mensajeError) {
            mensajeError.style.display = "none";
        }
    }

    if (botonInicioRapido && inputCorreo && inputClave) {
        botonInicioRapido.addEventListener("click", () => {
            inputCorreo.value = "test@test.com";
            inputClave.value = "test";
            botonInicioRapido.blur();
            ocultarError();
        });
    }

    if (inputCorreo) {
        inputCorreo.addEventListener("input", ocultarError);
    }
    if (inputClave) {
        inputClave.addEventListener("input", ocultarError);
    }
});

window.addEventListener("pageshow", () => {
    const entradaNavegacion = window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType("navigation")[0];
    if (entradaNavegacion) {
        const tipoNavegacion = entradaNavegacion.type;
        if (tipoNavegacion === "back_forward" || tipoNavegacion === "reload") {
            const inputCorreo = document.getElementById("emailAdmin");
            const inputClave = document.getElementById("passwordAdmin");
            const mensajeError = document.getElementById("mensajeError");
            if (inputCorreo) inputCorreo.value = "";
            if (inputClave) inputClave.value = "";
            if (mensajeError) mensajeError.style.display = "none";
        }
    }
});