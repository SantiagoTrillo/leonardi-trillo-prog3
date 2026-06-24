import { Sequelize } from 'sequelize';

const connection = new Sequelize(
    process.env.DB_NAME || 'tp_seriespeliculas',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: false //Evita que agregue columnas automaticamente 
        }
    }
);

export default connection;