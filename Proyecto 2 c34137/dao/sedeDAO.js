class SedeDAO {
    constructor() {
        this.arregloSedes = [];
    }

    consultar() {
        return this.arregloSedes;
    }

    consultarPorId(id) {
        return this.arregloSedes.find(sede => sede.id === id);
    }

    insertar(sede) {
        this.arregloSedes.push(sede);
    }

    actualizar(id, sede) {
        const index = this.arregloSedes.findIndex(s => s.id === id);
        if (index !== -1) {
            this.arregloSedes[index] = sede;
        }
    }

    eliminar(id) {
        this.arregloSedes = this.arregloSedes.filter(sede => sede.id !== id);
    }
}

export default SedeDAO;
