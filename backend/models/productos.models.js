import { Op } from "sequelize";
import Producto from "./producto.model.js";

const obtenerTodosLosProductos = async () => {
    const productos = await Producto.findAll();
    return productos.map(p => {
        const raw = p.get({ plain: true });
        raw.tipo = raw.categoria;
        return raw;
    });
};

const obtenerProductoPorId = async (id) => {
    const producto = await Producto.findByPk(id);
    if (!producto) return null;
    const raw = producto.get({ plain: true });
    raw.tipo = raw.categoria;
    return raw;
};

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

const actualizarProducto = async (id, producto) => {
    const { tipo, titulo, precio, imagen, estado } = producto;
    const [affectedRows] = await Producto.update(
        { categoria: tipo, titulo, precio, imagen, estado },
        { where: { id } }
    );
    return affectedRows > 0;
};

const actualizarEstadoProducto = async (id, estado) => {
    const [affectedRows] = await Producto.update(
        { estado },
        { where: { id } }
    );
    return affectedRows > 0;
};

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