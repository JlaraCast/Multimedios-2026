class Estudiante {
    constructor(id, nombre, apellidopaterno, apellidomaterno, cedula, correoelectronico, telefono, usuario) {
        this._id = id;
        this._nombre = nombre;
        this._apellidopaterno = apellidopaterno;
        this._apellidomaterno = apellidomaterno;
        this._cedula = cedula;
        this._correoelectronico = correoelectronico;
        this._telefono = telefono;
        this._usuario = usuario;
    }

    get id() { return this._id; }
    get nombre() { return this._nombre; }
    get apellidopaterno() { return this._apellidopaterno; }
    get apellidomaterno() { return this._apellidomaterno; }
    get cedula() { return this._cedula; }
    get correoelectronico() { return this._correoelectronico; }
    get telefono() { return this._telefono; }
    get usuario() { return this._usuario; }

    set id(id) { this._id = id; }
    set nombre(nombre) { this._nombre = nombre; }
    set apellidopaterno(apellidopaterno) { this._apellidopaterno = apellidopaterno; }
    set apellidomaterno(apellidomaterno) { this._apellidomaterno = apellidomaterno; }
    set cedula(cedula) { this._cedula = cedula; }
    set correoelectronico(correoelectronico) { this._correoelectronico = correoelectronico; }
    set telefono(telefono) { this._telefono = telefono; }
    set usuario(usuario) { this._usuario = usuario; }
}

export default Estudiante;
