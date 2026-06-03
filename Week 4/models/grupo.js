class Grupo {
    constructor(id, nombre) {
        this._id = id;
        this._nombre = nombre;
    }

    get id() {
        return this._id;
    }

    get nombre() {
        return this._nombre;
    }

    set id(id) {
        this._id = id;
    }

    set nombre(nombre) {
        this._nombre = nombre;
    }
}

export default Grupo;
