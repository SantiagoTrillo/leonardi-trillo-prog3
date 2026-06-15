import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";
import Venta from "../models/venta.model.js";
import Producto from "../models/producto.model.js";
import VentaProducto from "../models/venta-producto.model.js";

// Registrar un nuevo usuario administrador
export const registrarAdministrador = async (req, res) => {
    try {
        const { correo, clave } = req.body;

        if (!correo || !clave) {
            return res.status(400).json({ error: "El correo y la clave son obligatorios." });
        }

        // Cifrar la clave
        const salt = await bcrypt.genSalt(10);
        const claveCifrada = await bcrypt.hash(clave, salt);

        // Crear el usuario administrador en la base de datos
        const nuevoUsuario = await Usuario.create({
            correo,
            clave: claveCifrada
        });

        // Retornar el usuario creado (sin exponer la clave)
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

// Registrar una venta y sus relaciones de productos
export const registrarVenta = async (req, res) => {
    try {
        const { nombre_cliente, fecha, hora, total, productos } = req.body;

        if (!nombre_cliente || !fecha || !hora || !total || !productos || !Array.isArray(productos)) {
            return res.status(400).json({ error: "Datos de venta incompletos o inválidos." });
        }

        // Crear registro en la tabla de ventas
        const nuevaVenta = await Venta.create({
            nombre_cliente,
            fecha,
            hora,
            total
        });

        // Insertar relaciones en la tabla intermedia
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

// Obtener todas las ventas con sus respectivos productos
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
