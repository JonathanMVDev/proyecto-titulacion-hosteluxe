import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Categoria = db.define('categorias', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
}, {
  timestamps: false
})

export default Categoria