import { DataTypes } from "sequelize";
import connection from "../database/db-connection.js";
import Venta from "./venta.model.js";
import Producto from "./producto.model.js";

const VentaProducto = connection.define(
    "VentaProducto",
    {
        venta_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Venta,
                key: "id"
            }
        },
        producto_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Producto,
                key: "id"
            }
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        tableName: "ventas_productos"
    }
);

// Establecer relaciones muchos a muchos
Venta.belongsToMany(Producto, {
    through: VentaProducto,
    foreignKey: "venta_id",
    otherKey: "producto_id",
    as: "productos"
});

Producto.belongsToMany(Venta, {
    through: VentaProducto,
    foreignKey: "producto_id",
    otherKey: "venta_id",
    as: "ventas"
});

export { VentaProducto };
export default VentaProducto;
