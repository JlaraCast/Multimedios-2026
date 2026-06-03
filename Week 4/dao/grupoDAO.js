class GrupoDAO {
    constructor() {
        this.arregloGrupos = [];
    }

    consultar() {
        return this.arregloGrupos;
    }

    consultarPorId(id) {
        return this.arregloGrupos.find((grupo) => id === grupo.id);
    }

    insertar(objetoGrupo) {
        this.arregloGrupos.push(objetoGrupo);
        return true;
    }

    actualizar(id, objetoGrupo) {
        let elementoGrupo = this.consultarPorId(id);
        if (elementoGrupo) {
            elementoGrupo.nombre = objetoGrupo.nombre;
            return true;
        }
        return false;
    }

    eliminar(id) {
        let elementoGrupo = this.consultarPorId(id);
        if (elementoGrupo) {
            this.arregloGrupos = this.arregloGrupos.filter((grupo) => id !== grupo.id);
            return true;
        }
        return false;
    }
}

export default GrupoDAO;
