import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar almacenamiento en disco para subir archivos
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename: (req, file, cb) => {
        // Generar un nombre único basado en timestamp
        const extension = path.extname(file.originalname);
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, nombreUnico);
    }
});

// Filtrar para aceptar únicamente imágenes
const filtroArchivo = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten archivos de imagen."), false);
    }
};

const cargaImagen = multer({
    storage: almacenamiento,
    fileFilter: filtroArchivo,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB
    }
});

export default cargaImagen;
