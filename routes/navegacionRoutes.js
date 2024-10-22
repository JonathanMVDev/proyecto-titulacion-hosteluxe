import express from 'express'
import { inicio, nosotros, contactanos, ingresarContactanos, mensajeEnviado, habitaciones, servicios } from '../controller/navegacionController.js'
import publicaRuta from '../middleware/publicaRuta.js'
import upload from '../middleware/subirImagen.js'

const router = express.Router()

router.get('/', publicaRuta, inicio)

router.get('/nosotros', publicaRuta, nosotros)

router.get('/contactanos', publicaRuta, contactanos)
router.post('/contactanos', publicaRuta, upload.single('imagen'), ingresarContactanos)

router.get('/mensaje-confirmado', publicaRuta, mensajeEnviado)

router.get('/habitaciones', publicaRuta, habitaciones)

router.get('/servicios', publicaRuta, servicios)


export default router