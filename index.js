import express from 'express'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'
import usuarioRoutes from './routes/usuarioRoutes.js'
import reservaRoutes from './routes/reservaRoutes.js'
import navegacionRoutes from './routes/navegacionRoutes.js'
import perfilRoutes from './routes/perfilRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import pedidoRoutes from './routes/pedidoRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import empleadoRoutes from './routes/empleadoRoutes.js'
import db from './config/db.js'

const app = express()

// Habilitamos PUG
app.set('view engine', 'pug')
app.set('views', './views')

// Habilitamos la léctura de formularios
app.use( express.urlencoded({extended: true}))

// Habilitamos CSRF para los formularios con Cookie-Parser y CSurf
app.use(cookieParser())
app.use(csurf({ cookie: true }))

// Conexión a la base de datos
try {
    db.authenticate()
    db.sync()
    console.log('Se establecio la conexion a la db')
} catch (error) {
    console.log(error)
}

// Carpeta publica
app.use( express.static('public'))

// Routing
app.use('/auth', usuarioRoutes)
app.use('/', reservaRoutes)
app.use('/', navegacionRoutes)
app.use('/', perfilRoutes)
app.use('/', adminRoutes)
app.use('/', pedidoRoutes)
app.use('/', apiRoutes)
app.use('/', empleadoRoutes)

// Creamos el puerto y la conexión local
const port = 3000 
app.listen(port, () => {
    `El servidor se esta ejecutando en el puerto ${port}`
})