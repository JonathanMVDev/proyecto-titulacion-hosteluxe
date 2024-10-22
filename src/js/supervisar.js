document.querySelector('#supervisar').addEventListener('change', function() {
    const url = document.querySelector('#supervisar').value;
    if(url != "") {
        window.location.replace(`/${url}`);
    }
})

