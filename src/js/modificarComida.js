import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').content

const menu = document.getElementById('menuId').value

Dropzone.options.SubirMenu = {
    url: `/administrar/menus/modificar-menu/${menu}`,
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
            document.getElementById('modificarComida').addEventListener('submit', function(e) {
                e.preventDefault()

                const categoria = document.getElementById('categoria').value.trim()
                const subcategoria = document.getElementById('subcategoria').value.trim()
                const name = document.getElementById('name').value.trim()
                const descripcion = document.getElementById('descripcion').value.trim()
                const precio = document.getElementById('precio').value.trim()
                const estado = document.getElementById('estado').value.trim()

                if(categoria == "" || subcategoria == "" || name == "" || descripcion == "" || precio == "" || estado == "") {
                    return document.getElementById('modificarComida').submit()
                }

                // Verifica si hay archivos en la cola
                if (myDropzone.getQueuedFiles().length > 0) {
                    // Agrega los datos del formulario a la solicitud de Dropzone
                    myDropzone.on('sending', function(file, xhr, formData) {
                        // Obtén todos los campos del formulario
                        var formElements = document.querySelectorAll('#modificarComida input, #modificarComida select, #modificarComida textarea');
                        
                        formElements.forEach(function(element) {
                            if (element.name) { // Verifica que el campo tenga un nombre
                                formData.append(element.name, element.value);
                            } else {
                                console.warn('Campo sin nombre:', element);
                            }
                        })
                    })

                    myDropzone.processQueue()
                } else {
                    // Si no hay archivos, envía el formulario normalmente
                    document.getElementById('modificarComida').submit()
                }
            })

            // Evento cuando se completa la cola de archivos
            myDropzone.on('queuecomplete', function () {
                window.location.href = '/administrar/menus'
            })

            // Manejo de errores durante la subida
            myDropzone.on('error', function(file, errorMessage) {
                console.error('Error durante la subida:', errorMessage)
            })
    }
}