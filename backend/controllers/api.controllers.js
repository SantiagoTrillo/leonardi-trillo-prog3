import bcrypt from "bcryptjs";
import puppeteer from "puppeteer";
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

export const generarTicketPDF = async (req, res) => {
    try {
        const { cliente, fecha, hora, items, total, tema } = req.body;

        if (!cliente || !fecha || !items || !Array.isArray(items)) {
            return res.status(400).json({ error: "Datos del ticket incompletos para generar el PDF." });
        }

        const esClaro = tema === "light";
        
        const fondoOscuro = esClaro ? "#f5f6f8" : "#111";
        const colorLinea = esClaro ? "#2e3440" : "#c9c9c9";
        const textoPrincipal = esClaro ? "#2e3440" : "#d6d6d6";
        const textoSecundario = esClaro ? "#4c566a" : "#a8a8a8";
        const colorAcento = esClaro ? "#e67e00" : "#ff9000";

        let itemsHTML = "";
        items.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            const qtyText = item.cantidad > 1 ? ` x ${item.cantidad}` : "";
            itemsHTML += `
                <div class="item-row">
                    <span class="item-label">${item.titulo}${qtyText}</span>
                    <span class="item-value">$${subtotal.toLocaleString('es-AR')}</span>
                </div>
            `;
        });

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                    
                    @page {
                        margin: 0;
                    }
                    
                    * {
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: "Inter", Arial, sans-serif;
                        background: ${fondoOscuro};
                        color: ${textoPrincipal};
                        margin: 0;
                        padding: 24px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }

                    .ticket-centro {
                        width: 100%;
                        max-width: 380px;
                        margin: 0 auto;
                    }

                    .ticket-tarjeta {
                        background: ${esClaro ? "rgba(0,0,0,0.02)" : "rgba(255, 255, 255, 0.015)"};
                        border: 1.5px solid ${colorLinea};
                        border-radius: 22px;
                        padding: 36px 30px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    }

                    .ticket-header {
                        text-align: center;
                    }

                    .ticket-titulo-app {
                        font-size: 1.85rem;
                        font-weight: 700;
                        color: ${textoPrincipal};
                        margin: 0;
                        letter-spacing: 1.5px;
                    }

                    .ticket-separador-linea {
                        height: 1.5px;
                        background: ${colorLinea};
                        margin: 24px 0;
                        opacity: 0.8;
                    }

                    .ticket-meta {
                        font-size: 1.05rem;
                        color: ${textoPrincipal};
                    }

                    .meta-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;
                    }

                    .meta-label {
                        font-weight: 400;
                        color: ${textoSecundario};
                    }

                    .meta-value {
                        font-weight: 600;
                        color: ${textoPrincipal};
                    }

                    .ticket-items {
                        margin-top: 14px;
                    }

                    .item-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 1.05rem;
                        margin-bottom: 14px;
                    }

                    .item-label {
                        font-weight: 500;
                        color: ${textoPrincipal};
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-right: 12px;
                    }

                    .item-value {
                        font-weight: 600;
                        color: ${textoPrincipal};
                        flex-shrink: 0;
                    }

                    .ticket-total {
                        text-align: center;
                        margin-top: 10px;
                    }

                    .ticket-total-monto {
                        font-size: 1.5rem;
                        font-weight: 700;
                        margin: 0;
                        color: ${colorAcento};
                    }
                </style>
            </head>
            <body>
                <div class="ticket-centro">
                    <div class="ticket-tarjeta">
                        <div class="ticket-header">
                            <h2 class="ticket-titulo-app">CineStream</h2>
                        </div>
                        <div class="ticket-separador-linea"></div>
                        <div class="ticket-meta">
                            <div class="meta-row">
                                <span class="meta-label">Cliente:</span>
                                <span class="meta-value">${cliente}</span>
                            </div>
                            <div class="meta-row">
                                <span class="meta-label">Fecha:</span>
                                <span class="meta-value">${fecha}</span>
                            </div>
                            <div class="meta-row">
                                <span class="meta-label">Hora:</span>
                                <span class="meta-value">${hora}</span>
                            </div>
                        </div>
                        <div class="ticket-separador-linea"></div>
                        <div class="ticket-items">
                            ${itemsHTML}
                        </div>
                        <div class="ticket-separador-linea"></div>
                        <div class="ticket-total">
                            <h3 class="ticket-total-monto">Total: $${total.toLocaleString('es-AR')}</h3>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();
        
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });
        
        const pdfBuffer = await page.pdf({
            width: '450px',
            height: '650px',
            printBackground: true,
            margin: {
                top: '0px',
                bottom: '0px',
                left: '0px',
                right: '0px'
            }
        });

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=ticket-${cliente.replace(/\s+/g, "_")}.pdf`);
        return res.send(pdfBuffer);

    } catch (error) {
        console.error("Error al generar PDF del ticket:", error);
        return res.status(500).json({ error: "Error al generar el PDF del ticket." });
    }
};