//acceso al manipular datos
class BibliotecaDAO {
  ///BD, API, json, csv, txt, xml, memoria
  //???
  constructor() {
    this.arregloBiblioteca = [];
  }

  consultar() {
    ///String BD, API, json, csv, txt, xml, memoria
    return this.arregloBiblioteca;
  }

  consultarId(id) {
    ///String BD, API, json, csv, txt, xml, memoria
    return this.arregloBiblioteca.find((p) => id === id);
  }

  insertar(objetoBiblioteca) {
    this.arregloBiblioteca.push(objetoBiblioteca);
  }

  actualizar(id, objetoBiblioteca) {
    let elementoBiblioteca = this.consultarId(id);
    if (elementoBiblioteca) {
      elementoBiblioteca.nombre = objetoBiblioteca.nombre;
      elementoBiblioteca.sede = objetoBiblioteca.sede;
      elementoBiblioteca.numero = objetoBiblioteca.numero;
    }
    //const es para definir constante o estructuras
    //var = soy una variable obsoleta
    //let = soy una variable
  }

  eliminar(id) {
    let elementoBiblioteca = this.consultarId(id);
    if (elementoBiblioteca) {
      this.arregloBiblioteca = this.arregloBiblioteca.filter((p) => id !== id);
      ///String BD, API, json, csv, txt, xml, memoria
    }
  }
}

export default BibliotecaDAO;
