import express from 'express'
import { reserva, ingresarReserva, confirmacionReserva } from '../controller/reservaController.js'
import protegerRuta from '../middleware/protegerRuta.js'

const router = express.Router()

router.get('/reserva', protegerRuta, reserva)
router.post('/reserva', protegerRuta, ingresarReserva)

router.get('/reserva/:id', protegerRuta, confirmacionReserva)

export default router