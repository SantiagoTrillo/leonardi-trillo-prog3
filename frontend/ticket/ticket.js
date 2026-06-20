document.addEventListener("DOMContentLoaded", () => {
    const ultimoTicket = JSON.parse(sessionStorage.getItem("ultimoTicket"));
    if (!ultimoTicket) {
        window.location.href = "../bienvenida/bienvenida.html";
        return;
    }

    const ticketNombreCliente = document.getElementById("ticketNombreCliente");
    const ticketFecha = document.getElementById("ticketFecha");
    const ticketHora = document.getElementById("ticketHora");
    const ticketItemsContainer = document.getElementById("ticketItemsContainer");
    const ticketTotalMonto = document.getElementById("ticketTotalMonto");

    const btnHome = document.getElementById("btnHome");
    const btnGuardarTicket = document.getElementById("btnGuardarTicket");

    /**
     * Agrupa productos idénticos incrementando su cantidad para el desglose del ticket.
     * @param {Array<Object>} items - Lista de productos agregados en la compra.
     * @returns {Array<Object>} Lista de productos agrupados por ID con sus cantidades consolidadas.
     */
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

    ticketNombreCliente.textContent = ultimoTicket.cliente;
    ticketFecha.textContent = ultimoTicket.fecha;
    ticketHora.textContent = ultimoTicket.hora || new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    ticketTotalMonto.textContent = `$${ultimoTicket.total.toLocaleString('es-AR')}`;

    const itemsAgrupados = agruparProductos(ultimoTicket.items);
    ticketItemsContainer.innerHTML = "";

    itemsAgrupados.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        const itemRow = document.createElement("div");
        itemRow.className = "item-row";
        const qtyText = item.cantidad > 1 ? ` x ${item.cantidad}` : '';
        itemRow.innerHTML = `
            <span class="item-label">${item.titulo}${qtyText}</span>
            <span class="item-value">$${subtotal.toLocaleString('es-AR')}</span>
        `;
        ticketItemsContainer.appendChild(itemRow);
    });

    btnGuardarTicket.addEventListener("click", async () => {
        try {
            btnGuardarTicket.disabled = true;
            btnGuardarTicket.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
            
            const payload = {
                cliente: ultimoTicket.cliente,
                fecha: ultimoTicket.fecha,
                hora: ultimoTicket.hora || new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
                items: itemsAgrupados,
                total: ultimoTicket.total,
                tema: localStorage.getItem("tema") || "dark"
            };

            const respuesta = await fetch("http://localhost:3000/api/ticket-pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!respuesta.ok) {
                throw new Error("Error al generar el PDF en el servidor.");
            }

            const blob = await respuesta.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ticket-${ultimoTicket.cliente.replace(/\s+/g, "_")}-${ultimoTicket.fecha.replace(/\//g, "-")}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar el ticket en PDF:", error);
            alert("No se pudo descargar el ticket. Por favor intente nuevamente.");
        } finally {
            btnGuardarTicket.disabled = false;
            btnGuardarTicket.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>`;
        }
    });

    btnHome.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("nombreCliente");
        sessionStorage.removeItem("ultimoTicket");
        sessionStorage.removeItem("carrito");
        window.location.href = "../bienvenida/bienvenida.html";
    });
});