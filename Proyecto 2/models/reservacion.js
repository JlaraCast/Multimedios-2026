class Reservacion {
    constructor(id, fechaEntrada, fechaSalida, idCliente, idHabitacion, estado) {
        this._id = id;
        this._fechaEntrada = fechaEntrada;
        this._fechaSalida = fechaSalida;
        this._idCliente = idCliente;
        this._idHabitacion = idHabitacion;
        this._estado = estado;
    }

    get id() { return this._id; }
    set id(value) { this._id = value; }

    get fechaEntrada() { return this._fechaEntrada; }
    set fechaEntrada(value) { this._fechaEntrada = value; }

    get fechaSalida() { return this._fechaSalida; }
    set fechaSalida(value) { this._fechaSalida = value; }

    get idCliente() { return this._idCliente; }
    set idCliente(value) { this._idCliente = value; }

    get idHabitacion() { return this._idHabitacion; }
    set idHabitacion(value) { this._idHabitacion = value; }

    get estado() { return this._estado; }
    set estado(value) { this._estado = value; }
}

export default Reservacion;
