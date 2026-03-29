/**
 * ============================================================================
 * COMMENTS.JS - Módulo de Gestión de Comentarios Frontend
 * ============================================================================
 *
 * Archivo: assets/js/comments.js
 * Rol: 2 - Frontend JavaScript
 * Autor: Juan Dincey Victorino Mañon
 * Matricula: 2022-0900
 *
 * DESCRIPCIÓN:
 * Este archivo maneja toda la lógica del frontend relacionada con los
 * comentarios: cargar, mostrar, crear y eliminar. Usa fetch() para
 * comunicarse con la API del backend.
 *
 * FUNCIONALIDADES:
 * - Cargar y mostrar comentarios al abrir la página
 * - Enviar nuevos comentarios
 * - Eliminar comentarios propios (solo si es_mio: true)
 * - Paginación de comentarios
 * - Cerrar sesión (logout)
 *
 * ENDPOINTS QUE CONSUME:
 * - GET    /api/comment_list.php?pagina=N → Obtener lista de comentarios
 * - POST   /api/comment_create.php        → Crear un nuevo comentario
 * - DELETE /api/comment_delete.php        → Eliminar un comentario propio
 * - POST   /api/auth_logout.php           → Cerrar sesión
 *
 * ELEMENTOS HTML REQUERIDOS (creados por Rol 1 en index.php):
 *   - textarea#comentario-texto  → Área de texto para escribir comentario
 *   - button#enviar-btn          → Botón para enviar comentario
 *   - div#lista-comentarios      → Contenedor donde se insertan los comentarios
 *   - div#comment-error          → (opcional) Para mostrar errores
 *   - div#paginacion             → (opcional) Para controles de paginación
 *   - button#logout-btn          → (opcional) Botón para cerrar sesión
 *   - span#usuario-nombre        → (opcional) Mostrar nombre del usuario logueado
 * ============================================================================
 */

/**
 * Variable global para almacenar la página actual de comentarios.
 * Se usa para la paginación.
 * @type {number}
 */
let paginaActual = 1;

/**
 * Variable para almacenar el total de páginas disponibles.
 * Se actualiza cada vez que se cargan los comentarios.
 * @type {number}
 */
let totalPaginas = 1;

/**
 * Evento principal que se ejecuta cuando el DOM está completamente cargado.
 * Inicializa todos los event listeners y carga los comentarios iniciales.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Restaurar comentario pendiente si vuelve del login
    const pendiente = localStorage.getItem('comentario_pendiente');
    if (pendiente) {
        const textarea = document.getElementById('comentario-texto');
        if (textarea) textarea.value = pendiente;
        localStorage.removeItem('comentario_pendiente');
    }

    // Cargar comentarios al iniciar la página
    cargarComentarios();

    // Configurar el evento para enviar nuevos comentarios
    configurarEnvioComentario();

    // Configurar el botón de logout si existe
    configurarLogout();
});

// ============================================================================
// FUNCIÓN: cargarComentarios
// ============================================================================
/**
 * Carga los comentarios desde la API y los renderiza en el DOM.
 *
 * Esta función hace una petición GET al endpoint comment_list.php,
 * que devuelve un JSON con la lista de comentarios y datos de paginación.
 *
 * @param {number} pagina - Número de página a cargar (por defecto 1)
 *
 * RESPUESTA ESPERADA DE LA API:
 * {
 *   "ok": true,
 *   "comentarios": [
 *     {
 *       "id": 1,
 *       "contenido": "Texto del comentario",
 *       "nombre": "Nombre del usuario",
 *       "creado_en": "2024-01-15 10:30:00",
 *       "es_mio": true/false
 *     },
 *     ...
 *   ],
 *   "pagina_actual": 1,
 *   "total_paginas": 5
 * }
 */
async function cargarComentarios(pagina = 1) {
    // Obtiene referencia al contenedor donde se mostrarán los comentarios
    const listaComentarios = document.getElementById('lista-comentarios');

    // Verifica que el contenedor exista en el DOM
    if (!listaComentarios) {
        console.error('Error: No se encontró el elemento #lista-comentarios');
        return;
    }

    try {
        // Muestra un indicador de carga mientras se obtienen los datos
        listaComentarios.innerHTML = '<p class="text-center text-muted">Cargando comentarios...</p>';

        /**
         * Realiza petición GET a la API de listado de comentarios.
         * El parámetro ?pagina=N permite la paginación.
         */
        const res = await fetch(`api/comment_list.php?pagina=${pagina}`, {
            credentials: 'same-origin',
        });
        const data = await res.json();

        if (data.ok) {
            // Actualiza las variables de paginación
            paginaActual = data.pagina_actual || 1;
            totalPaginas = data.total_paginas || 1;

            // Renderiza los comentarios en el DOM
            renderizarComentarios(data.comentarios);

            // Actualiza los controles de paginación si existen
            renderizarPaginacion();
        } else {
            // Muestra error si la API devuelve ok: false
            listaComentarios.innerHTML = `
                <div class="alert alert-warning">
                    ${data.error || 'No se pudieron cargar los comentarios'}
                </div>
            `;
        }
    } catch (error) {
        // Error de conexión (sin internet, servidor caído, etc.)
        console.error('Error al cargar comentarios:', error);
        listaComentarios.innerHTML = `
            <div class="alert alert-danger">
                Error de conexión. Por favor, recarga la página.
            </div>
        `;
    }
}

// ============================================================================
// FUNCIÓN: renderizarComentarios
// ============================================================================
/**
 * Inserta los comentarios en el DOM usando HTML dinámico.
 *
 * Genera una tarjeta (card) Bootstrap para cada comentario, mostrando:
 * - Nombre del autor
 * - Fecha de creación
 * - Contenido del comentario
 * - Botón eliminar (solo si es_mio: true)
 *
 * @param {Array} comentarios - Array de objetos comentario de la API
 *
 * ESTRUCTURA DE CADA COMENTARIO:
 * {
 *   id: number,          → ID único del comentario
 *   contenido: string,   → Texto del comentario
 *   nombre: string,      → Nombre del usuario que lo escribió
 *   creado_en: string,   → Fecha y hora de creación
 *   es_mio: boolean      → true si el comentario pertenece al usuario actual
 * }
 */
function renderizarComentarios(comentarios) {
    const listaComentarios = document.getElementById('lista-comentarios');

    // Si no hay comentarios, muestra mensaje informativo
    if (!comentarios || comentarios.length === 0) {
        listaComentarios.innerHTML = `
            <div class="text-center text-muted py-4">
                <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
            </div>
        `;
        return;
    }

    /**
     * Genera el HTML para cada comentario usando map() y join().
     * map() transforma cada objeto en una string HTML.
     * join('') une todas las strings sin separador.
     */
    const html = comentarios.map(comentario => {
        /**
         * Formatea la fecha para mostrarla de forma legible.
         * Convierte "2024-01-15 10:30:00" a formato local.
         */
        const fecha = formatearFecha(comentario.creado_en);

        /**
         * El botón eliminar solo se muestra si es_mio es true.
         * Esto viene determinado por el backend comparando usuario_id
         * con el ID del usuario en sesión.
         */
        const botonEliminar = comentario.es_mio
            ? `<button class="btn btn-sm btn-outline-danger btn-eliminar"
                       data-id="${comentario.id}"
                       title="Eliminar comentario">
                   <i class="bi bi-trash"></i> Eliminar
               </button>`
            : '';

        /**
         * Escapa el contenido del comentario para prevenir XSS.
         * Esto es una capa adicional de seguridad (el backend también debe sanitizar).
         */
        const contenidoSeguro = escaparHTML(comentario.contenido);

        // Retorna la tarjeta HTML del comentario
        return `
            <div class="card mb-3 comentario-card" data-id="${comentario.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h6 class="card-subtitle mb-1 text-primary">
                                <i class="bi bi-person-circle"></i> ${escaparHTML(comentario.nombre)}
                            </h6>
                            <small class="text-muted">
                                <i class="bi bi-clock"></i> ${fecha}
                            </small>
                        </div>
                        ${botonEliminar}
                    </div>
                    <p class="card-text mt-2">${contenidoSeguro}</p>
                </div>
            </div>
        `;
    }).join('');

    // Inserta todo el HTML generado en el contenedor
    listaComentarios.innerHTML = html;

    // Configura los event listeners para los botones de eliminar
    configurarBotonesEliminar();
}

// ============================================================================
// FUNCIÓN: configurarEnvioComentario
// ============================================================================
/**
 * Configura el evento click del botón "Enviar" para crear nuevos comentarios.
 *
 * FLUJO:
 * 1. Obtiene el texto del textarea
 * 2. Valida que no esté vacío
 * 3. Envía POST a la API
 * 4. Si ok:true, limpia el textarea y recarga los comentarios
 * 5. Si ok:false, muestra el error
 */
function configurarEnvioComentario() {
    const enviarBtn = document.getElementById('enviar-btn');
    const textarea = document.getElementById('comentario-texto');

    // Verifica que los elementos existan
    if (!enviarBtn || !textarea) {
        console.warn('Elementos de formulario de comentario no encontrados');
        return;
    }

    /**
     * Event listener para el clic en el botón enviar.
     * Usamos async para poder usar await con fetch().
     */
    enviarBtn.addEventListener('click', async () => {
        // Obtiene el contenido del textarea y elimina espacios extra
        const contenido = textarea.value.trim();

        // Validación: no permite comentarios vacíos
        if (!contenido) {
            mostrarError('Escribe algo antes de enviar');
            return;
        }

        // Validación: longitud máxima (opcional, ajustar según necesidad)
        if (contenido.length > 1000) {
            mostrarError('El comentario es demasiado largo (máximo 1000 caracteres)');
            return;
        }

        // Deshabilita el botón mientras se envía para evitar doble clic
        enviarBtn.disabled = true;
        enviarBtn.textContent = 'Enviando...';

        try {
            /**
             * Envía el comentario al backend.
             * El backend (Rol 3) verificará que haya sesión activa
             * antes de insertar en la base de datos.
             */
            const res = await fetch('api/comment_create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ contenido }),
            });

            const data = await res.json();

            if (data.ok) {
                // Éxito: limpia el textarea y recarga los comentarios
                textarea.value = '';
                ocultarError();

                // Recarga la primera página para ver el nuevo comentario
                await cargarComentarios(1);

                // Muestra mensaje de éxito temporal (opcional)
                mostrarExito('Comentario publicado correctamente');
            } else {
                // Error de la API (ej: "No autenticado")
                mostrarError(data.error || 'No se pudo enviar el comentario');

                // Si no está autenticado, guardar texto y redirigir al login
                if (data.error === 'No autenticado') {
                    localStorage.setItem('comentario_pendiente', contenido);
                    window.location.href = 'login.php';
                    return;
                }
            }
        } catch (error) {
            console.error('Error al enviar comentario:', error);
            mostrarError('Error de conexión. Intenta de nuevo.');
        } finally {
            // Rehabilita el botón sin importar el resultado
            enviarBtn.disabled = false;
            enviarBtn.textContent = 'Enviar';
        }
    });

    /**
     * Permite enviar el comentario presionando Ctrl+Enter.
     * Mejora la experiencia de usuario.
     */
    textarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            enviarBtn.click();
        }
    });
}

// ============================================================================
// FUNCIÓN: configurarBotonesEliminar
// ============================================================================
/**
 * Configura los event listeners para todos los botones "Eliminar".
 *
 * Esta función se llama después de renderizar los comentarios,
 * ya que los botones se crean dinámicamente.
 *
 * Usa delegación de eventos: en lugar de añadir un listener a cada botón,
 * selecciona todos los botones con clase .btn-eliminar.
 */
function configurarBotonesEliminar() {
    // Selecciona todos los botones eliminar
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');

    botonesEliminar.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            // Obtiene el ID del comentario desde el atributo data-id
            const comentarioId = btn.dataset.id;

            // Pide confirmación antes de eliminar
            if (!confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
                return;
            }

            // Deshabilita el botón mientras se procesa
            btn.disabled = true;

            try {
                /**
                 * Envía petición DELETE a la API.
                 * El backend (Rol 4) verificará que el comentario
                 * pertenezca al usuario en sesión antes de eliminarlo.
                 */
                const res = await fetch('api/comment_delete.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin',
                    body: JSON.stringify({ id: comentarioId }),
                });

                const data = await res.json();

                if (data.ok) {
                    // Éxito: elimina la tarjeta del DOM con animación
                    const card = document.querySelector(`.comentario-card[data-id="${comentarioId}"]`);
                    if (card) {
                        card.style.transition = 'opacity 0.3s';
                        card.style.opacity = '0';
                        setTimeout(() => card.remove(), 300);
                    }

                    mostrarExito('Comentario eliminado');
                } else {
                    mostrarError(data.error || 'No se pudo eliminar el comentario');
                    btn.disabled = false;
                }
            } catch (error) {
                console.error('Error al eliminar comentario:', error);
                mostrarError('Error de conexión');
                btn.disabled = false;
            }
        });
    });
}

// ============================================================================
// FUNCIÓN: configurarLogout
// ============================================================================
/**
 * Configura el botón de cerrar sesión.
 *
 * Al hacer clic, envía POST a auth_logout.php y redirige al login.
 */
function configurarLogout() {
    const logoutBtn = document.getElementById('logout-btn');

    if (!logoutBtn) {
        return; // El botón es opcional
    }

    logoutBtn.addEventListener('click', async () => {
        try {
            // Envía petición de logout al backend
            const res = await fetch('api/auth_logout.php', {
                method: 'POST',
                credentials: 'same-origin',
            });

            const data = await res.json();

            if (data.ok) {
                // Redirige al login
                window.location.href = 'login.php';
            } else {
                mostrarError('Error al cerrar sesión');
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Aún si hay error, redirige al login
            window.location.href = 'login.php';
        }
    });
}

// ============================================================================
// FUNCIÓN: renderizarPaginacion
// ============================================================================
/**
 * Renderiza los controles de paginación.
 *
 * Muestra botones "Anterior" y "Siguiente" junto con el número
 * de página actual y total.
 */
function renderizarPaginacion() {
    const contenedorPaginacion = document.getElementById('paginacion');

    if (!contenedorPaginacion) {
        return; // La paginación es opcional
    }

    // Si solo hay una página, oculta la paginación
    if (totalPaginas <= 1) {
        contenedorPaginacion.innerHTML = '';
        return;
    }

    contenedorPaginacion.innerHTML = `
        <nav aria-label="Navegación de comentarios">
            <ul class="pagination justify-content-center">
                <li class="page-item ${paginaActual <= 1 ? 'disabled' : ''}">
                    <button class="page-link" id="btn-anterior">Anterior</button>
                </li>
                <li class="page-item disabled">
                    <span class="page-link">Página ${paginaActual} de ${totalPaginas}</span>
                </li>
                <li class="page-item ${paginaActual >= totalPaginas ? 'disabled' : ''}">
                    <button class="page-link" id="btn-siguiente">Siguiente</button>
                </li>
            </ul>
        </nav>
    `;

    // Configura eventos de los botones de paginación
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');

    if (btnAnterior && paginaActual > 1) {
        btnAnterior.addEventListener('click', () => {
            cargarComentarios(paginaActual - 1);
        });
    }

    if (btnSiguiente && paginaActual < totalPaginas) {
        btnSiguiente.addEventListener('click', () => {
            cargarComentarios(paginaActual + 1);
        });
    }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Formatea una fecha ISO a formato legible en español.
 *
 * @param {string} fechaISO - Fecha en formato "YYYY-MM-DD HH:MM:SS"
 * @returns {string} - Fecha formateada (ej: "15 de enero de 2024, 10:30")
 */
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'Fecha desconocida';

    try {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return fechaISO; // Si falla, devuelve la fecha original
    }
}

/**
 * Escapa caracteres HTML especiales para prevenir ataques XSS.
 *
 * Convierte caracteres como < > & " ' a sus entidades HTML.
 *
 * @param {string} texto - Texto a escapar
 * @returns {string} - Texto seguro para insertar en HTML
 */
function escaparHTML(texto) {
    if (!texto) return '';

    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Muestra un mensaje de error en el UI.
 *
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(mensaje) {
    const errorDiv = document.getElementById('comment-error');

    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.classList.remove('d-none');
        errorDiv.classList.add('alert', 'alert-danger');
    } else {
        // Fallback: usa alert si no existe el div de error
        alert(mensaje);
    }
}

/**
 * Oculta el mensaje de error.
 */
function ocultarError() {
    const errorDiv = document.getElementById('comment-error');

    if (errorDiv) {
        errorDiv.classList.add('d-none');
    }
}

/**
 * Muestra un mensaje de éxito temporal.
 *
 * @param {string} mensaje - Mensaje de éxito a mostrar
 */
function mostrarExito(mensaje) {
    const exitoDiv = document.getElementById('comment-exito');

    if (exitoDiv) {
        exitoDiv.textContent = mensaje;
        exitoDiv.classList.remove('d-none');
        exitoDiv.classList.add('alert', 'alert-success');

        // Oculta el mensaje después de 3 segundos
        setTimeout(() => {
            exitoDiv.classList.add('d-none');
        }, 3000);
    }
}
