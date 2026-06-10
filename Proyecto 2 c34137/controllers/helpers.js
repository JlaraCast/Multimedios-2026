// ============ HELPERS GENERALES - Sistema Hotelero ============

const API_BASE = 'https://paginas-web-cr.com/Api/hotelApi/';

// --- FETCH API ---

export async function hacerFetch(endpoint, metodo, datos = null) {
    const config = { method: metodo, headers: { 'Content-Type': 'application/json' } };
    if (datos) config.body = JSON.stringify(datos);
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

export async function obtenerTodos(endpoint) {
    const resultado = await hacerFetch(endpoint, 'GET');
    return resultado.data || resultado || [];
}

export async function crearRegistro(endpoint, datos) {
    return hacerFetch(endpoint, 'POST', datos);
}

export async function actualizarRegistro(endpoint, datos) {
    return hacerFetch(endpoint, 'PUT', datos);
}

export async function eliminarRegistro(endpoint, id) {
    return hacerFetch(endpoint, 'DELETE', { id });
}

// --- FORMULARIO ---

export function obtenerValores(campos) {
    const datos = {};
    for (const [key, id] of Object.entries(campos)) {
        const el = document.getElementById(id);
        datos[key] = el ? el.value.trim() : '';
    }
    return datos;
}

export function llenarFormulario(campos) {
    for (const [id, valor] of Object.entries(campos)) {
        const el = document.getElementById(id);
        if (el) el.value = valor ?? '';
    }
}

// --- ALERTAS ---
// elementId: 'alertaFormulario' para errores en modal, 'alertaPagina' para mensajes de éxito

export function mostrarAlerta(mensaje, tipo = 'success', elementId = 'alertaFormulario') {
    const contenedor = document.getElementById(elementId);
    if (!contenedor) return;
    contenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    if (tipo !== 'danger') {
        setTimeout(() => { contenedor.innerHTML = ''; }, 3500);
    }
}

// --- TABLA ---

export function dibujarTabla(tbodyId, datos, renderFila) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    if (!Array.isArray(datos) || datos.length === 0) {
        const cols = tbody.closest('table').querySelectorAll('th').length;
        tbody.innerHTML = `<tr><td colspan="${cols}" class="text-center text-muted py-3">No hay registros disponibles</td></tr>`;
        return;
    }
    tbody.innerHTML = datos.map((item, i) => `<tr>${renderFila(item, i + 1)}</tr>`).join('');
}

// --- VALIDACIONES ---

export function requerido(valor) {
    return valor != null && String(valor).trim().length > 0;
}

export function esEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

export function esNumeroPositivo(valor) {
    return !isNaN(parseFloat(valor)) && parseFloat(valor) > 0;
}
