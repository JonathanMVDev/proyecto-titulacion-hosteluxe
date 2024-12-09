import {check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import { UsuarioModel } from '../db.js'
import { generarJWT, generarId } from '../helpers/token.js'
import { emailConfirmacion, emailOlvidePassword } from '../helpers/emails.js'

const registro = (req, res) => {

    const { _token } = req.cookies
    if(_token) {
        return res.redirect('/reserva')
    }

    res.render('auth/registro', {
        pagina: 'Registrarse',
        csrfToken: req.csrfToken()
    })
}

const ingresarRegistro = async (req, res) => {
    
    await check('name').notEmpty().withMessage('Debe ingresar un nombre').run(req)
    await check('genero').notEmpty().withMessage('Debe seleccionar un género').run(req)
    await check('email').isEmail().withMessage('Debe ingresar un correo electronico').run(req)
    await check('telefono').isLength({ min:8 }).withMessage('Debe tener 8 caracteres minimos el telefono').run(req)
    await check('password').isLength({ min:6 }).withMessage('Debe ingresar una contraseña de 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no son iguales').run(req)

    const resultado = validationResult(req);

    // Valida el formulario
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Registrarse',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                name: req.body.name,
                telefono: req.body.telefono
            }
        })
    }

    // Valida si el correo electronico esta registrado
    const { name, genero, email, telefono, password } = req.body
    const ExisteUsuario = await UsuarioModel.findOne({where: {email}})
    if (ExisteUsuario) {
        return res.render('auth/registro', {

            pagina: 'Registrarse',
            errores: [{msg: 'Correo ya registrado, ingrese nuevamente'}],
            csrfToken: req.csrfToken(),
            usuario: {
                name: req.body.name,
                telefono: req.body.telefono
            }
        })
    }

    // Hasheo del password
    const pass_hash = bcrypt.hashSync(password, 10);
    const token = generarId()

    // Crea el usuario en la DB
    const usuario = await UsuarioModel.create({
        name,
        paterno: '',
        materno: '',
        genero,
        email,
        telefono,
        password: pass_hash,
        confirmado: false,
        token,
        cuentaId: 1
    })
    await usuario.save();
    const datos = {
        email,
        name,
        token
    }

    await emailConfirmacion(datos)

    // Retorna al usuario a una pagina para validar la cuenta
    return res.render('auth/mensaje', {
        pagina: 'Confirme su cuenta',
        mensaje: 'Hemos enviado un vinculo para confirmar su cuenta a su correo electronico, por favor confirme su cuenta.'
    })
}

const confirmarUsuario = async(req, res) => {

    const { _token } = req.cookies
    if(_token) {
        return res.redirect('/reserva')
    }

    const { token } = req.params
    const usuario = await UsuarioModel.findOne({ where: {token}})

    if(!usuario) {
        return res.render('auth/mensaje', {
            pagina: 'Error al Confirmar',
            mensaje: 'Hubo un error al intentar confirmar, intente nuevamente.'
        })
    }

    usuario.token = null
    usuario.confirmado = true
    await usuario.save()

    res.render('auth/mensaje', {
        pagina: 'Gracias por Registrarse',
        mensaje: 'Su cuenta fue confirmada correctamente, por favor Inicie Sesión.',
        confirmado: true
    })
}

const login = (req, res) => {

    const { _token } = req.cookies
    if(_token) {
        return res.redirect('/reserva')
    }

    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const ingresarLogin = async (req, res) => {
    await check('email').isEmail().withMessage('Debe ingresar un correo').run(req)
    await check('password').notEmpty().withMessage('Debe ingresar una contraseña').run(req)

    const resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { email, password } = req.body
    
    const usuario = await UsuarioModel.findOne({where: {email}});
    
    if(usuario){
        const comparePass = bcrypt.compareSync(password, usuario.password);
        
        if(!comparePass){
            return res.render('auth/login', {
                autenticado:false,
                pagina: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errores: [{msg: 'Usuario invalido, intente nuevamente'}]
            })
        }

        else if(!usuario.confirmado) {
            return res.render('auth/login', {
    
                pagina: 'Iniciar Sesión',
                csrfToken: req.csrfToken(),
                errores: [{msg: 'Debe confirmar su cuenta antes de ingresar'}]
            })
        }

        else {
            const token = generarJWT(usuario.id)
            res.cookie('_token', token, {
                httpOnly: true,
                secure: true
            }).redirect('/')
        }
    }

    else {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Usuario invalido, intente nuevamente'}]
        })
    }
}

const recuperar = (req, res) => {

    const { _token } = req.cookies
    if(_token) {
        return res.redirect('/reserva')
    }

    res.render('auth/recuperar', {
        csrfToken: req.csrfToken(),
        pagina: 'Recuperar Acceso'
    })
}

const ingresarRecuperar = async (req, res) => {
    await check('email').isEmail().withMessage('Debe ingresar un correo').run(req)

    const resultado = validationResult(req);

    if (!resultado.isEmpty()){
        return res.render('auth/recuperar', {

            pagina: 'Recuperar Acceso',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { email } = req.body;
    const usuario = await UsuarioModel.findOne({where: {email}});
    
    if(!usuario){
        return res.render('auth/recuperar', {
            pagina: 'Recuperar cuenta',
            csrfToken: req.csrfToken(),
            emailError: true
        })
    }
        
    const token = generarId();
    
    const datos = {
        name: usuario.name,
        email,
        token
    }

    emailOlvidePassword(datos)
    usuario.token = token;
    usuario.save();

    res.render('auth/mensaje', {
        pagina: 'Recuperar cuenta',
        mensaje: 'Hemos enviado un mensaje a su correo electronico para recuperar su cuenta.'
    })
}

const cambiarPassword = async (req, res) => {

    const { _token } = req.cookies
    if(_token) {
        return res.redirect('/reserva')
    }

    const { token } = req.params
    const usuario = await UsuarioModel.findOne({where: {token}});

    if(!usuario){
        return res.render('auth/cambiarPassword',{
            errorToken: true,
            pagina: 'Recuperar Acceso'
        })
    }

    res.render('auth/cambiarPassword', {
        token,
        csrfToken: req.csrfToken(),
        pagina: 'Recuperar Acceso'
    })
}

const validarCambioPassword = async (req, res) => {
    await check('password').isLength({ min:6 }).withMessage('Debe ingresar una contraseña de 6 caracteres').run(req)
    await check('repetir_password').notEmpty().withMessage('Debe repetir su contraseña').equals(req.body.password).withMessage('Las contraseñas no son iguales').run(req)

    const resultado = validationResult(req)
    
    if(!resultado.isEmpty()) {
        return res.render('auth/cambiarPassword', {
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            pagina: 'Recuperar Acceso'
        })
    }

    const { password, token } = await req.body;
    const usuario = await UsuarioModel.findOne({where: {token}})
    const pass_hash = bcrypt.hashSync(password, 10)
    usuario.password = pass_hash;
    usuario.token = null
    usuario.save();

    res.render('auth/mensaje', {
        pagina: 'Acceso Recuperado',
        mensaje: 'Su contraseña ha sido reestablecida correctamente, ahora puede iniciar sesión.'
    })
}

const logout = (req, res) => {
    res.clearCookie('_token', { path: '/' });
    return res.redirect('/');
}

export {
    registro,
    ingresarRegistro,
    confirmarUsuario,
    login,
    ingresarLogin,
    recuperar,
    ingresarRecuperar,
    cambiarPassword,
    validarCambioPassword,
    logout
}