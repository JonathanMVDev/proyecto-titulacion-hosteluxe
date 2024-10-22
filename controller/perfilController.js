import { validationResult, check } from 'express-validator'
import bcrypt from 'bcrypt';
import { Op } from 'sequelize'
import { differenceInDays } from 'date-fns'
import { HabitacionModel, UsuarioModel, ReservaModel, CompraModel, TipoModel,  DetalleCompraModel } from '../db.js'
import { Solicitar } from './pedidoController.js'

const miPerfil = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    res.render('perfil/mi-perfil', {
        pagina: 'Mi Perfil',
        usuarioSolicitar,
        autenticado: true,
        cuentaId,
        usuario,
        csrfToken: req.csrfToken()
    })
}

const modificarDatosPersonales = async (req, res) => {

    await check('name').notEmpty().withMessage('Debe ingresar un nombre').run(req)
    await check('paterno').notEmpty().withMessage('Debe ingresar un apellido paterno').run(req)
    await check('materno').notEmpty().withMessage('Debe ingresar un apellido materno').run(req)
    await check('email').isEmail().withMessage('Debe ingresar un correo electronico').run(req)
    await check('telefono').isLength({ min:8 }).withMessage('Debe tener 8 caracteres minimos el telefono').run(req)

    const resultado = validationResult(req)

    const { id } = req.usuario
    let usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    if(!resultado.isEmpty()) {

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('perfil/mi-perfil', {
            pagina: 'Mi Perfil',
            autenticado: true,
            usuario,
            usuarioSolicitar,
            cuentaId,
            erroresDatos: resultado.array(),
            csrfToken: req.csrfToken()
        })
    }

    const { email } = req.body
    const verificarCorreo = await UsuarioModel.findOne({where: { email }})

    if(verificarCorreo) {

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('perfil/mi-perfil', {
            pagina: 'Mi Perfil',
            autenticado: true,
            usuarioSolicitar,
            usuario,
            cuentaId,
            erroresDatos: [{msg: 'Correo eléctronico ya registrado'}],
            csrfToken: req.csrfToken()
        })
    }

    try {
        const { name, paterno, materno, email, telefono } = req.body

        usuario.set({
            name, 
            paterno, 
            materno,
            email,
            telefono
        })
        await usuario.save()

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('perfil/mi-perfil', {
            pagina: 'Mi Perfil',
            usuarioSolicitar,
            mensajeDatos: 'Sus datos han sido modificados correctamente',
            autenticado: true,
            usuario,
            cuentaId,
            csrfToken: req.csrfToken()
    })
    } catch (error) {
        console.log(error)
    }
}

const cambiarContraseña = async (req, res) => {
    await check('password').notEmpty().withMessage('Debe ingresar su contraseña').run(req)
    await check('passwordNueva').notEmpty().withMessage('Debe ingresar una nueva contraseña').run(req)
    await check('repetir_passwordNueva').equals(req.body.passwordNueva).withMessage('Las contraseñas no son iguales').run(req)

    const resultado = validationResult(req)

    const { id } = req.usuario
    let usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    if(!resultado.isEmpty()) {

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('perfil/mi-perfil', {
            pagina: 'Mi Perfil',
            autenticado: true,
            usuarioSolicitar,
            usuario,
            cuentaId,
            erroresContraseñas: resultado.array(),
            csrfToken: req.csrfToken()
        })
    }

    const { password, passwordNueva } = req.body
    const verificarContraseña = await bcrypt.compare(password, usuario.password)

    if(!verificarContraseña) {

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('perfil/mi-perfil', {
            pagina: 'Mi Perfil',
            usuarioSolicitar,
            autenticado: true,
            usuario,
            cuentaId,
            erroresContraseñas: [{msg: 'Contraseña incorrecta, intente nuevamente'}],
            csrfToken: req.csrfToken()
        })
    }

    else {
        const pass_hash = bcrypt.hashSync(passwordNueva, 10) 
        usuario.password = pass_hash
        usuario.save()

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('perfil/mi-perfil', {
            pagina: 'Mi Perfil',
            autenticado: true,
            usuarioSolicitar,
            usuario,
            cuentaId,
            mensajeContraseña: 'Su contraseña se ha cambiado correctamente',
            csrfToken: req.csrfToken()
        })
    }
}

const misReservas = async (req, res) => {
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    const fechaActual = new Date()
    const dia = fechaActual.getDate().toString().padStart(2, '0')
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0')
    const año = fechaActual.getFullYear()
    const fecha = `${año}-${mes}-${dia}`

    const reservas = await ReservaModel.findAll({
        where: {
            usuarioId
        },
        include: [
            { model: HabitacionModel, as: 'habitacion' }
        ],
        order: [
            [ 'fechaFin', 'DESC' ],
            [ 'fechaInicio', 'DESC' ],
        ]
    })

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    res.render('perfil/mis-reservas', {
        pagina: 'Mis Reservas',
        autenticado: true,
        cuentaId,
        usuario,
        usuarioSolicitar,
        reservas,
        fecha,
        csrfToken: req.csrfToken()
    })
}

const cancelarReserva = async (req, res) => {
    const { id } = req.params
    const reserva = await ReservaModel.findByPk(id)
    
    const { id: usuarioId } = req.usuario

    if(!reserva) {
        return res.redirect('/mis-reservas')
    }

    if( reserva.usuarioId !== usuarioId ) {
        return res.redirect('/mis-reservas')
    }

    const fechaActual = new Date()
    const dia = fechaActual.getDate().toString().padStart(2, '0')
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0')
    const año = fechaActual.getFullYear()
    const fecha = `${año}-${mes}-${dia}`

    const reservaEnCurso = await ReservaModel.findOne({
        where: {
            id,
            [Op.and]: {
                fechaInicio: {
                    [Op.lte]: fecha
                },
                fechaFin: {
                    [Op.gte]: fecha
                }
            }
        },
        include: [
            { model: HabitacionModel, as: 'habitacion',
                include: [
                    { model: TipoModel }
                ]
             }
        ]
    })

    if(reservaEnCurso) {
        // Modificacion de la fecha
        reservaEnCurso.fechaFin = fecha
        const dias = (differenceInDays(fecha, reservaEnCurso.fechaInicio) +1)
        
        // Modificacion de los dias
        reservaEnCurso.cantidadDias = dias
        
        // Modificacion del precio total
        const { diaPrecio } = reservaEnCurso.habitacion.tipo
        const precio = dias*diaPrecio
        reservaEnCurso.montoTotal = precio

        await reservaEnCurso.save()
        return res.redirect('/mis-reservas')   
    }

    else {
        await reserva.destroy()
        return res.redirect('/mis-reservas')  
    }
}

const misCompras = async (req,res) => {
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    const compras = await CompraModel.findAll({
        include: [
            { model: ReservaModel, 
                include: [
                    { model: HabitacionModel, as: 'habitacion', 
                        include: [
                            { model: TipoModel }
                        ]
                    }
                ],
                where: {
                    usuarioId
                }
             }
        ]
    })

    res.render('perfil/mis-compras', {
        pagina: 'Mis Compras',
        autenticado: true,
        cuentaId,
        usuario,
        usuarioSolicitar,
        compras
    })
}

const detalleCompra = async (req,res) =>{
    const { id: usuarioId   } = req.usuario
    const usuario = await UsuarioModel.findByPk(usuarioId)
    const { cuentaId } = usuario

    const usuarioSolicitar = await Solicitar(usuario)

    const { id: compraId } = req.params

    const compra = await CompraModel.findByPk(compraId)
    const { total } = compra

    const detalles = await DetalleCompraModel.findAll({
        where: {
            compraId
        },
        include: [
            { model: CompraModel }
        ]
    })

    res.render('perfil/detalle-compra', {
        pagina: 'Detalle',
        autenticado: true,
        cuentaId,
        usuario,
        usuarioSolicitar,
        detalles,
        total
    })  
}

export {
    miPerfil,
    modificarDatosPersonales,
    cambiarContraseña,
    misReservas,
    cancelarReserva,
    misCompras,
    detalleCompra
}