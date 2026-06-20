import { DataTypes } from "sequelize";
import connection from "../database/conexion.js";

const Producto = connection.define(
    "Producto",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        categoria: {
            type: DataTypes.ENUM("pelicula", "serie"),
            allowNull: false
        },
        titulo: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM("activo", "inactivo"),
            allowNull: false,
            defaultValue: "activo"
        }
    },
    {
        tableName: "productos"
    }
);

export default Producto;