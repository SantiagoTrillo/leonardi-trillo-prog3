import express from "express";

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("inicio-sesion");
});

router.get("/dashboard", (req, res) => {
    res.render("panel-control");
});

router.get("/alta-producto", (req, res) => {
    res.render("alta-producto");
});

router.get("/modificar-producto", (req, res) => {
    res.render("modificar-producto");
});

export default router;