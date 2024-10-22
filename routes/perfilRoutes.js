import express from 'express'
import { miPerfil, modificarDatosPersonales, cambiarContraseña, misReservas, cancelarReserva, misCompras, detalleCompra } from '../controller/perfilController.js'
import protegerRuta from '../middleware/protegerRuta.js'

const router = express.Router()

router.get('/perfil', protegerRuta, miPerfil)
router.post('/perfil-datos', protegerRuta, modificarDatosPersonales)
router.post('/perfil-password', protegerRuta, cambiarContraseña)

router.get('/mis-reservas', protegerRuta, misReservas)
router.post('/mis-reservas/:id', protegerRuta, cancelarReserva)

router.get('/mis-compras', protegerRuta, misCompras)
router.get('/mis-compras/:id', protegerRuta, detalleCompra)




export default router