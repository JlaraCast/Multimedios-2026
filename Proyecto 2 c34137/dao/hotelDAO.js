class HotelDAO {
    constructor() {
        this.arregloHoteles = [];
    }

    consultar() {
        return this.arregloHoteles;
    }

    consultarPorId(id) {
        return this.arregloHoteles.find(hotel => hotel.id === id);
    }

    insertar(hotel) {
        this.arregloHoteles.push(hotel);
    }

    actualizar(id, hotel) {
        const index = this.arregloHoteles.findIndex(h => h.id === id);
        if (index !== -1) {
            this.arregloHoteles[index] = hotel;
        }
    }

    eliminar(id) {
        this.arregloHoteles = this.arregloHoteles.filter(hotel => hotel.id !== id);
    }
}

export default HotelDAO;
