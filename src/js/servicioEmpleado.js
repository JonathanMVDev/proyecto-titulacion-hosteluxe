document.querySelector('#pedidos').addEventListener('click', function() {
    // Selectores Div
    const pedidosDiv = document.querySelector('#pedidosDiv');
    const mantencionDiv = document.querySelector('#mantencionDiv');
    const eventosDiv = document.querySelector('#eventosDiv');
    // Selectores Button
    const pedidosButton = document.querySelector('#pedidos');
    const mantencionButton = document.querySelector('#mantencion');
    const eventosButton = document.querySelector('#eventos');

    // Manipulacion de Buttons
    pedidosButton.classList.remove('bg-sky-900');
    pedidosButton.classList.add('bg-gray-400');
    pedidosButton.classList.add('pointer-events-none');

    mantencionButton.classList.remove('bg-gray-400');
    mantencionButton.classList.add('bg-sky-900');
    mantencionButton.classList.remove('pointer-events-none');
    eventosButton.classList.remove('bg-gray-400');
    eventosButton.classList.add('bg-sky-900');
    eventosButton.classList.remove('pointer-events-none');

    // Manipulacion de Divs
    mantencionDiv.classList.add('hidden');
    eventosDiv.classList.add('hidden');
    pedidosDiv.classList.remove('hidden');
})

document.querySelector('#mantencion').addEventListener('click', function() {
    // Selectores
    const mantencionDiv = document.querySelector('#mantencionDiv');
    const pedidosDiv = document.querySelector('#pedidosDiv');
    const eventosDiv = document.querySelector('#eventosDiv');
    // Selectores Button
    const pedidosButton = document.querySelector('#pedidos');
    const mantencionButton = document.querySelector('#mantencion');
    const eventosButton = document.querySelector('#eventos');

    // Manipulacion de Buttons
    mantencionButton.classList.remove('bg-sky-900');
    mantencionButton.classList.add('bg-gray-400');
    mantencionButton.classList.add('pointer-events-none');

    pedidosButton.classList.remove('bg-gray-400');
    pedidosButton.classList.remove('pointer-events-none');
    pedidosButton.classList.add('bg-sky-900');
    eventosButton.classList.remove('bg-gray-400');
    eventosButton.classList.remove('pointer-events-none');
    eventosButton.classList.add('bg-sky-900');

    // Manipulacion de Divs
    eventosDiv.classList.add('hidden');
    pedidosDiv.classList.add('hidden');
    mantencionDiv.classList.remove('hidden');
})

document.querySelector('#eventos').addEventListener('click', function() {
    // Selectores
    const pedidosDiv = document.querySelector('#pedidosDiv');
    const mantencionDiv = document.querySelector('#mantencionDiv');
    const eventosDiv = document.querySelector('#eventosDiv');
    // Selectores Button
    const pedidosButton = document.querySelector('#pedidos');
    const mantencionButton = document.querySelector('#mantencion');
    const eventosButton = document.querySelector('#eventos');

    // Manipulacion de Buttons
    eventosButton.classList.remove('bg-sky-900');
    eventosButton.classList.add('bg-gray-400');
    eventosButton.classList.add('pointer-events-none');
    
    mantencionButton.classList.remove('bg-gray-400');
    mantencionButton.classList.remove('pointer-events-none');
    mantencionButton.classList.add('bg-sky-900');
    pedidosButton.classList.remove('bg-gray-400');
    pedidosButton.classList.remove('pointer-events-none');
    pedidosButton.classList.add('bg-sky-900');

    // Manipulacion de Divs
    mantencionDiv.classList.add('hidden');
    pedidosDiv.classList.add('hidden');
    eventosDiv.classList.remove('hidden');
})