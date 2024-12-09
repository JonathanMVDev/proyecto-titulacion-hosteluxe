import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const detalleCompra = db.define('detalleCompras',{
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precioUnitario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subTotal: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    timestamps: true,
})

export default detalleCompra