import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const SubCategoria = db.define('subcategorias', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
}, {
  timestamps: false
})

export default SubCategoria