class HabitacionDAO {
    constructor() {
        this.arregloHabitaciones = [];
    }

    consultar() {
        return this.arregloHabitaciones;
    }

    consultarPorId(id) {
        return this.arregloHabitaciones.find(habitacion => habitacion.id === id);
    }

    insertar(habitacion) {
        this.arregloHabitaciones.push(habitacion);
    }

    actualizar(id, habitacion) {
        const index = this.arregloHabitaciones.findIndex(h => h.id === id);
        if (index !== -1) {
            this.arregloHabitaciones[index] = habitacion;
        }
    }

    eliminar(id) {
        this.arregloHabitaciones = this.arregloHabitaciones.filter(habitacion => habitacion.id !== id);
    }
}

export default HabitacionDAO;
