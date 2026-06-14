import cors from "cors"
import express, { Router } from "express"
import path from "path"
import { nextTick } from "process"
import { fileURLToPath } from "url"
import multer from "multer";
import productosRoutes from "./routes/productos.routes.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors());

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.use("/", viewRoutes)
app.use("/api/productos", productosRoutes);

/*
app.get("/a",
    (req, res, next) => {
        console.log("Middleware 1");

        if (true == 1) {
            next();
        }else
        {
            res.send("No se cumple la condición");
        }
    },
    (req, res, next) => { console.log("Middleware 2"); next(); },
    (req, res) => { res.send("Hola Mundo") }
);


app.get("/test",

    (req, res) => { res.send("AAAAAAAA") }

);


// http://localhost:3000/id/10
app.get("/id/:id",(req, res) => { 
    res.status(201).send("El id es:  " + req.params.id) 
});

// http://localhost:3000/nombre?nombre=Santiago
app.get("/nombre",(req, res) => { 
    res.status(201).send("El nombre es:  " + req.query.nombre) 
});


app.post("/post", (req, res) => {
    console.log("BODY:", req.body);

    res.json(req.body);
});

// app.post('/post', (req, res) => {
//     res.json({
//         mensaje: 'Recibido',
//         datos: req.body
//     });
// });
*/