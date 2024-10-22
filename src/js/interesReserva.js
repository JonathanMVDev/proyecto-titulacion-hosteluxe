document.querySelector('#experiencia').addEventListener('change', async function() {
    const experienciaId = this.value;
    const preferenciaSelect = document.querySelector('#preferencia');

    // Verifica que se haya seleccionado la Experiencia Preferida
    if(!experienciaId) {
        preferenciaSelect.disabled = true;
        preferenciaSelect.innerHTML = '<option value="">Seleccione Preferencia</option>';
    }

    // Habilita el boton para selecciona la Preferencia
    preferenciaSelect.disabled = false;

    // Consulta y obtiene una respuesta de la API
    const response = await fetch(`/reserva/${experienciaId}/tipo-eventos`);
    const preferencias = await response.json();
    console.log(preferencias);

    // Limpias las opciones anteriores
    preferenciaSelect.innerHTML = '<option value="">Seleccione Preferencia</option>';

    // 
    preferencias.forEach(preferencia => {
        const option = document.createElement('option');
        option.value = preferencia.id;
        option.textContent = preferencia.name;
        preferenciaSelect.appendChild(option);
    })
})

document.querySelector('#preferencia').addEventListener('change', function() {
    const experienciaId = document.querySelector('#experiencia').value;
    let preferenciaId = document.querySelector('#preferencia').value;
    const interesButton = document.querySelector('#interesButton');

    if(preferenciaId == "") {
        preferenciaId = undefined;
    }

    if(!preferenciaId) {
        interesButton.classList.remove('cursor-pointer');
        interesButton.classList.add('bg-gray-400');
        interesButton.classList.add('pointer-events-none')
        interesButton.classList.remove('bg-sky-950');
        interesButton.classList.remove('hover:bg-sky-600');
        interesButton.classList.remove('duration-200');
    } else {
        interesButton.classList.add('cursor-pointer');
        interesButton.classList.remove('bg-gray-400');
        interesButton.classList.remove('pointer-events-none')
        interesButton.classList.add('bg-sky-950');
        interesButton.classList.add('hover:bg-sky-600');
        interesButton.classList.add('duration-200');
    }
})

document.querySelector('#interesButton').addEventListener('click', function() {
    const interesDiv = document.querySelector('#formInteres');
    const reservaDiv = document.querySelector('#reservaDiv');

    // Valores ingresados por el usuario
    const experienciaId = document.querySelector('#experiencia').value;
    let preferenciaId = document.querySelector('#preferencia').value;

    // Valores ocultos en el formulario de la Reserva
    const interesPrincipalInput = document.querySelector('#interesPrincipalInput');
    const PreferenciaInput = document.querySelector('#PreferenciaInput');
    interesPrincipalInput.value = experienciaId;
    PreferenciaInput.value = preferenciaId;

    interesDiv.classList.add('hidden');  
    reservaDiv.classList.remove('hidden');  
})