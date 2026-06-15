import { DataTypes } from "sequelize";
import connection from "../database/db-connection.js";

const Usuario = connection.define(
    "Usuario",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        correo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        clave: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        tableName: "usuarios"
    }
);

export default Usuario;
