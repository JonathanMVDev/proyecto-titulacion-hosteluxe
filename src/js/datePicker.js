import flatpickr from "flatpickr"
import { Spanish } from "flatpickr/dist/l10n/es.js"

flatpickr.localize(Spanish)

document.addEventListener("DOMContentLoaded", function() {
    flatpickr('#fecha', {
        minDate: "today",  // Fecha minima
        maxDate: new Date().fp_incr(120), // Selecciona 120 dias de hoy en adelante
        dateFormat: "d \\de F \\de\\l Y",  // Formato de la fecha
        mode: "range", // Modo Rango de fechas
        onChange: fechas => {
            if (fechas.length === 2) {
                const fechaIni = fechas[0]; 
                const fechaTer = fechas[1];   

                // Primera fecha
                const anio = fechaIni.getFullYear()
                const mes = String(fechaIni.getMonth() + 1).padStart(2, '0')
                const dia = String(fechaIni.getDate()).padStart(2, '0')
                const fechaInicio = `${anio}-${mes}-${dia}`
                
                // Segunda fecha
                const anioTer = fechaTer.getFullYear()
                const mesTer = String(fechaTer.getMonth() + 1).padStart(2, '0')
                const diaTer = String(fechaTer.getDate()).padStart(2, '0')
                const fechaTermino = `${anioTer}-${mesTer}-${diaTer}`
                
                // Editar el valor de los input del HTML
                document.querySelector('#fechaInicio').value = fechaInicio
                document.querySelector('#fechaTermino').value = fechaTermino
            }
        }
    })
})