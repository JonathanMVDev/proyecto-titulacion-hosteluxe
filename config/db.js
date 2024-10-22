import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
// import path from 'path';
dotenv.config({ path: '.env'})

const db = new Sequelize(process.env.DB_NOMBRE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
})

export default db