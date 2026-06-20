import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const almacenamiento = multer.diskStorage({
    /**
     * Define el directorio de destino donde se guardarán los archivos subidos.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} file - Objeto del archivo subido.
     * @param {Function} callback - Función callback para retornar el destino.
     */
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "../public/uploads"));
    },
    /**
     * Define el nombre con el que se guardará el archivo en el servidor.
     * Si viene un ID en el body, se adjunta al nombre base; de lo contrario, se genera un nombre temporal único.
     * @param {Object} req - Objeto de solicitud de Express.
     * @param {Object} file - Objeto del archivo subido.
     * @param {Function} callback - Función callback para retornar el nombre del archivo.
     */
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        const nombreBase = path.basename(file.originalname, extension);
        const id = req.body.id;
        if (id) {
            callback(null, `${nombreBase}${id}${extension}`);
        } else {
            const nombreUnico = `temp-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
            callback(null, nombreUnico);
        }
    }
});

/**
 * Filtra los archivos subidos para asegurarse de que solo se permitan imágenes.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} file - Objeto del archivo subido.
 * @param {Function} callback - Función callback para indicar si el archivo es aceptado.
 */
const filtroArchivo = (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
        callback(null, true);
    } else {
        callback(new Error("Solo se permiten archivos de imagen."), false);
    }
};

const cargaImagen = multer({
    storage: almacenamiento,
    fileFilter: filtroArchivo,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default cargaImagen;