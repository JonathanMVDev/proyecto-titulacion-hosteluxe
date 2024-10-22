import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').content

Dropzone.options.SubirMenu = {
    url: '/administrar/menus/crear-menu',
    dictDefaultMessage: 'Sube tu imagen aquí',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Remover Archivo',
    dictMaxFilesExceeded: 'Máximo un archivo',
    uploadMultiple: false,
    paramName: 'imagen',
    headers: {
        'CSRF-Token': token
    },
    init: function () {
        var myDropzone = this

            // Evento de envío del formulario
            document.getElementById('menuForm').addEventListener('submit', function(e) {
                e.preventDefault()
                e.stopPropagation()

                const categoria = document.getElementById('categoria').value.trim()
                const subcategoria = document.getElementById('subcategoria').value.trim()
                const name = document.getElementById('name').value.trim()
                const descripcion = document.getElementById('descripcion').value.trim()
                const precio = document.getElementById('precio').value.trim()
                const estado = document.getElementById('estado').value.trim()

                if(categoria == "" || subcategoria == "" || name == "" || descripcion == "" || precio == "" || estado == "") {
                    return document.getElementById('menuForm').submit()
                }

                // Verifica si hay archivos en la cola
                if (myDropzone.getQueuedFiles().length > 0) {
                    // Procesa la cola de archivos (subir imagen)
                    myDropzone.processQueue()
                }})
                
                // Agrega los datos del formulario a la solicitud de Dropzone
                myDropzone.on('sending', function (file, xhr, formData) {
                var formElements = document.querySelectorAll('#menuForm input, #menuForm select, #menuForm textarea')
                
                // Agregar todos los campos del formulario a los datos de la imagen
                formElements.forEach(function (element) {
                    if (element.name) {
                        formData.append(element.name, element.value)
                    } else {
                        console.warn('Campo sin nombre:', element)
                    }
                })
            })

            // Evento de finalización de la cola de subida
            myDropzone.on('queuecomplete', function() {
                return window.location.href = '/administrar/menus'
            })

            // Manejo de errores durante la subida
            myDropzone.on('error', function(file, errorMessage) {
                console.error('Error durante la subida:', errorMessage)
            })
    }
}