import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";
import Venta from "../models/venta.model.js";
import Producto from "../models/producto.model.js";
import VentaProducto from "../models/venta-producto.model.js";

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

export const obtenerProductosPaginados = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 10;
        const offset = (pagina - 1) * limite;

        const { count, rows } = await Producto.findAndCountAll({
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