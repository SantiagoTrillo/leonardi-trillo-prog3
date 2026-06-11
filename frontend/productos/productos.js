document.addEventListener("DOMContentLoaded", () => {
    // 0. Inicializar y Persistir Tema
    const btnTema = document.getElementById("btnTema");
    const iconTema = btnTema ? btnTema.querySelector("i") : null;

    function aplicarTema() {
        const temaGuardado = localStorage.getItem("tema") || "dark";
        if (temaGuardado === "light") {
            document.body.classList.add("light-mode");
            if (iconTema) iconTema.className = "fa-solid fa-sun";
        } else {
            document.body.classList.remove("light-mode");
            if (iconTema) iconTema.className = "fa-solid fa-moon";
        }
    }
    
    aplicarTema();

    if (btnTema) {
        btnTema.addEventListener("click", () => {
            if (document.body.classList.contains("light-mode")) {
                localStorage.setItem("tema", "dark");
            } else {
                localStorage.setItem("tema", "light");
            }
            aplicarTema();
        });
    }

    // 1. Validar nombre del cliente y mostrarlo
    const nombreCliente = localStorage.getItem("nombreCliente");
    if (!nombreCliente) {
        window.location.href = "../bienvenida/bienvenida.html";
        return;
    }

    const nombreClienteSpan = document.getElementById("nombreClienteSpan");
    if (nombreClienteSpan) {
        nombreClienteSpan.textContent = nombreCliente;
    }

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
                imagen: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?q=80&w=400&auto=format&fit=crop"
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
            },
            {
                id: "s7",
                titulo: "Retro Gaming",
                precio: 850,
                imagen: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "s8",
                titulo: "Kingdom of Ice",
                precio: 910,
                imagen: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "s9",
                titulo: "Viking Legends",
                precio: 880,
                imagen: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "s10",
                titulo: "Neon Nights",
                precio: 940,
                imagen: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "s11",
                titulo: "Lost Expedition",
                precio: 860,
                imagen: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "s12",
                titulo: "AI Revolution",
                precio: 990,
                imagen: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop"
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
            },
            {
                id: "p7",
                titulo: "Golden Hour",
                precio: 440,
                imagen: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "p8",
                titulo: "Deep Ocean",
                precio: 470,
                imagen: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "p9",
                titulo: "Cyber Runner",
                precio: 495,
                imagen: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "p10",
                titulo: "Shadow Forest",
                precio: 430,
                imagen: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "p11",
                titulo: "Future City",
                precio: 480,
                imagen: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=400&auto=format&fit=crop"
            },
            {
                id: "p12",
                titulo: "Retro Car",
                precio: 450,
                imagen: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?q=80&w=400&auto=format&fit=crop"
            }
        ]
    };

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
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
            localStorage.setItem("carrito", JSON.stringify(carrito));
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
        localStorage.setItem("carrito", JSON.stringify(carrito));
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