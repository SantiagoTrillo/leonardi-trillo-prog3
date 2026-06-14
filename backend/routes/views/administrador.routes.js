import express from "express";

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("inicio-sesion");
});

// TODO: Estos datos son únicamente de prueba y deberán ser removidos en el futuro cuando se conecte con la base de datos real.
const productosPrueba = [
    {
        id: "s1",
        titulo: "Stranger Things",
        precio: 1200,
        imagen: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop",
        tipo: "serie",
        estado: "activo"
    },
    {
        id: "s2",
        titulo: "Breaking Bad",
        precio: 1500,
        imagen: "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?q=80&w=400&auto=format&fit=crop",
        tipo: "serie",
        estado: "activo"
    },
    {
        id: "s5",
        titulo: "Dark Detective",
        precio: 920,
        imagen: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=400&auto=format&fit=crop",
        tipo: "serie",
        estado: "inactivo"
    },
    {
        id: "p1",
        titulo: "Dream Heist",
        precio: 450,
        imagen: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop",
        tipo: "pelicula",
        estado: "activo"
    },
    {
        id: "p2",
        titulo: "Beyond Space",
        precio: 490,
        imagen: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=400&auto=format&fit=crop",
        tipo: "pelicula",
        estado: "inactivo"
    },
    {
        id: "p3",
        titulo: "Shadow Vigilante",
        precio: 480,
        imagen: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400&auto=format&fit=crop",
        tipo: "pelicula",
        estado: "activo"
    }
];

router.get("/dashboard", (req, res) => {
    res.render("panel-control", { productos: productosPrueba });
});

router.get("/alta-producto", (req, res) => {
    res.render("alta-producto");
});

router.post("/alta-producto", (req, res) => {
    // TODO: En el futuro aquí se implementará la lógica para guardar el producto en la base de datos real.
    res.redirect("/admin/dashboard");
});

router.get("/modificar-producto", (req, res) => {
    const id = req.query.id;
    const product = productosPrueba.find(p => p.id === id);
    if (!product) {
        return res.redirect("/admin/dashboard");
    }
    res.render("modificar-producto", { product });
});

router.post("/modificar-producto", (req, res) => {
    const { id, tipo, titulo, precio, imagen, estado } = req.body;
    const index = productosPrueba.findIndex(p => p.id === id);
    if (index !== -1) {
        productosPrueba[index] = {
            id,
            titulo,
            precio: parseFloat(precio) || 0,
            imagen,
            tipo,
            estado
        };
    }
    res.redirect("/admin/dashboard");
});

export default router;