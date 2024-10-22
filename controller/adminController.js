import { validationResult, check } from 'express-validator'
import bcrypt from 'bcrypt'
import { Op, fn, col, literal } from 'sequelize'
import { HabitacionModel, UsuarioModel, ReservaModel, TipoModel, CuentasModel, MenuModel, SubCategoriaModel, CategoriaModel, MensajeModel, RespuestaModel, PedidoModel } from '../db.js'
import { Solicitar } from './pedidoController.js'
import fs from 'fs'

const administrar = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }
    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    const nombreMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] 

    const fechaActual = new Date()

    // Función para formatear fechas con hora
    function formatearFechaConHora(fecha, esInicio) {
        const año = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        const hora = esInicio ? '00:00:00' : '23:59:59';
        return `${año}-${mes}-${dia} ${hora}`;
    }


    // Primer día del mes actual con hora de inicio (00:00:00)
    const primerDiaMesActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const primerDiaMesActualConHora = formatearFechaConHora(primerDiaMesActual, true);

    // Último día del mes actual con hora de fin (23:59:59)
    const ultimoDiaMesActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    const ultimoDiaMesActualConHora = formatearFechaConHora(ultimoDiaMesActual, false);

    // Primer día del mes anterior con hora de inicio (00:00:00)
    const primerDiaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1);
    const primerDiaMesAnteriorConHora = formatearFechaConHora(primerDiaMesAnterior, true);

    // Último día del mes anterior con hora de fin (23:59:59)
    const ultimoDiaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0);
    const ultimoDiaMesAnteriorConHora = formatearFechaConHora(ultimoDiaMesAnterior, false);

    // Estadísticas mes actual
    const [ usuariosNuevosActual, hombresActual, mujeresActual, reservaUsuariosNuevosActual, reservasNuevasActual, diaConMasReservasActual, habitacionesMasYMenosPreferidas, mensajesNuevosActual, mensajesRespondidosActual, motivosMensajes  ] = await Promise.all([
        // Estadísticas Usuarios DIV
        UsuarioModel.count({
            where: {
                cuentaId: 1,
                [Op.and]: {
                    createdAt: {
                        [Op.gte]: primerDiaMesActualConHora,
                        [Op.lte]: ultimoDiaMesActualConHora
                    }
                }
            }
        }),
        UsuarioModel.count({
            where: {
                cuentaId: 1,
                [Op.and]: {
                    createdAt: {
                        [Op.gte]: primerDiaMesActualConHora,
                        [Op.lte]: ultimoDiaMesActualConHora
                    }
                },
                genero: 'masculino'
            }
        }),
        UsuarioModel.count({
            where: {
                cuentaId: 1,
                [Op.and]: {
                    createdAt: {
                        [Op.gte]: primerDiaMesActualConHora,
                        [Op.lte]: ultimoDiaMesActualConHora
                    }
                },
                genero: 'femenino'
            }
        }),
        ReservaModel.count({
            include: [
                { model: UsuarioModel,
                    where: {
                        cuentaId: 1,
                        [Op.and]: {
                            createdAt: {
                                [Op.gte]: primerDiaMesActualConHora,
                                [Op.lte]: ultimoDiaMesActualConHora
                            }
                        }
                    }
                }
            ],
        }),
        // Estadísticas Reservas DIV
        ReservaModel.count({
            where: {
                [Op.and]: {
                    createdAt: {
                        [Op.gte]: primerDiaMesActualConHora,
                        [Op.lte]: ultimoDiaMesActualConHora
                    }
                }
            }
        }),
        ReservaModel.findOne({
            attributes: [
                [fn('DATE', col('createdAt')), 'dia'],  
                [fn('COUNT', col('id')), 'totalReservas']
            ],
            where: {
                createdAt: {
                    [Op.gte]: primerDiaMesActualConHora,
                    [Op.lte]: ultimoDiaMesActualConHora
                }
            },
            group: [fn('DATE', col('createdAt'))], 
            order: [[literal('totalReservas'), 'DESC']], 
            limit: 1
        }),
        ReservaModel.findAll({
            attributes: [
                [fn('COUNT', col('reserva.id')), 'totalReservas'],
                'habitacion.id',
                'habitacion.name',
                'habitacion.dormitorios',
                'habitacion.estado',
                'habitacion.habilitado',
                'habitacion.tipoId',
                [col('habitacion->tipo.name'), 'tipoHabitacion']
            ],
            where: {
                createdAt: {
                    [Op.gte]: primerDiaMesActualConHora,
                    [Op.lte]: ultimoDiaMesActualConHora
                }
            },
            include: [
                {
                    model: HabitacionModel,
                    as: 'habitacion',
                    include: [
                        {
                            model: TipoModel,
                            attributes: ['name'],
                            as: 'tipo'
                        }
                    ]
                }
            ],
            group: [
                'habitacion.id',
                'habitacion.name',
                'habitacion.dormitorios',
                'habitacion.estado',
                'habitacion.habilitado',
                'habitacion.tipoId',
                'habitacion->tipo.id',
                'habitacion->tipo.name'
            ],
            order: [[literal('totalReservas'), 'DESC']]
        }),
        // Estadísticas Mensajes DIV
        MensajeModel.count({
            where: {
                [Op.and]: {
                    createdAt: {
                        [Op.gte]: primerDiaMesActualConHora,
                        [Op.lte]: ultimoDiaMesActualConHora,
                    }
                }
            }
        }),
        MensajeModel.count({
            where: {
                estado: 1,
                [Op.and]: {
                    createdAt: {
                        [Op.gte]: primerDiaMesActualConHora,
                        [Op.lte]: ultimoDiaMesActualConHora,
                    }
                }
            }
        }),
        MensajeModel.findAll({
            attributes: [ 'motivo', [fn('COUNT', col('id')), 'totalMensajes'] 
            ],
            where: {
                createdAt: {
                    [Op.gte]: primerDiaMesActualConHora,
                    [Op.lte]: ultimoDiaMesActualConHora,
                }
            },
            group: ['motivo'],
            order: [[literal('totalMensajes'), 'DESC']]
        }),
        // Estadísticas Menús DIV

        // Estadísticas Financiamiento DIV

    ])
    console.log(motivosMensajes)
    
    // Obtener el mayor y menor cantidad del tipo de Habitación 
    const tipoHabitacionMasOcupadaActual = habitacionesMasYMenosPreferidas[0]
    const tipoHabitacionMenosOcupadaActual = habitacionesMasYMenosPreferidas[habitacionesMasYMenosPreferidas.length - 1]
    
    // Obtener el mayor y menor cantidad del Motivo de los mensajes 
    const mayorMotivoMensaje = motivosMensajes[0]
    const menorMotivoMensaje = motivosMensajes[motivosMensajes.length - 1]

    res.render('admin/administrar',{
        pagina: 'Administración',
        autenticado: true,
        usuarioSolicitar,
        cuentaId,
        // Estadísticas Usuarios DIV
        usuariosNuevosActual,
        hombresActual,
        mujeresActual,
        reservaUsuariosNuevosActual,
        // Estadísticas Reservas DIV
        reservasNuevasActual,
        diaConMasReservasActual,
        tipoHabitacionMasOcupadaActual,
        tipoHabitacionMenosOcupadaActual,
        // Estadísticas Mensajes DIV
        mensajesNuevosActual,
        mensajesRespondidosActual,
        mayorMotivoMensaje,
        menorMotivoMensaje,
        // Estadísticas Menús DIV

        // Estadísticas Financiamiento DIV

    })
}

const administrarClientes = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    const { pagina: paginaActual } = req.query
    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)) {
        return res.redirect('/administrar/clientes?pagina=1')
    }

    try {
        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual*limit) - limit)

        const [usuarios, total, usuarioSolicitar] = await Promise.all([
            UsuarioModel.findAll({
                limit,
                offset,
                where: {
                    cuentaId: 1
                },
                order: [
                    ['fechaCreacion', 'DESC']
                ]
            }),
            UsuarioModel.count({
                where: {
                    cuentaId: 1
                }
            }),
            // Llamado de funcion para ver si tiene reserva activa
            Solicitar(usuario)
        ])

        res.render('admin/usuarios',{
            pagina: 'Administración',
            autenticado: true,
            clientesTabla: true,
            usuarioSolicitar,
            cuentaId,
            usuarios,
            total,
            offset,
            limit,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            csrfToken: req.csrfToken()
        })
    } catch (error) {
        console.log(error)
    }
}

const reservasCliente = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    const { id: usuarioId } = req.params

    const [reservas, cliente] = await Promise.all([
        ReservaModel.findAll({
            where: {
                usuarioId
            },
            include: [
                { model: UsuarioModel },
                { model: HabitacionModel, as: 'habitacion' }
            ],
            order: [
                [ 'fechaCreacion', 'DESC' ]
            ]
        }),
        UsuarioModel.findByPk(usuarioId)
    ])

    res.render('admin/reservasUsuario',{
        pagina: 'Administración',
        autenticado: true,
        usuarioSolicitar,
        cuentaId,
        reservas,
        cliente
    })
}

const crearCliente = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    res.render('admin/crearUsuario',{
        pagina: 'Administración',
        clienteTabla: true,
        autenticado: true,
        usuarioSolicitar,
        cuentaId,
        csrfToken: req.csrfToken(),
    })
}

const ingresoCrearCliente = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    await check('name').notEmpty().withMessage('Debe ingresar un nombre').run(req)
    await check('paterno').notEmpty().withMessage('Debe ingresar un apellido paterno').run(req)
    await check('materno').notEmpty().withMessage('Debe ingresar un apellido materno').run(req)
    await check('genero').notEmpty().withMessage('Debe seleccionar un género').run(req)
    await check('email').notEmpty().withMessage('Debe ingresar un correo electronico').run(req)
    await check('telefono').isLength({ min:8 }).withMessage('Debe tener 8 caracteres minimos el telefono').run(req)
    await check('password').isLength({ min:6 }).withMessage('Debe ingresar una contraseña de 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no son iguales').run(req)

    const resultado = validationResult(req);

    // Valida el formulario
    if (!resultado.isEmpty()) {
        return res.render('admin/crearUsuario', {
            pagina: 'Administración',
            autenticado: true,
            clienteTabla: true,
            usuarioSolicitar,
            cuentaId,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                name: req.body.name,
                paterno: req.body.paterno,
                materno: req.body.materno,
                genero: req.body.genero,
                email: req.body.email,
                telefono: req.body.telefono
            }
        })
    }

    const { email } = req.body
    const emailExistente = await UsuarioModel.findOne({
        where: {
            email
        }
    })

    if(emailExistente) {
        return res.render('admin/crearUsuario', {
            pagina: 'Administración',
            autenticado: true,
            usuarioSolicitar,
            clienteTabla: true,
            cuentaId,
            errores: [{msg: 'El correo ya esta registrado'}],
            csrfToken: req.csrfToken(),
            usuario: {
                name: req.body.name,
                paterno: req.body.paterno,
                materno: req.body.materno,
                genero: req.body.genero,
                email: req.body.email,
                telefono: req.body.telefono
            }
        })
    }


    const { name, paterno, materno, genero, telefono, password } = req.body
    const hass_pass = bcrypt.hashSync(password, 10)
    const crearUsuario = await UsuarioModel.create({
        name,
        paterno,
        materno,
        genero,
        email,
        telefono,
        password: hass_pass,
        cuentaId: 1,
        token: '',
        confirmado: 1
    })

    crearUsuario.save()

    res.redirect('/administrar/clientes')
}

const buscadorCliente = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    let termino = req.body.termino || req.query.termino

    if(!termino) {
        return res.redirect('/administrar/clientes')
    }

    if(!termino.trim()) {
        return res.redirect('back')
    }
    
    termino = termino.trim()

    let paginaActual = parseInt(req.query.pagina)

    const expresion = /^[1-9]$/
    if(!expresion.test(paginaActual)) {
        return res.redirect(`/administrar/clientes/buscador?pagina=1&termino=${termino}`)
    }

    try {
        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual*limit) - limit)

        const [usuarios, total] = await Promise.all([

            UsuarioModel.findAll({
                limit,
                offset,
                where: {
                    name: {
                        [Op.like]: termino + '%'
                    }
                }
            }),
            UsuarioModel.count({
                where: {
                    name: {
                        [Op.like]: termino + '%'
                    }
                }
            })
        ])

        return res.render('admin/usuarios',{
            pagina: 'Administración',
            autenticado: true,
            clientesTabla: true,
            usuarioSolicitar,
            cuentaId,
            usuarios,
            total,
            offset,
            limit,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            csrfToken: req.csrfToken(),
            termino,
            buscador: true
        })

    } catch (error) {
        console.log(error)
    }
}

const modificarCliente = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    const { id: usuarioId } = req.params

    const usuario = await UsuarioModel.findByPk(usuarioId)

    if(!usuario) {
        return res.redirect('/administrar/clientes')
    }

    res.render('admin/modificarUsuario',{
        pagina: 'Administración',
        autenticado: true,
        usuarioSolicitar,
        clienteTabla: true,
        cuentaId,
        usuario,
        csrfToken: req.csrfToken()
    })
}

const ingresarModificarCliente = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    await check('name').notEmpty().withMessage('Debe ingresar un nombre').run(req)
    await check('paterno').notEmpty().withMessage('Debe ingresar un apellido paterno').run(req)
    await check('materno').notEmpty().withMessage('Debe ingresar un apellido materno').run(req)
    await check('email').isEmail().withMessage('Debe ingresar un correo electronico').run(req)
    await check('telefono').isLength({ min:8 }).withMessage('Debe tener 8 caracteres minimos el telefono').run(req)

    const resultado = validationResult(req);

    const { id: usuarioId } = req.params
    const usuario = await UsuarioModel.findByPk(usuarioId)

    // Valida el formulario
    if (!resultado.isEmpty()) {
        return res.render('admin/modificarUsuario', {
            pagina: 'Administración',
            autenticado: true,
            clienteTabla: true,
            usuarioSolicitar,
            cuentaId,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario
        })
    }

    const { email } = req.body

    if(usuario.email != email) {

        const emailExistente = await UsuarioModel.findOne({
            where: {
                email
            }
        })

        if(emailExistente) {
            return res.render('admin/modificarUsuario', {
                pagina: 'Administración',
                autenticado: true,
                clienteTabla: true,
                usuarioSolicitar,
                cuentaId,
                errores: [{msg: 'El correo ya esta registrado'}],
                csrfToken: req.csrfToken(),
                usuario
            })
        }
    }

    const { name, paterno, materno, telefono } = req.body
    usuario.name = name
    usuario.paterno = paterno
    usuario.materno = materno
    usuario.email = email
    usuario.telefono = telefono
    await usuario.save()
    res.redirect('/administrar/clientes')
}

const administrarEmpleados = async (req, res) =>{
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    const { pagina: paginaActual } = req.query
    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)) {
        return res.redirect('/administrar/empleados?pagina=1')
    }

    try {
        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual*limit) - limit)

        const [usuarios, total, usuarioSolicitar] = await Promise.all([
            UsuarioModel.findAll({
                limit,
                offset,
                where: {
                    cuentaId: {
                        [Op.between]: [2, 4]
                    }
                },
                include: [
                    { model: CuentasModel}
                ],
                order: [
                    ['cuentaId', 'DESC'],
                    ['fechaCreacion', 'DESC']
                ]
            }),
            UsuarioModel.count({
                where: {
                    cuentaId: {
                        [Op.between]: [2, 4]
                    }
                }
            }),
            // Llamado de funcion para ver si tiene reserva activa
            Solicitar(usuario)
        ])

        res.render('admin/usuarios',{
            pagina: 'Administración',
            autenticado: true,
            usuarioSolicitar,
            cuentaId,
            empleadosTabla: true,
            usuarios,
            csrfToken: req.csrfToken(),
            total,
            offset,
            limit,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            csrfToken: req.csrfToken()
        })
    } catch (error) {
        console.log(error)
    }
}

const crearEmpleado = async (req,res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    res.render('admin/crearUsuario',{
        pagina: 'Administración',
        empleadoTabla: true,
        autenticado: true,
        usuarioSolicitar,
        cuentaId,
        csrfToken: req.csrfToken(),
    })
}

const ingresoCrearEmpleado = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    await check('name').notEmpty().withMessage('Debe ingresar un nombre').run(req)
    await check('paterno').notEmpty().withMessage('Debe ingresar un apellido paterno').run(req)
    await check('materno').notEmpty().withMessage('Debe ingresar un apellido materno').run(req)
    await check('genero').notEmpty().withMessage('Debe seleccionar un género').run(req)
    await check('telefono').isLength({ min:8 }).withMessage('Debe tener 8 caracteres minimos el telefono').run(req)

    const resultado = validationResult(req);

    // Valida el formulario
    if (!resultado.isEmpty()) {
        return res.render('admin/crearUsuario', {
            pagina: 'Administración',
            autenticado: true,
            empleadoTabla: true,
            usuarioSolicitar,
            cuentaId,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                name: req.body.name,
                paterno: req.body.paterno,
                materno: req.body.materno,
                genero: req.body.genero,
                emailEmpleado: req.body.emailEmpleado,
                telefono: req.body.telefono
            }
        })
    }

    const { emailEmpleado: email } = req.body
    const emailExistente = await UsuarioModel.findOne({
        where: {
            email
        }
    })

    if(emailExistente) {
        return res.render('admin/crearUsuario', {
            pagina: 'Administración',
            autenticado: true,
            usuarioSolicitar,
            empleadoTabla: true,
            cuentaId,
            errores: [{msg: 'El correo ya esta registrado'}],
            csrfToken: req.csrfToken(),
            usuario: {
                name: req.body.name,
                paterno: req.body.paterno,
                materno: req.body.materno,
                genero: req.body.genero,
                telefono: req.body.telefono
            }
        })
    }

    const { name, paterno, materno, genero, telefono, password, cuentaRol } = req.body
    const hass_pass = bcrypt.hashSync(password, 10)
    const crearUsuario = await UsuarioModel.create({
        name,
        paterno,
        materno,
        genero,
        email,
        telefono,
        password: hass_pass,
        cuentaId: cuentaRol,
        token: '',
        confirmado: 1
    })

    crearUsuario.save()

    res.redirect('/administrar/empleados')
}

const buscadorEmpleado = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    let termino = req.body.termino || req.query.termino

    if(!termino) {
        return res.redirect('/administrar/empleados')
    }

    if(!termino.trim()) {
        return res.redirect('back')
    }
    
    termino = termino.trim()

    let paginaActual = parseInt(req.query.pagina)

    const expresion = /^[1-9]$/
    if(!expresion.test(paginaActual)) {
        return res.redirect(`/administrar/empleados/buscador?pagina=1&termino=${termino}`)
    }

    try {
        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual*limit) - limit)

        const [usuarios, total] = await Promise.all([

            UsuarioModel.findAll({
                limit,
                offset,
                where: {
                    name: {
                        [Op.like]: termino + '%'
                    }
                },
                include: [
                    {model: CuentasModel}
                ]
            }),
            UsuarioModel.count({
                where: {
                    name: {
                        [Op.like]: termino + '%'
                    }
                }
            })
        ])

        return res.render('admin/usuarios',{
            pagina: 'Administración',
            autenticado: true,
            empleadosTabla: true,
            usuarioSolicitar,
            cuentaId,
            usuarios,
            total,
            offset,
            limit,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            csrfToken: req.csrfToken(),
            termino,
            buscador: true
        })
    } catch (error) {
        console.log(error)
    }
}

const modificarEmpleado = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    const { id: usuarioId } = req.params

    const usuario = await UsuarioModel.findByPk(usuarioId)

    if(!usuario) {
        return res.redirect('/administrar/empleados')
    }

    res.render('admin/modificarUsuario',{
        pagina: 'Administración',
        autenticado: true,
        empleadoTabla: true,
        usuarioSolicitar,
        cuentaId,
        usuario,
        csrfToken: req.csrfToken()
    })
}

const ingresoModificarEmpleado = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    await check('name').notEmpty().withMessage('Debe ingresar un nombre').run(req)
    await check('paterno').notEmpty().withMessage('Debe ingresar un apellido paterno').run(req)
    await check('materno').notEmpty().withMessage('Debe ingresar un apellido materno').run(req)
    await check('email').notEmpty().withMessage('Debe ingresar un correo electronico').run(req)
    await check('telefono').isLength({ min:8 }).withMessage('Debe tener 8 caracteres minimos el telefono').run(req)
    await check('tipo').notEmpty({ min:8 }).withMessage('Debe seleccionar un rol').run(req)

    const resultado = validationResult(req)

    const { id: usuarioId } = req.params
    const usuario = await UsuarioModel.findByPk(usuarioId)

    if(!resultado.isEmpty()) {
        return res.render('admin/modificarUsuario', {
            pagina: 'Administración',
            autenticado: true,
            usuarioSolicitar,
            cuentaId,
            empleadoTabla: true,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario
        })
    }

    const { email } = req.body

    if(usuario.email != email) {

        const emailExistente = await UsuarioModel.findOne({
            where: {
                email
            }
        })

        if(emailExistente) {
            return res.render('admin/modificarUsuario', {
                pagina: 'Administración',
                empleadoTabla: true,
                autenticado: true,
                usuarioSolicitar,
                cuentaId,
                errores: [{msg: 'El correo ya esta registrado'}],
                csrfToken: req.csrfToken(),
                cliente
            })
        }
    }

    const { name, paterno, materno, telefono, tipo } = req.body
    usuario.name = name
    usuario.paterno = paterno
    usuario.materno = materno
    usuario.email = email
    usuario.telefono = telefono
    usuario.cuentaId = tipo
    await usuario.save()
    res.redirect('/administrar/empleados')
}

const eliminarEmpleado = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    const usuarioId = req.params.id

    const usuario = await UsuarioModel.findByPk(usuarioId)

    if(!usuario) {
        return res.redirect('/administrar/empleados')
    }

    await usuario.destroy()

    return res.redirect('/administrar/empleados')
}

const administrarHabitaciones = async (req, res) =>{
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)
    
    const { pagina: paginaActual } = req.query
    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)) {
        return res.redirect('/administrar/habitaciones?pagina=1')
    }

    try {
        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual*limit) - limit)
        
        const fecha = new Date()
        const dia = fecha.getDate().toString().padStart(2, '0')
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
        const año = fecha.getFullYear()
        const fechaHoy = `${año}-${mes}-${dia}`

        const [habitacionesReservadas, habitaciones, total] = await Promise.all([
            ReservaModel.findAll({
                where: {
                    recepcionado: 1,
                    [Op.and]: {
                        fechaInicio: {
                            [Op.lte]: fechaHoy
                        },
                        fechaFin: {
                            [Op.gte]: fechaHoy
                        }
                    }
                    
                }
            }),
            HabitacionModel.findAll({
                limit,
                offset,
                include: {
                    model: TipoModel
                },
                order: [
                    ['tipoId', 'DESC'],
                    ['name', 'ASC']
                ]
            }),
            HabitacionModel.count()
        ])
        
        let reservadas = []

        for (var i = 0; i < habitacionesReservadas.length; i++) {
            let habitacionReservada = habitacionesReservadas[i].dataValues.habitacionId
            reservadas.push(habitacionReservada)
        }
    
        return res.render('admin/habitaciones',{
            pagina: 'Administración',
            autenticado: true,
            habitaciones,
            reservadas,
            total,
            offset,
            limit,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            csrfToken: req.csrfToken(),
            cuentaId,
            usuarioSolicitar
        })
    } catch (error) {
        console.log(error)
    }
}

const buscadorHabitacion = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)
    
    let termino = req.body.termino || req.query.termino
    if(!termino) {
        return res.redirect('/administrar/habitaciones')
    }
    
    
    const { pagina: paginaActual } = req.query
    const expresion = /^[1-9]$/
    
    console.log(termino)
    console.log(paginaActual)
    if(!expresion.test(paginaActual)) {
        return res.redirect(`/administrar/habitaciones/buscador?pagina=1&termino=${termino}`)
    }

    try {
        if(termino >= 1 && termino <=4) {
            // Limites y Offset para el paginador
            const limit = 10
            const offset = ((paginaActual*limit) - limit)
            
            const fecha = new Date()
            const dia = fecha.getDate().toString().padStart(2, '0')
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
            const año = fecha.getFullYear()
            const fechaHoy = `${año}-${mes}-${dia}`

            const [habitacionesReservadas, habitaciones, total] = await Promise.all([
                ReservaModel.findAll({
                    where: {
                        [Op.and]: {
                            fechaInicio: {
                                [Op.lte]: fechaHoy
                            },
                            fechaFin: {
                                [Op.gte]: fechaHoy
                            }
                        }
                    }, 
                    include: [
                        { model: HabitacionModel, as: 'habitacion', 
                            where: {
                                tipoId: termino
                            }
                        }
                    ]
                }),
                HabitacionModel.findAll({
                    limit,
                    offset,
                    include: [
                        {
                            model: TipoModel,
                            where: {
                                id: termino
                            }
                        }
                    ]
                }),
                HabitacionModel.count({
                    where: {
                        tipoId: termino
                    }
                })
            ])

            let reservadas = []

            for (var i = 0; i < habitacionesReservadas.length; i++) {
                let habitacionReservada = habitacionesReservadas[i].dataValues.habitacionId
                reservadas.push(habitacionReservada)
            }

            return res.render('admin/habitaciones',{
                pagina: 'Administración',
                autenticado: true,
                empleadosTabla: true,
                usuarioSolicitar,
                cuentaId,
                reservadas,
                buscador: true,
                total,
                offset,
                limit,
                paginas: Math.ceil(total / limit),
                paginaActual: Number(paginaActual),
                habitaciones,
                csrfToken: req.csrfToken(),
                termino
            })
        }
        else {
            return res.redirect('/administrar/habitaciones')
        }
    } catch (error) {
        console.log(error)
    }
}

const modificarHabitacion = async (req,res) =>{
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    const { id: habitacionId } = req.params

    const habitacion = await HabitacionModel.findByPk(habitacionId, {
        include: [
            {model: TipoModel}
        ]
    }
    )
    
    if(!habitacion) {
        return res.redirect('/administrar/habitaciones')
    }

    res.render('admin/modificarHabitacion', {
        pagina: 'Administración',
        autenticado: true,
        habitacion,
        csrfToken: req.csrfToken(),
        cuentaId,
        usuarioSolicitar
    })
}

const ingresoModificarHabitacion = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    const { id: habitacionId } = req.params
    const habitacion = await HabitacionModel.findByPk(habitacionId)

    if(!habitacion){
        return res.redirect('/administrar/habitaciones')
    }

    const { estado } = req.body
    const { habilitado } = req.body

    habitacion.estado = estado
    habitacion.habilitado = habilitado
    await habitacion.save()

    res.redirect('/administrar/habitaciones')
}

const administrarMenu = async (req,res ) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    const { pagina: paginaActual } = req.query
    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)) {
        return res.redirect('/administrar/menus?pagina=1')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    try {
        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual*limit) - limit)

        const [menus, total] = await Promise.all([
            MenuModel.findAll({
                limit,
                offset,
                include: [
                    {model: SubCategoriaModel, 
                        include: {
                            model: CategoriaModel
                        }
                    }
                ],
                order: [
                    ['subcategoriaId', 'ASC']
                ]
            }),
            MenuModel.count()
        ])
        
        return res.render('admin/menus',{
            pagina: 'Administración',
            autenticado: true,
            menus,
            total,
            offset,
            limit,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            csrfToken: req.csrfToken(),
            cuentaId,
            usuarioSolicitar
        })
    } catch (error) {
        console.log(error)
    }
}

const crearMenu = async (req,res) =>{
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    res.render('admin/crearMenu',{
        pagina: 'Administración',
        autenticado: true,
        usuarioSolicitar,
        cuentaId,
        csrfToken: req.csrfToken()
    }) 
}

const ingresoCrearMenu = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuario)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    // Input Imagen
    if(req.file){
        var imagen = req.file.filename
    }

    // await check('filename').notEmpty().withMessage('Debe ingresar una imagen').run(req)
    await check('categoria').notEmpty().withMessage('Debe seleccionar una categoria').run(req)
    await check('subcategoria').notEmpty().withMessage('Debe seleccionar una sub-categoria').run(req)
    await check('name').notEmpty().withMessage('Debe ingresar un nombre').run(req)
    await check('descripcion').notEmpty().withMessage('Debe ingresar una descripción').run(req)
    await check('precio').isNumeric().withMessage('Debe ingresar un precio valido').notEmpty().withMessage('Debe ingresar un precio').run(req)
    await check('estado').notEmpty().withMessage('Debe seleccionar un estado').run(req)

    const resultado = validationResult(req)
    
    // Valida el formulario
    if (!resultado.isEmpty()) {
        return res.render('admin/crearMenu', {
            pagina: 'Administración',
            autenticado: true,
            usuarioSolicitar,
            cuentaId,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            menu: {
                name: req.body.name,
                categoria: req.body.categoria,
                subcategoria: req.body.subcategoria,
                descripcion: req.body.descripcion,
                precio: req.body.precio,
                estado: req.body.estado
            }
        })
    }
    
    const { name, descripcion, precio, estado, subcategoria: subcategoriaId } = req.body
    const crearMenu = await MenuModel.create({
        name,
        descripcion,
        precio,
        estado,
        imagen,
        subcategoriaId
    })
    
    crearMenu.save()

    res.redirect('/administrar/menus')
}

const buscadorMenu = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    const categoria = req.body.categoria || req.query.categoria
    const subcategoria = req.body.subcategoria || req.query.subcategoria
    
    if(!categoria) {
        return res.redirect('/administrar/menus')
    }

    let paginaActual = parseInt(req.query.pagina)
    
    const expresion = /^[1-9]$/
    if(!expresion.test(paginaActual)) {
        if(categoria && subcategoria) {
            return res.redirect(`/administrar/menus/buscador?pagina=1&categoria=${categoria}&subcategoria=${subcategoria}`)
        }
        else if (categoria) {
            return res.redirect(`/administrar/menus/buscador?pagina=1&categoria=${categoria}`)
        }
    }
    
    try {
        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual*limit) - limit)
        
        // En caso de filtrar con Categoria y Sub-Categoria
        if(categoria && subcategoria) {
            const [menus, total] = await Promise.all([
                MenuModel.findAll({
                    limit,
                    offset,
                    include: [
                        { model: SubCategoriaModel, 
                            where: {
                                id: subcategoria
                            },
                            include: [
                                { model: CategoriaModel, 
                                    where: {
                                        id: categoria
                                    }
                                 }
                            ]
                        }
                    ],
                    order: [
                        ['subcategoriaId', 'ASC']
                    ]
                }),
                MenuModel.count({
                    include: [
                        { model: SubCategoriaModel, 
                            where: {
                                id: subcategoria
                            },
                            include: [
                                { model: CategoriaModel, 
                                    where: {
                                        id: categoria
                                    }
                                 }
                            ]
                        }
                    ]
                })
            ])

            res.render('admin/menus', {
                pagina: 'Administración',
                autenticado: true,
                categoria,
                subcategoria,
                buscador: true,
                menus,
                total,
                offset,
                limit,
                paginas: Math.ceil(total / limit),
                paginaActual: Number(paginaActual),
                csrfToken: req.csrfToken(),
                cuentaId,
                usuarioSolicitar
            })
        }
        
        // En caso de filtrar solo con Categoria seleccionada
        else {
            const [menus, total] = await Promise.all([
                MenuModel.findAll({
                    limit,
                    offset,
                    include: [
                        { model: SubCategoriaModel, 
                            where: {
                                categoriaId: categoria
                            }, 
                            include: [
                                { model: CategoriaModel }
                            ]
                        }
                    ],
                    order: [
                        ['subcategoriaId', 'ASC']
                    ]
                }),
                MenuModel.count({
                    include: [
                        { model: SubCategoriaModel,
                            where: {
                                categoriaId: categoria
                            }, 
                            include: [
                                { model: CategoriaModel }
                            ]
                        }
                    ]
                })
            ])

            res.render('admin/menus', {
                pagina: 'Administración',
                autenticado: true,
                categoria,
                menus,
                buscador: true,
                total,
                offset,
                limit,
                paginas: Math.ceil(total / limit),
                paginaActual: Number(paginaActual),
                csrfToken: req.csrfToken(),
                cuentaId,
                usuarioSolicitar
            })
        }


    } catch (error) {
        console.log(error)
    }
}

const modificarMenu = async (req, res,next) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    const { id: menuId } = req.params

    const menu = await MenuModel.findByPk(menuId, {
        include: [
            { model: SubCategoriaModel, 
                include: {
                    model: CategoriaModel
                }
            }
        ]
    })

    if(!menu) {
        return res.redirect('/administrar/menus')
    }

    res.render('admin/modificarMenu',{
        pagina: 'Administración',
        autenticado: true,
        usuarioSolicitar,
        cuentaId,
        menu,
        csrfToken: req.csrfToken()
    })
}

const ingresoModificarMenu = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    if(req.file) {
        var imagen = req.file.filename
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    const { id: menuId } = req.params
    const menu = await MenuModel.findByPk(menuId)

    if(!menu) {
        return res.redirect('/administrar/menus')
    }

    await check('name').notEmpty().withMessage('Debe ingresar un nombre').run(req)
    await check('descripcion').notEmpty().withMessage('Debe ingresar una descripcion').run(req)
    await check('categoria').notEmpty().withMessage('Debe seleccionnar una categoria').run(req)
    await check('subcategoria').notEmpty().withMessage('Debe seleccionar una sub categoria').run(req)
    await check('precio').isNumeric().withMessage('Debe ingresar un precio valido').notEmpty().withMessage('Debe ingresar un precio').run(req)
    await check('estado').notEmpty().withMessage('Debe seleccionar un estado').run(req)

    const resultado = validationResult(req)

    if(!resultado.isEmpty()) {
        return res.render('admin/modificarMenu', {
            pagina: 'Administración',
            autenticado: true,
            usuarioSolicitar,
            cuentaId,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            menu
        })
    }

    if(req.file){
        const pathImagen = `public/uploads/menus/${menu.imagen}`
        fs.access(pathImagen, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(`El archivo no existe o no es accesible: ${err.message}`)
            } else {
                fs.unlink(pathImagen, (err) => {
                    if (err) {
                        console.error(`Error al eliminar el archivo: ${err.message}`)
                    } else {
                        console.log(`Archivo ${menu.imagen} eliminado exitosamente`)
                    }
                })
            }
        })
    }
    
    const { name, descripcion, categoria, subcategoria, estado, precio } = req.body
    // En caso de modificación de la Imagen
    if(req.file) {
        menu.imagen = imagen
    }
    menu.name = name
    menu.descripcion = descripcion
    menu.categoria = categoria
    menu.subcategoriaId = subcategoria
    menu.precio = precio
    menu.estado = estado
    await menu.save()

    res.redirect('/administrar/menus')
}

const alterarMenu = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    const { id: menuId } = req.params

    const menu = await MenuModel.findByPk(menuId)

    if(!menu) {
        return redirect('/administrar/menus')
    }

    if(menu.estado === true) {
        menu.estado = 0
        await menu.save()
    }

    else {
        menu.estado = 1
        await menu.save()
    }

    return res.redirect('/administrar/menus')
}

const eliminarMenu = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    const { id: menuId } = req.params

    const menu = await MenuModel.findByPk(menuId)

    if(!menu) {
        return redirect('/administrar/menus')
    }

    await PedidoModel.destroy({
        where: {
            menuId
        }
    })
    
    await menu.destroy()

    return res.redirect('/administrar/menus')
}

const administrarMensajes = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    const { pagina: paginaActual } = req.query
    const expresion = /^[1-9]$/

    if(!expresion.test(paginaActual)) {
        return res.redirect('/administrar/mensajes?pagina=1')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    try {
        // Limites y Offset para el paginador
        const limit = 5
        const offset = ((paginaActual*limit) - limit)

        const [mensajes, total] = await Promise.all([
            MensajeModel.findAll({
                limit,
                offset,
                order: [
                    ['estado', 'DESC'],
                    ['fechaCreacion', 'DESC']
                ]
            }),
            MensajeModel.count()
        ])

        return res.render('admin/mensajes',{
            pagina: 'Administración',
            autenticado: true,
            cuentaId,
            mensajes,
            total,
            offset,
            limit,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            usuarioSolicitar,
            csrfToken: req.csrfToken()
        })
    } catch (error) {
        console.log(error)
    }
}

const respuestaMensaje = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    const { id: mensajeId } = req.params

    const mensaje = await MensajeModel.findByPk(mensajeId)

    if(!mensaje) {
        return res.redirect('/administrar/mensajes')
    }

    const fecha = new Date()
      
    const dia = fecha.getDate().toString().padStart(2, '0')
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    const año = fecha.getFullYear()
    const fechaHoy = `${año}-${mes}-${dia}`

    return res.render('admin/respuestaMensaje',{
        pagina: 'Administración',
        autenticado: true,
        cuentaId,
        mensaje,
        fechaHoy,
        usuarioSolicitar,
        csrfToken: req.csrfToken()
    })
}

const ingresoRespuestaMensaje = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    const { id: mensajeId } = req.params

    const mensaje = await MensajeModel.findByPk(mensajeId)

    if(!mensaje) {
        return res.redirect('/administrar/mensajes')
    }

    await check('descripcion').notEmpty().withMessage('Debe ingresar un cuerpo de respuesta').run(req)

    const resultado = validationResult(req)

    if(!resultado.isEmpty()) {
        const fecha = new Date()
        
        const dia = fecha.getDate().toString().padStart(2, '0')
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
        const año = fecha.getFullYear()
        const fechaHoy = `${año}-${mes}-${dia}`

        return res.render('admin/respuestaMensaje', {
            pagina: 'Administración',
            autenticado: true,
            cuentaId,
            mensaje,
            fechaHoy,
            usuarioSolicitar,
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { descripcion } = req.body

    const Respuesta = await RespuestaModel.create({
        descripcion,
        mensajeId
    })

    await Respuesta.save()

    mensaje.set({
        estado: false
    })

    await mensaje.save()

    res.redirect('/administrar/mensajes')
}

const buscadorMensaje = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)
    
    const correo = req.body.correo || req.query.correo

    if(!correo) {
        return res.redirect('/administrar/mensajes')
    }

    let paginaActual = parseInt(req.query.pagina)
    
    const expresion = /^[1-9]$/
    if(!expresion.test(paginaActual)) {
        return res.redirect(`/administrar/mensajes/buscador?pagina=1&correo=${correo}`)
    }

    try {
        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual*limit) - limit)
        
        const [mensajes, total] = await Promise.all([
            MensajeModel.findAll({
                limit,
                offset,
                where: {
                    email: {
                        [Op.like]: correo + '%'
                    }
                },
                order: [
                    ['estado', 'DESC'],
                    ['fechaCreacion', 'DESC']
                ]
            }),
            MensajeModel.count({
                where: {
                    email: {
                        [Op.like]: correo + '%'
                    }
                }
            })
        ])

        res.render('admin/mensajes', {
            pagina: 'Administración',
            autenticado: true,
            mensajes,
            correo,
            total,
            offset,
            limit,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            csrfToken: req.csrfToken(),
            cuentaId,
            buscador: true,
            usuarioSolicitar
        })
        
    } catch (error) {
        console.log(error)
    }
}

const verMensaje = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuarioLogeado

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuarioLogeado)

    const { id: mensajeId } = req.params

    const respuesta = await RespuestaModel.findOne({
        where: {
            mensajeId
        }, 
        include: {
            model: MensajeModel
        }
    })

    if(!respuesta) {
        const mensaje = await MensajeModel.findByPk(mensajeId)

        if(!mensaje) {
            return res.redirect('/administrar/mensajes')
        }

        else {
            return res.render('admin/verMensaje', {
                pagina: 'Administración',
                autenticado: true,
                cuentaId,
                mensaje,
                usuarioSolicitar,
                csrfToken: req.csrfToken()
            })
        }
    }

    return res.render('admin/verMensaje', {
        pagina: 'Administración',
        autenticado: true,
        cuentaId,
        respuesta,
        usuarioSolicitar,
        csrfToken: req.csrfToken()
    })
}

const cerrarMensaje = async (req, res) => {
    const { id } = req.usuario
    const usuarioLogeado = await UsuarioModel.findByPk(id)

    // Verifica si el usuario es Administrador
    const admin = verificarAdmin(usuarioLogeado)
    if(!admin) {
        return res.redirect('/')
    }

    const { id: mensajeId } = req.params

    const mensaje = await MensajeModel.findByPk(mensajeId)

    if(!mensaje) {
        return res.redirect('/administrar/mensajes')
    }

    mensaje.set({
        estado: false
    })

    await mensaje.save()

    return res.redirect('/administrar/mensajes')
}

const verificarAdmin = datos => {
    const { cuentaId } = datos

    if(cuentaId == 5) {
        return true
    }

    else {
        return false
    }
}

export {
    administrar,
    administrarClientes,
    reservasCliente,
    crearCliente,
    ingresoCrearCliente,
    buscadorCliente,
    modificarCliente,
    ingresarModificarCliente,

    administrarEmpleados,
    crearEmpleado,
    ingresoCrearEmpleado,
    buscadorEmpleado,
    modificarEmpleado,
    ingresoModificarEmpleado,
    eliminarEmpleado,

    administrarHabitaciones,
    buscadorHabitacion,
    modificarHabitacion,
    ingresoModificarHabitacion,
    
    administrarMenu,
    crearMenu,
    ingresoCrearMenu,
    buscadorMenu,
    modificarMenu,
    ingresoModificarMenu,
    alterarMenu,
    eliminarMenu,

    administrarMensajes,
    respuestaMensaje,
    ingresoRespuestaMensaje,
    buscadorMensaje,
    verMensaje,
    cerrarMensaje
}