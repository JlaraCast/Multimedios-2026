import * as helpers from './helpers.js';
import Cliente from '../models/cliente.js';
import ClienteDAO from '../dao/clienteDAO.js';

// ============ CONFIG ============
const ENDPOINT = 'cliente/cliente.php';
const CAMPOS = { nombre: 'nombre', apellidos: 'apellidos', correo: 'correo', telefono: 'telefono', identificacion: 'identificacion', usuario: 'usuario' };

// ============ STATE ============
let modoEdicion = false;
let modalFormulario;
const cache = new Map();
const clienteDAO = new ClienteDAO();

// ============ TABLA ============
function renderFila(cliente, num) {
    return `
        <td>${num}</td>
        <td>${cliente.nombre || ''}</td>
        <td>${cliente.apellidos || ''}</td>
        <td>${cliente.identificacion || ''}</td>
        <td>${cliente.correo || ''}</td>
        <td>${cliente.telefono || ''}</td>
        <td>
            <button class="btn btn-sm btn-warning me-1 btnEditar" data-id="${cliente.id}">Editar</button>
            <button class="btn btn-sm btn-danger btnEliminar" data-id="${cliente.id}">Eliminar</button>
        </td>`;
}

async function consultarAPI() {
    try {
        const datos = await helpers.obtenerTodos(ENDPOINT);
        cache.clear();
        datos.forEach(c => cache.set(String(c.id), c));
        helpers.dibujarTabla('cuerpoTabla', datos, renderFila);
    } catch {
        helpers.mostrarAlerta('Error al consultar clientes', 'danger', 'alertaPagina');
    }
}

// ============ VALIDACIÓN ============
function validarFormulario() {
    const datos = helpers.obtenerValores(CAMPOS);
    if (!helpers.requerido(datos.nombre)) { helpers.mostrarAlerta('El nombre es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.apellidos)) { helpers.mostrarAlerta('Los apellidos son requeridos', 'danger'); return false; }
    if (!helpers.esEmail(datos.correo)) { helpers.mostrarAlerta('El correo no es válido', 'danger'); return false; }
    if (!helpers.requerido(datos.telefono)) { helpers.mostrarAlerta('El teléfono es requerido', 'danger'); return false; }
    if (!helpers.requerido(datos.identificacion)) { helpers.mostrarAlerta('La identificación es requerida', 'danger'); return false; }
    if (!helpers.requerido(datos.usuario)) { helpers.mostrarAlerta('El usuario es requerido', 'danger'); return false; }
    return true;
}

// ============ UTILIDADES ============
function obtenerDatos() {
    const datos = helpers.obtenerValores(CAMPOS);
    datos.id = document.getElementById('clienteId').value || Date.now();
    return datos;
}

function cambiarModoFormulario(editar = false) {
    modoEdicion = editar;
    document.getElementById('tituloModal').textContent = editar ? 'Editar Cliente' : 'Crear Cliente';
    document.getElementById('btnSubmit').textContent = editar ? 'Guardar Cambios' : 'Guardar';
}

function limpiarFormulario() {
    document.getElementById('formulario').reset();
    document.getElementById('alertaFormulario').innerHTML = '';
    document.getElementById('clienteId').value = '';
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
async function insertarCliente() {
    const datos = obtenerDatos();
    try {
        const cliente = new Cliente(datos.id, datos.nombre, datos.apellidos, datos.correo, datos.telefono, datos.identificacion, datos.usuario);
        await helpers.crearRegistro(ENDPOINT, datos);
        clienteDAO.insertar(cliente);
        limpiarFormulario();
        modalFormulario.hide();
        helpers.mostrarAlerta('Cliente creado correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al crear cliente', 'danger');
    }
}

async function guardarEdicion() {
    const datos = obtenerDatos();
    try {
        const cliente = new Cliente(datos.id, datos.nombre, datos.apellidos, datos.correo, datos.telefono, datos.identificacion, datos.usuario);
        await helpers.actualizarRegistro(ENDPOINT, datos);
        clienteDAO.actualizar(datos.id, cliente);
        cancelarEdicion();
        modalFormulario.hide();
        helpers.mostrarAlerta('Cliente actualizado correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al actualizar cliente', 'danger');
    }
}

async function eliminarCliente(id) {
    if (!confirm('¿Está seguro que desea eliminar este cliente?')) return;
    try {
        await helpers.eliminarRegistro(ENDPOINT, id);
        clienteDAO.eliminar(id);
        helpers.mostrarAlerta('Cliente eliminado correctamente', 'success', 'alertaPagina');
        consultarAPI();
    } catch {
        helpers.mostrarAlerta('Error al eliminar cliente', 'danger', 'alertaPagina');
    }
}

function editarEnFormulario(item) {
    cambiarModoFormulario(true);
    document.getElementById('clienteId').value = item.id;
    helpers.llenarFormulario({ nombre: item.nombre, apellidos: item.apellidos, correo: item.correo, telefono: item.telefono, identificacion: item.identificacion, usuario: item.usuario });
    modalFormulario.show();
}

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    modalFormulario = new bootstrap.Modal(document.getElementById('modalFormulario'));

    document.getElementById('formulario').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            modoEdicion ? guardarEdicion() : insertarCliente();
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
        if (btn.classList.contains('btnEliminar')) eliminarCliente(btn.dataset.id);
    });

    consultarAPI();
    window.prepararFormularioAgregar = prepararFormularioAgregar;
});
