import connection from "../database/db-connection.js";

const getAllProducts = async () => {

        const [productos]  = await connection.query("SELECT * FROM productos");
        return [productos];
}

export default {
    getAllProducts
}
