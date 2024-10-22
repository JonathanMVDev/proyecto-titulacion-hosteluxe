import jwt from 'jsonwebtoken'
import { UsuarioModel } from '../db.js'

const publicaRuta = async (req, res, next) => {

    // Verificar si hay un token
    const { _token } = req.cookies
    if(!_token) {
        return next()
    }

    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario = await UsuarioModel.scope('eliminarPassword').findByPk(decoded.id)
        // Almacenar el usuario en el Request
        if(usuario) {
            req.usuario = usuario
        } else {
            return next()
        }
        return next()
    } catch (error) {
        console.log(error)
        return next()
    }
    
}

export default publicaRuta