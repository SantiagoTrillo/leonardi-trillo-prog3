import { DataTypes } from "sequelize";
import connection from "../database/conexion.js";

const Venta = connection.define(
    "Venta",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_cliente: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        hora: {
            type: DataTypes.TIME,
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        tableName: "ventas"
    }
);

export default Venta;
