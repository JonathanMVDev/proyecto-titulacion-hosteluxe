import { DataTypes } from 'sequelize'
import db from '../config/db.js'


const reserva = db.define('reserva', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    fechaInicio : {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaFin: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    cantidadDias: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    montoTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recepcionado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    fechaCreacion: {
        type: DataTypes.STRING,
    }
}, {
    hooks: {
        beforeCreate: datos => {
            const fecha = new Date()
      
            const dia = fecha.getDate().toString().padStart(2, '0')
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
            const año = fecha.getFullYear()
            
            const horas = fecha.getHours().toString().padStart(2, '0')
            const minutos = fecha.getMinutes().toString().padStart(2, '0')
            const segundos = fecha.getSeconds().toString().padStart(2, '0')
      
            datos.fechaCreacion = `${dia}-${mes}-${año} ${horas}:${minutos}:${segundos}`
        }
    }
})


export default reserva