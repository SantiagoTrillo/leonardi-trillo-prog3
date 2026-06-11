document.addEventListener("DOMContentLoaded", () => {
    // Aplicar tema guardado
    const temaGuardado = localStorage.getItem("tema") || "dark";
    if (temaGuardado === "light") {
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
    }

    const formulario = document.getElementById("formularioBienvenida");
    const nombreCliente = document.getElementById("nombreCliente");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const nombre = nombreCliente.value.trim();

        if (!nombre) {
            return;
        }

        localStorage.setItem("nombreCliente", nombre);
        window.location.href = "../productos/productos.html";
    });
});