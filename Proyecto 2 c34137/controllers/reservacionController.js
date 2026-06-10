import * as helpers from './helpers.js';
import Reservacion from '../models/reservacion.js';
import ReservacionDAO from '../dao/reservacionDAO.js';

// ============ CONFIG ============
const ENDPOINT = 'reservacion/reservacion.php';
const CAMPOS = { id_cliente: 'id_cliente', id_habitacion: 'id_habitacion', fecha_entrada: 'fecha_entrada', fecha_salida: 'fecha_salida', cantidad_personas: 'cantidad_personas', estado: 'estado', total: 'total', usuario: 'usuario' };

// ============ STATE ============
let modoEdicion = false;
let modalFormulario;
const cache = new Map();
const reservacionDAO = new ReservacionDAO();

// ============ TABLA ============
const ESTADO_RES = { pendiente: 'warning', confirmada: 'success', cancelada: 'danger', finalizada: 'secondary' };

function renderFila(res, num) {
    const estadoKey = (res.estado || '').toLowerCase();
    const estadoBadge = `<span class="badge bg-${ESTADO_RES[estadoKey] || 'secondary'}">${res.estado || ''}</span>`;
    return `
        <td>${num}</td>
        <td>${res.fecha_entrada || ''}</td>
        <td>${res.fecha_salida || ''}</td>
        <td>${res.id_cliente || ''}</td>
        <td>${res.id_habitacion || ''}</td>
        <td>${res.cantidad_personas || ''}</td>
        <td>$${parseFloat(res.total || 0).toFixed(2)}</td>
        <td>${estadoBadge}</td>
        <td>
            <button class="btn btn-sm btn-warning me-1 btnEditar" data-id="${res.id}">Editar</button>
            <button class="btn btn-sm btn-danger btnEliminar" data-id="${res.id}">Eliminar</button>
        </td>`;
}

async function consultarAPI() {
    try {
        const datos = await helpers.obtenerTodos(ENDPOINT);
        cache.clear();
        datos.forEach(r => cache.set(String(r.id), r));
        helpers.dibujarTabla('cuerpoTabla', datos, renderFila);
    } catch {
        helpers.mostrarAlerta('Error al consultar reservaciones', 'danger', 'alertaPagina');
    }
}

// ============ VALIDACIÓN ============
function validarFormulario() {
    const datos = helpers.obtenerValores(CAMPOS);
    if (!helpers.requerido(datos.id_cliente)) { helpers.mostrarAlerta('El ID de cliente es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.id_habitacion)) { helpers.mostrarAlerta('El ID de habitación es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.fecha_entrada)) { helpers.mostrarAlerta('La fecha de entrada es requerida', 'danger'); return false; }
    if (!helpers.requerido(datos.fecha_salida)) { helpers.mostrarAlerta('La fecha de salida es requerida', 'danger'); return false; }
    if (new Date(datos.fecha_salida) <= new Date(datos.fecha_entrada)) {
        helpers.mostrarAlerta('La fecha de salida debe ser posterior a la de entrada', 'danger');
        return false;
    }
    if (!helpers.requerido(datos.estado)) { helpers.mostrarAlerta('El estado es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.usuario)) { helpers.mostrarAlerta('El usuario es requerido', 'danger'); return false; }
    return true;
}

// ============ UTILIDADES ============
function obtenerDatos() {
    const datos = helpers.obtenerValores(CAMPOS);
    datos.id = document.getElementById('reservacionId').value || Date.now();
    datos.cantidad_personas = parseInt(datos.cantidad_personas) || 1;
    datos.total = parseFloat(datos.total) || 0;
    return datos;
}

function cambiarModoFormulario(editar = false) {
    modoEdicion = editar;
    document.getElementById('tituloModal').textContent = editar ? 'Editar Reservación' : 'Crear Reservación';
    document.getElementById('btnSubmit').textContent = editar ? 'Guardar Cambios' : 'Guardar';
}

function limpiarFormulario() {
    document.getElementById('formulario').reset();
    document.getElementById('alertaFormulario').innerHTML = '';
    document.getElementById('reservacionId').value = '';
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
async function insertarReservacion() {
    const datos = obtenerDatos();
    try {
        const res = new Reservacion(datos.id, datos.id_cliente, datos.id_habitacion, datos.fecha_entrada, datos.fecha_salida, datos.cantidad_personas, datos.estado, datos.total, datos.usuario);
        await helpers.crearRegistro(ENDPOINT, datos);
        reservacionDAO.insertar(res);
        limpiarFormulario();
        modalFormulario.hide();
        helpers.mostrarAlerta('Reservación creada correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al crear reservación', 'danger');
    }
}

async function guardarEdicion() {
    const datos = obtenerDatos();
    try {
        const res = new Reservacion(datos.id, datos.id_cliente, datos.id_habitacion, datos.fecha_entrada, datos.fecha_salida, datos.cantidad_personas, datos.estado, datos.total, datos.usuario);
        await helpers.actualizarRegistro(ENDPOINT, datos);
        reservacionDAO.actualizar(datos.id, res);
        cancelarEdicion();
        modalFormulario.hide();
        helpers.mostrarAlerta('Reservación actualizada correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al actualizar reservación', 'danger');
    }
}

async function eliminarReservacion(id) {
    if (!confirm('¿Está seguro que desea eliminar esta reservación?')) return;
    try {
        await helpers.eliminarRegistro(ENDPOINT, id);
        reservacionDAO.eliminar(id);
        helpers.mostrarAlerta('Reservación eliminada correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al eliminar reservación', 'danger', 'alertaPagina');
    }
}

function editarEnFormulario(item) {
    cambiarModoFormulario(true);
    document.getElementById('reservacionId').value = item.id;
    helpers.llenarFormulario({ id_cliente: item.id_cliente, id_habitacion: item.id_habitacion, fecha_entrada: item.fecha_entrada, fecha_salida: item.fecha_salida, cantidad_personas: item.cantidad_personas, estado: item.estado, total: item.total, usuario: item.usuario });
    modalFormulario.show();
}

// ============ COMBOS ============
async function cargarClientes() {
    try {
        const clientes = await helpers.obtenerTodos('cliente/cliente.php');
        const select = document.getElementById('id_cliente');
        clientes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.id} - ${c.nombre} ${c.apellidos}`;
            select.appendChild(opt);
        });
    } catch { /* sin clientes disponibles */ }
}

async function cargarHabitaciones() {
    try {
        const habitaciones = await helpers.obtenerTodos('habitacion/habitacion.php');
        const select = document.getElementById('id_habitacion');
        habitaciones.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h.id;
            opt.textContent = `${h.id} - Hab. ${h.numero} (${h.tipo})`;
            select.appendChild(opt);
        });
    } catch { /* sin habitaciones disponibles */ }
}

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));
    cargarClientes();
    cargarHabitaciones();

    document.getElementById('formulario').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            modoEdicion ? guardarEdicion() : insertarReservacion();
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
        if (btn.classList.contains('btnEliminar')) eliminarReservacion(btn.dataset.id);
    });

    consultarAPI();
    window.prepararFormularioAgregar = prepararFormularioAgregar;
});
