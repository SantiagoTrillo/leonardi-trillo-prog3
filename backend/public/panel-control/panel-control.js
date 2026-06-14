document.addEventListener("DOMContentLoaded", () => {
    const btnSeries = document.getElementById("btnSeries");
    const btnPeliculas = document.getElementById("btnPeliculas");
    const listaAdministracion = document.getElementById("listaAdministracion");
    const itemsProductos = document.querySelectorAll(".item-producto-admin");

    function aplicarFiltro(tipo) {
        itemsProductos.forEach(item => {
            if (item.getAttribute("data-tipo") === tipo) {
                item.classList.remove("d-none");
            } else {
                item.classList.add("d-none");
            }
        });
    }

    if (btnSeries && btnPeliculas) {
        btnSeries.addEventListener("click", () => {
            btnSeries.classList.add("active");
            btnPeliculas.classList.remove("active");
            aplicarFiltro("serie");
        });

        btnPeliculas.addEventListener("click", () => {
            btnPeliculas.classList.add("active");
            btnSeries.classList.remove("active");
            aplicarFiltro("pelicula");
        });

        aplicarFiltro("serie");
    }

    if (listaAdministracion) {
        listaAdministracion.addEventListener("click", (e) => {
            const btnBorrar = e.target.closest(".btn-borrar-admin");
            if (!btnBorrar) return;

            const itemCard = btnBorrar.closest(".item-producto-admin");
            if (!itemCard) return;

            itemCard.classList.add("inactivo");
            itemCard.setAttribute("data-estado", "inactivo");

            const badge = itemCard.querySelector(".badge-estado");
            if (badge) {
                badge.className = "badge-estado state-inactivo";
                badge.textContent = "Inactivo";
            }

            btnBorrar.classList.add("d-none");

            listaAdministracion.appendChild(itemCard);
        });
    }
});