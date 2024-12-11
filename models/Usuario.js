import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Usuario = db.define('usuarios', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    fotoPerfil: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paterno: {
        type: DataTypes.STRING
    },
    materno: {
        type: DataTypes.STRING
    },
    genero: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fechaCreacion: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
}, {
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude:['password', 'token', 'confirmado']
            }
        }
    },
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

export default Usuario;