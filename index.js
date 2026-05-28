import ejs from "ejs"
import express from "express"
import path from "path"
import {fileURLToPath} from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PUERTO = process.env.PORT

app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.render("home", {
        titulo: "Home"
    })
})

app.get("/pruebas", (req, res) => {
    res.render("home", {
        titulo: "Pruebas"
    })
})

app.listen(PUERTO, () => {
    
})