//class o en un modelo, atributos, metodos
class Biblioteca{
    //Constructor
    constructor(nombre, sede, numero){
        this._nombre = nombre;
        this._sede = sede;
        this._numero = numero;
    }
//Get
    get nombre(){
        return this._nombre;
    }
    get numero(){
        return this._numero;
    }
    get sede(){
        return this._sede;
    }
//set
    set nombre(nombre){
        this._nombre = nombre;
    }
    set numero(numero){
        this._numero = numero;
    }
    set sede(sede){
        this._sede = sede;
    }


}

export default Biblioteca;