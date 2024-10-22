import express from 'express'
import protegerRuta from '../middleware/protegerRuta.js'
import { administrar, administrarClientes, reservasCliente, crearCliente, ingresoCrearCliente, buscadorCliente, modificarCliente, ingresarModificarCliente, administrarEmpleados, crearEmpleado, ingresoCrearEmpleado, buscadorEmpleado, modificarEmpleado, ingresoModificarEmpleado, eliminarEmpleado, administrarHabitaciones, buscadorHabitacion, modificarHabitacion, ingresoModificarHabitacion, administrarMenu, crearMenu, ingresoCrearMenu, buscadorMenu, modificarMenu, ingresoModificarMenu, alterarMenu, eliminarMenu, administrarMensajes, respuestaMensaje, ingresoRespuestaMensaje, buscadorMensaje, verMensaje, cerrarMensaje } from '../controller/adminController.js'
import upload from '../middleware/subirImagenMenu.js'

const router = express.Router()

router.get('/administrar', protegerRuta, administrar)

router.get('/administrar/clientes', protegerRuta, administrarClientes)
router.get('/administrar/clientes/reservas-cliente/:id', protegerRuta, reservasCliente)
router.get('/administrar/clientes/crear-cliente', protegerRuta, crearCliente)
router.post('/administrar/clientes/crear-cliente', protegerRuta, ingresoCrearCliente)
router.get('/administrar/clientes/buscador', protegerRuta, buscadorCliente)
router.post('/administrar/clientes/buscador', protegerRuta, buscadorCliente)
router.get('/administrar/clientes/modificar-cliente/:id', protegerRuta, modificarCliente)
router.post('/administrar/clientes/modificar-cliente/:id', protegerRuta, ingresarModificarCliente)

router.get('/administrar/empleados', protegerRuta, administrarEmpleados)
router.get('/administrar/empleados/crear-empleado', protegerRuta, crearEmpleado)
router.post('/administrar/empleados/crear-empleado', protegerRuta, ingresoCrearEmpleado)
router.get('/administrar/empleados/buscador', protegerRuta, buscadorEmpleado)
router.post('/administrar/empleados/buscador', protegerRuta, buscadorEmpleado)
router.get('/administrar/empleados/modificar-empleado/:id', protegerRuta, modificarEmpleado)
router.post('/administrar/empleados/modificar-empleado/:id', protegerRuta, ingresoModificarEmpleado)
router.post('/administrar/empleados/eliminar-empleado/:id', protegerRuta, eliminarEmpleado)

router.get('/administrar/habitaciones', protegerRuta, administrarHabitaciones)
router.get('/administrar/habitaciones/buscador', protegerRuta, buscadorHabitacion)
router.post('/administrar/habitaciones/buscador', protegerRuta, buscadorHabitacion)
router.get('/administrar/habitaciones/modificar-habitacion/:id', protegerRuta, modificarHabitacion)
router.post('/administrar/habitaciones/modificar-habitacion/:id', protegerRuta, ingresoModificarHabitacion)

router.get('/administrar/menus', protegerRuta, administrarMenu)
router.get('/administrar/menus/crear-menu', protegerRuta, crearMenu)
router.post('/administrar/menus/crear-menu', protegerRuta, upload.single('imagen'), ingresoCrearMenu)

router.get('/administrar/menus/buscador', protegerRuta, buscadorMenu)
router.post('/administrar/menus/buscador', protegerRuta, buscadorMenu)

router.get('/administrar/menus/modificar-menu/:id', protegerRuta, modificarMenu)
router.post('/administrar/menus/modificar-menu/:id', protegerRuta, upload.single('imagen'), ingresoModificarMenu)
router.post('/administrar/menus/alterar-menu/:id', protegerRuta, alterarMenu)
router.post('/administrar/menus/eliminar-menu/:id', protegerRuta, eliminarMenu)

router.get('/administrar/mensajes', protegerRuta, administrarMensajes)
router.get('/administrar/mensajes/respuesta-mensaje/:id', protegerRuta, respuestaMensaje)
router.post('/administrar/mensajes/respuesta-mensaje/:id', protegerRuta, ingresoRespuestaMensaje)
router.get('/administrar/mensajes/buscador', protegerRuta, buscadorMensaje)
router.post('/administrar/mensajes/buscador', protegerRuta, buscadorMensaje)
router.get('/administrar/mensajes/:id', protegerRuta, verMensaje)
router.post('/administrar/mensajes/:id', protegerRuta, cerrarMensaje)

export default router