import { DataTypes }from 'sequelize';
import db from '../config/db.js';

const Evento = db.define('Eventos', {
    preparado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false
})

export default Evento