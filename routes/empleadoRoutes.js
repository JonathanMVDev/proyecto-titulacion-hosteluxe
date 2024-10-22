import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js'
import { recepcion, buscadorRecepcion, ingresoRecepcion, pedido, ingresoPedido, servicio, ingresoDespachoPedido, ingresoHabitacion, ingresoEvento } from '../controller/empleadoController.js'

const router = express.Router()

router.get('/recepcion', protegerRuta, recepcion)
router.get('/recepcion/buscador', protegerRuta, buscadorRecepcion)
router.post('/recepcion/buscador', protegerRuta, buscadorRecepcion)
router.post('/recepcion/recepcionar/:id', protegerRuta, ingresoRecepcion)

router.get('/pedido', protegerRuta, pedido)
router.post('/pedido/despacho/:id', protegerRuta, ingresoPedido)

router.get('/servicio', protegerRuta, servicio)
router.post('/servicio/pedido/:id', protegerRuta, ingresoDespachoPedido)
router.post('/servicio/habitacion/:id', protegerRuta, ingresoHabitacion)
router.post('/servicio/evento/:id', protegerRuta, ingresoEvento)

export default router