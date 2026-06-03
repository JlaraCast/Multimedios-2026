class ProvinciaDAO {
    constructor() {
        this.arregloProvincias = [];
    }

    consultar() {
        return this.arregloProvincias;
    }

    consultarPorId(id) {
        return this.arregloProvincias.find((provincia) => id === provincia.id);
    }

    insertar(objetoProvincia) {
        this.arregloProvincias.push(objetoProvincia);
        return true;
    }

    actualizar(id, objetoProvincia) {
        let elementoProvincia = this.consultarPorId(id);
        if (elementoProvincia) {
            elementoProvincia.nombre = objetoProvincia.nombre;
            return true;
        }
        return false;
    }

    eliminar(id) {
        let elementoProvincia = this.consultarPorId(id);
        if (elementoProvincia) {
            this.arregloProvincias = this.arregloProvincias.filter((provincia) => id !== provincia.id);
            return true;
        }
        return false;
    }
}

export default ProvinciaDAO;
