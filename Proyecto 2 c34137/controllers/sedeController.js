import * as helpers from './helpers.js';
import Sede from '../models/sede.js';
import SedeDAO from '../dao/sedeDAO.js';

// ============ CONFIG ============
const ENDPOINT = 'sede/sede.php';
const CAMPOS = { id_hotel: 'id_hotel', nombre: 'nombre', pais: 'pais', provincia: 'provincia', ciudad: 'ciudad', direccion: 'direccion', telefono: 'telefono', correo: 'correo', cantidad_habitaciones: 'cantidad_habitaciones', usuario: 'usuario' };

// ============ STATE ============
let modoEdicion = false;
let modalFormulario;
const cache = new Map();
const sedeDAO = new SedeDAO();
let allData = [];

// ============ TABLA ============
function renderFila(sede, num) {
    return `
        <td>${num}</td>
        <td>${sede.nombre || ''}</td>
        <td>${sede.pais || ''}</td>
        <td>${sede.provincia || ''}</td>
        <td>${sede.ciudad || ''}</td>
        <td>${sede.direccion || ''}</td>
        <td>${sede.telefono || ''}</td>
        <td>${sede.correo || ''}</td>
        <td>${sede.cantidad_habitaciones ?? ''}</td>
        <td>${sede.id_hotel || ''}</td>
        <td>
            <button class="btn btn-sm btn-warning me-1 btnEditar" data-id="${sede.id}">Editar</button>
            <button class="btn btn-sm btn-danger btnEliminar" data-id="${sede.id}">Eliminar</button>
        </td>`;
}

async function consultarAPI() {
    try {
        const datos = await helpers.obtenerTodos(ENDPOINT);
        cache.clear();
        datos.forEach(s => cache.set(String(s.id), s));
        allData = datos;
        aplicarFiltros();
        poblarFiltroId();
    } catch {
        helpers.mostrarAlerta('Error al consultar sedes', 'danger', 'alertaPagina');
    }
}

function aplicarFiltros() {
    const nombre = document.getElementById('filtroNombre')?.value.toLowerCase() || '';
    const id = document.getElementById('filtroId')?.value || '';
    let filtrados = allData;
    if (nombre) filtrados = filtrados.filter(s => (s.nombre || '').toLowerCase().includes(nombre));
    if (id) filtrados = filtrados.filter(s => String(s.id) === id);
    helpers.dibujarTabla('cuerpoTabla', filtrados, renderFila);
}

function poblarFiltroId() {
    const select = document.getElementById('filtroId');
    const val = select.value;
    select.innerHTML = '<option value="">Todas</option>';
    allData.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.id} - ${s.nombre}`;
        select.appendChild(opt);
    });
    select.value = val;
}

// ============ VALIDACIÓN ============
function validarFormulario() {
    const datos = helpers.obtenerValores(CAMPOS);
    if (!helpers.requerido(datos.id_hotel)) { helpers.mostrarAlerta('El ID de hotel es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.nombre)) { helpers.mostrarAlerta('El nombre es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.pais)) { helpers.mostrarAlerta('El país es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.provincia)) { helpers.mostrarAlerta('La provincia es requerida', 'danger'); return false; }
    if (!helpers.requerido(datos.ciudad)) { helpers.mostrarAlerta('La ciudad es requerida', 'danger'); return false; }
    if (!helpers.requerido(datos.direccion)) { helpers.mostrarAlerta('La dirección es requerida', 'danger'); return false; }
    if (!helpers.requerido(datos.telefono)) { helpers.mostrarAlerta('El teléfono es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.usuario)) { helpers.mostrarAlerta('El usuario es requerido', 'danger'); return false; }
    return true;
}

// ============ UTILIDADES ============
function obtenerDatos() {
    const datos = helpers.obtenerValores(CAMPOS);
    datos.id = document.getElementById('sedeId').value || Date.now();
    datos.cantidad_habitaciones = parseInt(datos.cantidad_habitaciones) || 0;
    return datos;
}

function cambiarModoFormulario(editar = false) {
    modoEdicion = editar;
    document.getElementById('tituloModal').textContent = editar ? 'Editar Sede' : 'Crear Sede';
    document.getElementById('btnSubmit').textContent = editar ? 'Guardar Cambios' : 'Guardar';
}

function limpiarFormulario() {
    document.getElementById('formulario').reset();
    document.getElementById('alertaFormulario').innerHTML = '';
    document.getElementById('sedeId').value = '';
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
async function insertarSede() {
    const datos = obtenerDatos();
    try {
        const sede = new Sede(datos.id, datos.id_hotel, datos.nombre, datos.pais, datos.provincia, datos.ciudad, datos.direccion, datos.telefono, datos.correo, datos.cantidad_habitaciones, datos.usuario);
        const { id, ...payload } = datos;
        await helpers.crearRegistro(ENDPOINT, payload);
        sedeDAO.insertar(sede);
        limpiarFormulario();
        modalFormulario.hide();
        helpers.mostrarAlerta('Sede creada correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al crear sede', 'danger');
    }
}

async function guardarEdicion() {
    const datos = obtenerDatos();
    try {
        const sede = new Sede(datos.id, datos.id_hotel, datos.nombre, datos.pais, datos.provincia, datos.ciudad, datos.direccion, datos.telefono, datos.correo, datos.cantidad_habitaciones, datos.usuario);
        await helpers.actualizarRegistro(ENDPOINT, datos);
        sedeDAO.actualizar(datos.id, sede);
        cancelarEdicion();
        modalFormulario.hide();
        helpers.mostrarAlerta('Sede actualizada correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al actualizar sede', 'danger');
    }
}

async function eliminarSede(id) {
    if (!confirm('¿Está seguro que desea eliminar esta sede?')) return;
    try {
        await helpers.eliminarRegistro(ENDPOINT, id);
        sedeDAO.eliminar(id);
        helpers.mostrarAlerta('Sede eliminada correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al eliminar sede', 'danger', 'alertaPagina');
    }
}

async function editarEnFormulario(item) {
    await comboPromise;
    cambiarModoFormulario(true);
    document.getElementById('sedeId').value = item.id;
    helpers.llenarFormulario({ id_hotel: item.id_hotel, nombre: item.nombre, pais: item.pais, provincia: item.provincia, ciudad: item.ciudad, direccion: item.direccion, telefono: item.telefono, correo: item.correo, cantidad_habitaciones: item.cantidad_habitaciones, usuario: item.usuario });
    modalFormulario.show();
}

// ============ COMBOS ============
let comboPromise;

async function cargarHoteles() {
    try {
        const hoteles = await helpers.obtenerTodos('hotel/hotel.php');
        const select = document.getElementById('id_hotel');
        hoteles.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h.id;
            opt.textContent = `${h.id} - ${h.nombre}`;
            select.appendChild(opt);
        });
    } catch { /* sin hoteles disponibles */ }
}

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));
    comboPromise = cargarHoteles();

    document.getElementById('formulario').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            modoEdicion ? guardarEdicion() : insertarSede();
        }
    });

    document.getElementById('modalFormulario').addEventListener('hidden.bs.modal', () => {
        if (!modoEdicion) limpiarFormulario();
    });

    document.getElementById('btnCancelarModal').addEventListener('click', cancelarEdicion);

    document.getElementById('filtroNombre').addEventListener('input', aplicarFiltros);
    document.getElementById('filtroId').addEventListener('change', aplicarFiltros);
    document.getElementById('btnLimpiarFiltros').addEventListener('click', () => {
        document.getElementById('filtroNombre').value = '';
        document.getElementById('filtroId').value = '';
        aplicarFiltros();
    });

    document.getElementById('cuerpoTabla').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const item = cache.get(String(btn.dataset.id));
        if (btn.classList.contains('btnEditar') && item) editarEnFormulario(item);
        if (btn.classList.contains('btnEliminar')) eliminarSede(btn.dataset.id);
    });

    consultarAPI();
    window.prepararFormularioAgregar = prepararFormularioAgregar;
});
