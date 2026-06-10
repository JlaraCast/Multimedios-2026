class Hotel {
    constructor(id, nombre, direccion, telefono, email) {
        this._id = id;
        this._nombre = nombre;
        this._direccion = direccion;
        this._telefono = telefono;
        this._email = email;
    }

    get id() { return this._id; }
    set id(value) { this._id = value; }

    get nombre() { return this._nombre; }
    set nombre(value) { this._nombre = value; }

    get direccion() { return this._direccion; }
    set direccion(value) { this._direccion = value; }

    get telefono() { return this._telefono; }
    set telefono(value) { this._telefono = value; }

    get email() { return this._email; }
    set email(value) { this._email = value; }
}

export default Hotel;
