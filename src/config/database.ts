import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DATABASE,
    username: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: Number(process.env.PORT_DATABASE_CONNECTION),
    dialect: 'mysql',
    dialectOptions: {
        ssl: process.env.SSL === 'REQUIRED' ? { rejectUnauthorized: false } : false
    }
});

export default sequelize;
