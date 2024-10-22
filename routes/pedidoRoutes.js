import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js'
import { solicitar, ingresarSolicitar, carro, modificarCarro, eliminarCarro, IngresarCompra } from '../controller/pedidoController.js'

const router = express.Router()

router.get('/solicitar', protegerRuta, solicitar)
router.post('/solicitar/:id', protegerRuta, ingresarSolicitar)

router.get('/solicitar/carro', protegerRuta, carro)
router.post('/carro/modificar/:id', protegerRuta, modificarCarro)
router.post('/carro/eliminar/:id', protegerRuta, eliminarCarro)
router.post('/carro/comprar', protegerRuta, IngresarCompra)

export default router