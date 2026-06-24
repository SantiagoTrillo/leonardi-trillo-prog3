import express from "express";
import { registrarAdministrador, registrarVenta, obtenerVentas, obtenerProductosPaginados, generarTicketPDF } from "../../controllers/api.controllers.js";
import { validarRegistroAdmin, validarRegistroVenta, adaptarConfirmarCompra } from "../../middlewares/validadores.js";

const router = express.Router();

router.post("/registro-admin", validarRegistroAdmin, registrarAdministrador);
router.post("/ventas", adaptarConfirmarCompra, validarRegistroVenta, registrarVenta);
router.get("/ventas", obtenerVentas);
router.get("/productos", obtenerProductosPaginados);
router.post("/ticket-pdf", generarTicketPDF);

export default router;