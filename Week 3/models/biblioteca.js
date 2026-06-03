class Biblioteca{
    constructor(nombre, sede, numero){
        this.nombre = nombre;
        this.sede = sede;
        this.numero = numero;
    }
    get nombre(){
        return this.nombre;
    }
    get sede    (){
        return this.sede;
    }
    get numero(){
        return this.numero;
    }

    set nombre(nombre){
        this.nombre = nombre;
    }
    set sede(sede){
        this.sede = sede;
    }
    set numero(numero){
        this.numero = numero;
    }
}
export default Biblioteca;