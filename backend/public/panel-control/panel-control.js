document.addEventListener("DOMContentLoaded", () => {
    const btnSeries = document.getElementById("btnSeries");
    const btnPeliculas = document.getElementById("btnPeliculas");
    const listaAdministracion = document.getElementById("listaAdministracion");
    const itemsProductos = document.querySelectorAll(".item-producto-admin");

    const modalDesactivar = document.getElementById("modalDesactivar");
    const botonConfirmarDesactivar = document.getElementById("botonConfirmarDesactivar");
    const botonCancelarDesactivar = document.getElementById("botonCancelarDesactivar");

    let idProductoSeleccionado = null;
    let tarjetaSeleccionada = null;

    function aplicarFiltro(tipo) {
        itemsProductos.forEach(item => {
            if (item.getAttribute("data-tipo") === tipo) {
                item.classList.remove("d-none");
            } else {
                item.classList.add("d-none");
            }
        });

        const divisor = document.getElementById("divisorInactivos");
        if (divisor) {
            const inactivosVisibles = Array.from(itemsProductos).some(item => 
                item.getAttribute("data-tipo") === tipo && 
                item.getAttribute("data-estado") === "inactivo"
            );
            if (inactivosVisibles) {
                divisor.classList.remove("d-none");
            } else {
                divisor.classList.add("d-none");
            }
        }
    }

    if (btnSeries && btnPeliculas) {
        btnSeries.addEventListener("click", () => {
            btnSeries.classList.add("active");
            btnPeliculas.classList.remove("active");
            aplicarFiltro("serie");
            sessionStorage.setItem("catalogoActivo", "serie");
        });

        btnPeliculas.addEventListener("click", () => {
            btnPeliculas.classList.add("active");
            btnSeries.classList.remove("active");
            aplicarFiltro("pelicula");
            sessionStorage.setItem("catalogoActivo", "pelicula");
        });

        const catalogoGuardado = sessionStorage.getItem("catalogoActivo") || "serie";
        if (catalogoGuardado === "pelicula") {
            btnPeliculas.classList.add("active");
            btnSeries.classList.remove("active");
            aplicarFiltro("pelicula");
        } else {
            btnSeries.classList.add("active");
            btnPeliculas.classList.remove("active");
            aplicarFiltro("serie");
        }
    }

    if (listaAdministracion) {
        listaAdministracion.addEventListener("click", (e) => {
            const btnBorrar = e.target.closest(".btn-borrar-admin");
            if (!btnBorrar) return;

            const tarjeta = btnBorrar.closest(".item-producto-admin");
            if (!tarjeta) return;

            // Guardar referencias y mostrar modal
            idProductoSeleccionado = tarjeta.getAttribute("data-id");
            tarjetaSeleccionada = tarjeta;

            if (modalDesactivar) {
                modalDesactivar.classList.remove("d-none");
            }
        });
    }

    function ocultarModal() {
        if (modalDesactivar) {
            modalDesactivar.classList.add("d-none");
        }
        idProductoSeleccionado = null;
        tarjetaSeleccionada = null;
    }

    if (botonCancelarDesactivar) {
        botonCancelarDesactivar.addEventListener("click", ocultarModal);
    }

    if (modalDesactivar) {
        modalDesactivar.addEventListener("click", (e) => {
            if (e.target === modalDesactivar) {
                ocultarModal();
            }
        });
    }

    if (botonConfirmarDesactivar) {
        botonConfirmarDesactivar.addEventListener("click", () => {
            if (!idProductoSeleccionado || !tarjetaSeleccionada) return;

            const datos = new URLSearchParams();
            datos.append("id", idProductoSeleccionado);
            datos.append("estado", "inactivo");

            fetch("/admin/modificar-producto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: datos
            })
            .then(respuesta => respuesta.json())
            .then(resultado => {
                if (resultado.success && tarjetaSeleccionada) {
                    tarjetaSeleccionada.classList.add("inactivo");
                    tarjetaSeleccionada.setAttribute("data-estado", "inactivo");

                    const badge = tarjetaSeleccionada.querySelector(".badge-estado");
                    if (badge) {
                        badge.className = "badge-estado state-inactivo";
                        badge.textContent = "Inactivo";
                    }

                    const botonBorrar = tarjetaSeleccionada.querySelector(".btn-borrar-admin");
                    if (botonBorrar) {
                        botonBorrar.classList.add("d-none");
                    }

                    if (listaAdministracion) {
                        const divisor = document.getElementById("divisorInactivos");
                        if (divisor) {
                            divisor.classList.remove("d-none");
                        }
                        listaAdministracion.appendChild(tarjetaSeleccionada);
                    }
                }
                ocultarModal();
            })
            .catch(error => {
                console.error("Error al desactivar el producto:", error);
                ocultarModal();
            });
        });
    }
});