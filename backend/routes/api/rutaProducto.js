import express from "express";

const rutaProducto = express.Router();

rutaProducto.get("/productos", (req, res) => {
    res.json(productos)
});

export { rutaProducto };