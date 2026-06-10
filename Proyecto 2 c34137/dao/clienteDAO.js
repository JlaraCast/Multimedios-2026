class ClienteDAO {
    constructor() {
        this.arregloClientes = [];
    }

    consultar() {
        return this.arregloClientes;
    }

    consultarPorId(id) {
        return this.arregloClientes.find(cliente => cliente.id === id);
    }

    insertar(cliente) {
        this.arregloClientes.push(cliente);
    }

    actualizar(id, cliente) {
        const index = this.arregloClientes.findIndex(c => c.id === id);
        if (index !== -1) {
            this.arregloClientes[index] = cliente;
        }
    }

    eliminar(id) {
        this.arregloClientes = this.arregloClientes.filter(cliente => cliente.id !== id);
    }
}

export default ClienteDAO;
