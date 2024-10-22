// Fecha
const fecha = new Date()

const dia = fecha.getDate().toString().padStart(2, '0')
const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
const año = fecha.getFullYear()
const fechaCreacion = `${año}-${mes}-${dia}`

const mensaje = [
    {
        motivo: 'queja',
        asunto: 'Problema con la habitación',
        descripcion: 'La calefacción de la habitación no funciona correctamente. Solicito una solución inmediata.',
        imagen: 'calefaccion.jpeg',
        email: 'cliente1@example.com',
        fechaCreacion: fechaCreacion
    },
    {
        motivo: 'consulta',
        asunto: 'Disponibilidad de habitaciones',
        descripcion: '¿Tienen habitaciones VIP disponibles para el próximo fin de semana?',
        imagen: '',
        email: 'cliente2@example.com',
        fechaCreacion: fechaCreacion
    },
    {
        motivo: 'sugerencia',
        asunto: 'Mejora en el servicio de desayuno',
        descripcion: 'Sería genial si pudieran ofrecer opciones de desayuno sin gluten.',
        imagen: '',
        email: 'cliente3@example.com',
        fechaCreacion: fechaCreacion
    },
    {
        motivo: 'queja',
        asunto: 'Ruido durante la noche',
        descripcion: 'Hubo mucho ruido en el pasillo durante la noche, lo que afectó mi descanso.',
        imagen: '', 
        email: 'cliente4@example.com',
        fechaCreacion: fechaCreacion
    },
    {
        motivo: 'consulta',
        asunto: 'Servicio de transporte al aeropuerto',
        descripcion: 'Quisiera saber si ofrecen servicio de transporte al aeropuerto.',
        imagen: 'transporte.jpg',
        email: 'cliente5@example.com',
        fechaCreacion: fechaCreacion
    },
    {
        motivo: 'sugerencia',
        asunto: 'Mejora en las áreas comunes',
        descripcion: 'Podrían mejorar las áreas comunes añadiendo más plantas o decoración natural.',
        imagen: 'areacomun.jpg',
        email: 'cliente6@example.com',
        fechaCreacion: fechaCreacion
    }
]

export default mensaje