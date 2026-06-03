class ProfesorDAO {
    constructor() {
        this.arregloProfesores = [];
    }

    consultar() {
        return this.arregloProfesores;
    }

    consultarPorId(id) {
        return this.arregloProfesores.find((profesor) => id === profesor.id);
    }

    insertar(objetoProfesor) {
        this.arregloProfesores.push(objetoProfesor);
        return true;
    }

    actualizar(id, objetoProfesor) {
        let elementoProfesor = this.consultarPorId(id);
        if (elementoProfesor) {
            elementoProfesor.nombre = objetoProfesor.nombre;
            elementoProfesor.apellidopaterno = objetoProfesor.apellidopaterno;
            elementoProfesor.apellidomaterno = objetoProfesor.apellidomaterno;
            elementoProfesor.cedula = objetoProfesor.cedula;
            elementoProfesor.correoelectronico = objetoProfesor.correoelectronico;
            elementoProfesor.telefono = objetoProfesor.telefono;
            elementoProfesor.usuario = objetoProfesor.usuario;
            return true;
        }
        return false;
    }

    eliminar(id) {
        let elementoProfesor = this.consultarPorId(id);
        if (elementoProfesor) {
            this.arregloProfesores = this.arregloProfesores.filter((profesor) => id !== profesor.id);
            return true;
        }
        return false;
    }
}

export default ProfesorDAO;
