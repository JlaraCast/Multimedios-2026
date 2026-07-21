class PagoDAO {
    constructor() {
        this.arregloPagos = [];
    }

    consultar() {
        return this.arregloPagos;
    }

    consultarPorId(id) {
        return this.arregloPagos.find(pago => pago.id === id);
    }

    insertar(pago) {
        this.arregloPagos.push(pago);
    }

    actualizar(id, pago) {
        const index = this.arregloPagos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.arregloPagos[index] = pago;
        }
    }

    eliminar(id) {
        this.arregloPagos = this.arregloPagos.filter(pago => pago.id !== id);
    }
}

export default PagoDAO;
