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

    const modalActivar = document.getElementById("modalActivar");
    const botonConfirmarActivar = document.getElementById("botonConfirmarActivar");
    const botonCancelarActivar = document.getElementById("botonCancelarActivar");

    if (listaAdministracion) {
        listaAdministracion.addEventListener("click", (e) => {
            const btnBorrar = e.target.closest(".btn-borrar-admin");
            const btnActivar = e.target.closest(".btn-activar-admin");

            if (btnBorrar) {
                const tarjeta = btnBorrar.closest(".item-producto-admin");
                if (!tarjeta) return;

                idProductoSeleccionado = tarjeta.getAttribute("data-id");
                tarjetaSeleccionada = tarjeta;

                if (modalDesactivar) {
                    modalDesactivar.classList.remove("d-none");
                }
            } else if (btnActivar) {
                const tarjeta = btnActivar.closest(".item-producto-admin");
                if (!tarjeta) return;

                idProductoSeleccionado = tarjeta.getAttribute("data-id");
                tarjetaSeleccionada = tarjeta;

                if (modalActivar) {
                    modalActivar.classList.remove("d-none");
                }
            }
        });
    }

    function ocultarModal() {
        if (modalDesactivar) {
            modalDesactivar.classList.add("d-none");
        }
        if (modalActivar) {
            modalActivar.classList.add("d-none");
        }
        idProductoSeleccionado = null;
        tarjetaSeleccionada = null;
    }

    if (botonCancelarDesactivar) {
        botonCancelarDesactivar.addEventListener("click", ocultarModal);
    }
    if (botonCancelarActivar) {
        botonCancelarActivar.addEventListener("click", ocultarModal);
    }

    if (modalDesactivar) {
        modalDesactivar.addEventListener("click", (e) => {
            if (e.target === modalDesactivar) {
                ocultarModal();
            }
        });
    }
    if (modalActivar) {
        modalActivar.addEventListener("click", (e) => {
            if (e.target === modalActivar) {
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

                    const botonActivar = tarjetaSeleccionada.querySelector(".btn-activar-admin");
                    if (botonActivar) {
                        botonActivar.classList.remove("d-none");
                    }

                    if (listaAdministracion) {
                        const divisor = document.getElementById("divisorInactivos");
                        if (divisor) {
                            divisor.classList.remove("d-none");
                        }

                        // Insertar en orden alfabético dentro de los inactivos
                        const tituloInactivo = tarjetaSeleccionada.getAttribute("data-titulo");
                        const itemsInactivos = Array.from(listaAdministracion.querySelectorAll(".item-producto-admin[data-estado='inactivo']")).filter(item => item !== tarjetaSeleccionada);
                        
                        let insertado = false;
                        for (const item of itemsInactivos) {
                            const tituloItem = item.getAttribute("data-titulo");
                            if (tituloInactivo.localeCompare(tituloItem) < 0) {
                                listaAdministracion.insertBefore(tarjetaSeleccionada, item);
                                insertado = true;
                                break;
                            }
                        }
                        if (!insertado) {
                            listaAdministracion.appendChild(tarjetaSeleccionada);
                        }
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

    if (botonConfirmarActivar) {
        botonConfirmarActivar.addEventListener("click", () => {
            if (!idProductoSeleccionado || !tarjetaSeleccionada) return;

            const datos = new URLSearchParams();
            datos.append("id", idProductoSeleccionado);
            datos.append("estado", "activo");

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
                    tarjetaSeleccionada.classList.remove("inactivo");
                    tarjetaSeleccionada.setAttribute("data-estado", "activo");

                    const badge = tarjetaSeleccionada.querySelector(".badge-estado");
                    if (badge) {
                        badge.className = "badge-estado state-activo";
                        badge.textContent = "Activo";
                    }

                    const botonBorrar = tarjetaSeleccionada.querySelector(".btn-borrar-admin");
                    if (botonBorrar) {
                        botonBorrar.classList.remove("d-none");
                    }

                    const botonActivar = tarjetaSeleccionada.querySelector(".btn-activar-admin");
                    if (botonActivar) {
                        botonActivar.classList.add("d-none");
                    }

                    if (listaAdministracion) {
                        const divisor = document.getElementById("divisorInactivos");

                        // Insertar en orden alfabético dentro de los activos
                        const tituloActivo = tarjetaSeleccionada.getAttribute("data-titulo");
                        const itemsActivos = Array.from(listaAdministracion.querySelectorAll(".item-producto-admin[data-estado='activo']")).filter(item => item !== tarjetaSeleccionada);

                        let insertado = false;
                        for (const item of itemsActivos) {
                            const tituloItem = item.getAttribute("data-titulo");
                            if (tituloActivo.localeCompare(tituloItem) < 0) {
                                listaAdministracion.insertBefore(tarjetaSeleccionada, item);
                                insertado = true;
                                break;
                            }
                        }
                        if (!insertado) {
                            if (divisor) {
                                listaAdministracion.insertBefore(tarjetaSeleccionada, divisor);
                            } else {
                                listaAdministracion.appendChild(tarjetaSeleccionada);
                            }
                        }

                        // Ocultar divisor si ya no quedan inactivos del catálogo actual
                        const tipoActual = tarjetaSeleccionada.getAttribute("data-tipo");
                        const tieneInactivos = Array.from(itemsProductos).some(item => 
                            item !== tarjetaSeleccionada &&
                            item.getAttribute("data-tipo") === tipoActual &&
                            item.getAttribute("data-estado") === "inactivo"
                        );
                        if (!tieneInactivos && divisor) {
                            divisor.classList.add("d-none");
                        }
                    }
                }
                ocultarModal();
            })
            .catch(error => {
                console.error("Error al activar el producto:", error);
                ocultarModal();
            });
        });
    }
});