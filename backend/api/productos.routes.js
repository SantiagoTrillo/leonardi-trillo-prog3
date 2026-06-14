import express from "express";

const rutaApi = express.Router();

rutaApi.get("/productos", (req, res) => {
    res.json(productos)
});

export { rutaProducto };