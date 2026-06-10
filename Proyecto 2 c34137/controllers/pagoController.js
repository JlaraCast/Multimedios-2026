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
let allData = [];

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
        allData = datos;
        aplicarFiltros();
        poblarFiltroId();
    } catch {
        helpers.mostrarAlerta('Error al consultar pagos', 'danger', 'alertaPagina');
    }
}

function aplicarFiltros() {
    const reservacion = document.getElementById('filtroReservacion')?.value || '';
    const id = document.getElementById('filtroId')?.value || '';
    let filtrados = allData;
    if (reservacion) filtrados = filtrados.filter(p => String(p.id_reservacion) === reservacion);
    if (id) filtrados = filtrados.filter(p => String(p.id) === id);
    helpers.dibujarTabla('cuerpoTabla', filtrados, renderFila);
}

function poblarFiltroId() {
    const select = document.getElementById('filtroId');
    const val = select.value;
    select.innerHTML = '<option value="">Todos</option>';
    allData.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.id} - $${parseFloat(p.monto || 0).toFixed(2)} (Res. ${p.id_reservacion})`;
        select.appendChild(opt);
    });
    select.value = val;
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
    if (datos.fecha_pago) {
        datos.fecha_pago = datos.fecha_pago.replace('T', ' ') + ':00';
    }
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
        const { id, ...payload } = datos;
        await helpers.crearRegistro(ENDPOINT, payload);
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

async function editarEnFormulario(item) {
    await comboPromise;
    cambiarModoFormulario(true);
    document.getElementById('pagoId').value = item.id;
    const fechaLocal = item.fecha_pago ? item.fecha_pago.replace(' ', 'T').substring(0, 16) : '';
    helpers.llenarFormulario({ id_reservacion: item.id_reservacion, monto: item.monto, metodo: item.metodo, detalle: item.detalle, estado: item.estado, fecha_pago: fechaLocal, usuario: item.usuario });
    modalFormulario.show();
}

// ============ COMBOS ============
let comboPromise;

async function cargarReservaciones() {
    try {
        const reservaciones = await helpers.obtenerTodos('reservacion/reservacion.php');
        const select = document.getElementById('id_reservacion');
        const filtro = document.getElementById('filtroReservacion');
        reservaciones.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = `${r.id} - Cliente ${r.id_cliente} (${r.fecha_entrada} → ${r.fecha_salida})`;
            select.appendChild(opt);
            filtro.appendChild(opt.cloneNode(true));
        });
    } catch { /* sin reservaciones disponibles */ }
}

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));
    comboPromise = cargarReservaciones();

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

    document.getElementById('filtroReservacion')?.addEventListener('change', aplicarFiltros);
    document.getElementById('filtroId')?.addEventListener('change', aplicarFiltros);
    document.getElementById('btnLimpiarFiltros').addEventListener('click', () => {
        document.getElementById('filtroReservacion').value = '';
        document.getElementById('filtroId').value = '';
        aplicarFiltros();
    });

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
