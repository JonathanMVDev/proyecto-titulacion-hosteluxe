import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Compra = db.define('compras', {
    total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fechaCompra: {
        type: DataTypes.STRING,
    },
    cantidadPlatos: {
        type: DataTypes.INTEGER,
    }
},{
    timestamps:false,
    hooks: {
        beforeCreate: datos => {
            const fecha = new Date()
      
            const dia = fecha.getDate().toString().padStart(2, '0')
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
            const año = fecha.getFullYear()
            
            const horas = fecha.getHours().toString().padStart(2, '0')
            const minutos = fecha.getMinutes().toString().padStart(2, '0')
            const segundos = fecha.getSeconds().toString().padStart(2, '0')
      
            datos.fechaCompra = `${dia}-${mes}-${año} ${horas}:${minutos}:${segundos}`
        }
    }
})

export default Compra