import fs from "fs";
import Usuario from "../models/usuario.model.js";

/**
 * Borra un archivo temporal que fue subido en la solicitud si esta falla validación.
 * @param {Object} req - Objeto de solicitud de Express.
 */
const borrarArchivoCargado = (req) => {
    if (req.file) {
        try {
            fs.unlinkSync(req.file.path);
        } catch (error) {
            console.error("Error al borrar archivo temporal huérfano:", error);
        }
    }
};

/**
 * Valida los datos para el registro de administradores.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Siguiente función en la cadena de middleware.
 */
export const validarRegistroAdmin = (req, res, next) => {
    const { correo, clave } = req.body;
    if (!correo || !correo.includes("@") || !correo.includes(".")) {
        return res.status(400).json({ error: "El formato del correo electrónico no es válido." });
    }
    if (!clave || clave.length < 6) {
        return res.status(400).json({ error: "La clave debe tener al menos 6 caracteres." });
    }
    next();
};

/**
 * Valida los datos enviados al confirmar/registrar una venta.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Siguiente función en la cadena de middleware.
 */
export const validarRegistroVenta = (req, res, next) => {
    const { nombre_cliente, fecha, hora, total, productos } = req.body;
    if (!nombre_cliente || nombre_cliente.trim() === "") {
        return res.status(400).json({ error: "El nombre del cliente es obligatorio." });
    }
    if (!fecha || !hora) {
        return res.status(400).json({ error: "La fecha y la hora son obligatorias." });
    }
    if (total === undefined || isNaN(total) || parseFloat(total) < 0) {
        return res.status(400).json({ error: "El total de la venta debe ser un número no negativo." });
    }
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ error: "Debe incluir al menos un producto en la venta." });
    }
    for (const item of productos) {
        const prodId = item.id || item.producto_id || item;
        const cant = item.cantidad || 1;
        if (!prodId) {
            return res.status(400).json({ error: "Cada producto en la lista debe tener un identificador válido." });
        }
        if (isNaN(cant) || parseInt(cant) <= 0) {
            return res.status(400).json({ error: "La cantidad de cada producto debe ser un número entero mayor a cero." });
        }
    }
    next();
};

/**
 * Valida los datos de entrada para la creación (alta) de un producto.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Siguiente función en la cadena de middleware.
 */
export const validarAltaProducto = (req, res, next) => {
    const { tipo, titulo, precio, estado } = req.body;
    
    if (!tipo || (tipo !== "pelicula" && tipo !== "serie")) {
        borrarArchivoCargado(req);
        return res.status(400).send("La categoría del producto es obligatoria y debe ser 'pelicula' o 'serie'.");
    }
    if (!titulo || titulo.trim() === "") {
        borrarArchivoCargado(req);
        return res.status(400).send("El título del producto es obligatorio.");
    }
    if (precio === undefined || isNaN(precio) || parseFloat(precio) < 0) {
        borrarArchivoCargado(req);
        return res.status(400).send("El precio del producto debe ser un número válido y no negativo.");
    }
    if (estado && estado !== "activo" && estado !== "inactivo") {
        borrarArchivoCargado(req);
        return res.status(400).send("El estado debe ser 'activo' o 'inactivo'.");
    }
    if (!req.file) {
        return res.status(400).send("La imagen del producto es obligatoria.");
    }
    next();
};

/**
 * Valida los datos para la modificación de un producto existente.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Siguiente función en la cadena de middleware.
 */
export const validarModificarProducto = (req, res, next) => {
    const { id, tipo, titulo, precio, estado } = req.body;
    
    if (id && estado && !tipo && !titulo && !precio) {
        if (estado !== "activo" && estado !== "inactivo") {
            return res.status(400).json({ error: "El estado debe ser 'activo' o 'inactivo'." });
        }
        return next();
    }
    
    if (!id || isNaN(id)) {
        borrarArchivoCargado(req);
        return res.status(400).send("El identificador del producto es obligatorio y debe ser numérico.");
    }
    if (tipo && tipo !== "pelicula" && tipo !== "serie") {
        borrarArchivoCargado(req);
        return res.status(400).send("La categoría debe ser 'pelicula' o 'serie'.");
    }
    if (titulo && titulo.trim() === "") {
        borrarArchivoCargado(req);
        return res.status(400).send("El título no puede estar vacío.");
    }
    if (precio !== undefined && (isNaN(precio) || parseFloat(precio) < 0)) {
        borrarArchivoCargado(req);
        return res.status(400).send("El precio debe ser un número válido y no negativo.");
    }
    if (estado && estado !== "activo" && estado !== "inactivo") {
        borrarArchivoCargado(req);
        return res.status(400).send("El estado debe ser 'activo' o 'inactivo'.");
    }
    next();
};