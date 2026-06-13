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

    btnGuardarTicket.addEventListener("click", () => {
        window.print();
    });

    btnHome.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("nombreCliente");
        sessionStorage.removeItem("ultimoTicket");
        sessionStorage.removeItem("carrito");
        window.location.href = "../bienvenida/bienvenida.html";
    });
});