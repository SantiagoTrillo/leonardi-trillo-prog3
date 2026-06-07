import ejs from "ejs"
import cors from "cors"
import express from "express"
import path from "path"
import {fileURLToPath} from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//Creamos una instancia de express
const app = express()

//Setiamos el puerto que vamos a usar
const PUERTO = process.env.PORT

//EJS como motor de plantillas
app.set("view engine", "ejs")

//Indicamos la ruta de las vistas que va a ser raiz del proyecto
app.set("views", path.join(__dirname, "views"))

//middleware para servir archivos estaticos
app.use(express.static(path.join(__dirname, "public")))

//Middlewares Cors que permite peticiones desde el front
app.use(cors());

app.get("/", (req, res) => {
    res.render("login", {
        titulo: "Home"
    })
})

app.get("/pruebas", (req, res) => {
    res.render("login", {
        titulo: "Pruebas"
    })
})

app.listen(PUERTO, () => {
    
})