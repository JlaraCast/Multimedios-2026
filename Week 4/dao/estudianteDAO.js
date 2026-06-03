class EstudianteDAO {
    constructor() {
        this.arregloEstudiantes = [];
    }

    consultar() {
        return this.arregloEstudiantes;
    }

    consultarPorId(id) {
        return this.arregloEstudiantes.find((estudiante) => id === estudiante.id);
    }

    insertar(objetoEstudiante) {
        this.arregloEstudiantes.push(objetoEstudiante);
        return true;
    }

    actualizar(id, objetoEstudiante) {
        let elementoEstudiante = this.consultarPorId(id);
        if (elementoEstudiante) {
            elementoEstudiante.nombre = objetoEstudiante.nombre;
            elementoEstudiante.apellidopaterno = objetoEstudiante.apellidopaterno;
            elementoEstudiante.apellidomaterno = objetoEstudiante.apellidomaterno;
            elementoEstudiante.cedula = objetoEstudiante.cedula;
            elementoEstudiante.correoelectronico = objetoEstudiante.correoelectronico;
            elementoEstudiante.telefono = objetoEstudiante.telefono;
            elementoEstudiante.usuario = objetoEstudiante.usuario;
            return true;
        }
        return false;
    }

    eliminar(id) {
        let elementoEstudiante = this.consultarPorId(id);
        if (elementoEstudiante) {
            this.arregloEstudiantes = this.arregloEstudiantes.filter((estudiante) => id !== estudiante.id);
            return true;
        }
        return false;
    }
}

export default EstudianteDAO;
