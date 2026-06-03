import Curso from '../models/curso.js';

// ============ CONFIG ============
const API = {
    BASE: 'https://paginas-web-cr.com/Api/apis/',
    ENDPOINTS: {
        consultar: 'ListaCurso.php',
        insertar: 'InsertarCursos.php',
        actualizar: 'ActualizarCursos.php',
        eliminar: 'BorrarCursos.php'
    }
};

// ============ STATE ============
let modalFormulario;
let modoEdicion = false;
const elementos = {
    form: () => document.getElementById('formulario'),
    titulo: () => document.getElementById('tituloCurso'),
    btnSubmit: () => document.getElementById('btnSubmit'),
    alerta: () => document.getElementById('alertaFormulario'),
    tabla: () => document.getElementById('tablaCurso'),
    cursoId: () => document.getElementById('cursoId'),
    nombre: () => document.getElementById('nombre'),
    usuario: () => document.getElementById('usuario'),
    descripcion: () => document.getElementById('descripcion'),
    tiempo: () => document.getElementById('tiempo')
};

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));
    consultarAPI();
    
    elementos.form().addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            modoEdicion ? guardarEdicion() : insertarCurso();
        }
    });

    document.getElementById('modalFormulario').addEventListener('hidden.bs.modal', () => {
        if (!modoEdicion) limpiarFormulario();
    });

    document.getElementById('btnCancelarModal').addEventListener('click', cancelarEdicion);
    
    // Delegación de eventos para la tabla
    elementos.tabla().addEventListener('click', (e) => {
        if (e.target.classList.contains('btnEditar')) {
            editarEnFormulario(e.target.dataset);
        } else if (e.target.classList.contains('btnEliminar')) {
            eliminarCurso(e.target.dataset.id);
        }
    });
});

// ============ VALIDACIÓN ============
function validarFormulario() {
    const campos = {
        nombre: elementos.nombre().value.trim(),
        descripcion: elementos.descripcion().value.trim(),
        tiempo: elementos.tiempo().value.trim(),
        usuario: elementos.usuario().value.trim()
    };

    const errores = {
        nombre: 'El nombre del curso es requerido',
        descripcion: 'La descripción del curso es requerida',
        tiempo: 'La duración debe ser mayor a 0 horas',
        usuario: 'El nombre del instructor es requerido'
    };

    for (let [campo, error] of Object.entries(errores)) {
        if (!campos[campo] || (campo === 'tiempo' && campos[campo] <= 0)) {
            mostrarAlerta(error, 'danger');
            return false;
        }
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
        id: elementos.cursoId().value || Math.floor(Math.random() * 10000),
        nombre: elementos.nombre().value.trim(),
        descripcion: elementos.descripcion().value.trim(),
        tiempo: elementos.tiempo().value.trim(),
        usuario: elementos.usuario().value.trim()
    };
}

function limpiarFormulario() {
    elementos.form().reset();
    elementos.alerta().innerHTML = '';
    elementos.cursoId().value = '';
}

function cambiarModoFormulario(editar = false) {
    modoEdicion = editar;
    elementos.titulo().textContent = editar ? 'Editar Curso' : 'Agregar Nuevo Curso';
    elementos.btnSubmit().textContent = editar ? 'Guardar Cambios' : 'Agregar Curso';
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
        mostrarAlerta('Error al cargar los cursos', 'danger');
    }
}

function dibujarTabla(datos) {
    const tabla = elementos.tabla();
    
    if (!datos.length) {
        tabla.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No hay cursos registrados aún</td></tr>';
        return;
    }

    tabla.innerHTML = datos.map(d => `
        <tr>
            <td>${d.id}</td>
            <td>${d.nombre}</td>
            <td>${d.descripcion}</td>
            <td>${d.tiempo}</td>
            <td>${d.usuario}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2 btnEditar" 
                    data-id="${d.id}" data-nombre="${d.nombre}" data-usuario="${d.usuario}" 
                    data-descripcion="${d.descripcion}" data-tiempo="${d.tiempo}">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger btnEliminar" data-id="${d.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

async function insertarCurso() {
    const datos = obtenerDatos();
    try {
        await hacerFetch('insertar', datos);
        limpiarFormulario();
        modalFormulario.hide();
        mostrarAlerta('Curso agregado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al agregar el curso', 'danger');
    }
}

async function guardarEdicion() {
    const datos = obtenerDatos();
    if (!datos.nombre || !datos.usuario || !datos.descripcion || !datos.tiempo) {
        mostrarAlerta('Todos los campos son requeridos', 'danger');
        return;
    }
    
    try {
        await hacerFetch('actualizar', datos);
        cancelarEdicion();
        modalFormulario.hide();
        mostrarAlerta('Curso actualizado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al actualizar el curso', 'danger');
    }
}

async function eliminarCurso(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este curso?')) return;
    
    try {
        await hacerFetch('eliminar', { id });
        mostrarAlerta('Curso eliminado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al eliminar el curso', 'danger');
    }
}

function editarEnFormulario(datos) {
    cambiarModoFormulario(true);
    elementos.cursoId().value = datos.id;
    elementos.nombre().value = datos.nombre;
    elementos.usuario().value = datos.usuario;
    elementos.descripcion().value = datos.descripcion;
    elementos.tiempo().value = datos.tiempo;
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