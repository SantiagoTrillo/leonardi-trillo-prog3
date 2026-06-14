document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioBienvenida");
    const nombreCliente = document.getElementById("nombreCliente");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const nombre = nombreCliente.value.trim();

        if (!nombre) {
            nombreCliente.focus();
            return;
        }

        sessionStorage.setItem("nombreCliente", nombre);
        window.location.href = "../productos/productos.html";
    });
});