import consultaBD from "../models/productos.models.js"
import usuariosModel from "../models/usuarios.models.js"

export const loginView = (req, res) => {
    res.render('inicio-sesion', {
        titulo: 'Iniciar Sesion',
        error: null
    })
}

export const dashboardView = async (req, res) => {
    const productos = await consultaBD.obtenerTodosLosProductos();

    res.render('panel-control', {
        titulo: 'Panel de Control',
        productos
    })
}

export const altaProductoView = (req, res) => {
    res.render('alta-producto', {
        titulo: 'Alta de Producto'
    })
} 

export const modificarProductoView = async (req, res) => {
    const { id } = req.query;

    const product = await consultaBD.obtenerProductoPorId(id);

    if (!product) {
        return res.redirect("/admin/dashboard");
    }

    res.render('modificar-producto', {
        titulo: 'Modificar Producto',
        product
    });
}

export const altaProductoAction = async (req, res) => {
    const { tipo, titulo, precio, estado } = req.body;
    let rutaImagen = "";
    if (req.file) {
        rutaImagen = `/uploads/${req.file.filename}`;
    }
    await consultaBD.agregarProducto({ tipo, titulo, precio: parseFloat(precio) || 0, imagen: rutaImagen, estado });
    res.redirect("/admin/dashboard");
};

export const modificarProductoAction = async (req, res) => {
    const { id, tipo, titulo, precio, imagen, estado } = req.body;

    if (id && estado && !tipo && !titulo) {
        const resultado = await consultaBD.actualizarEstadoProducto(id, estado);
        return res.json({ success: resultado });
    }

    await consultaBD.actualizarProducto(id, { tipo, titulo, precio: parseFloat(precio) || 0, imagen, estado });
    res.redirect("/admin/dashboard");
};

export const loginAction = async (req, res) => {
    const { email, password } = req.body;
    const user = await usuariosModel.validateUser(email, password);
    if (user) {
        res.redirect("/admin/dashboard");
    } else {
        res.render('inicio-sesion', {
            titulo: 'Iniciar Sesion',
            error: 'Correo o contraseña incorrectos'
        });
    }
};