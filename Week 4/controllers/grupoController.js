import Grupo from '../models/grupo.js';

// ============ CONFIG ============
const API = {
    BASE: 'https://paginas-web-cr.com/Api/apis/',
    ENDPOINTS: {
        consultar: 'ListaGrupo.php',
        insertar: 'InsertarGrupo.php',
        actualizar: 'ActualizarGrupo.php',
        eliminar: 'BorrarGrupo.php'
    }
};

// ============ STATE ============
let modalFormulario;
let modoEdicion = false;
const elementos = {
    form: () => document.getElementById('formulario'),
    titulo: () => document.getElementById('tituloGrupo'),
    btnSubmit: () => document.getElementById('btnSubmit'),
    alerta: () => document.getElementById('alertaFormulario'),
    tabla: () => document.getElementById('tablaGrupo'),
    grupoId: () => document.getElementById('grupoId'),
    nombre: () => document.getElementById('nombre')
};

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));
    consultarAPI();
    
    elementos.form().addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            modoEdicion ? guardarEdicion() : insertarGrupo();
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
            eliminarGrupo(e.target.dataset.id);
        }
    });
});

// ============ VALIDACIÓN ============
function validarFormulario() {
    const nombre = elementos.nombre().value.trim();
    
    if (!nombre) {
        mostrarAlerta('El nombre del grupo es requerido', 'danger');
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
        id: elementos.grupoId().value || Math.floor(Math.random() * 10000),
        nombre: elementos.nombre().value.trim()
    };
}

function limpiarFormulario() {
    elementos.form().reset();
    elementos.alerta().innerHTML = '';
    elementos.grupoId().value = '';
}

function cambiarModoFormulario(editar = false) {
    modoEdicion = editar;
    elementos.titulo().textContent = editar ? 'Editar Grupo' : 'Agregar Nuevo Grupo';
    elementos.btnSubmit().textContent = editar ? 'Guardar Cambios' : 'Agregar Grupo';
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
        mostrarAlerta('Error al cargar los grupos', 'danger');
    }
}

function dibujarTabla(datos) {
    const tabla = elementos.tabla();
    
    if (!datos.length) {
        tabla.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-3">No hay grupos registrados aún</td></tr>';
        return;
    }

    tabla.innerHTML = datos.map(d => `
        <tr>
            <td>${d.id}</td>
            <td>${d.nombre}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2 btnEditar" 
                    data-id="${d.id}" data-nombre="${d.nombre}">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger btnEliminar" data-id="${d.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

async function insertarGrupo() {
    const datos = obtenerDatos();
    try {
        await hacerFetch('insertar', datos);
        limpiarFormulario();
        modalFormulario.hide();
        mostrarAlerta('Grupo agregado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al agregar el grupo', 'danger');
    }
}

async function guardarEdicion() {
    const datos = obtenerDatos();
    if (!datos.nombre) {
        mostrarAlerta('El nombre del grupo es requerido', 'danger');
        return;
    }
    
    try {
        await hacerFetch('actualizar', datos);
        cancelarEdicion();
        modalFormulario.hide();
        mostrarAlerta('Grupo actualizado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al actualizar el grupo', 'danger');
    }
}

async function eliminarGrupo(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este grupo?')) return;
    
    try {
        await hacerFetch('eliminar', { id });
        mostrarAlerta('Grupo eliminado correctamente', 'success');
        consultarAPI();
    } catch {
        mostrarAlerta('Error al eliminar el grupo', 'danger');
    }
}

function editarEnFormulario(datos) {
    cambiarModoFormulario(true);
    elementos.grupoId().value = datos.id;
    elementos.nombre().value = datos.nombre;
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
