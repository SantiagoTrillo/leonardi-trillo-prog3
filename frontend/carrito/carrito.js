document.addEventListener("DOMContentLoaded", () => {
    const nombreCliente = sessionStorage.getItem("nombreCliente");
    if (!nombreCliente) {
        window.location.href = "../bienvenida/bienvenida.html";
        return;
    }

    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    carrito = carrito.map(item => {
        if (!item.cantidad) item.cantidad = 1;
        return item;
    });

    const cuerpoCarrito = document.querySelector(".cuerpo-carrito");
    const grillaPosters = document.getElementById("grillaPosters");
    const listaResumenCarrito = document.getElementById("listaResumenCarrito");
    const totalMonto = document.getElementById("totalMonto");
    const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");
    

    function actualizarCarritoUI() {
        if (carrito.length === 0) {
            cuerpoCarrito.innerHTML = `
                <div class="carrito-vacio">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <p>El carrito está vacío. ¡Volvé al catálogo para elegir tus películas y series favoritas!</p>
                    <a href="../productos/productos.html" class="btn-volver-catalogo">Ir al Catálogo</a>
                </div>
            `;
            sessionStorage.setItem("carrito", JSON.stringify(carrito));
            return;
        }

        const postersDOM = Array.from(grillaPosters.querySelectorAll(".poster-tarjeta"));
        postersDOM.forEach(tarjeta => {
            const id = tarjeta.getAttribute("data-id");
            if (!carrito.some(item => item.id === id)) {
                tarjeta.remove();
            }
        });

        carrito.forEach(prod => {
            let tarjeta = grillaPosters.querySelector(`.poster-tarjeta[data-id="${prod.id}"]`);
            
            if (!tarjeta) {
                tarjeta = document.createElement("div");
                tarjeta.className = "poster-tarjeta";
                tarjeta.setAttribute("data-id", prod.id);
                
                const badgeHTML = prod.cantidad > 1 ? `<span class="poster-badge">x${prod.cantidad}</span>` : "";
                
                const imagenSrc = prod.imagen.startsWith("http")
                    ? prod.imagen
                    : `http://localhost:3000${prod.imagen}`;
                
                tarjeta.innerHTML = `
                    <img class="poster-img" src="${imagenSrc}" alt="Póster de ${prod.titulo}" loading="lazy">
                    ${badgeHTML}
                `;
            } else {
                let badge = tarjeta.querySelector(".poster-badge");
                if (prod.cantidad > 1) {
                    if (!badge) {
                        badge = document.createElement("span");
                        badge.className = "poster-badge";
                        tarjeta.appendChild(badge);
                    }
                    badge.textContent = `x${prod.cantidad}`;
                } else {
                    if (badge) {
                        badge.remove();
                    }
                }
            }
            
            grillaPosters.appendChild(tarjeta);
        });

        const itemsDOM = Array.from(listaResumenCarrito.querySelectorAll(".item-resumen-tarjeta"));
        itemsDOM.forEach(card => {
            const id = card.getAttribute("data-id");
            if (!carrito.some(item => item.id === id)) {
                card.remove();
            }
        });

        let total = 0;

        carrito.forEach(prod => {
            const subtotal = prod.precio * prod.cantidad;
            total += subtotal;

            let card = listaResumenCarrito.querySelector(`.item-resumen-tarjeta[data-id="${prod.id}"]`);
            if (card) {
                card.querySelector(".item-precio").textContent = `$${subtotal.toLocaleString('es-AR')}`;
                
                let badge = card.querySelector(".item-carrito-multiplicador");
                if (prod.cantidad > 1) {
                    if (!badge) {
                        badge = document.createElement("span");
                        badge.className = "item-carrito-multiplicador";
                        card.querySelector(".item-titulo").appendChild(badge);
                    }
                    badge.textContent = `x${prod.cantidad}`;
                } else {
                    if (badge) {
                        badge.remove();
                    }
                }
            } else {
                card = document.createElement("div");
                card.className = "item-resumen-tarjeta";
                card.setAttribute("data-id", prod.id);
                
                const multiplicadorHTML = prod.cantidad > 1 ? ` <span class="item-carrito-multiplicador">x${prod.cantidad}</span>` : "";
                
                card.innerHTML = `
                    <div class="item-info">
                        <h3 class="item-titulo">
                            <span class="item-carrito-texto">${prod.titulo}</span>
                            ${multiplicadorHTML}
                        </h3>
                        <p class="item-precio">$${subtotal.toLocaleString('es-AR')}</p>
                    </div>
                    <div class="controles-cantidad">
                        <button class="btn-cantidad btn-restar" aria-label="Restar 1 de ${prod.titulo}" type="button">-</button>
                        <button class="btn-cantidad btn-sumar" aria-label="Sumar 1 de ${prod.titulo}" type="button">+</button>
                    </div>
                `;

                card.querySelector(".btn-restar").addEventListener("click", () => {
                    restarCantidad(prod.id);
                });

                card.querySelector(".btn-sumar").addEventListener("click", () => {
                    sumarCantidad(prod);
                });
            }
            
            listaResumenCarrito.appendChild(card);
        });

        totalMonto.textContent = `$${total.toLocaleString('es-AR')}`;
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function sumarCantidad(producto) {
        const itemExistente = carrito.find(item => item.id === producto.id);
        if (itemExistente) {
            itemExistente.cantidad += 1;
        }
        actualizarCarritoUI();
    }

    function restarCantidad(productoId) {
        const itemExistente = carrito.find(item => item.id === productoId);
        if (itemExistente) {
            itemExistente.cantidad -= 1;
            if (itemExistente.cantidad <= 0) {
                carrito = carrito.filter(item => item.id !== productoId);
            }
        }
        actualizarCarritoUI();
    }

    const modalConfirmar = document.getElementById("modalConfirmarCompra");
    const botonConfirmar = document.getElementById("botonConfirmarCompra");
    const botonCancelar = document.getElementById("botonCancelarCompra");

    function ocultarModal() {
        if (modalConfirmar) {
            modalConfirmar.classList.add("d-none");
        }
    }

    if (btnConfirmarCompra) {
        btnConfirmarCompra.addEventListener("click", () => {
            if (carrito.length === 0) return;
            if (modalConfirmar) {
                modalConfirmar.classList.remove("d-none");
            }
        });
    }

    if (botonCancelar) {
        botonCancelar.addEventListener("click", ocultarModal);
    }

    if (modalConfirmar) {
        modalConfirmar.addEventListener("click", (e) => {
            if (e.target === modalConfirmar) {
                ocultarModal();
            }
        });
    }

    if (botonConfirmar) {
        botonConfirmar.addEventListener("click", () => {
            if (carrito.length === 0) return;

            let total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

            try {
                const url = window.location.protocol === 'file:' 
                    ? 'http://localhost:3000/api/ventas' 
                    : '/api/ventas';
                
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cliente: nombreCliente,
                        productos: carrito,
                        total: total
                    })
                });
            } catch (error) {
                console.log("Fetch simulado o fallido en backend (esperado):", error);
            }

            const compraFinalizada = {
                cliente: nombreCliente,
                items: carrito,
                total: total,
                fecha: new Date().toLocaleDateString('es-AR'),
                hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
            };
            sessionStorage.setItem("ultimoTicket", JSON.stringify(compraFinalizada));
            sessionStorage.removeItem("carrito");

            ocultarModal();
            window.location.href = "../ticket/ticket.html";
        });
    }

    actualizarCarritoUI();
});