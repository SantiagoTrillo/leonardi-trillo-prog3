import express from "express";

import { loginView, dashboardView, altaProductoView, modificarProductoView } from "../controllers/view.controllers.js";

const router = express();

router.get("/login",loginView);

router.get("/dashboard", dashboardView);

router.get("/alta-producto", altaProductoView);

router.get("/modificar-producto", modificarProductoView);

export default router;