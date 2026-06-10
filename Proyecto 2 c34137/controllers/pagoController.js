import * as helpers from './helpers.js';
import Pago from '../models/pago.js';
import PagoDAO from '../dao/pagoDAO.js';

// ============ CONFIG ============
const ENDPOINT = 'pago/pago.php';
const CAMPOS = { id_reservacion: 'id_reservacion', monto: 'monto', metodo: 'metodo', detalle: 'detalle', estado: 'estado', fecha_pago: 'fecha_pago', usuario: 'usuario' };

// ============ STATE ============
let modoEdicion = false;
let modalFormulario;
const cache = new Map();
const pagoDAO = new PagoDAO();

// ============ TABLA ============
const ESTADO_PAGO = { pendiente: 'warning', pagado: 'success', rechazado: 'danger' };

function renderFila(pago, num) {
    const estadoKey = (pago.estado || '').toLowerCase();
    const estadoBadge = `<span class="badge bg-${ESTADO_PAGO[estadoKey] || 'secondary'}">${pago.estado || ''}</span>`;
    return `
        <td>${num}</td>
        <td>$${parseFloat(pago.monto || 0).toFixed(2)}</td>
        <td>${pago.fecha_pago || ''}</td>
        <td>${pago.metodo || ''}</td>
        <td>${pago.detalle || ''}</td>
        <td>${estadoBadge}</td>
        <td>${pago.id_reservacion || ''}</td>
        <td>
            <button class="btn btn-sm btn-warning me-1 btnEditar" data-id="${pago.id}">Editar</button>
            <button class="btn btn-sm btn-danger btnEliminar" data-id="${pago.id}">Eliminar</button>
        </td>`;
}

async function consultarAPI() {
    try {
        const datos = await helpers.obtenerTodos(ENDPOINT);
        cache.clear();
        datos.forEach(p => cache.set(String(p.id), p));
        helpers.dibujarTabla('cuerpoTabla', datos, renderFila);
    } catch {
        helpers.mostrarAlerta('Error al consultar pagos', 'danger', 'alertaPagina');
    }
}

// ============ VALIDACIÓN ============
function validarFormulario() {
    const datos = helpers.obtenerValores(CAMPOS);
    if (!helpers.requerido(datos.id_reservacion)) { helpers.mostrarAlerta('El ID de reservación es requerido', 'danger'); return false; }
    if (!helpers.esNumeroPositivo(datos.monto)) { helpers.mostrarAlerta('El monto debe ser mayor a 0', 'danger'); return false; }
    if (!helpers.requerido(datos.metodo)) { helpers.mostrarAlerta('El método de pago es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.estado)) { helpers.mostrarAlerta('El estado es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.fecha_pago)) { helpers.mostrarAlerta('La fecha de pago es requerida', 'danger'); return false; }
    if (!helpers.requerido(datos.usuario)) { helpers.mostrarAlerta('El usuario es requerido', 'danger'); return false; }
    return true;
}

// ============ UTILIDADES ============
function obtenerDatos() {
    const datos = helpers.obtenerValores(CAMPOS);
    datos.id = document.getElementById('pagoId').value || Date.now();
    datos.monto = parseFloat(datos.monto);
    return datos;
}

function cambiarModoFormulario(editar = false) {
    modoEdicion = editar;
    document.getElementById('tituloModal').textContent = editar ? 'Editar Pago' : 'Crear Pago';
    document.getElementById('btnSubmit').textContent = editar ? 'Guardar Cambios' : 'Guardar';
}

function limpiarFormulario() {
    document.getElementById('formulario').reset();
    document.getElementById('alertaFormulario').innerHTML = '';
    document.getElementById('pagoId').value = '';
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
async function insertarPago() {
    const datos = obtenerDatos();
    try {
        const pago = new Pago(datos.id, datos.id_reservacion, datos.monto, datos.metodo, datos.detalle, datos.estado, datos.fecha_pago, datos.usuario);
        await helpers.crearRegistro(ENDPOINT, datos);
        pagoDAO.insertar(pago);
        limpiarFormulario();
        modalFormulario.hide();
        helpers.mostrarAlerta('Pago creado correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al crear pago', 'danger');
    }
}

async function guardarEdicion() {
    const datos = obtenerDatos();
    try {
        const pago = new Pago(datos.id, datos.id_reservacion, datos.monto, datos.metodo, datos.detalle, datos.estado, datos.fecha_pago, datos.usuario);
        await helpers.actualizarRegistro(ENDPOINT, datos);
        pagoDAO.actualizar(datos.id, pago);
        cancelarEdicion();
        modalFormulario.hide();
        helpers.mostrarAlerta('Pago actualizado correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al actualizar pago', 'danger');
    }
}

async function eliminarPago(id) {
    if (!confirm('¿Está seguro que desea eliminar este pago?')) return;
    try {
        await helpers.eliminarRegistro(ENDPOINT, id);
        pagoDAO.eliminar(id);
        helpers.mostrarAlerta('Pago eliminado correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al eliminar pago', 'danger', 'alertaPagina');
    }
}

function editarEnFormulario(item) {
    cambiarModoFormulario(true);
    document.getElementById('pagoId').value = item.id;
    helpers.llenarFormulario({ id_reservacion: item.id_reservacion, monto: item.monto, metodo: item.metodo, detalle: item.detalle, estado: item.estado, fecha_pago: item.fecha_pago, usuario: item.usuario });
    modalFormulario.show();
}

// ============ COMBOS ============
async function cargarReservaciones() {
    try {
        const reservaciones = await helpers.obtenerTodos('reservacion/reservacion.php');
        const select = document.getElementById('id_reservacion');
        reservaciones.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = `${r.id} - Cliente ${r.id_cliente} (${r.fecha_entrada} → ${r.fecha_salida})`;
            select.appendChild(opt);
        });
    } catch { /* sin reservaciones disponibles */ }
}

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));
    cargarReservaciones();

    document.getElementById('formulario').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            modoEdicion ? guardarEdicion() : insertarPago();
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
        if (btn.classList.contains('btnEliminar')) eliminarPago(btn.dataset.id);
    });

    consultarAPI();
    window.prepararFormularioAgregar = prepararFormularioAgregar;
});
