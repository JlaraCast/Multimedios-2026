import * as helpers from './helpers.js';
import Habitacion from '../models/habitacion.js';
import HabitacionDAO from '../dao/habitacionDAO.js';

// ============ CONFIG ============
const ENDPOINT = 'habitacion/habitacion.php';
const CAMPOS = { id_sede: 'id_sede', numero: 'numero', tipo: 'tipo', descripcion: 'descripcion', precio: 'precio', capacidad: 'capacidad', estado: 'estado', usuario: 'usuario' };

// ============ STATE ============
let modoEdicion = false;
let modalFormulario;
const cache = new Map();
const habitacionDAO = new HabitacionDAO();

// ============ TABLA ============
function renderFila(hab, num) {
    return `
        <td>${num}</td>
        <td>${hab.numero || ''}</td>
        <td>${hab.tipo || ''}</td>
        <td>$${parseFloat(hab.precio || 0).toFixed(2)}</td>
        <td>${hab.estado || ''}</td>
        <td>${hab.id_sede || ''}</td>
        <td>
            <button class="btn btn-sm btn-warning me-1 btnEditar" data-id="${hab.id}">Editar</button>
            <button class="btn btn-sm btn-danger btnEliminar" data-id="${hab.id}">Eliminar</button>
        </td>`;
}

async function consultarAPI() {
    try {
        const datos = await helpers.obtenerTodos(ENDPOINT);
        cache.clear();
        datos.forEach(h => cache.set(String(h.id), h));
        helpers.dibujarTabla('cuerpoTabla', datos, renderFila);
    } catch {
        helpers.mostrarAlerta('Error al consultar habitaciones', 'danger', 'alertaPagina');
    }
}

// ============ VALIDACIÓN ============
function validarFormulario() {
    const datos = helpers.obtenerValores(CAMPOS);
    if (!helpers.requerido(datos.id_sede)) { helpers.mostrarAlerta('El ID de sede es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.numero)) { helpers.mostrarAlerta('El número de habitación es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.tipo)) { helpers.mostrarAlerta('El tipo es requerido', 'danger'); return false; }
    if (!helpers.esNumeroPositivo(datos.precio)) { helpers.mostrarAlerta('El precio debe ser mayor a 0', 'danger'); return false; }
    if (!helpers.requerido(datos.estado)) { helpers.mostrarAlerta('El estado es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.usuario)) { helpers.mostrarAlerta('El usuario es requerido', 'danger'); return false; }
    return true;
}

// ============ UTILIDADES ============
function obtenerDatos() {
    const datos = helpers.obtenerValores(CAMPOS);
    datos.id = document.getElementById('habitacionId').value || Date.now();
    datos.precio = parseFloat(datos.precio);
    datos.capacidad = parseInt(datos.capacidad) || 1;
    return datos;
}

function cambiarModoFormulario(editar = false) {
    modoEdicion = editar;
    document.getElementById('tituloModal').textContent = editar ? 'Editar Habitación' : 'Crear Habitación';
    document.getElementById('btnSubmit').textContent = editar ? 'Guardar Cambios' : 'Guardar';
}

function limpiarFormulario() {
    document.getElementById('formulario').reset();
    document.getElementById('alertaFormulario').innerHTML = '';
    document.getElementById('habitacionId').value = '';
}

function cancelarEdicion() {
    cambiarModoFormulario(false);
    limpiarFormulario();
}

function prepararFormularioAgregar() {
    cambiarModoFormulario(false);
    limpiarFormulario();
}

// ============ API ============
async function insertarHabitacion() {
    const datos = obtenerDatos();
    try {
        const hab = new Habitacion(datos.id, datos.id_sede, datos.numero, datos.tipo, datos.descripcion, datos.precio, datos.capacidad, datos.estado, datos.usuario);
        await helpers.crearRegistro(ENDPOINT, datos);
        habitacionDAO.insertar(hab);
        limpiarFormulario();
        modalFormulario.hide();
        helpers.mostrarAlerta('Habitación creada correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al crear habitación', 'danger');
    }
}

async function guardarEdicion() {
    const datos = obtenerDatos();
    try {
        const hab = new Habitacion(datos.id, datos.id_sede, datos.numero, datos.tipo, datos.descripcion, datos.precio, datos.capacidad, datos.estado, datos.usuario);
        await helpers.actualizarRegistro(ENDPOINT, datos);
        habitacionDAO.actualizar(datos.id, hab);
        cancelarEdicion();
        modalFormulario.hide();
        helpers.mostrarAlerta('Habitación actualizada correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al actualizar habitación', 'danger');
    }
}

async function eliminarHabitacion(id) {
    if (!confirm('¿Está seguro que desea eliminar esta habitación?')) return;
    try {
        await helpers.eliminarRegistro(ENDPOINT, id);
        habitacionDAO.eliminar(id);
        helpers.mostrarAlerta('Habitación eliminada correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al eliminar habitación', 'danger', 'alertaPagina');
    }
}

function editarEnFormulario(item) {
    cambiarModoFormulario(true);
    document.getElementById('habitacionId').value = item.id;
    helpers.llenarFormulario({ id_sede: item.id_sede, numero: item.numero, tipo: item.tipo, descripcion: item.descripcion, precio: item.precio, capacidad: item.capacidad, estado: item.estado, usuario: item.usuario });
    modalFormulario.show();
}

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));

    document.getElementById('formulario').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            modoEdicion ? guardarEdicion() : insertarHabitacion();
        }
    });

    document.getElementById('modalFormulario').addEventListener('hidden.bs.modal', () => {
        if (!modoEdicion) limpiarFormulario();
    });

    document.getElementById('btnCancelarModal').addEventListener('click', cancelarEdicion);

    document.getElementById('cuerpoTabla').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const item = cache.get(String(btn.dataset.id));
        if (btn.classList.contains('btnEditar') && item) editarEnFormulario(item);
        if (btn.classList.contains('btnEliminar')) eliminarHabitacion(btn.dataset.id);
    });

    consultarAPI();
    window.prepararFormularioAgregar = prepararFormularioAgregar;
});
