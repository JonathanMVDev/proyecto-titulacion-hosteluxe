async function subcategoria() {

    const subcategorias = [
        // Entradas (Aperitivos)
        { name: 'Ensaladas', categoriaId: 1 },
        { name: 'Sopas', categoriaId: 1 },
        { name: 'Tapas', categoriaId: 1 },
        { name: 'Antipastos', categoriaId: 1 },

        // Platos principales
        { name: 'Carnes (res, pollo, cerdo)', categoriaId: 2 },
        { name: 'Pescados y mariscos', categoriaId: 2 },
        { name: 'Pastas', categoriaId: 2 },
        { name: 'Arroces', categoriaId: 2 },
        { name: 'Vegetarianos/Veganos', categoriaId: 2 },

        // Acompañamientos
        { name: 'Papas (fritas, asadas, puré)', categoriaId: 3 },
        { name: 'Verduras asadas', categoriaId: 3 },
        { name: 'Arroz', categoriaId: 3 },
        { name: 'Panes', categoriaId: 3 },

        // Postres
        { name: 'Pasteles', categoriaId: 4 },
        { name: 'Tartas', categoriaId: 4 },
        { name: 'Helados', categoriaId: 4 },
        { name: 'Frutas', categoriaId: 4 },

        // Bebidas alcohólicas
        { name: 'Vinos (tintos, blancos, rosados)', categoriaId: 5 },
        { name: 'Cervezas (artesanales, comerciales)', categoriaId: 5 },
        { name: 'Licores (vodka, whisky, ron)', categoriaId: 5 },
        { name: 'Cócteles (mojito, margarita, piña colada)', categoriaId: 5 },

        // Bebidas sin alcohol
        { name: 'Refrescos', categoriaId: 6 },
        { name: 'Jugos naturales', categoriaId: 6 },
        { name: 'Agua (con gas, sin gas)', categoriaId: 6 },
        { name: 'Batidos', categoriaId: 6 },

        // Bebidas calientes
        { name: 'Café (espresso, cappuccino, etc)', categoriaId: 7 },
        { name: 'Té (verde, negro, herbal)', categoriaId: 7 },
        { name: 'Chocolate caliente', categoriaId: 7 },
    ]
    
    return subcategorias
}

export default subcategoria