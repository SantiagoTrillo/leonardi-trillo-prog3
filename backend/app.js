import cors from "cors"
import express, { Router } from "express"
import path from "path"
import { nextTick } from "process"
import { fileURLToPath } from "url"

import rutasAdministrador from "./routes/administrador.routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PUERTO = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

//app.use(express.static(path.join(__dirname, "../frontend"))) //eliminar cuando sea posible
app.use("/shared", express.static(path.join(__dirname, "../shared")))
app.use(express.static(path.join(__dirname, "public")))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use("/admin", rutasAdministrador)

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});