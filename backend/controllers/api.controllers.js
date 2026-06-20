import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";
import Venta from "../models/venta.model.js";
import Producto from "../models/producto.model.js";
import VentaProducto from "../models/venta-producto.model.js";
import { crearPDFTicket } from "../utils/ticket-pdf.js";

/**
 * Registra un nuevo administrador en el sistema cifrando su contraseña.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const registrarAdministrador = async (req, res) => {
    try {
        const { correo, clave } = req.body;

        if (!correo || !clave) {
            return res.status(400).json({ error: "El correo y la clave son obligatorios." });
        }

        const salt = await bcrypt.genSalt(10);
        const claveCifrada = await bcrypt.hash(clave, salt);

        const nuevoUsuario = await Usuario.create({
            correo,
            clave: claveCifrada
        });

        return res.status(201).json({
            success: true,
            usuario: {
                id: nuevoUsuario.id,
                correo: nuevoUsuario.correo
            }
        });
    } catch (error) {
        console.error("Error al registrar administrador:", error);
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: "El correo electrónico ya se encuentra registrado." });
        }
        return res.status(500).json({ error: "Error interno del servidor al crear administrador." });
    }
};

/**
 * Registra una nueva compra (venta) asociándola con sus productos y cantidades correspondientes.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const registrarVenta = async (req, res) => {
    try {
        const { nombre_cliente, fecha, hora, total, productos } = req.body;

        if (!nombre_cliente || !fecha || !hora || !total || !productos || !Array.isArray(productos)) {
            return res.status(400).json({ error: "Datos de venta incompletos o inválidos." });
        }

        const nuevaVenta = await Venta.create({
            nombre_cliente,
            fecha,
            hora,
            total
        });

        for (const item of productos) {
            const productoId = item.id || item.producto_id || item;
            const cantidad = item.cantidad || 1;

            await VentaProducto.create({
                venta_id: nuevaVenta.id,
                producto_id: productoId,
                cantidad: cantidad
            });
        }

        return res.status(201).json({
            success: true,
            venta: {
                id: nuevaVenta.id,
                nombre_cliente: nuevaVenta.nombre_cliente,
                total: nuevaVenta.total
            }
        });
    } catch (error) {
        console.error("Error al registrar venta:", error);
        return res.status(500).json({ error: "Error interno del servidor al registrar venta." });
    }
};

/**
 * Obtiene el listado completo de todas las ventas registradas con sus productos.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [
                {
                    model: Producto,
                    as: "productos",
                    through: {
                        attributes: ["cantidad"]
                    }
                }
            ]
        });

        return res.json(ventas);
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        return res.status(500).json({ error: "Error interno del servidor al obtener ventas." });
    }
};

/**
 * Obtiene un listado paginado y filtrado por estado/categoría de productos de forma genérica.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const obtenerProductosPaginados = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 10;
        const offset = (pagina - 1) * limite;

        const whereClause = {};
        if (req.query.estado) {
            whereClause.estado = req.query.estado;
        }
        if (req.query.categoria) {
            whereClause.categoria = req.query.categoria;
        }

        const { count, rows } = await Producto.findAndCountAll({
            where: whereClause,
            limit: limite,
            offset: offset,
            order: [["titulo", "ASC"]]
        });

        const totalPaginas = Math.ceil(count / limite);

        return res.json({
            success: true,
            totalProductos: count,
            totalPaginas,
            paginaActual: pagina,
            limite,
            productos: rows.map(p => {
                const raw = p.get({ plain: true });
                raw.tipo = raw.categoria;
                return raw;
            })
        });
    } catch (error) {
        console.error("Error al obtener productos paginados:", error);
        return res.status(500).json({ error: "Error interno del servidor al obtener productos paginados." });
    }
};

/**
 * Genera y envía un archivo PDF del ticket de compra utilizando Puppeteer mediante un servicio externo.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
export const generarTicketPDF = async (req, res) => {
    try {
        const { cliente, fecha, hora, items, total, tema } = req.body;

        if (!cliente || !fecha || !items || !Array.isArray(items)) {
            return res.status(400).json({ error: "Datos del ticket incompletos para generar el PDF." });
        }

        const pdfBuffer = await crearPDFTicket({ cliente, fecha, hora, items, total, tema });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=ticket-${cliente.replace(/\s+/g, "_")}.pdf`);
        return res.send(pdfBuffer);
    } catch (error) {
        console.error("Error al generar PDF del ticket:", error);
        return res.status(500).json({ error: "Error al generar el PDF del ticket." });
    }
};