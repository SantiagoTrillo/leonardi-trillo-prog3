import ejs from "ejs"
import cors from "cors"
import express from "express"
import path from "path"
import {fileURLToPath} from "url"

import {rutaProducto} from './api/routes/rutaProducto.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PUERTO = process.env.PORT

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors());

app.use("/api", rutaProducto);

rutaProducto.get("/test", (req, res) => {
    console.log("test");
    res.send("test");
});

export default rutaProducto;

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
