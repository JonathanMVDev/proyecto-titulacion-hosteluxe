import express from 'express'
import { api, apiTipoEventos } from '../controller/apiController.js'

const router = express.Router()

router.get('/administrar/:id/sub-categorias', api)
router.get('/reserva/:id/tipo-eventos', apiTipoEventos)

export default router