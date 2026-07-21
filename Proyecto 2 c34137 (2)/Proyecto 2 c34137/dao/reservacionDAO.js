class ReservacionDAO {
    constructor() {
        this.arregloReservaciones = [];
    }

    consultar() {
        return this.arregloReservaciones;
    }

    consultarPorId(id) {
        return this.arregloReservaciones.find(reservacion => reservacion.id === id);
    }

    insertar(reservacion) {
        this.arregloReservaciones.push(reservacion);
    }

    actualizar(id, reservacion) {
        const index = this.arregloReservaciones.findIndex(r => r.id === id);
        if (index !== -1) {
            this.arregloReservaciones[index] = reservacion;
        }
    }

    eliminar(id) {
        this.arregloReservaciones = this.arregloReservaciones.filter(reservacion => reservacion.id !== id);
    }
}

export default ReservacionDAO;
