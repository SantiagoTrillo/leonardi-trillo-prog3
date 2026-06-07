document.addEventListener("DOMContentLoaded", () => {
    // 1. Validar nombre del cliente y mostrarlo
    const nombreCliente = localStorage.getItem("nombreCliente");
    if (!nombreCliente) {
        // Si no hay nombre guardado, redirigir a bienvenida para cumplir las consignas
        window.location.href = "../bienvenida/bienvenida.html";
        return;
    }

    const nombreClienteSpan = document.getElementById("nombreClienteSpan");
    if (nombreClienteSpan) {
        nombreClienteSpan.textContent = nombreCliente;
    }

    // 2. Base de datos Mock (Series y Películas)
    const productosDB = {
        series: [
            {
                id: "s1",
                titulo: "Strange Dimensions",
                precio: 890,
                imagen: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "s2",
                titulo: "Breaking Chemistry",
                precio: 950,
                imagen: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "s3",
                titulo: "Space Bounty Hunter",
                precio: 990,
                imagen: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "s4",
                titulo: "Throne of Swords",
                precio: 870,
                imagen: "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "s5",
                titulo: "Dark Detective",
                precio: 920,
                imagen: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "s6",
                titulo: "Cyber Hacker",
                precio: 880,
                imagen: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop"
            }
        ],
        peliculas: [
            {
                id: "p1",
                titulo: "Dream Heist",
                precio: 450,
                imagen: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "p2",
                titulo: "Beyond Space",
                precio: 490,
                imagen: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "p3",
                titulo: "Shadow Vigilante",
                precio: 480,
                imagen: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "p4",
                titulo: "Spirited Journey",
                precio: 420,
                imagen: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "p5",
                titulo: "Neon Speedster",
                precio: 460,
                imagen: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "p6",
                titulo: "Jungle Quest",
                precio: 430,
                imagen: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=400&auto=format&fit=crop"
            }
        ]
    };

    // 3. Estado del Carrito (recuperar de localStorage si existe, sino vacío)
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Elementos del DOM
    const btnSeries = document.getElementById("btnSeries");
    const btnPeliculas = document.getElementById("btnPeliculas");
    const tipoCatalogoSpan = document.getElementById("tipoCatalogoSpan");
    const grillaProductos = document.getElementById("grillaProductos");
    const listaCarrito = document.getElementById("listaCarrito");
    const totalMonto = document.getElementById("totalMonto");

    let catalogoActual = "series";

    // 4. Funciones de Renderizado
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

            // Al hacer click, agregar al carrito
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
                    <i class="fa-solid fa-basket-shopping mb-2 fs-3 opacity-50"></i>
                    <p class="mb-0 text-muted">El carrito está vacío</p>
                </div>
            `;
            totalMonto.textContent = "$0";
            localStorage.setItem("carrito", JSON.stringify(carrito));
            return;
        }

        let total = 0;

        carrito.forEach(item => {
            total += item.precio;

            const itemDiv = document.createElement("div");
            itemDiv.className = "item-carrito";
            
            itemDiv.innerHTML = `
                <div class="item-carrito-info">
                    <h4 class="item-carrito-titulo">${item.titulo}</h4>
                    <p class="item-carrito-precio">$${item.precio}</p>
                </div>
                <button class="btn-eliminar-item" aria-label="Eliminar ${item.titulo} del carrito" type="button">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;

            // Evento para eliminar
            const btnEliminar = itemDiv.querySelector(".btn-eliminar-item");
            btnEliminar.addEventListener("click", (e) => {
                e.stopPropagation(); // Evitar cualquier otro click accidental
                eliminarDelCarrito(item.uid);
            });

            listaCarrito.appendChild(itemDiv);
        });

        totalMonto.textContent = `$${total}`;
        
        // Persistir el estado actual del carrito
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // 5. Funciones del Carrito
    function agregarAlCarrito(producto) {
        // Generar un ID único de item en el carrito para permitir duplicados del mismo producto
        const itemCarrito = {
            ...producto,
            uid: Date.now() + Math.random().toString(36).substring(2, 9)
        };

        carrito.push(itemCarrito);
        actualizarCarritoUI();

        // Efecto visual: desplazar el carrito al fondo para ver el nuevo producto agregado
        setTimeout(() => {
            listaCarrito.scrollTop = listaCarrito.scrollHeight;
        }, 50);
    }

    function eliminarDelCarrito(uid) {
        carrito = carrito.filter(item => item.uid !== uid);
        actualizarCarritoUI();
    }

    // 6. Configurar Event Listeners para filtros de Catálogo
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

    // 7. Inicialización
    renderizarCatalogo();
    actualizarCarritoUI();
});
