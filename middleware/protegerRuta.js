import jwt from 'jsonwebtoken'
import { UsuarioModel } from '../db.js'

const protegerRuta = async (req, res, next) => {

    // Verificar si hay un token
    const { _token } = req.cookies
    if(!_token) {
        return res.redirect('/auth/login')
    }

    // Comprobar el Token
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario = await UsuarioModel.scope('eliminarPassword').findByPk(decoded.id)
        // Almacenar el usuario en el Request
        if(usuario) {
            req.usuario = usuario
        } else {
            return res.redirect('/auth/login')
        }
        return next()
    } catch (error) {
        res.clearCookie('_token').redirect('/auth/login')
    }
}

export default protegerRuta