import path from 'path'

export default {
    mode: 'development',
    entry: {
        datePicker:'./src/js/datePicker.js',
        agregarImagen:'./src/js/agregarImagen.js',
        mapa:'./src/js/mapa.js',
        inputCorreo:'./src/js/inputCorreo.js',
        agregarComida:'./src/js/agregarComida.js',
        modificarComida:'./src/js/modificarComida.js',
        editarInput:'./src/js/editarInput.js',
        buscadorMenu:'./src/js/buscadorMenu.js',
        interesReserva:'./src/js/interesReserva.js',
        servicioEmpleado:'./src/js/servicioEmpleado.js',
        supervisar:'./src/js/supervisar.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}