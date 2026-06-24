import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import consultaBD from "../repositories/productos.repository.js";
import usuariosModel from "../repositories/usuarios.repository.js";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Renderiza la vista de inicio de sesion de administradores. */
export const loginView = (req, res) => {
    res.render('inicio-sesion', {
        titulo: 'Iniciar Sesion',
        error: null
    });
};

/* Procesa la accion de inicio de sesion de administradores.*/
export const loginAction = async (req, res) => {
    const { email, password } = req.body;

    const user = await usuariosModel.validateUser(email, password);

    if (!user) {
        return res.render("inicio-sesion", {
            titulo: "Iniciar Sesion",
            error: "Correo o contraseña incorrectos"
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            correo: user.correo
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h"
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 10 * 60 * 1000 // 10 minutos
    });

    res.redirect("/admin/dashboard");
};
export const logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/admin/login");
};

/* Renderiza el panel de control administrativo con listado paginado y filtrado de productos.*/
export const dashboardView = async (req, res) => {
    const tipoActual = req.query.tipo || "serie";
    const buscar = req.query.buscar || "";
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = 6;

    const result = await consultaBD.obtenerProductosPaginadosYFiltrados({
        tipo: tipoActual,
        buscar,
        pagina,
        limite
    });

    res.render('panel-control', {
        titulo: 'Panel de Control',
        productos: result.productos,
        tipoActual,
        buscar,
        paginaActual: result.paginaActual,
        totalPaginas: result.totalPaginas,
        totalProductos: result.totalProductos
    });
};

/* Renderiza la vista de formulario para dar de alta un producto */
export const altaProductoView = (req, res) => {
    res.render('alta-producto', {
        titulo: 'Alta de Producto'
    });
};

/* Renderiza la vista de formulario para modificar un producto existente */
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
};

/* Procesa la creacion de un nuevo producto, incluyendo la gestion de archivos de imagen subidos */
export const altaProductoAction = async (req, res) => {
    const { tipo, titulo, precio, estado } = req.body;
    let rutaImagen = "";
    if (req.file) {
        rutaImagen = `/uploads/${req.file.filename}`;
    }
    
    const nuevoId = await consultaBD.agregarProducto({ tipo, titulo, precio: parseFloat(precio) || 0, imagen: rutaImagen, estado });
    
    if (req.file && nuevoId) {
        const extension = path.extname(req.file.originalname);
        const nombreBase = path.basename(req.file.originalname, extension);
        const nuevoNombreArchivo = `${nombreBase}${nuevoId}${extension}`;
        
        const rutaTemporal = path.join(__dirname, "../public/uploads", req.file.filename);
        const rutaFinal = path.join(__dirname, "../public/uploads", nuevoNombreArchivo);
        
        try {
            if (fs.existsSync(rutaTemporal)) {
                if (fs.existsSync(rutaFinal)) {
                    fs.unlinkSync(rutaFinal);
                }
                fs.renameSync(rutaTemporal, rutaFinal);
                
                const nuevaRutaImagen = `/uploads/${nuevoNombreArchivo}`;
                await consultaBD.actualizarProducto(nuevoId, { tipo, titulo, precio: parseFloat(precio) || 0, imagen: nuevaRutaImagen, estado });
            }
        } catch (error) {
            console.error("Error al renombrar la imagen en altaProductoAction:", error);
        }
    }
    
    res.redirect("/admin/dashboard");
};

/* Procesa la modificacion de un producto existente, incluyendo la actualización de imagenes y el cambio de estado */
export const modificarProductoAction = async (req, res) => {
    const { id, tipo, titulo, precio, imagenExistente, estado } = req.body;

    //Actualizar estado
    if (id && estado && !tipo && !titulo) {
        await consultaBD.actualizarEstadoProducto(id, estado);
        const producto = await consultaBD.obtenerProductoPorId(id);
        const tipoRedireccion = (producto && producto.tipo) ? producto.tipo : "serie";
        return res.redirect(`/admin/dashboard?tipo=${tipoRedireccion}`);
    }

    //Cambia el nombre de la imagen a nombre unico y definitivo
    let rutaImagen = imagenExistente;
    if (req.file) {
        const extension = path.extname(req.file.originalname);
        const nombreBase = path.basename(req.file.originalname, extension);
        const nuevoNombreArchivo = `${nombreBase}${id}${extension}`;
        
        const pathNuevoTemporal = path.join(__dirname, "../public/uploads", req.file.filename);
        const pathNuevoFinal = path.join(__dirname, "../public/uploads", nuevoNombreArchivo);
        const nuevaRutaImagen = `/uploads/${nuevoNombreArchivo}`;

        if (imagenExistente && imagenExistente !== nuevaRutaImagen && imagenExistente.startsWith("/uploads/")) {
            const pathAnterior = path.join(__dirname, "../public", imagenExistente);
            try {
                if (fs.existsSync(pathAnterior)) {
                    fs.unlinkSync(pathAnterior);
                }
            } catch (error) {
                console.error("Error al borrar la imagen anterior:", error);
            }
        }

        try {
            if (req.file.filename !== nuevoNombreArchivo) {
                if (fs.existsSync(pathNuevoFinal)) {
                    fs.unlinkSync(pathNuevoFinal);
                }
                if (fs.existsSync(pathNuevoTemporal)) {
                    fs.renameSync(pathNuevoTemporal, pathNuevoFinal);
                }
            }
            rutaImagen = nuevaRutaImagen;
        } catch (error) {
            console.error("Error al renombrar el archivo en modificarProductoAction:", error);
            rutaImagen = `/uploads/${req.file.filename}`;
        }
    }

    await consultaBD.actualizarProducto(id, { tipo, titulo, precio: parseFloat(precio) || 0, imagen: rutaImagen, estado });
    res.redirect("/admin/dashboard");
};