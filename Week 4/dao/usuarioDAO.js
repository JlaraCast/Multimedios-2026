class UsuarioDAO {
    constructor() {
        this.arregloUsuarios = [];
    }

    consultar() {
        return this.arregloUsuarios;
    }

    consultarPorId(id) {
        return this.arregloUsuarios.find((usuario) => id === usuario.id);
    }

    insertar(objetoUsuario) {
        this.arregloUsuarios.push(objetoUsuario);
        return true;
    }

    actualizar(id, objetoUsuario) {
        let elementoUsuario = this.consultarPorId(id);
        if (elementoUsuario) {
            elementoUsuario.name = objetoUsuario.name;
            elementoUsuario.email = objetoUsuario.email;
            elementoUsuario.password = objetoUsuario.password;
            return true;
        }
        return false;
    }

    eliminar(id) {
        let elementoUsuario = this.consultarPorId(id);
        if (elementoUsuario) {
            this.arregloUsuarios = this.arregloUsuarios.filter((usuario) => id !== usuario.id);
            return true;
        }
        return false;
    }
}

export default UsuarioDAO;
