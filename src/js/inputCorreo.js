const Nombre = document.getElementById('name')
const Paterno = document.getElementById('paterno')
const Materno = document.getElementById('materno')
const Password = document.getElementById('password')

const Email = document.getElementById('emailEmpleado')

function limpiarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('ñ', 'n').replace('Ñ', 'N')
}

function actualizarInputs() {
    const nombre = limpiarTexto(Nombre.value.trim().toLowerCase())
    const paterno = limpiarTexto(Paterno.value.trim().toLowerCase())
    const materno = limpiarTexto(Materno.value.trim().toLowerCase())

    if (nombre && paterno && materno) {
        Email.value = `${nombre.substring(0, 2)}.${paterno}${materno.charAt(0)}@servicioHosteluxe.cl`
    } else {
        Email.value = ''
    }

    if (nombre && paterno) {
        Password.value = `${nombre}.${paterno.substring(0, 2)}`
    }
}

Nombre.addEventListener('input', actualizarInputs)
Paterno.addEventListener('input', actualizarInputs)
Materno.addEventListener('input', actualizarInputs)