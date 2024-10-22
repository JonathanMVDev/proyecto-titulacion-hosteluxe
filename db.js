import Usuario from './models/Usuario.js'
import Habitacion from './models/Habitacion.js'
import Reserva from './models/Reserva.js'
import Tipo from './models/Tipo.js'
import Mensaje from './models/Mensaje.js'
import Menu from './models/Menu.js'
import Cuenta from './models/Cuenta.js'
import SubCategoria from './models/SubCategoria.js'
import Categoria from './models/Categoria.js'
import Respuesta from './models/Respuesta.js'
import Pedido from './models/Pedido.js'
import detalleCompra from './models/detalleCompra.js'
import Compra from './models/Compra.js'
import Experiencia from './models/Experiencia.js'
import TipoEvento from './models/TipoEvento.js'
import Evento from './models/evento.js'

// Modelo de Habitaciones
const HabitacionModel = Habitacion;
// Modelo de Reserva
const ReservaModel = Reserva;
// Modelo de Usuario
const UsuarioModel = Usuario;
// Modelo de Tipo de Habitaciones
const TipoModel = Tipo;
// Modelo de Mensajes de Contactanos
const MensajeModel= Mensaje;
// modelo de Respuestas de Mensajes
const RespuestaModel = Respuesta;
// modelo de Menu 
const MenuModel = Menu;
// modelo de Cuentas 
const CuentasModel = Cuenta;
// modelo de Categorias
const SubCategoriaModel = SubCategoria;
// modelo de Categorias
const CategoriaModel = Categoria;
// modelo de Categorias
const PedidoModel = Pedido;
// modelo del Detalle de las Compras
const DetalleCompraModel = detalleCompra;
// modelo de Compras
const CompraModel = Compra;
// modelo de Experiencias
const ExperienciaModel = Experiencia;
// modelo de Tipo de Eventos
const TipoEventoModel = TipoEvento;
// modelo de Tipo de Eventos
const EventoModel = Evento;

UsuarioModel.belongsTo(CuentasModel, { foreignKey: 'cuentaId' })

HabitacionModel.belongsTo(TipoModel, { foreignKey: 'tipoId' })

ReservaModel.belongsTo(HabitacionModel, { foreignKey: 'habitacionId', as: 'habitacion' })
ReservaModel.belongsTo(UsuarioModel, { foreignKey: 'usuarioId' })
ReservaModel.belongsTo(EventoModel, { foreignKey: 'eventoId' })

SubCategoriaModel.belongsTo(CategoriaModel, { foreignKey: 'categoriaId' })
SubCategoriaModel.hasMany(MenuModel, { foreignKey: 'subcategoriaId' })

MenuModel.belongsTo(SubCategoriaModel, { foreignKey: 'subcategoriaId' })

RespuestaModel.belongsTo(MensajeModel, { foreignKey: 'mensajeId' })

PedidoModel.belongsTo(MenuModel, { foreignKey: 'menuId' })
PedidoModel.belongsTo(ReservaModel, { foreignKey: 'reservaId' })

DetalleCompraModel.belongsTo(CompraModel, { foreignKey: 'compraId' })

CompraModel.hasMany(DetalleCompraModel, { foreignKey: 'compraId' })
CompraModel.belongsTo(ReservaModel, { foreignKey: 'reservaId' })

TipoEventoModel.belongsTo(ExperienciaModel, { foreignKey: 'experienciaId' })

EventoModel.belongsTo(TipoEventoModel, { foreignKey: 'tipoeventoId'})

export { 
    UsuarioModel, 
    ReservaModel, 
    HabitacionModel, 
    TipoModel, 
    MensajeModel,
    MenuModel,
    CuentasModel,
    CategoriaModel,
    SubCategoriaModel,
    RespuestaModel,
    PedidoModel,
    DetalleCompraModel,
    CompraModel,
    TipoEventoModel,
    ExperienciaModel,
    EventoModel
}