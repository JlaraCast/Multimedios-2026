import biblioteca from '../models/biblioteca.js';
class BibliotecaDao {
    constructor() {
        this.arregloBiblioteca = [];
    }
    consultar() {
        return this.arregloBiblioteca;
    }
    insertar(biblioteca) {
        this.arregloBiblioteca.push(biblioteca);
    }
    consultarPorId(id) {
        return this.arregloBiblioteca.find(p => id == id);
    }
    actualizar(id,biblioteca) {
        let elementoBiblioteca = this.consultarPorId(id);
        if (elementoBiblioteca) {
            elementoBiblioteca.nombre = biblioteca.nombre;
            elementoBiblioteca.sede = biblioteca.sede;
            elementoBiblioteca.numero = biblioteca.numero;
        }
        //const es para definir constante o estructura 
        //var define variables obsoleta
        // let soy una variable 
    

    }
    eliminar(id) {
        let elementoBiblioteca = this.consultarPorId(id);
        if (elementoBiblioteca) {
            this.arregloBiblioteca = this.arregloBiblioteca.filter(p => id !== id);
        }
    }

}

export default BibliotecaDao;