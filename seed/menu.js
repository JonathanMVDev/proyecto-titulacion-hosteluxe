async function menu() {

    const menus = [
        // Categoria Entrada
        { name: 'Ensalada César', imagen: 'ensaladacesar.jpg', descripcion: 'Ensalada con lechuga, pollo y aderezo César.', precio: 5500, estado: true, subcategoriaId: 1 },
        { name: 'Ensalada Mediterránea', imagen: 'ensaladamediterranea.avif', descripcion: 'Fresca ensalada con aceitunas, queso feta y pepino.', precio: 7000, estado: true, subcategoriaId: 1 },
        { name: 'Tacos al Pastor', imagen: 'tacosalpastor.jpg', descripcion: 'Deliciosos tacos de cerdo adobado con piña.', precio: 4000, estado: true, subcategoriaId: 3 },
        { name: 'Burritos de Carne Asada', imagen: 'burritosdecarneasada.jpg', descripcion: 'Burritos rellenos de carne asada y guacamole.', precio: 5000, estado: true, subcategoriaId: 3 },
        { name: 'Hamburguesa Clásica', imagen: 'hamburguesaclasica.avif', descripcion: 'Jugosa hamburguesa con queso y vegetales frescos.', precio: 6000, estado: true, subcategoriaId: 3 },
        { name: 'Hot Dog Americano', imagen: 'hotdogamericano.jpg', descripcion: 'Clásico hot dog con salchicha, mostaza y ketchup.', precio: 3500, estado: true, subcategoriaId: 3 },
        { name: 'Pizza Margarita', imagen: 'pizzamargarita.jpg', descripcion: 'Pizza tradicional con tomate, albahaca y mozzarella.', precio: 8500, estado: true, subcategoriaId: 4 },
        { name: 'Pizza Pepperoni', imagen: 'pizzapepperoni.webp', descripcion: 'Pizza con rodajas de pepperoni y queso extra.', precio: 9000, estado: true, subcategoriaId: 4 },

        // Categoria Platos Principales
        { name: 'Pollo Asado', imagen: 'polloasado.jpg', descripcion: 'Pollo a la parrilla con hierbas y limón.', precio: 7000, estado: true, subcategoriaId: 5 },
        { name: 'Filete de Res', imagen: 'filetederes.jpg', descripcion: 'Filete de res a la parrilla con papas al horno.', precio: 9500, estado: true, subcategoriaId: 5 },
        { name: 'Salmón a la Parrilla', imagen: 'salmonalaparrilla.jpg', descripcion: 'Salmón asado con verduras a la parrilla.', precio: 9000, estado: true, subcategoriaId: 5 },
        { name: 'Costillas BBQ', imagen: 'costillasbbq.jpg', descripcion: 'Costillas de cerdo cocidas a fuego lento con salsa BBQ.', precio: 9500, estado: true, subcategoriaId: 5 },
        { name: 'Sushi Roll de Atún', imagen: 'sushirolldeatun.jpg', descripcion: 'Sushi relleno de atún fresco y aguacate.', precio: 7500, estado: true, subcategoriaId: 6 },
        { name: 'Sashimi de Salmón', imagen: 'sashimidesalmon.webp', descripcion: 'Finos cortes de salmón servidos con salsa de soya.', precio: 10000, estado: true, subcategoriaId: 6 },
        { name: 'Pasta Carbonara', imagen: 'pastacarbonara.jpg', descripcion: 'Pasta con salsa de crema, panceta y queso.', precio: 6500, estado: true, subcategoriaId: 7 },
        { name: 'Pasta Alfredo', imagen: 'pastaalfredo.jpg', descripcion: 'Pasta con salsa cremosa de queso parmesano.', precio: 7000, estado: true, subcategoriaId: 7 },
        { name: 'Paella Valenciana', imagen: 'paellavalenciana.jpg', descripcion: 'Paella tradicional con mariscos y pollo.', precio: 10000, estado: true, subcategoriaId: 8 },
        { name: 'Arroz Frito con Pollo', imagen: 'arrozfritoconpollo.jpg', descripcion: 'Arroz frito estilo oriental con trozos de pollo.', precio: 5000, estado: true, subcategoriaId: 8 },

        // Categoria Acompañamientos
        { name: 'Empanadas de Carne', imagen: 'empanadasdecarne.jpg', descripcion: 'Empanadas rellenas de carne molida y especias.', precio: 3500, estado: true, subcategoriaId: 10 },
        { name: 'Arepas de Queso', imagen: 'arepasdequeso.jpg', descripcion: 'Arepas rellenas de queso fresco.', precio: 4000, estado: true, subcategoriaId: 10 },

        // Categoria Postres
        { name: 'Tarta de Chocolate', imagen: 'tartadeChocolate.jpg', descripcion: 'Deliciosa tarta de chocolate con crema.', precio: 3500, estado: true, subcategoriaId: 15 },
        { name: 'Cheesecake de Fresa', imagen: 'cheesecakefresa.jpg', descripcion: 'Cheesecake cremoso con fresas frescas.', precio: 4000, estado: true, subcategoriaId: 15 },
        { name: 'Helado de Vainilla', imagen: 'heladodeVainilla.webp', descripcion: 'Helado cremoso de vainilla con toppings.', precio: 3000, estado: true, subcategoriaId: 16 },
        { name: 'Helado de Chocolate', imagen: 'heladodechocolate.webp', descripcion: 'Helado de chocolate con trozos de brownie.', precio: 3500, estado: true, subcategoriaId: 16 },

        // Cateogia  Bebidas Alcohólicas
        { name: "Vino Tinto Reserva", imagen: "VinoTintoReserva.jpg", descripcion: "Vino tinto reserva, con cuerpo y aroma frutal.", precio: 8500, estado: true, subcategoriaId: 18 },
        { name: "Vino Blanco Chardonnay", imagen: "VinoBlancoChardonnay.avif", descripcion: "Vino blanco de uvas Chardonnay, suave y refrescante.", precio: 7200, estado: true, subcategoriaId: 18 },
        { name: "Vino Rosado", imagen: "VinoRosado.webp", descripcion: "Vino rosado con un toque afrutado, ideal para el verano.", precio: 6500, estado: true, subcategoriaId: 18 },
        { name: "Cerveza Artesanal IPA", imagen: "CervezaArtesanalIPA.jpg", descripcion: "Cerveza artesanal estilo IPA, con sabor intenso a lúpulo.", precio: 5000, estado: true, subcategoriaId: 19 },
        { name: "Cerveza Lager Comercial", imagen: "CervezaLagerComercial.jpg", descripcion: "Cerveza lager refrescante, ideal para cualquier ocasión.", precio: 3500, estado: true, subcategoriaId: 19 },
        { name: "Vodka Premium", imagen: "VodkaPremium.webp", descripcion: "Vodka de alta calidad, ideal para cócteles o para beber solo.", precio: 9500, estado: true, subcategoriaId: 20 },
        { name: "Whisky Añejo", imagen: "WhiskyAñejo.avif", descripcion: "Whisky añejado en barricas de roble, con notas de caramelo y vainilla.", precio: 10000, estado: true, subcategoriaId: 20 },
        { name: "Ron Oscuro", imagen: "RonOscuro.jpg", descripcion: "Ron oscuro, con un sabor profundo y suave.", precio: 8200, estado: true, subcategoriaId: 20 },
        { name: "Mojito", imagen: "Mojito.webp", descripcion: "Cóctel refrescante con menta, ron y soda.", precio: 6000, estado: true, subcategoriaId: 21 },
        { name: "Margarita", imagen: "Margarita.jpg", descripcion: "Cóctel clásico de tequila, jugo de lima y triple sec.", precio: 7000, estado: true, subcategoriaId: 21 },
        { name: "Piña Colada", imagen: "PiñaColada.webp", descripcion: "Cóctel dulce y cremoso con piña, coco y ron.", precio: 6500, estado: true, subcategoriaId: 21 },

        // Categoria Bebidas sin Alcohol
        { name: "Refresco de Cola", imagen: "RefrescodeCola.jpg", descripcion: "Refresco de cola burbujeante y refrescante.", precio: 3000, estado: true, subcategoriaId: 22 },
        { name: "Refresco de Limón", imagen: "RefrescodeLimón.jpg", descripcion: "Bebida de limón con gas, refrescante y perfecta para el verano.", precio: 3200, estado: true, subcategoriaId: 22 },
        { name: 'Limonada Natural', imagen: 'limonadanatural.webp', descripcion: 'Bebida refrescante de limón recién exprimido.', precio: 2500, estado: true, subcategoriaId: 23 },
        { name: 'Jugo de Naranja', imagen: 'jugodenaranja.jpg', descripcion: 'Jugo recién exprimido de naranja.', precio: 4000, estado: true, subcategoriaId: 23 },
        { name: 'Jugo de Manzana', imagen: 'jugodemanzana.webp', descripcion: 'Jugo natural de manzana.', precio: 4000, estado: true, subcategoriaId: 23 },
        { name: 'Batido de Fresa', imagen: 'batidodefresa.webp', descripcion: 'Refrescante batido de fresa natural.', precio: 3000, estado: true, subcategoriaId: 25 },
        { name: 'Batido de Plátano', imagen: 'batidodeplatano.webp', descripcion: 'Batido cremoso de plátano y leche.', precio: 3500, estado: true, subcategoriaId: 25 },

        // Categoria Bebidas Calientes
        { name: 'Café Americano', imagen: 'cafeamericano.webp', descripcion: 'Café negro suave y aromático.', precio: 2000, estado: true, subcategoriaId: 26 },
        { name: 'Café Latte', imagen: 'cafeLatte.avif', descripcion: 'Café con leche espumosa.', precio: 3500, estado: true, subcategoriaId: 26 },
        { name: 'Té Helado', imagen: 'tehelado.jpg', descripcion: 'Té frío con limón y hielo.', precio: 3000, estado: true, subcategoriaId: 27 },
    ]

    return menus
}

export default menu