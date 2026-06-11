document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar detalles del ticket
    const ultimoTicket = JSON.parse(localStorage.getItem("ultimoTicket"));
    if (!ultimoTicket) {
        // Redirigir a bienvenida si se intenta acceder directamente
        window.location.href = "../bienvenida/bienvenida.html";
        return;
    }

    // Elementos del DOM
    const ticketNombreCliente = document.getElementById("ticketNombreCliente");
    const ticketFecha = document.getElementById("ticketFecha");
    const ticketItemsContainer = document.getElementById("ticketItemsContainer");
    const ticketTotalMonto = document.getElementById("ticketTotalMonto");
    const btnDescargarTicket = document.getElementById("btnDescargarTicket");
    const btnSalir = document.getElementById("btnSalir");
    
    // Botón de Tema
    const btnTema = document.getElementById("btnTema");
    const iconTema = btnTema.querySelector("i");

    // 2. Inicializar y Persistir Tema
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

    // 3. Agrupar productos para listado del ticket
    function agruparProductos(items) {
        const agrupados = [];
        items.forEach(item => {
            const existente = agrupados.find(p => p.id === item.id);
            if (existente) {
                existente.cantidad += 1;
            } else {
                agrupados.push({
                    id: item.id,
                    titulo: item.titulo,
                    precio: item.precio,
                    cantidad: 1
                });
            }
        });
        return agrupados;
    }

    // 4. Renderizar datos del ticket
    ticketNombreCliente.textContent = ultimoTicket.cliente;
    ticketFecha.textContent = ultimoTicket.fecha;
    ticketTotalMonto.textContent = `$${ultimoTicket.total.toLocaleString('es-AR')}`;

    const itemsAgrupados = agruparProductos(ultimoTicket.items);
    ticketItemsContainer.innerHTML = "";

    itemsAgrupados.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        const itemDiv = document.createElement("div");
        itemDiv.className = "ticket-item";
        itemDiv.innerHTML = `
            <span class="ticket-item-nombre">${item.titulo} x ${item.cantidad}</span>
            <span class="ticket-item-subtotal">$${subtotal.toLocaleString('es-AR')}</span>
        `;
        ticketItemsContainer.appendChild(itemDiv);
    });

    // 5. Descargar Ticket (Abre el diálogo de impresión configurado para PDF)
    btnDescargarTicket.addEventListener("click", () => {
        window.print();
    });

    // 6. Salir / Nueva Compra
    btnSalir.addEventListener("click", () => {
        // Limpiar nombre del cliente y ticket para reiniciar todo el flujo de compra
        localStorage.removeItem("nombreCliente");
        localStorage.removeItem("ultimoTicket");
        localStorage.removeItem("carrito");
        
        // Redirigir a bienvenida
        window.location.href = "../bienvenida/bienvenida.html";
    });
});
