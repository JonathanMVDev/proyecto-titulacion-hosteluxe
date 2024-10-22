import { CategoriaModel, SubCategoriaModel, MenuModel, TipoEventoModel, ExperienciaModel } from "../db.js"

const api = async (req, res) => {
    const { id } = req.params

    const subcategorias = await SubCategoriaModel.findAll({
        include: [
            { model: CategoriaModel, 
                where: {
                    id
                }
             }
        ]
    })

    res.json(subcategorias)
}

const apiTipoEventos = async (req, res) => {
    const { id } = req.params

    const tipoeventos = await TipoEventoModel.findAll({
        include: [
            { model: ExperienciaModel,
                where: {
                    id
                }
             }
        ]
    })

    res.json(tipoeventos)
}

export {
    api,
    apiTipoEventos
}