import { Op } from "sequelize";
import Producto from "../models/producto.model.js";

/**
 * Obtiene todos los productos de la base de datos.
 * @returns {Promise<Array<Object>>} Lista de todos los productos mapeados con el tipo de categoría.
 */
const obtenerTodosLosProductos = async () => {
    const productos = await Producto.findAll();
    return productos.map(p => {
        const raw = p.get({ plain: true });
        raw.tipo = raw.categoria;
        return raw;
    });
};

/**
 * Obtiene un producto específico por su identificador único.
 * @param {number|string} id - El ID del producto.
 * @returns {Promise<Object|null>} El producto mapeado, o null si no se encuentra.
 */
const obtenerProductoPorId = async (id) => {
    const producto = await Producto.findByPk(id);
    if (!producto) return null;
    const raw = producto.get({ plain: true });
    raw.tipo = raw.categoria;
    return raw;
};

/**
 * Agrega un nuevo producto a la base de datos.
 * @param {Object} producto - Los datos del producto a agregar.
 * @param {string} producto.tipo - La categoría ("pelicula" o "serie").
 * @param {string} producto.titulo - El título del producto.
 * @param {number} producto.precio - El precio del producto.
 * @param {string} producto.imagen - La ruta de la imagen del producto.
 * @param {string} producto.estado - El estado del producto ("activo" o "inactivo").
 * @returns {Promise<number>} El identificador único del producto creado.
 */
const agregarProducto = async (producto) => {
    const { tipo, titulo, precio, imagen, estado } = producto;
    const nuevoProducto = await Producto.create({
        categoria: tipo,
        titulo,
        precio,
        imagen,
        estado
    });
    return nuevoProducto.id;
};

/**
 * Actualiza los datos de un producto existente.
 * @param {number|string} id - El ID del producto a actualizar.
 * @param {Object} producto - Los nuevos datos del producto.
 * @param {string} producto.tipo - La categoría del producto.
 * @param {string} producto.titulo - El título del producto.
 * @param {number} producto.precio - El precio del producto.
 * @param {string} producto.imagen - La ruta de la imagen del producto.
 * @param {string} producto.estado - El estado del producto.
 * @returns {Promise<boolean>} True si el producto fue actualizado, false en caso contrario.
 */
const actualizarProducto = async (id, producto) => {
    const { tipo, titulo, precio, imagen, estado } = producto;
    const [affectedRows] = await Producto.update(
        { categoria: tipo, titulo, precio, imagen, estado },
        { where: { id } }
    );
    return affectedRows > 0;
};

/**
 * Actualiza únicamente el estado (activo/inactivo) de un producto.
 * @param {number|string} id - El ID del producto.
 * @param {string} estado - El nuevo estado del producto.
 * @returns {Promise<boolean>} True si el estado fue actualizado, false en caso contrario.
 */
const actualizarEstadoProducto = async (id, estado) => {
    const [affectedRows] = await Producto.update(
        { estado },
        { where: { id } }
    );
    return affectedRows > 0;
};

/**
 * Realiza una consulta paginada y filtrada de productos, ordenados por estado y título.
 * @param {Object} params - Parámetros de paginación y filtros.
 * @param {string} params.tipo - Categoría de los productos ("pelicula" o "serie").
 * @param {string} params.buscar - Término de búsqueda parcial por título.
 * @param {number} params.pagina - Número de página actual (1-indexed).
 * @param {number} params.limite - Límite de elementos por página.
 * @returns {Promise<Object>} Un objeto con la lista de productos, total de productos, total de páginas y página actual.
 */
const obtenerProductosPaginadosYFiltrados = async ({ tipo, buscar, pagina, limite }) => {
    const offset = (pagina - 1) * limite;
    const where = {
        categoria: tipo
    };
    if (buscar && buscar.trim() !== "") {
        where.titulo = {
            [Op.like]: `%${buscar}%`
        };
    }
    const { count, rows } = await Producto.findAndCountAll({
        where,
        limit: limite,
        offset: offset,
        order: [
            ['estado', 'ASC'],
            ['titulo', 'ASC']
        ]
    });
    
    const productos = rows.map(p => {
        const raw = p.get({ plain: true });
        raw.tipo = raw.categoria;
        return raw;
    });

    const totalPaginas = Math.ceil(count / limite);

    return {
        productos,
        totalProductos: count,
        totalPaginas,
        paginaActual: pagina
    };
};

export default {
    obtenerTodosLosProductos,
    obtenerProductoPorId,
    agregarProducto,
    actualizarProducto,
    actualizarEstadoProducto,
    obtenerProductosPaginadosYFiltrados
};