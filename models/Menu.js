import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Menu = db.define('menus', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion:{
        type: DataTypes.STRING,
        allowNull: false
    },
    precio:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: false
})

export default Menu