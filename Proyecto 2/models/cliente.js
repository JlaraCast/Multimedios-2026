class Cliente {
    constructor(id, nombre, apellido, cedula, email, telefono) {
        this._id = id;
        this._nombre = nombre;
        this._apellido = apellido;
        this._cedula = cedula;
        this._email = email;
        this._telefono = telefono;
    }

    get id() { return this._id; }
    set id(value) { this._id = value; }

    get nombre() { return this._nombre; }
    set nombre(value) { this._nombre = value; }

    get apellido() { return this._apellido; }
    set apellido(value) { this._apellido = value; }

    get cedula() { return this._cedula; }
    set cedula(value) { this._cedula = value; }

    get email() { return this._email; }
    set email(value) { this._email = value; }

    get telefono() { return this._telefono; }
    set telefono(value) { this._telefono = value; }
}

export default Cliente;
