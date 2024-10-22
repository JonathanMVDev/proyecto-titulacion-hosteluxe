document.getElementById('categoria').addEventListener('change', async function() {
    const categoriaId = this.value
    const subcategoriaSelect = document.getElementById('subcategoria')


    // Si no se seleccionó ninguna categoría, limpiar las subcategorías
    if (!categoriaId) {
        subcategoriaSelect.disabled = true
        subcategoriaSelect.innerHTML = '<option value="">Seleccione</option>';
        return
    }

    // Si se seleccionó una categoría, habilitar subcategoría
    subcategoriaSelect.disabled = false

    // Hacer la solicitud AJAX para obtener las subcategorías
    const response = await fetch(`/administrar/${categoriaId}/sub-categorias`)
    const subcategorias = await response.json()

    // Limpiar las opciones previas de subcategorías
    subcategoriaSelect.innerHTML = 'option(value="") Seleccione'

    // Llenar el select con las nuevas subcategorías
    subcategorias.forEach(subcategoria => {
        const option = document.createElement('option')
        option.value = subcategoria.id
        option.textContent = subcategoria.name
        subcategoriaSelect.appendChild(option)
    })
})

window.addEventListener('DOMContentLoaded', async () => {
    const categoriaId = document.getElementById('categoriaId').value
    const subcategoriaId = document.getElementById('subcategoriaId').value
    const categoriaSelect = document.getElementById('categoria')

    if (categoriaId) {
        categoriaSelect.value = categoriaId

        const event = new Event('change')
        categoriaSelect.dispatchEvent(event)

        const subcategoriaSelect = document.getElementById('subcategoria')
        if (subcategoriaId) {
            subcategoriaSelect.value = subcategoriaId
        }
    }
})