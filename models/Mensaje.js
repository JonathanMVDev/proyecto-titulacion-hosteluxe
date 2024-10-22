import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Mensaje = db.define('mensajes', {
    motivo: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    asunto: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

export default Mensaje;