import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').content

Dropzone.options.SubirImagen = {
    url: '/contactanos',
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
        var myDropzone = this;

            // Evento de envío del formulario
            document.getElementById('Idform').addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const motivo = document.getElementById('motivo').value = document.getElementById('motivo').value.trim();
                const asunto = document.getElementById('asunto').value = document.getElementById('asunto').value.trim();
                const descripcion = document.getElementById('descripcion').value = document.getElementById('descripcion').value.trim();
                const email = document.getElementById('email').value = document.getElementById('email').value.trim();

                if(motivo == "" || asunto == "" || descripcion == "" || email == "") {
                    return document.getElementById('Idform').submit()
                }

                // Verifica si hay archivos en la cola
                if (myDropzone.getQueuedFiles().length > 0) {
                    // Agrega los datos del formulario a la solicitud de Dropzone
                    myDropzone.on('sending', function(file, xhr, formData) {
                        // Obtén todos los campos del formulario
                        var formElements = document.querySelectorAll('#Idform input, #Idform select, #Idform textarea');
                        
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
                    document.getElementById('Idform').submit()
                }
            });

            // Evento de finalización de la cola de subida
            myDropzone.on('queuecomplete', function() {
                return window.location.href = '/mensaje-confirmado'
            });

            // Manejo de errores durante la subida
            myDropzone.on('error', function(file, errorMessage) {
                console.error('Error durante la subida:', errorMessage);
            });
    }
}