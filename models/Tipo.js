import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Tipos = db.define('tipos', {
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    diaPrecio: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
})

export default Tipos