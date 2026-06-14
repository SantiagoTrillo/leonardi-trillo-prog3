//Importamos modulos necesarios msql en modo promesas, para usar async/await
import mysql from 'mysql2/promise';

//Creamos una conexion a la base de datos usando un pool de conexiones
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});

export default connection;