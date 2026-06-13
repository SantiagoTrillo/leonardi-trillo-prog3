document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioBienvenida");
    const nombreCliente = document.getElementById("nombreCliente");
    const btnTema = document.getElementById("btnTema");
    const iconTema = btnTema.querySelector("i");

    const temaGuardado = localStorage.getItem("tema") || "dark";
    if (temaGuardado === "light") {
        document.body.classList.add("light-mode");
        iconTema.className = "fa-solid fa-sun";
    } else {
        document.body.classList.remove("light-mode");
        iconTema.className = "fa-solid fa-moon";
    }

    btnTema.addEventListener("click", () => {
        if (document.body.classList.contains("light-mode")) {
            document.body.classList.remove("light-mode");
            iconTema.className = "fa-solid fa-moon";
            localStorage.setItem("tema", "dark");
        } else {
            document.body.classList.add("light-mode");
            iconTema.className = "fa-solid fa-sun";
            localStorage.setItem("tema", "light");
        }
    });

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