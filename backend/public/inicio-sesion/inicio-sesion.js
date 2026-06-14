document.addEventListener("DOMContentLoaded", () => {
    const btnAccesoUsuarios = document.getElementById("btnAccesoUsuarios");
    const formularioLogin = document.getElementById("formularioLogin");

    if (btnAccesoUsuarios) {
        btnAccesoUsuarios.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/bienvenida/bienvenida.html";
        });
    }

    if (formularioLogin) {
        formularioLogin.addEventListener("submit", (e) => {
            e.preventDefault();
        });
    }
});