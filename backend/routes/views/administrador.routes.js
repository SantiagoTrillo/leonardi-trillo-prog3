import express from "express";

import { loginView, loginAction, logout, dashboardView, altaProductoView, modificarProductoView, altaProductoAction, modificarProductoAction} from "../../controllers/view.controllers.js";

import cargaImagen from "../../middlewares/carga-imagen.js";

import authMiddleware from "../../middlewares/authAdmin.middleware.js";

const router = express.Router();

//Rutas publicas
router.get("/login", loginView);
router.post("/login", loginAction);

//Rutas protegidas por autenticacion
router.use(authMiddleware);

router.get("/logout", logout);

router.get("/dashboard", dashboardView);

router.get("/alta-producto", altaProductoView);
router.post("/alta-producto", cargaImagen.single("imagen"), altaProductoAction);

router.get("/modificar-producto", modificarProductoView);
router.post("/modificar-producto", modificarProductoAction);

export default router;