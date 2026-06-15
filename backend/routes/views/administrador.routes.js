import express from "express";

import { loginView, dashboardView, altaProductoView, modificarProductoView, altaProductoAction, modificarProductoAction, loginAction } from "../../controllers/view.controllers.js";
import cargaImagen from "../../middlewares/carga-imagen.js";
import { validarAltaProducto, validarModificarProducto } from "../../middlewares/validadores.js";

const router = express.Router();

router.get("/login", loginView);
router.post("/login", loginAction);

router.get("/dashboard", dashboardView);

router.get("/alta-producto", altaProductoView);
router.post("/alta-producto", cargaImagen.single("imagen"), validarAltaProducto, altaProductoAction);

router.get("/modificar-producto", modificarProductoView);
router.post("/modificar-producto", cargaImagen.single("imagen"), validarModificarProducto, modificarProductoAction);

export default router;