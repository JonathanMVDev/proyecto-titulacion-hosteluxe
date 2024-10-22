import { validationResult, check } from 'express-validator'
import { MensajeModel, UsuarioModel } from '../db.js'
import { emailMensajeEnviado } from '../helpers/emails.js'
import { Solicitar } from './pedidoController.js'

const inicio = async (req, res) => {
    if(req.usuario) {
        const { id } = req.usuario
        const usuario = await UsuarioModel.findByPk(id)
        const { cuentaId, name } = usuario

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('navegacion/inicio', {
            pagina: `¿Deseas reservar algo, ${name}?`,
            autenticado: true,
            usuarioSolicitar,
            cuentaId
        })
    }

    res.render('navegacion/inicio', {
        pagina: '¿Deseas reservar algo?'
    })
}

const nosotros = async (req, res) => {
    if(req.usuario) {
        const { id } = req.usuario
        const usuario = await UsuarioModel.findByPk(id)
        const { cuentaId } = usuario

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('navegacion/nosotros', {
            pagina: 'Sobre Nosotros',
            autenticado: true,
            usuarioSolicitar,
            cuentaId
        })
    }

    res.render('navegacion/nosotros', {
        pagina: 'Sobre Nosotros'
    })
}

const contactanos = async (req, res) => {
    if(req.usuario) {
        const { id } = req.usuario
        const usuario = await UsuarioModel.findByPk(id)
        const { cuentaId, id: usuarioId } = usuario

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('navegacion/contactanos', {
            pagina: 'Contactanos',
            autenticado: true,
            usuarioSolicitar,
            cuentaId,
            csrfToken: req.csrfToken()
        })
    }

    res.render('navegacion/contactanos', {
        pagina: 'Contactanos',
        csrfToken: req.csrfToken()
    })
}

const ingresarContactanos = async (req, res, next) => {
    
    await check('motivo').notEmpty().withMessage('Debe ingresar un motivo').run(req)
    await check('asunto').notEmpty().withMessage('Debe ingresar un asunto').run(req)
    await check('descripcion').notEmpty().withMessage('Debe ingresar una descripción').run(req)
    await check('email').notEmpty().withMessage('Debe ingresar un correo electronico').run(req)
    const resultado = validationResult(req)

    // Si el Usuario esta ingresado y envia un mensaje
    if(req.usuario) {
        const { id } = req.usuario
        const usuario = await UsuarioModel.findByPk(id)
        const { cuentaId, id: usuarioId } = usuario

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        if(!resultado.isEmpty()) {
            return res.render('navegacion/contactanos', {
                pagina: 'Contactanos',
                autenticado: true,
                usuarioSolicitar,
                errores: resultado.array(),
                cuentaId,
                csrfToken: req.csrfToken()
            })
        }
        else {
            if(req.file) {
                const imagen = req.file.filename
                const { motivo, asunto, descripcion, email } = req.body 
                const mensaje = await MensajeModel.create({
                    motivo,
                    asunto,
                    descripcion,
                    email,
                    imagen
                })
                mensaje.save()
                await mensaje.save()
                emailMensajeEnviado(email)
                return res.redirect('/mensaje-confirmado')
            }
            else {
                const { motivo, asunto, descripcion, email } = req.body 
                const mensaje = await MensajeModel.create({
                    motivo,
                    asunto,
                    descripcion,
                    email,
                    imagen: ''
                })
                mensaje.save()
                await mensaje.save()
                emailMensajeEnviado(email)
                return res.redirect('/mensaje-confirmado')
            }
            
        }
    }

    // Si el Usuario no esta ingresado y envia un mensaje
    else {
        if(!resultado.isEmpty()) {
            return res.render('navegacion/contactanos', {
                pagina: 'Contactanos',
                usuarioSolicitar,
                errores: resultado.array(),
                csrfToken: req.csrfToken()
            })
        }
        else {
            
            if(req.file) {
                const imagen = req.file.filename
                const { motivo, asunto, descripcion, email } = req.body 
                const mensaje = await MensajeModel.create({
                    motivo,
                    asunto,
                    descripcion,
                    email,
                    imagen
                })
                await mensaje.save()
                emailMensajeEnviado(email)
                return res.redirect('/mensaje-confirmado')
            }
            else{
                const { motivo, asunto, descripcion, email } = req.body 
                const mensaje = await MensajeModel.create({
                    motivo,
                    asunto,
                    descripcion,
                    email,
                    imagen: ''
                })
                await mensaje.save()
                emailMensajeEnviado(email)
                return res.redirect('/mensaje-confirmado')
            }
        }
    }
}

const mensajeEnviado = async (req, res) => {
    if(req.usuario) {
        const { id } = req.usuario
        const usuario = await UsuarioModel.findByPk(id)
        const { cuentaId, id: usuarioId } = usuario

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('navegacion/mensaje-enviado', {
            pagina: 'Gracias por su mensaje',
            autenticado: true,
            usuarioSolicitar,
            cuentaId
        })
    }
    
    res.render('navegacion/mensaje-enviado', {
        pagina: 'Gracias por su mensaje'
    })
}

const servicios = async (req, res) => {
    if(req.usuario) {
        const { id } = req.usuario
        const usuario = await UsuarioModel.findByPk(id)
        const { cuentaId } = usuario

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('navegacion/servicios', {
            pagina: 'Nuestros Servicios',
            autenticado: true,
            usuarioSolicitar,
            cuentaId
        })
    }

    res.render('navegacion/servicios', {
        pagina: 'Bienvenido'
    })
}

const habitaciones = async (req, res) => {
    if(req.usuario) {
        const { id } = req.usuario
        const usuario = await UsuarioModel.findByPk(id)
        const { cuentaId, id: usuarioId } = usuario

        // Llamado de funcion para ver si tiene reserva activa
        const usuarioSolicitar = await Solicitar(usuario)

        return res.render('navegacion/habitaciones', {
            pagina: 'Nuestras Habitaciones',
            autenticado: true,
            usuarioSolicitar,
            cuentaId
        })
    }

    res.render('navegacion/habitaciones', {
        pagina: 'Nuestras Habitaciones'
    })
}

export {
    inicio,
    nosotros,
    contactanos,
    ingresarContactanos,
    mensajeEnviado,
    servicios,
    habitaciones
}