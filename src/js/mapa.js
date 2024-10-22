(function(){
    const ltn = -33.5104893
    const lng = -70.7536868
    var map = L.map('mapa', {
        center: [ltn, lng],
        zoom: 15,
        zoomControl: false,
        doubleClickZoom: false,
        dragging: false,
        zoomControl: false,
        boxZoom: false,
        scrollWheelZoom: false
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([ltn, lng]).addTo(map).bindPopup('Av. Esq. Blanca 501 - Maipú, Región Metropolitana')

})()