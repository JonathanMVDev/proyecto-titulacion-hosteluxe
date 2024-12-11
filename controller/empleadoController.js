import { col, fn, Op } from 'sequelize'
import { HabitacionModel, UsuarioModel, ReservaModel, TipoModel, CompraModel, DetalleCompraModel, TipoEventoModel, ExperienciaModel, EventoModel } from '../db.js'
import { Solicitar } from './pedidoController.js'

const recepcion = async (req,res) =>{
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    if(!verificarRecepcionista(cuentaId)) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    const fechaActual = new Date()
    const dia = fechaActual.getDate().toString().padStart(2, '0')
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0')
    const año = fechaActual.getFullYear()
    const fecha = `${año}-${mes}-${dia}`

    let paginaActual = parseInt(req.query.pagina)

    const expresion = /^[1-999]$/
    if(!expresion.test(paginaActual)) {
        return res.redirect(`/recepcion?pagina=1`)
    }

    // Limites y Offset para el paginador
    const limit = 10
    const offset = ((paginaActual*limit) - limit)

    const [reservas, total] = await Promise.all([
        ReservaModel.findAll({
            limit,
            offset,
            include: [
                { model: UsuarioModel },
                { model: HabitacionModel, as: 'habitacion' , 
                    include: [
                        { model: TipoModel }
                    ]
                },
                { model: EventoModel, 
                    include: [
                        { model: TipoEventoModel,
                            include: [
                                { model: ExperienciaModel }
                            ]
                         }
                    ]
                }
            ],
            where: {
                fechaInicio: fecha,
                recepcionado: {
                    [Op.between]: [0, 1]
                }
            },
            order: [
                ['recepcionado', 'ASC']
            ]
        }),
        ReservaModel.count({
            where: {
                fechaInicio: fecha,
                recepcionado: {
                    [Op.between]: [0, 1]
                }
            }
        })
    ])

    res.render('empleado/recepcion', {
        pagina: 'Recepción Hosteluxe',
        autenticado: true,
        cuentaId,
        usuarioSolicitar,
        fecha,
        reservas,
        total,
        offset,
        limit,
        paginas: Math.ceil(total / limit),
        paginaActual: Number(paginaActual),
        csrfToken: req.csrfToken(req)
    })
}

const buscadorRecepcion = async (req, res) => {
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    if(!verificarRecepcionista(cuentaId)) {
        return res.redirect('/')
    }

    const fechaActual = new Date()
    const dia = fechaActual.getDate().toString().padStart(2, '0')
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0')
    const año = fechaActual.getFullYear()
    const fecha = `${año}-${mes}-${dia}`

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    let termino = req.body.termino || req.query.termino

    if(!termino) {
        return res.redirect('/recepcion?pagina=1')
    }

    if(!termino.trim()) {
        return res.redirect('back')
    }
    
    termino = termino.trim()

    let paginaActual = parseInt(req.query.pagina)

    const expresion = /^[1-9]$/
    if(!expresion.test(paginaActual)) {
        return res.redirect(`/recepcion/buscador?pagina=1&termino=${termino}`)
    }

    try {
        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual*limit) - limit)

        const [reservas, total] = await Promise.all([
            ReservaModel.findAll({
                limit,
                offset,
                include: [
                    { model: UsuarioModel, 
                        where: {
                            name: {
                                [Op.like]: termino + '%'
                            }
                        }
                     },
                    { model: HabitacionModel, as: 'habitacion' , 
                        include: [
                            { model: TipoModel }
                        ]
                    },
                    { model: EventoModel, 
                        include: [
                            { model: TipoEventoModel,
                                include: [
                                    { model: ExperienciaModel }
                                ]
                             }
                        ]
                    }
                ],
                where: {
                    fechaInicio: fecha,
                },
                order: [
                    ['recepcionado', 'ASC']
                ]
            }),
            ReservaModel.count({
                include: [
                    { model: UsuarioModel, 
                        where: {
                            name: {
                                [Op.like]: termino + '%'
                            }
                        }
                    }
                ],
                where: {
                    fechaInicio: fecha
                }
            })
        ])

        return res.render('empleado/recepcion', {
            pagina: 'Recepción Hosteluxe',
            autenticado: true,
            cuentaId,
            buscador: true,
            termino,
            usuarioSolicitar,
            fecha,
            reservas,
            total,
            offset,
            limit,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            csrfToken: req.csrfToken(req)
        })
    } catch (error) {
        console.log(error)
    }
}

const ingresoRecepcion = async (req,res) =>{
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    if(!verificarRecepcionista(cuentaId)) {
        return res.redirect('/')
    }

    const { id } = req.params

    const reserva = await ReservaModel.findByPk(id, {
        include: [
            { model: HabitacionModel, as: 'habitacion' }
        ]
    })

    if(!reserva) {
        return res.redirect('/recepcion')
    }

    if(reserva.recepcionado == 0) {
        reserva.recepcionado = 1
        reserva.habitacion.estado = 2
        reserva.save()
        reserva.habitacion.save()
    } else if (reserva.recepcionado == 1) {
        reserva.recepcionado = 2
        reserva.habitacion.estado = 3
        reserva.save()
        reserva.habitacion.save()
    }

    return res.redirect('/recepcion')
}

const pedido = async (req,res) => {
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    if(!verificarCocinero(cuentaId)) {
        return res.redirect('/')
    }
    
    const fechaActual = new Date()
    const dia = fechaActual.getDate().toString().padStart(2, '0')
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0')
    const año = fechaActual.getFullYear()
    const fecha = `${año}-${mes}-${dia}`

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)
    
    const pedidos = await CompraModel.findAll({
        where: {
            estado: 1
        },
        include: [
            { model: DetalleCompraModel },
            { model: ReservaModel,
                include: [
                    { model: UsuarioModel },
                    { model: HabitacionModel,  as: 'habitacion',
                        include: [
                            { model: TipoModel }
                        ]
                    }
                ]
            }
        ],
        order: [
            ['fechaCompra', 'ASC']
        ]
    })

    res.render('empleado/pedido', {
        pagina: 'Adm. Hosteluxe',
        autenticado: true,
        fecha,
        cuentaId,
        usuarioSolicitar,
        pedidos,
        csrfToken: req.csrfToken()
    })
}

const ingresoPedido = async (req,res) => {
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    if(!verificarCocinero(cuentaId)) {
        return res.redirect('/')
    }

    const { id } = req.params

    const compra = await CompraModel.findByPk(id)

    if(!compra) {
        return res.redirect('/pedido')
    }

    compra.estado = 2
    compra.save()

    return res.redirect('/pedido')
}

const servicio = async (req,res) => {
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    if(!verificarServicio(cuentaId)) {
        return res.redirect('/')
    }

    const fechaActual = new Date()
    const dia = fechaActual.getDate().toString().padStart(2, '0')
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0')
    const año = fechaActual.getFullYear()
    const fecha = `${año}-${mes}-${dia}`

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    const [compras, habitaciones, eventos] = await Promise.all([
        // Pedidos a enviar
        CompraModel.findAll({ 
            where: {
                estado: 2 
            },
            include: [
                { model: ReservaModel,
                    include: [
                        { model: HabitacionModel, as: 'habitacion',
                            include: [
                                { model: TipoModel }
                            ]
                        },
                        { model: UsuarioModel }
                    ]
                }
            ]
        }),
        
        // Habitacion que necesitan mantenimiento (Limpieza)
        ReservaModel.findAll({
            include: [
                { model: UsuarioModel },
                { model: HabitacionModel, as: 'habitacion',
                    where: {
                        estado: 3
                    },
                    include: [
                        { model: TipoModel }
                    ]
                }
            ]
        }),

        // Eventos que necesitan prepararse antes de que llegue el Cliente
        ReservaModel.findAll({
            where: {
                recepcionado: 0
            },
            include: [
                { model: HabitacionModel, as: 'habitacion'},
                { model: UsuarioModel },
                { model: EventoModel,
                    where: { preparado: 0 },
                    include: [
                        { model: TipoEventoModel,
                            include: [
                                { model: ExperienciaModel }
                            ]
                        }
                    ]
                }
            ]
        })
    ])

    res.render('empleado/servicio', {
        pagina: 'Servicio a la Habitación',
        autenticado: true,
        cuentaId,
        fecha,
        usuarioSolicitar,
        habitaciones,
        compras,
        csrfToken: req.csrfToken(),
        eventos
    })
}

const ingresoDespachoPedido = async (req,res) => {
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    if(!verificarServicio(cuentaId)) {
        return res.redirect('/')
    }

    const { id } = req.params

    const compra = await CompraModel.findByPk(id)

    if(!compra) {
        return res.redirect('/servicio')
    }

    compra.estado = 3
    compra.save()

    return res.redirect('/servicio')
}

const ingresoHabitacion = async (req,res) => {
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    if(!verificarServicio(cuentaId)) {
        return res.redirect('/')
    }

    const { id } = req.params

    const habitacion = await HabitacionModel.findByPk(id)

    if(!habitacion) {
        return res.redirect('/servicio')
    }


    habitacion.estado = 1
    habitacion.save()

    return res.redirect('/servicio')
}

const ingresoEvento = async (req,res) => {
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    if(!verificarServicio(cuentaId)) {
        return res.redirect('/')
    }

    const { id } = req.params

    const evento = await EventoModel.findByPk(id)

    if(!evento) {
        return res.redirect('/servicio')
    }

    evento.preparado = 1
    evento.save()

    return res.redirect('/servicio')
}

// Función que verifica si el usuario es administrador o empleado
const verificarRecepcionista = (id) => {
    return id === 2 || id === 5
}

// Función que verifica si el usuario es administrador o empleado
const verificarCocinero = (id) => {
    return id === 4 || id === 5
}

// Función que verifica si el usuario es administrador o empleado
const verificarServicio = (id) => {
    return id === 3 || id === 5
}

export {
    recepcion,
    buscadorRecepcion,
    ingresoRecepcion,

    pedido,
    ingresoPedido,

    servicio,
    ingresoDespachoPedido,
    ingresoHabitacion,
    ingresoEvento
}