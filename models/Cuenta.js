import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Cuenta = db.define('cuentas', {
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
}, {
    timestamps: false
})

export default Cuenta