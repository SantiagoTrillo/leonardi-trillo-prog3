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
    const ticketHora = document.getElementById("ticketHora");
    const ticketItemsContainer = document.getElementById("ticketItemsContainer");
    const ticketTotalMonto = document.getElementById("ticketTotalMonto");
    
    const btnHome = document.getElementById("btnHome");
    const btnGuardarTicket = document.getElementById("btnGuardarTicket");
    
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
    // Mostrar hora (si no existe, calcularla sobre la marcha)
    ticketHora.textContent = ultimoTicket.hora || new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    ticketTotalMonto.textContent = `$${ultimoTicket.total.toLocaleString('es-AR')}`;

    const itemsAgrupados = agruparProductos(ultimoTicket.items);
    ticketItemsContainer.innerHTML = "";

    itemsAgrupados.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        const itemRow = document.createElement("div");
        itemRow.className = "item-row";
        
        // Formatear cantidad de acuerdo al formato del boceto: Producto4 x 4 o Producto3 (si es 1 sola unidad)
        const qtyText = item.cantidad > 1 ? ` x ${item.cantidad}` : '';
        itemRow.innerHTML = `
            <span class="item-label">${item.titulo}${qtyText}</span>
            <span class="item-value">$${subtotal.toLocaleString('es-AR')}</span>
        `;
        ticketItemsContainer.appendChild(itemRow);
    });

    // 5. Salir al presionar el botón de la casita (Home)
    btnHome.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Limpiar datos para reiniciar todo el flujo de compra
        localStorage.removeItem("nombreCliente");
        localStorage.removeItem("ultimoTicket");
        localStorage.removeItem("carrito");
        
        // Redirigir al inicio
        window.location.href = "../bienvenida/bienvenida.html";
    });

    // 6. Descargar Ticket (Petición al backend con fallback de impresión)
    btnGuardarTicket.addEventListener("click", async () => {
        btnGuardarTicket.disabled = true;
        const iconOriginal = btnGuardarTicket.innerHTML;
        btnGuardarTicket.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

        const url = window.location.protocol === 'file:' 
            ? 'http://localhost:3000/api/ticket/pdf' 
            : '/api/ticket/pdf';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cliente: ultimoTicket.cliente,
                    items: itemsAgrupados,
                    total: ultimoTicket.total,
                    fecha: ultimoTicket.fecha,
                    hora: ultimoTicket.hora || new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                })
            });

            if (response.ok) {
                // Obtener archivo PDF retornado por el back y disparar descarga
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `ticket-${ultimoTicket.cliente.replace(/\s+/g, '-')}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(downloadUrl);
            } else {
                throw new Error("Respuesta del backend fallida");
            }
        } catch (error) {
            console.log("Error de conexión al backend para descargar PDF. Ejecutando fallback local:", error);
            // Fallback: usar el diálogo de impresión nativo del navegador con formato de impresión
            window.print();
        } finally {
            btnGuardarTicket.innerHTML = iconOriginal;
            btnGuardarTicket.disabled = false;
        }
    });
});
