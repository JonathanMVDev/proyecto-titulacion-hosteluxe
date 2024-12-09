import express from 'express'
import { registro, ingresarRegistro, confirmarUsuario, login, ingresarLogin, recuperar, ingresarRecuperar, cambiarPassword, validarCambioPassword, logout } from '../controller/usuarioController.js'

const router = express.Router()

router.get('/registro', registro)
router.post('/registro', ingresarRegistro)

router.get('/mensaje/:token', confirmarUsuario)

router.get('/login', login)
router.post('/login', ingresarLogin)

router.get('/recuperar', recuperar)
router.post('/recuperar', ingresarRecuperar)

router.get('/cambiarPassword/:token', cambiarPassword)
router.post('/cambiarPassword', validarCambioPassword)

router.get('/logout', logout)

export default router