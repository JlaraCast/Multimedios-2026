class Sede {
    constructor(id, nombre, ciudad, telefono, idHotel) {
        this._id = id;
        this._nombre = nombre;
        this._ciudad = ciudad;
        this._telefono = telefono;
        this._idHotel = idHotel;
    }

    get id() { return this._id; }
    set id(value) { this._id = value; }

    get nombre() { return this._nombre; }
    set nombre(value) { this._nombre = value; }

    get ciudad() { return this._ciudad; }
    set ciudad(value) { this._ciudad = value; }

    get telefono() { return this._telefono; }
    set telefono(value) { this._telefono = value; }

    get idHotel() { return this._idHotel; }
    set idHotel(value) { this._idHotel = value; }
}

export default Sede;
