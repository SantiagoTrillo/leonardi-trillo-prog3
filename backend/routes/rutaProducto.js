import express from "express";

const rutaProducto = express.Router();

rutaProducto.get("/altaProducto", (req, res) => {
    console.log("/altaProducto");
    res.send("altaProducto");
});

export default rutaProducto;