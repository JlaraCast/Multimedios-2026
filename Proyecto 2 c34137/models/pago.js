class Pago {
    constructor(id, monto, fecha, metodo, estado, idReservacion) {
        this._id = id;
        this._monto = monto;
        this._fecha = fecha;
        this._metodo = metodo;
        this._estado = estado;
        this._idReservacion = idReservacion;
    }

    get id() { return this._id; }
    set id(value) { this._id = value; }

    get monto() { return this._monto; }
    set monto(value) { this._monto = value; }

    get fecha() { return this._fecha; }
    set fecha(value) { this._fecha = value; }

    get metodo() { return this._metodo; }
    set metodo(value) { this._metodo = value; }

    get estado() { return this._estado; }
    set estado(value) { this._estado = value; }

    get idReservacion() { return this._idReservacion; }
    set idReservacion(value) { this._idReservacion = value; }
}

export default Pago;
