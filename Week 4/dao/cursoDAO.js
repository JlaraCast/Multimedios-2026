// Acceso a datos para Cursos
// Puede conectarse a: BD, API, JSON, CSV, TXT, XML, memoria
class CursoDAO {
  constructor() {
    this.arregloCursos = [];
  }

  // Consultar todos los cursos
  consultar() {
    return this.arregloCursos;
  }

  // Consultar curso por ID
  consultarPorId(id) {
    return this.arregloCursos.find((curso) => id === curso.id);
  }

  // Insertar nuevo curso
  insertar(objetoCurso) {
    this.arregloCursos.push(objetoCurso);
    return true;
  }

  // Actualizar curso existente
  actualizar(id, objetoCurso) {
    let elementoCurso = this.consultarPorId(id);
    if (elementoCurso) {
      elementoCurso.nombre = objetoCurso.nombre;
      elementoCurso.descripcion = objetoCurso.descripcion;
      elementoCurso.tiempo = objetoCurso.tiempo;
      elementoCurso.usuario = objetoCurso.usuario;
      return true;
    }
    return false;
  }

  // Eliminar curso
  eliminar(id) {
    let elementoCurso = this.consultarPorId(id);
    if (elementoCurso) {
      this.arregloCursos = this.arregloCursos.filter((curso) => id !== curso.id);
      return true;
    }
    return false;
  }
}

export default CursoDAO;
