import Usuario from '../models/usuario.js';

// ============ CONFIG ============
const API = {
    BASE: 'https://paginas-web-cr.com/Api/apis/',
    ENDPOINTS: {
        consultar: 'ListaUsuarios.php',
        insertar: 'Insertar.php',
        actualizar: 'Actualizar.php',
        eliminar: 'Borrar.php'
    }
};

// ============ STATE ============
let modalFormulario;
let modoEdicion = false;
const elementos = {
    form: () => document.getElementById('formulario'),
    titulo: () => document.getElementById('tituloUsuario'),
    btnSubmit: () => document.getElementById('btnSubmit'),
    alerta: () => document.getElementById('alertaFormulario'),
    tabla: () => document.getElementById('tablaUsuario'),
    usuarioId: () => document.getElementById('usuarioId'),
    name: () => document.getElementById('name'),
    email: () => document.getElementById('email'),
    password: () => document.getElementById('password')
};

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));
    consultarAPI();
    
    elementos.form().addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            modoEdicion ? guardarEdicion() : insertarUsuario();
        }
    });

    document.getElementById('modalFormulario').addEventListener('hidden.bs.modal', () => {
        if (!modoEdicion) limpiarFormulario();
    });

    document.getElementById('btnCancelarModal').addEventListener('click', cancelarEdicion);
    
    elementos.tabla().addEventListener('click', (e) => {
        if (e.target.classList.contains('btnEditar')) {
            editarEnFormulario(e.target.dataset);
        } else if (e.target.classList.contains('btnEliminar')) {
            eliminarUsuario(e.target.dataset.id);
        }
    });
});

// ============ VALIDACIÓN ============
function validarFormulario() {
    const name = elementos.name().value.trim();
    const email = elementos.email().value.trim();
    const password = elementos.password().value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name) {
        mostrarAlerta('El nombre es requerido', 'danger');
        return false;
    }
    
    if (!email || !emailRegex.test(email)) {
        mostrarAlerta('Email inválido', 'danger');
        return false;
    }
    
    if (!password || password.length < 6) {
        mostrarAlerta('La contraseña debe tener al menos 6 caracteres', 'danger');
        return false;
    }
    
    return true;
}

// ============ UTILIDADES ============
function mostrarAlerta(mensaje, tipo = 'success') {
    const alerta = elementos.alerta();
    const clase = tipo === 'danger' ? 'alert-danger' : 'alert-success';
    alerta.innerHTML = `
        <div class="alert ${clase} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

function obtenerDatos() {
    return {
        id: elementos.usuarioId().value || Math.floor(Math.random() * 10000),
        name: elementos.name().value.trim(),
        email: elementos.email().value.trim(),
        password: elementos.password().value.trim()
    };
}

function limpiarFormulario() {
    elementos.form().reset();
    elementos.alerta().innerHTML = '';
    elementos.usuarioId().value = '';
}

function cambiarModoFormulario(editar = false) {
    modoEdicion = editar;
    elementos.titulo().textContent = editar ? 'Editar Usuario' : 'Agregar Nuevo Usuario';
    elementos.btnSubmit().textContent = editar ? 'Guardar Cambios' : 'Agregar Usuario';
}

// ============ FETCH GENÉRICO ============
async function hacerFetch(endpoint, datos) {
    try {
        const config = {
            method: 'POST',
            body: JSON.stringify(datos)
        };
        
        const response = await fetch(API.BASE + API.ENDPOINTS[endpoint], config);
        return await response.json();
    } catch (error) {
        console.error(`Error en ${endpoint}:`, error);
        throw error;
    }
}

// ============ API ============
async function consultarAPI() {
    try {
        const data = await hacerFetch('consultar', {});
        dibujarTabla(data?.data || []);
    } catch {
        mostrarAlerta('Error al cargar los usuarios', 'danger');
    }
}

function dibujarTabla(datos) {
    const tabla = elementos.tabla();
    
    if (!datos.length) {
        tabla.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-3">No hay usuarios registrados aún</td></tr>';
        return;
    }

    tabla.innerHTML = datos.map(d => `
        <tr>
            <td>${d.id}</td>
            <td>${d.name}</td>
            <td>${d.email}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2 btnEditar" 
                    data-id="${d.id}" data-name="${d.name}" data-email="${d.email}" data-password="${d.password}">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger btnEliminar" data-id="${d.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

async function insertarUsuario() {
    const datos = obtenerDatos();
    try {
        await hacerFetch('insertar', datos);
        limpiarFormulario();
        modalFormulario.hide();
        mostrarAlerta('Usuario agregado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al agregar el usuario', 'danger');
    }
}

async function guardarEdicion() {
    const datos = obtenerDatos();
    if (!datos.name || !datos.email || !datos.password) {
        mostrarAlerta('Todos los campos son requeridos', 'danger');
        return;
    }
    
    try {
        await hacerFetch('actualizar', datos);
        cancelarEdicion();
        modalFormulario.hide();
        mostrarAlerta('Usuario actualizado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al actualizar el usuario', 'danger');
    }
}

async function eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    
    try {
        await hacerFetch('eliminar', { id });
        mostrarAlerta('Usuario eliminado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al eliminar el usuario', 'danger');
    }
}

function editarEnFormulario(datos) {
    cambiarModoFormulario(true);
    elementos.usuarioId().value = datos.id;
    elementos.name().value = datos.name;
    elementos.email().value = datos.email;
    elementos.password().value = datos.password;
    modalFormulario.show();
}

function cancelarEdicion() {
    cambiarModoFormulario(false);
    limpiarFormulario();
}

function prepararFormularioAgregar() {
    cambiarModoFormulario(false);
    limpiarFormulario();
}
