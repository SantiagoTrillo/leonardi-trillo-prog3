const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(__dirname));

app.listen(3001, () => {
    console.log("Frontend disponible en http://localhost:3001/bienvenida/bienvenida.html");
});