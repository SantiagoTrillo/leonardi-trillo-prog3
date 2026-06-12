document.addEventListener("DOMContentLoaded", () => {
    // 1. Validar nombre del cliente
    const nombreCliente = localStorage.getItem("nombreCliente");
    if (!nombreCliente) {
        window.location.href = "../bienvenida/bienvenida.html";
        return;
    }

    // 2. Cargar estado del Carrito
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Elementos del DOM
    const cuerpoCarrito = document.querySelector(".cuerpo-carrito");
    const grillaPosters = document.getElementById("grillaPosters");
    const listaResumenCarrito = document.getElementById("listaResumenCarrito");
    const totalMonto = document.getElementById("totalMonto");
    const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");
    
    // Elementos del Modal
    const modalConfirmar = document.getElementById("modalConfirmar");
    const modalNombreCliente = document.getElementById("modalNombreCliente");
    const modalTotalMonto = document.getElementById("modalTotalMonto");
    const modalCargando = document.getElementById("modalCargando");
    const modalBotones = document.getElementById("modalBotones");
    const btnModalCancelar = document.getElementById("btnModalCancelar");
    const btnModalConfirmar = document.getElementById("btnModalConfirmar");

    // Botón de Tema
    const btnTema = document.getElementById("btnTema");
    const iconTema = btnTema.querySelector("i");

    // 3. Inicializar y Persistir Tema
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

    // 4. Agrupar productos repetidos
    function agruparProductos(items) {
        const agrupados = [];
        items.forEach(item => {
            const existente = agrupados.find(p => p.id === item.id);
            if (existente) {
                existente.cantidad += 1;
                existente.uids.push(item.uid);
            } else {
                agrupados.push({
                    id: item.id,
                    titulo: item.titulo,
                    precio: item.precio,
                    imagen: item.imagen,
                    cantidad: 1,
                    uids: [item.uid]
                });
            }
        });
        return agrupados;
    }

    // 5. Renderizar UI del Carrito
    function actualizarCarritoUI() {
        // Si el carrito está vacío, mostrar pantalla de vacío
        if (carrito.length === 0) {
            cuerpoCarrito.innerHTML = `
                <div class="carrito-vacio">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <p>El carrito está vacío. ¡Volvé al catálogo para elegir tus películas y series favoritas!</p>
                    <a href="../productos/productos.html" class="btn-volver-catalogo">Ir al Catálogo</a>
                </div>
            `;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            return;
        }

        // Renderizar grilla de pósters (uno por cada elemento en el carrito)
        grillaPosters.innerHTML = "";
        carrito.forEach(item => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "poster-tarjeta";
            tarjeta.innerHTML = `
                <img class="poster-img" src="${item.imagen}" alt="Póster de ${item.titulo}" loading="lazy">
            `;
            grillaPosters.innerHTML += tarjeta.outerHTML;
        });

        // Agrupar items para la lista de resumen
        const productosAgrupados = agruparProductos(carrito);
        listaResumenCarrito.innerHTML = "";
        let total = 0;

        productosAgrupados.forEach(prod => {
            const subtotal = prod.precio * prod.cantidad;
            total += subtotal;

            const itemTarjeta = document.createElement("div");
            itemTarjeta.className = "item-resumen-tarjeta";
            itemTarjeta.innerHTML = `
                <div class="item-info">
                    <h3 class="item-titulo">${prod.titulo}</h3>
                    <p class="item-precio">Precio unitario: $${prod.precio.toLocaleString('es-AR')}</p>
                    <p class="item-cantidad-texto">Cantidad: ${prod.cantidad}</p>
                </div>
                <div class="controles-cantidad">
                    <button class="btn-cantidad btn-restar" aria-label="Restar 1 de ${prod.titulo}" type="button">-</button>
                    <button class="btn-cantidad btn-sumar" aria-label="Sumar 1 de ${prod.titulo}" type="button">+</button>
                </div>
            `;

            // Configurar Eventos para botones +/-
            const btnRestar = itemTarjeta.querySelector(".btn-restar");
            const btnSumar = itemTarjeta.querySelector(".btn-sumar");

            btnRestar.addEventListener("click", () => {
                restarCantidad(prod.id);
            });

            btnSumar.addEventListener("click", () => {
                sumarCantidad(prod);
            });

            listaResumenCarrito.appendChild(itemTarjeta);
        });

        // Formatear y mostrar total
        totalMonto.textContent = `$${total.toLocaleString('es-AR')}`;
        
        // Persistir cambios
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // 6. Sumar cantidad de un producto
    function sumarCantidad(producto) {
        // Crear un nuevo item con uid único
        const nuevoItem = {
            id: producto.id,
            titulo: producto.titulo,
            precio: producto.precio,
            imagen: producto.imagen,
            uid: Date.now() + Math.random().toString(36).substring(2, 9)
        };
        carrito.push(nuevoItem);
        actualizarCarritoUI();
    }

    // 7. Restar cantidad de un producto
    function restarCantidad(productoId) {
        // Buscar el índice del último elemento agregado con ese ID
        const index = carrito.map(item => item.id).lastIndexOf(productoId);
        if (index !== -1) {
            carrito.splice(index, 1);
        }
        actualizarCarritoUI();
    }

    // 8. Confirmación de Compra y Modales
    btnConfirmarCompra.addEventListener("click", () => {
        if (carrito.length === 0) return;

        // Calcular total actual
        let total = carrito.reduce((acc, item) => acc + item.precio, 0);

        // Actualizar datos del modal
        modalNombreCliente.textContent = nombreCliente;
        modalTotalMonto.textContent = `$${total.toLocaleString('es-AR')}`;
        
        // Mostrar modal
        modalConfirmar.classList.remove("d-none");
    });

    btnModalCancelar.addEventListener("click", () => {
        // Ocultar modal
        modalConfirmar.classList.add("d-none");
    });

    btnModalConfirmar.addEventListener("click", async () => {
        // Deshabilitar botones e iniciar simulación
        btnModalCancelar.disabled = true;
        btnModalConfirmar.disabled = true;
        modalBotones.classList.add("d-none");
        modalCargando.classList.remove("d-none");

        let total = carrito.reduce((acc, item) => acc + item.precio, 0);

        // Simular llamada al backend de Express
        try {
            const url = window.location.protocol === 'file:' 
                ? 'http://localhost:3000/api/confirmar-compra' 
                : '/api/confirmar-compra';
            
            // Intentamos realizar la petición al backend según la estructura (incluso si da error)
            await fetch(url, {
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
            // Ignoramos el error en el front ya que la consigna pide no realizar la funcionalidad en el back
            console.log("Fetch simulado o fallido en backend (esperado):", error);
        }

        // Simular retraso de 2 segundos para dar sensación de procesamiento premium del PDF
        setTimeout(() => {
            // Guardar compra para mostrar en el ticket
            const compraFinalizada = {
                cliente: nombreCliente,
                items: carrito,
                total: total,
                fecha: new Date().toLocaleDateString('es-AR'),
                hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
            };
            localStorage.setItem("ultimoTicket", JSON.stringify(compraFinalizada));

            // Limpiar el carrito activo
            localStorage.removeItem("carrito");

            // Redirigir a la pantalla del ticket
            window.location.href = "../ticket/ticket.html";
        }, 2000);
    });

    // Inicialización de la pantalla
    actualizarCarritoUI();
});
