import { check, validationResult } from 'express-validator'
import { differenceInDays } from 'date-fns'
import { Op } from 'sequelize'
import { UsuarioModel, ReservaModel, HabitacionModel, TipoModel, ExperienciaModel, EventoModel } from '../db.js'
import { emailReserva } from '../helpers/emails.js'
import { Solicitar } from './pedidoController.js'

const reserva = async (req, res) => {

    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    const tipos = await TipoModel.findAll()
    res.render('reserva/reserva', {
        pagina: '¿Cuánto te gustaría hospedarte?',
        tipos,
        usuarioSolicitar,
        autenticado: true,
        cuentaId,
        csrfToken: req.csrfToken()
    })
}

const ingresarReserva = async (req, res) => {
    await check('fechaInicio').notEmpty().withMessage('Debe ingresar una fecha valida').run(req)
    await check('tipo').notEmpty().withMessage('Debe ingresar un tipo de habitación').run(req)

    // Validacion del Form para generar reserva
    const resultado = validationResult(req)
    const tipos = await TipoModel.findAll()

    if(!resultado.isEmpty()) {
        const { id } = req.usuario
        const usuario = await UsuarioModel.findByPk(id)
        const { cuentaId } = usuario

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('reserva/reserva', {
            pagina: '¿Cuanto te gustaria hospedarte?',
            autenticado: true,
            cuentaId,
            usuarioSolicitar,
            csrfToken: req.csrfToken(),
            tipos,
            errores: resultado.array()
        })
    }

    const { fechaInicio, fechaFin, tipo: tipoId } = req.body
    const { id: usuarioId  } = req.usuario

    // Obtiene la fecha actual para comprobar si usuario tiene una reserva pendiente
    const fechaActual = new Date()
    const dia = fechaActual.getDate().toString().padStart(2, '0')
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0')
    const año = fechaActual.getFullYear()
    const fecha = `${año}-${mes}-${dia}`

    const [reservaUsuario, reservaFuturas] = await Promise.all([
        ReservaModel.findOne({
            where: {
                usuarioId,
                [Op.and]: {
                    fechaInicio: {
                        [Op.lte]: fechaInicio
                    },
                    fechaFin: {
                        [Op.gte]: fechaFin
                    }
                }
            }
        }),
        ReservaModel.findAll({
            where: {
                usuarioId,
                [Op.and]: {
                    fechaInicio: {
                        [Op.gt]: fecha
                    },
                    fechaFin: {
                        [Op.gt]: fecha
                    }
                }
            }
        })
    ])

    // Si el usuario si posee una reserva en las fechas ingresadas, lo retorna con error
    if(reservaUsuario || reservaFuturas.length >= 3) {
        const { id } = req.usuario
        const usuario = await UsuarioModel.findByPk(id)
        const { cuentaId } = usuario

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        if(reservaUsuario) {
            return res.render('reserva/reserva', {
                pagina: '¿Cuanto te gustaria hospedarte?',
                autenticado: true,
                usuarioSolicitar,
                cuentaId,
                csrfToken: req.csrfToken(),
                tipos,
                errores: [{msg: 'Ya posee una reserva en ese horario, por favor ingrese otro horario'}]
            })      
        }

        else {
            return res.render('reserva/reserva', {
                pagina: '¿Cuanto te gustaria hospedarte?',
                autenticado: true,
                usuarioSolicitar,
                cuentaId,
                csrfToken: req.csrfToken(),
                tipos,
                errores: [{msg: 'Ya posee un máximo de 3 reservas próximas, si desea otro horario, puede cancelar una'}]
            })   
        }
    }

    // Consulta para traer habitaciones dependiendo del tipo
    const habitaciones = await HabitacionModel.findAll({ 
        where: { 
            tipoId, 
            estado: {
                [Op.between]: [1, 2]
            }
        }}
    )

    if(!habitaciones.length) {
        const { id } = req.usuario
        const usuario = await UsuarioModel.findByPk(id)
        const { cuentaId } = usuario

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('reserva/reserva', {
            pagina: '¿Cuanto te gustaria hospedarte?',
            csrfToken: req.csrfToken(),
            autenticado: true,
            usuarioSolicitar,
            cuentaId,
            tipos,
            errores: [{msg: 'No hay habitaciones disponible de ese tipo'}]
        })
    }

    // Funcion que verifica la disponibilidad de las habitaciones anteriormente consultadas y la registra
    const disponibilidad = async (habitaciones, fechaInicio, fechaTermino) => {
        const fechaIni = fechaInicio
        const fechaTerm = fechaTermino
        for (let i = 0; i < habitaciones.length; i++) {

            try {
                // Comprueba si existe la reserva
                let reservaExistente = await ReservaModel.findOne({
                    where: {
                        habitacionId: habitaciones[i].dataValues.id,
                        [Op.and]: {
                            fechaInicio: {
                                [Op.lte]: fechaTerm
                            },
                            fechaFin: {
                                [Op.gte]: fechaIni
                            }
                        }
                    }
                })

                // Verifica el True o False si al reserva existe en la BD anteriormente consultada
                if(!reservaExistente) {
                    const { id: usuarioId  } = req.usuario
                    const cantidadDias = (differenceInDays(fechaTermino, fechaInicio)+1) 

                    const habitacion = await HabitacionModel.findOne({
                        where: {
                            id: habitaciones[i].dataValues.id 
                        },
                        include: [
                            { model: TipoModel, as: 'tipo' }
                        ]
                    })

                    // Monto total a pagar
                    const montoTotal = cantidadDias * habitacion.tipo.diaPrecio

                    const { PreferenciaInput: tipoeventoId } = req.body

                    const nuevoEvento = await EventoModel.create({
                        tipoeventoId
                    })
                    const { id: eventoId } = nuevoEvento

                    // Crea la reserva en la BD
                    const nuevaReserva = await ReservaModel.create({
                        fechaInicio,
                        fechaFin: fechaTermino,
                        cantidadDias,
                        montoTotal,
                        habitacionId: habitacion.id,
                        usuarioId,
                        eventoId
                    })
                    await nuevaReserva.save()

                    // Datos del usuario
                    const usuario = await UsuarioModel.findByPk(usuarioId)
                    const { name, email } = usuario

                    const datos = { name, email, fechaInicio, fechaFin }
                    
                    emailReserva(datos)

                    return res.redirect(`/reserva/${nuevaReserva.id}`);
                }
            } catch (error) {
                console.log(error)
                const { id } = req.usuario
                const usuario = await UsuarioModel.findByPk(id)
                const { cuentaId } = usuario

                // Llamado de funcion para ver si tiene reserva activa
                const usuarioSolicitar = await Solicitar(usuario)

                return res.render('reserva/reserva', {
                    pagina: '¿Cuanto te gustaria hospedarte?',
                    csrfToken: req.csrfToken(),
                    usuarioSolicitar,
                    tipos,
                    cuentaId,
                    autenticado: true,
                    errores: [{msg: 'Hubo un error al procesar su solicitud, intente nuevamente'}]
                })
            }
        }

        const { id } = req.usuario
        const usuario = await UsuarioModel.findByPk(id)
        const { cuentaId } = usuario

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('reserva/reserva', {
            pagina: '¿Cuanto te gustaria hospedarte?',
            csrfToken: req.csrfToken(),
            tipos,
            usuarioSolicitar,
            cuentaId,
            autenticado: true,
            errores: [{msg: 'No hay disponibilidad de habitaciones en el horario'}]
        })
    }
    await disponibilidad(habitaciones, fechaInicio, fechaFin)
}

const confirmacionReserva = async (req, res) => {
    const { id } = req.params

    const reserva = await ReservaModel.findByPk(id)

    // Comprobar que la reserva exista
    if(!reserva) {
        return res.redirect('/reserva')
    }

    const { id: usuarioId } = req.usuario

    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    // Comprobar que la reserva pertenezca al usuario
    if( usuario.id.toString() !== reserva.usuarioId.toString() && cuentaId !== 5 ) {
        return res.redirect('/reserva')
    }

    // Obtiene los datos de la reserva, con los modelos 
    const datosReserva = await ReservaModel.findByPk(req.params.id, {
        include: [
            { model: HabitacionModel, 
              as: 'habitacion',
              include: [
                { model: TipoModel }
              ]
            },
            { model: UsuarioModel },
        ]
    })

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    res.render('reserva/confirmacion-reserva', {
        pagina: 'Información de la Reserva',
        cuentaId,
        autenticado: true,
        datosReserva,
        usuarioSolicitar,
        administrador: true
    })
}

export {
    reserva,
    ingresarReserva,
    confirmacionReserva,
    Solicitar
}
