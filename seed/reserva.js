import { UsuarioModel } from "../db.js"
import { differenceInDays } from "date-fns"

async function reserva() {
    const email = 'jona@correo.com'
    const usuario = await UsuarioModel.findOne({where: { email }})
    const { id } = usuario

    // Fecha de Hoy
    const fecha = new Date()
    const dia = fecha.getDate().toString().padStart(2, '0')
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const año = fecha.getFullYear()
    const fechaActual = `${año}-${mes}-${dia}`
    console.log(fechaActual)

    // Fecha de Dos Días Más
    const fecha_2 = new Date()
    fecha_2.setDate(fecha_2.getDate() + 20)
    const dia_2 = (fecha_2.getDate() +2).toString().padStart(2, '0')
    const mes_2 = (fecha_2.getMonth() + 1).toString().padStart(2, '0')
    const año_2 = fecha_2.getFullYear()
    const fechaDosDias = `${año_2}-${mes_2}-${dia_2}`

    const reservas = [
        {
            fechaInicio: '2024-09-01',
            fechaFin: '2024-09-01',
            cantidadDias: (differenceInDays('2024-09-01', '2024-09-01')+1),
            montoTotal: 123123,
            fechaCreacion: '01-09-2024 06:50:46',
            habitacionId: 1,
            usuarioId: id,
            recepcionado: 2,
            eventoId: 1
        },
        {
            fechaInicio: '2024-09-02',
            fechaFin: '2024-09-02',
            cantidadDias: (differenceInDays('2024-09-02', '2024-09-02')+1),
            montoTotal: 123123,
            fechaCreacion: '02-09-2024 06:50:46',
            habitacionId: 1,
            usuarioId: id,
            recepcionado: 2,
            eventoId: 2
        },
        {
            fechaInicio: '2024-09-03',
            fechaFin: '2024-09-03',
            cantidadDias: (differenceInDays('2024-09-03', '2024-09-03')+1),
            montoTotal: 123123,
            fechaCreacion: '03-09-2024 06:50:46',
            habitacionId: 1,
            usuarioId: id,
            recepcionado: 2,
            eventoId: 3
        },
        {
            fechaInicio: fechaActual,
            fechaFin: fechaDosDias,
            cantidadDias: (differenceInDays(fechaDosDias, fechaActual)+1),
            montoTotal: 123123,
            fechaCreacion: '05-09-2024 16:50:46',
            habitacionId: 1,
            usuarioId: id,
            recepcionado: 1,
            eventoId: 4
        }
    ]
    return reservas
}


export default reserva



