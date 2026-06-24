import { Op } from "sequelize";
import Producto from "../models/producto.model.js";

/*  Obtiene todos los productos de la base de datos. */
const obtenerTodosLosProductos = async () => {
    const productos = await Producto.findAll();
    return productos.map(p => {
        const raw = p.get({ plain: true });
        raw.tipo = raw.categoria;
        return raw;
    });
};

/* Obtiene un producto específico por su identificador unico */
const obtenerProductoPorId = async (id) => {
    const producto = await Producto.findByPk(id);
    if (!producto) return null;
    const raw = producto.get({ plain: true });
    raw.tipo = raw.categoria;
    return raw;
};

/**
 * Agrega un nuevo producto a la base de datos */
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

/* Actualiza los datos de un producto existente */
const actualizarProducto = async (id, producto) => {
    const { tipo, titulo, precio, imagen, estado } = producto;
    const [affectedRows] = await Producto.update(
        { categoria: tipo, titulo, precio, imagen, estado },
        { where: { id } }
    );
    return affectedRows > 0;
};

/* Actualiza únicamente el estado (activo/inactivo) de un producto. */
const actualizarEstadoProducto = async (id, estado) => {
    const [affectedRows] = await Producto.update(
        { estado },
        { where: { id } }
    );
    return affectedRows > 0;
};

/* Realiza una consulta paginada y filtrada de productos, ordenados por estado y titulo */
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

    const totalPaginas = Math.ceil(count / limite); //Calcula paginas a mostrar

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