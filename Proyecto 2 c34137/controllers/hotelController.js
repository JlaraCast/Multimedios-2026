import * as helpers from './helpers.js';
import Hotel from '../models/hotel.js';
import HotelDAO from '../dao/hotelDAO.js';

// ============ CONFIG ============
const ENDPOINT = 'hotel/hotel.php';
const CAMPOS = { nombre: 'nombre', descripcion: 'descripcion', telefono: 'telefono', correo: 'correo', sitio_web: 'sitio_web', usuario: 'usuario' };

// ============ STATE ============
let modoEdicion = false;
let modalFormulario;
const cache = new Map();
const hotelDAO = new HotelDAO();
let allData = [];

// ============ TABLA ============
function renderFila(hotel, num) {
    const estadoBadge = hotel.estado === 'Inactivo'
        ? `<span class="badge bg-secondary">Inactivo</span>`
        : `<span class="badge bg-success">Activo</span>`;
    return `
        <td>${num}</td>
        <td>${hotel.nombre || ''}</td>
        <td>${hotel.descripcion || ''}</td>
        <td>${hotel.telefono || ''}</td>
        <td>${hotel.correo || ''}</td>
        <td>${hotel.sitio_web || ''}</td>
        <td>${estadoBadge}</td>
        <td>
            <button class="btn btn-sm btn-warning me-1 btnEditar" data-id="${hotel.id}">Editar</button>
            <button class="btn btn-sm btn-danger btnEliminar" data-id="${hotel.id}">Eliminar</button>
        </td>`;
}

async function consultarAPI() {
    try {
        const datos = await helpers.obtenerTodos(ENDPOINT);
        cache.clear();
        datos.forEach(h => cache.set(String(h.id), h));
        allData = datos;
        aplicarFiltros();
        poblarFiltroId();
    } catch {
        helpers.mostrarAlerta('Error al consultar hoteles', 'danger', 'alertaPagina');
    }
}

function aplicarFiltros() {
    const nombre = document.getElementById('filtroNombre')?.value.toLowerCase() || '';
    const id = document.getElementById('filtroId')?.value || '';
    let filtrados = allData;
    if (nombre) filtrados = filtrados.filter(h => (h.nombre || '').toLowerCase().includes(nombre));
    if (id) filtrados = filtrados.filter(h => String(h.id) === id);
    helpers.dibujarTabla('cuerpoTabla', filtrados, renderFila);
}

function poblarFiltroId() {
    const select = document.getElementById('filtroId');
    const val = select.value;
    select.innerHTML = '<option value="">Todos</option>';
    allData.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h.id;
        opt.textContent = `${h.id} - ${h.nombre}`;
        select.appendChild(opt);
    });
    select.value = val;
}

// ============ VALIDACIÓN ============
function validarFormulario() {
    const datos = helpers.obtenerValores(CAMPOS);
    if (!helpers.requerido(datos.nombre)) { helpers.mostrarAlerta('El nombre es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.descripcion)) { helpers.mostrarAlerta('La descripción es requerida', 'danger'); return false; }
    if (!helpers.requerido(datos.telefono)) { helpers.mostrarAlerta('El teléfono es requerido', 'danger'); return false; }
    if (!helpers.esEmail(datos.correo)) { helpers.mostrarAlerta('El correo no es válido', 'danger'); return false; }
    if (!helpers.requerido(datos.sitio_web)) { helpers.mostrarAlerta('El sitio web es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.usuario)) { helpers.mostrarAlerta('El usuario es requerido', 'danger'); return false; }
    return true;
}

// ============ UTILIDADES ============
function obtenerDatos() {
    const datos = helpers.obtenerValores(CAMPOS);
    datos.id = document.getElementById('hotelId').value || Date.now();
    return datos;
}

function cambiarModoFormulario(editar = false) {
    modoEdicion = editar;
    document.getElementById('tituloModal').textContent = editar ? 'Editar Hotel' : 'Crear Hotel';
    document.getElementById('btnSubmit').textContent = editar ? 'Guardar Cambios' : 'Guardar';
}

function limpiarFormulario() {
    document.getElementById('formulario').reset();
    document.getElementById('alertaFormulario').innerHTML = '';
    document.getElementById('hotelId').value = '';
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
async function insertarHotel() {
    const datos = obtenerDatos();
    try {
        const hotel = new Hotel(datos.id, datos.nombre, datos.descripcion, datos.telefono, datos.correo, datos.sitio_web, datos.usuario);
        const { id, ...payload } = datos;
        await helpers.crearRegistro(ENDPOINT, payload);
        hotelDAO.insertar(hotel);
        limpiarFormulario();
        modalFormulario.hide();
        helpers.mostrarAlerta('Hotel creado correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al crear hotel', 'danger');
    }
}

async function guardarEdicion() {
    const datos = obtenerDatos();
    try {
        const hotel = new Hotel(datos.id, datos.nombre, datos.descripcion, datos.telefono, datos.correo, datos.sitio_web, datos.usuario);
        await helpers.actualizarRegistro(ENDPOINT, datos);
        hotelDAO.actualizar(datos.id, hotel);
        cancelarEdicion();
        modalFormulario.hide();
        helpers.mostrarAlerta('Hotel actualizado correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al actualizar hotel', 'danger');
    }
}

async function eliminarHotel(id) {
    if (!confirm('¿Está seguro que desea eliminar este hotel?')) return;
    try {
        await helpers.eliminarRegistro(ENDPOINT, id);
        hotelDAO.eliminar(id);
        helpers.mostrarAlerta('Hotel eliminado correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al eliminar hotel', 'danger', 'alertaPagina');
    }
}

function editarEnFormulario(item) {
    cambiarModoFormulario(true);
    document.getElementById('hotelId').value = item.id;
    helpers.llenarFormulario({ nombre: item.nombre, descripcion: item.descripcion, telefono: item.telefono, correo: item.correo, sitio_web: item.sitio_web, usuario: item.usuario });
    modalFormulario.show();
}

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));

    document.getElementById('formulario').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            modoEdicion ? guardarEdicion() : insertarHotel();
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
        if (btn.classList.contains('btnEliminar')) eliminarHotel(btn.dataset.id);
    });

    consultarAPI();
    window.prepararFormularioAgregar = prepararFormularioAgregar;
});
