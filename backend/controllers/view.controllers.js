import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import consultaBD from "../models/productos.models.js"
import usuariosModel from "../models/usuarios.models.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const loginView = (req, res) => {
    res.render('inicio-sesion', {
        titulo: 'Iniciar Sesion',
        error: null
    })
}

export const dashboardView = async (req, res) => {
    const tipoActual = req.query.tipo || "serie";
    const todosProductos = await consultaBD.obtenerTodosLosProductos();
    const productos = todosProductos.filter(p => p.tipo === tipoActual);

    res.render('panel-control', {
        titulo: 'Panel de Control',
        productos,
        tipoActual
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
    const { id, tipo, titulo, precio, estado, imagenExistente } = req.body;

    if (id && estado && !tipo && !titulo) {
        await consultaBD.actualizarEstadoProducto(id, estado);
        const producto = await consultaBD.obtenerProductoPorId(id);
        const tipoRedireccion = (producto && producto.tipo) ? producto.tipo : "serie";
        return res.redirect(`/admin/dashboard?tipo=${tipoRedireccion}`);
    }

    let rutaImagen = imagenExistente;
    if (req.file) {
        rutaImagen = `/uploads/${req.file.filename}`;

        if (imagenExistente && imagenExistente.startsWith("/uploads/")) {
            const pathAnterior = path.join(__dirname, "../public", imagenExistente);
            try {
                if (fs.existsSync(pathAnterior)) {
                    fs.unlinkSync(pathAnterior);
                }
            } catch (error) {
                console.error("Error al borrar la imagen anterior:", error);
            }
        }
    }

    await consultaBD.actualizarProducto(id, { tipo, titulo, precio: parseFloat(precio) || 0, imagen: rutaImagen, estado });
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