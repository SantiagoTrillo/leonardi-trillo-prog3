import cors from "cors"
import express, { Router } from "express"
import path from "path"
import { fileURLToPath } from "url"
import cookieParser from "cookie-parser";

import rutasAdministrador from "./routes/views/administrador.routes.js"
import rutasApi from "./routes/api/api.routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PUERTO = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/admin", rutasAdministrador)

app.use("/api", rutasApi)

app.listen(PUERTO, () => {
    console.log(`Backend disponible en http://localhost:${PUERTO}`);
});