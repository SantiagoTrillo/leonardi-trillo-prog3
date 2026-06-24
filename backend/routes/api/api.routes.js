import express from "express";
import { registrarAdministrador, registrarVenta, obtenerVentas, obtenerProductosPaginados, generarTicketPDF } from "../../controllers/api.controllers.js";
import { validarRegistroAdmin, validarRegistroVenta } from "../../middlewares/validadores.js";

const router = express.Router();

/* prepara los datos de la compra antes de guardarlos */
const adaptarConfirmarCompra = (req, res, next) => {
    if (req.body.cliente && !req.body.nombre_cliente) {
        req.body.nombre_cliente = req.body.cliente;
    }
    if (!req.body.fecha) {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        req.body.fecha = `${year}-${month}-${day}`;
    }
    if (!req.body.hora) {
        const d = new Date();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        req.body.hora = `${hours}:${minutes}:${seconds}`;
    }
    next();
};

router.post("/registro-admin", validarRegistroAdmin, registrarAdministrador);
router.post("/ventas", adaptarConfirmarCompra, validarRegistroVenta, registrarVenta);
router.get("/ventas", obtenerVentas);
router.get("/productos", obtenerProductosPaginados);
router.post("/ticket-pdf", generarTicketPDF);

export default router;