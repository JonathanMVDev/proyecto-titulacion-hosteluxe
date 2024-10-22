import { check, validationResult } from 'express-validator'
import { HabitacionModel, UsuarioModel, ReservaModel, MenuModel, SubCategoriaModel, CategoriaModel, PedidoModel, CompraModel, DetalleCompraModel } from '../db.js'
import { Op } from 'sequelize'

const solicitar = async (req,res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario

    let paginaActual = parseInt(req.query.pagina)
    
    let categoria = parseInt(req.query.categoria)

    const expresion = /^[1-9]$/
    const expresionCategoria = /^[1-7]$/

    if(!expresion.test(paginaActual) || !expresionCategoria.test(categoria)) {
        if(!expresionCategoria.test(categoria)) {
            return res.redirect(`/solicitar?categoria=1&pagina=1`)
        }
        else {
            return res.redirect(`/solicitar?categoria=${categoria}&pagina=1`)
        }
    }

    try {
        // Limites y Offset para el paginador
        const limit = 10
        const offset = ((paginaActual*limit) - limit)
        const [usuarioSolicitar, menus, total ] = await Promise.all([
            
            // Llamado de funcion para ver si tiene reserva activa
            Solicitar(usuario),
            MenuModel.findAll({
                limit, 
                offset,
                where: {
                    estado: 1
                },
                include: [
                    { model: SubCategoriaModel, 
                        order: [
                            [ 'id', 'DESC' ]
                        ],
                        where: {
                            categoriaId: categoria
                        },
                        include: [
                            { model: CategoriaModel }
                        ]
                     }
                ]
            }),
            MenuModel.count({
                where: {
                    estado: 1
                },
                include: [
                    { model: SubCategoriaModel, 
                        where: {
                            categoriaId: categoria
                        }
                     }
                ]
            })
        ])

        if(!usuarioSolicitar) {
            return res.redirect('/')
        }

        if(!menus.length) {
            return res.render('pedido/solicitar',{
                menu: 'No se ha encontrado',
                pagina: '¿Te gustaría solicitar algo?',
                autenticado: true,
                cuentaId,
                csrfToken: req.csrfToken(),
                usuarioSolicitar,
            })
        }

        for (var i = menus.length-1 ; i < menus.length; i++) {
            const menu = menus[i].dataValues.subcategoria.categoria.dataValues.name
            if(!usuarioSolicitar) {
                return res.render('/')
            }
    
            return res.render('pedido/solicitar',{
                menu,
                pagina: '¿Quieres solicitar algo?',
                autenticado: true,
                cuentaId,
                total,
                offset,
                categoria,
                limit,
                paginas: Math.ceil(total / limit),
                paginaActual: Number(paginaActual),
                usuarioSolicitar,
                csrfToken: req.csrfToken(),
                menus
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const ingresarSolicitar = async (req, res) => {
    await check('cantidad').notEmpty().run(req)

    const resultado = validationResult(req)

    if(!resultado.isEmpty()) {
        return res.redirect('back')
    }

    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    
    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    if(!usuarioSolicitar) {
        return res.redirect('/')
    }

    const { cantidad } = req.body
    const { id: reservaId } = usuarioSolicitar
    const { id: menuId } = req.params

    try {
        const menu = await MenuModel.findByPk(menuId)

        if(!menu) {
            return res.redirect('/solicitar')
        }

        const pedidoExistente = await PedidoModel.findOne({
            where: {
                menuId,
                reservaId
            }
        })

        if (pedidoExistente) {
            pedidoExistente.cantidad = Number(pedidoExistente.cantidad) + Number(cantidad)
            pedidoExistente.save()
        }

        else {
            await PedidoModel.create({
                reservaId,
                menuId,
                cantidad
            })
        }

        return res.redirect(`back`)
    } catch (error) {
        console.log(error)
    }
}

const carro = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    const { cuentaId } = usuario
    
    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    if(!usuarioSolicitar) {
        return res.redirect('/')
    }

    const { id: reservaId } = usuarioSolicitar

    try {
        const [pedidos] = await Promise.all([
            PedidoModel.findAll({
                where: {
                    reservaId
                },
                include: [
                    { model: MenuModel, 
                        include: [
                            { model: SubCategoriaModel,
                                include: [
                                    { model: CategoriaModel }
                                ]
                             }
                        ]
                     }
                ]
            })
        ])

        let precioTotal = 0

        for (var i = 0; i < pedidos.length; i++) {
            let precio = Number(pedidos[i].cantidad)*Number(pedidos[i].menu.precio)  
            precioTotal = precioTotal + precio
        }

        res.render('pedido/carro', {
            pagina: '¿Te gustaría solicitar algo?',
            menu: 'Tu Carrito',
            pedidos,
            carrito: true, 
            usuarioSolicitar,
            cuentaId,
            autenticado: true,
            precioTotal,
            csrfToken: req.csrfToken()
        })
    } catch (error) {
        console.log(error)
    }
}

const modificarCarro = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    
    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    if(!usuarioSolicitar) {
        return res.redirect('/')
    }
    
    await check('cantidad').notEmpty().run(req)

    const resultado = validationResult(req)

    if(!resultado.isEmpty()) {
        return res.redirect('/solicitar/carro')
    }

    const { id: idPedido } = req.params

    const pedido = await PedidoModel.findByPk(idPedido, {
        include: [
            { model: ReservaModel }
        ]
    })

    // Validacion que verifica que exista el pedido
    if(!pedido) {
        return res.redirect('/solicitar/carro')
    }

    // Validacion que el pedido corresponga al usuario
    if(id != pedido.reserva.usuarioId) {
        return res.redirect('/solicitar/carro')
    }

    const { cantidad } = req.body

    // Modifica el pedido
    const pedidoModificado = pedido.set({
        cantidad
    })
    await pedidoModificado.save()

    return res.redirect('/solicitar/carro')    
}

const eliminarCarro = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    
    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    if(!usuarioSolicitar) {
        return res.redirect('/')
    }
    
    const { id: idPedido } = req.params

    const pedido = await PedidoModel.findByPk(idPedido, {
        include: [
            { model: ReservaModel}
        ]
    })

    // Validacion que verifica que exista el pedido
    if(!pedido) {
        return res.redirect('/solicitar/carro')
    }

    // Validacion que el pedido corresponga al usuario
    if(id != pedido.reserva.usuarioId) {
        return res.redirect('/solicitar/carro')
    }

    // Elimina el pedido
    await pedido.destroy()

    return res.redirect('/solicitar/carro')    
}

const IngresarCompra = async (req, res) => {
    const { id } = req.usuario
    const usuario = await UsuarioModel.findByPk(id)
    
    // Llamado de funcion para ver si tiene reserva activa
    const usuarioSolicitar = await Solicitar(usuario)

    if(!usuarioSolicitar) {
        return res.redirect('/')
    }

    const { id: reservaId } = usuarioSolicitar

    const pedidos = await PedidoModel.findAll({
        where: {
            reservaId
        },
        include: [
            { model: MenuModel },
            { model: ReservaModel }
        ]
    })

    if(!pedidos) {
        return res.redirect('/solicitar/carro')
    }

    try {
        let precioTotal = 0
        let cantidadPlatos = 0
        for (var i = 0; i < pedidos.length; i++) {
            cantidadPlatos = cantidadPlatos + 1
            let precio = Number(pedidos[i].cantidad)*Number(pedidos[i].menu.precio)  
            precioTotal = precioTotal + precio
        }

        const compra = await CompraModel.create({
            total: precioTotal,
            estado: 1,
            cantidadPlatos,
            reservaId
        })
        compra.save()

        for(var i = 0; i < pedidos.length; i++) {
            let { cantidad } = pedidos[i]
            let { name, precio: precioUnitario } = pedidos[i].menu
            let subTotal = precioUnitario * pedidos[i].cantidad

            let DetalleCompra = await DetalleCompraModel.create({
                name,
                cantidad,
                precioUnitario,
                subTotal,
                compraId: compra.id
            })
            await DetalleCompra.save()
            await pedidos[i].destroy()
        }

        return res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

// Verifica si el usuario tiene una reserva "En Curso"
const Solicitar = async usuario => {
    const { id: usuarioId } = usuario
    const fechaActual = new Date()
    const dia = fechaActual.getDate().toString().padStart(2, '0')
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0')
    const año = fechaActual.getFullYear()
    const fecha = `${año}-${mes}-${dia}`
    const usuarioSolicitar = await ReservaModel.findOne({
        where: {
            usuarioId,
            recepcionado: 1,
            [Op.and]:{
                fechaInicio: {
                    [Op.lte]: fecha
                },
                fechaFin: {
                    [Op.gte]: fecha
                }
            }
        }
    })
    return usuarioSolicitar
}

export {
    solicitar,
    ingresarSolicitar,
    carro,
    modificarCarro,
    eliminarCarro,
    IngresarCompra,
    Solicitar,
}