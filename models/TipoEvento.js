import { DataTypes }from 'sequelize';
import db from '../config/db.js';

const TipoEvento = db.define('TipoEventos', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
})

export default TipoEvento