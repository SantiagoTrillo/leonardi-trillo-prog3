import express from "express";
import { registrarAdministrador, registrarVenta, obtenerVentas } from "../../controllers/api.controllers.js";

const router = express.Router();

router.post("/registro-admin", registrarAdministrador);
router.post("/ventas", registrarVenta);
router.get("/ventas", obtenerVentas);

export default router;
