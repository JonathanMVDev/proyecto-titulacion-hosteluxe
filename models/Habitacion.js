import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Habitacion = db.define('habitaciones', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dormitorios: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    habilitado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: false
})

export default Habitacion