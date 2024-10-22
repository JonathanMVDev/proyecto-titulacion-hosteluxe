import { exit } from 'node:process'
import habitaciones from './habitacion.js'
import tipos from './tipo.js'
import usuarios from './usuario.js'
import cuentas from './cuenta.js'
import reserva from './reserva.js'
import categorias from './categoria.js'
import subcategoria from './subcategorias.js'
import menu from './menu.js'
import experiencia from './experiencia.js'
import tipoevento from './tipoevento.js'
import mensaje from './mensaje.js'
import eventos from './evento.js'
import db from '../config/db.js'
import { UsuarioModel, HabitacionModel, TipoModel, ReservaModel, CuentasModel, CategoriaModel, SubCategoriaModel, MenuModel, MensajeModel, ExperienciaModel, TipoEventoModel, EventoModel } from '../db.js'

const importarDatos = async () => {

    try {
        await db.authenticate()
        await db.sync()

        await Promise.all([
            TipoModel.bulkCreate(tipos),
            HabitacionModel.bulkCreate(habitaciones),
            CuentasModel.bulkCreate(cuentas),
            CategoriaModel.bulkCreate(categorias),
            MensajeModel.bulkCreate(mensaje),
            ExperienciaModel.bulkCreate(experiencia)
        ])
        
        await UsuarioModel.bulkCreate(usuarios)
        await TipoEventoModel.bulkCreate(tipoevento)
        await EventoModel.bulkCreate(eventos)
        
        const reservas = await reserva()
        const subcategorias = await subcategoria()
        const menus = await menu()
        
        await Promise.all([
            ReservaModel.bulkCreate(reservas),
            SubCategoriaModel.bulkCreate(subcategorias),
            MenuModel.bulkCreate(menus)
        ])

        

        console.log('datos importados')
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

const eliminarDatos = async () => {
    try {
        await db.authenticate()
        await db.sync({ force: true })
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if(process.argv[2] === "-i") {
    importarDatos()
}

if(process.argv[2] === "-e") {
    eliminarDatos()
}