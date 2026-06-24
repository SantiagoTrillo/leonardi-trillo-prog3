document.addEventListener("DOMContentLoaded", () => {
    // Limpiar datos de la sesión anterior al ingresar a la pantalla de bienvenida
    sessionStorage.removeItem("nombreCliente");
    sessionStorage.removeItem("carrito");
    sessionStorage.removeItem("ultimoTicket");

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