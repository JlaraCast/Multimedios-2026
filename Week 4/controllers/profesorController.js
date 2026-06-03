import Profesor from '../models/profesor.js';

// ============ CONFIG ============
const API = {
    BASE: 'https://paginas-web-cr.com/Api/apis/',
    ENDPOINTS: {
        consultar: 'ListaProfesores.php',
        insertar: 'InsertarProfesores.php',
        actualizar: 'ActualizarProfesores.php',
        eliminar: 'BorrarProfesores.php'
    }
};

// ============ STATE ============
let modalFormulario;
let modoEdicion = false;
const elementos = {
    form: () => document.getElementById('formulario'),
    titulo: () => document.getElementById('tituloProfesor'),
    btnSubmit: () => document.getElementById('btnSubmit'),
    alerta: () => document.getElementById('alertaFormulario'),
    tabla: () => document.getElementById('tablaProfesor'),
    profesorId: () => document.getElementById('profesorId'),
    nombre: () => document.getElementById('nombre'),
    apellidopaterno: () => document.getElementById('apellidopaterno'),
    apellidomaterno: () => document.getElementById('apellidomaterno'),
    cedula: () => document.getElementById('cedula'),
    correoelectronico: () => document.getElementById('correoelectronico'),
    telefono: () => document.getElementById('telefono'),
    usuario: () => document.getElementById('usuario')
};

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));
    consultarAPI();
    
    elementos.form().addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            modoEdicion ? guardarEdicion() : insertarProfesor();
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
            eliminarProfesor(e.target.dataset.id);
        }
    });
});

// ============ VALIDACIÓN ============
function validarFormulario() {
    const campos = {
        nombre: elementos.nombre().value.trim(),
        apellidopaterno: elementos.apellidopaterno().value.trim(),
        cedula: elementos.cedula().value.trim(),
        correoelectronico: elementos.correoelectronico().value.trim(),
        telefono: elementos.telefono().value.trim(),
        usuario: elementos.usuario().value.trim()
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!campos.nombre) {
        mostrarAlerta('El nombre es requerido', 'danger');
        return false;
    }
    
    if (!campos.apellidopaterno) {
        mostrarAlerta('El apellido paterno es requerido', 'danger');
        return false;
    }

    if (!campos.cedula) {
        mostrarAlerta('La cédula es requerida', 'danger');
        return false;
    }

    if (!campos.correoelectronico || !emailRegex.test(campos.correoelectronico)) {
        mostrarAlerta('Email inválido', 'danger');
        return false;
    }

    if (!campos.telefono) {
        mostrarAlerta('El teléfono es requerido', 'danger');
        return false;
    }

    if (!campos.usuario) {
        mostrarAlerta('El usuario es requerido', 'danger');
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
        id: elementos.profesorId().value || Math.floor(Math.random() * 10000),
        nombre: elementos.nombre().value.trim(),
        apellidopaterno: elementos.apellidopaterno().value.trim(),
        apellidomaterno: elementos.apellidomaterno().value.trim(),
        cedula: elementos.cedula().value.trim(),
        correoelectronico: elementos.correoelectronico().value.trim(),
        telefono: elementos.telefono().value.trim(),
        usuario: elementos.usuario().value.trim()
    };
}

function limpiarFormulario() {
    elementos.form().reset();
    elementos.alerta().innerHTML = '';
    elementos.profesorId().value = '';
}

function cambiarModoFormulario(editar = false) {
    modoEdicion = editar;
    elementos.titulo().textContent = editar ? 'Editar Profesor' : 'Agregar Nuevo Profesor';
    elementos.btnSubmit().textContent = editar ? 'Guardar Cambios' : 'Agregar Profesor';
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
        mostrarAlerta('Error al cargar los profesores', 'danger');
    }
}

function dibujarTabla(datos) {
    const tabla = elementos.tabla();
    
    if (!datos.length) {
        tabla.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-3">No hay profesores registrados aún</td></tr>';
        return;
    }

    tabla.innerHTML = datos.map(d => `
        <tr>
            <td>${d.nombre} ${d.apellidopaterno}</td>
            <td>${d.cedula}</td>
            <td>${d.correoelectronico}</td>
            <td>${d.telefono}</td>
            <td>${d.usuario}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2 btnEditar" 
                    data-id="${d.id}" 
                    data-nombre="${d.nombre}" 
                    data-apellidopaterno="${d.apellidopaterno}" 
                    data-apellidomaterno="${d.apellidomaterno || ''}"
                    data-cedula="${d.cedula}"
                    data-correoelectronico="${d.correoelectronico}"
                    data-telefono="${d.telefono}"
                    data-usuario="${d.usuario}">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger btnEliminar" data-id="${d.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

async function insertarProfesor() {
    const datos = obtenerDatos();
    try {
        await hacerFetch('insertar', datos);
        limpiarFormulario();
        modalFormulario.hide();
        mostrarAlerta('Profesor agregado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al agregar el profesor', 'danger');
    }
}

async function guardarEdicion() {
    const datos = obtenerDatos();
    if (!datos.nombre || !datos.cedula || !datos.correoelectronico) {
        mostrarAlerta('Todos los campos principales son requeridos', 'danger');
        return;
    }
    
    try {
        await hacerFetch('actualizar', datos);
        cancelarEdicion();
        modalFormulario.hide();
        mostrarAlerta('Profesor actualizado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al actualizar el profesor', 'danger');
    }
}

async function eliminarProfesor(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este profesor?')) return;
    
    try {
        await hacerFetch('eliminar', { id });
        mostrarAlerta('Profesor eliminado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al eliminar el profesor', 'danger');
    }
}

function editarEnFormulario(datos) {
    cambiarModoFormulario(true);
    elementos.profesorId().value = datos.id;
    elementos.nombre().value = datos.nombre;
    elementos.apellidopaterno().value = datos.apellidopaterno;
    elementos.apellidomaterno().value = datos.apellidomaterno;
    elementos.cedula().value = datos.cedula;
    elementos.correoelectronico().value = datos.correoelectronico;
    elementos.telefono().value = datos.telefono;
    elementos.usuario().value = datos.usuario;
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
