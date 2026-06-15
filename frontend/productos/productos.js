document.addEventListener("DOMContentLoaded", () => {
    const nombreCliente = sessionStorage.getItem("nombreCliente");
    if (!nombreCliente) {
        window.location.href = "../bienvenida/bienvenida.html";
        return;
    }

    const nombreClienteSpan = document.getElementById("nombreClienteSpan");
    if (nombreClienteSpan) {
        nombreClienteSpan.textContent = nombreCliente;
    }

    const productosDB = {
        series: [],
        peliculas: []
    };

    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    carrito = carrito.map(item => {
        if (!item.cantidad) item.cantidad = 1;
        return item;
    });

    const btnSeries = document.getElementById("btnSeries");
    const btnPeliculas = document.getElementById("btnPeliculas");
    const tipoCatalogoSpan = document.getElementById("tipoCatalogoSpan");
    const grillaProductos = document.getElementById("grillaProductos");
    const listaCarrito = document.getElementById("listaCarrito");
    const totalMonto = document.getElementById("totalMonto");

    let catalogoActual = "series";

    function renderizarCatalogo() {
        grillaProductos.innerHTML = "";
        const productos = productosDB[catalogoActual];

        productos.forEach(producto => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-producto";
            tarjeta.setAttribute("role", "button");
            tarjeta.setAttribute("aria-label", `Agregar ${producto.titulo} al carrito`);
            
            tarjeta.innerHTML = `
                <div class="contenedor-portada">
                    <img class="portada-img" src="${producto.imagen}" alt="Póster de ${producto.titulo}" loading="lazy">
                    <div class="overlay-agregar">
                        <i class="fa-solid fa-cart-plus"></i>
                        <span>AGREGAR</span>
                    </div>
                </div>
                <div class="info-producto">
                    <h3 class="titulo-producto">${producto.titulo}</h3>
                    <p class="precio-producto">$${producto.precio}</p>
                </div>
            `;

            tarjeta.addEventListener("click", () => {
                agregarAlCarrito(producto);
            });

            grillaProductos.appendChild(tarjeta);
        });
    }

    function actualizarCarritoUI() {
        listaCarrito.innerHTML = "";

        if (carrito.length === 0) {
            listaCarrito.innerHTML = `
                <div class="carrito-vacio-msg text-center py-5">
                    <i class="fa-solid fa-basket-shopping mb-2"></i>
                    <p class="mb-0">El carrito está vacío</p>
                </div>
            `;
            totalMonto.textContent = "$0";
            sessionStorage.setItem("carrito", JSON.stringify(carrito));
            return;
        }

        let total = 0;

        carrito.forEach(item => {
            total += item.precio * item.cantidad;

            const itemDiv = document.createElement("div");
            itemDiv.className = "item-carrito";
            
            const multiplicadorHTML = item.cantidad > 1 ? ` <span class="item-carrito-multiplicador">x${item.cantidad}</span>` : "";
            
            itemDiv.innerHTML = `
                <div class="item-carrito-info">
                    <h4 class="item-carrito-titulo">
                        <span class="item-carrito-texto">${item.titulo}</span>
                        ${multiplicadorHTML}
                    </h4>
                    <p class="item-carrito-precio">$${item.precio * item.cantidad}</p>
                </div>
                <button class="btn-eliminar-item" aria-label="Eliminar ${item.titulo} del carrito" type="button">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;

            const btnEliminar = itemDiv.querySelector(".btn-eliminar-item");
            btnEliminar.addEventListener("click", (e) => {
                e.stopPropagation();
                eliminarDelCarrito(item.id);
            });

            listaCarrito.appendChild(itemDiv);
        });

        totalMonto.textContent = `$${total}`;
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function agregarAlCarrito(producto) {
        const itemExistente = carrito.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }

        actualizarCarritoUI();

        setTimeout(() => {
            listaCarrito.scrollTop = listaCarrito.scrollHeight;
        }, 50);
    }

    function eliminarDelCarrito(id) {
        carrito = carrito.filter(item => item.id !== id);
        actualizarCarritoUI();
    }

    btnSeries.addEventListener("click", () => {
        if (catalogoActual !== "series") {
            catalogoActual = "series";
            btnSeries.classList.add("active");
            btnPeliculas.classList.remove("active");
            tipoCatalogoSpan.textContent = "Series";
            renderizarCatalogo();
        }
    });

    btnPeliculas.addEventListener("click", () => {
        if (catalogoActual !== "peliculas") {
            catalogoActual = "peliculas";
            btnPeliculas.classList.add("active");
            btnSeries.classList.remove("active");
            tipoCatalogoSpan.textContent = "Películas";
            renderizarCatalogo();
        }
    });

    renderizarCatalogo();
    actualizarCarritoUI();
});