class Habitacion {
    constructor(id, numero, tipo, precio, estado, idSede) {
        this._id = id;
        this._numero = numero;
        this._tipo = tipo;
        this._precio = precio;
        this._estado = estado;
        this._idSede = idSede;
    }

    get id() { return this._id; }
    set id(value) { this._id = value; }

    get numero() { return this._numero; }
    set numero(value) { this._numero = value; }

    get tipo() { return this._tipo; }
    set tipo(value) { this._tipo = value; }

    get precio() { return this._precio; }
    set precio(value) { this._precio = value; }

    get estado() { return this._estado; }
    set estado(value) { this._estado = value; }

    get idSede() { return this._idSede; }
    set idSede(value) { this._idSede = value; }
}

export default Habitacion;
