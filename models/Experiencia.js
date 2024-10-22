import { DataTypes }from 'sequelize';
import db from '../config/db.js';

const Experiencia = db.define('experiencias', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
})

export default Experiencia