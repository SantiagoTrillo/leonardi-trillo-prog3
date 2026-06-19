import express from "express";

import { loginView, loginAction, dashboardView, altaProductoView, modificarProductoView, altaProductoAction, modificarProductoAction} from "../../controllers/view.controllers.js";

import cargaImagen from "../../middlewares/carga-imagen.js";

const router = express.Router();

router.get("/login", loginView);
router.post("/login", loginAction);

router.get("/dashboard", dashboardView);

router.get("/alta-producto", altaProductoView);
router.post("/alta-producto", cargaImagen.single("imagen"), altaProductoAction);

router.get("/modificar-producto", modificarProductoView);
router.post("/modificar-producto", modificarProductoAction);

export default router;