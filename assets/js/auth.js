/**
 * ============================================================================
 * AUTH.JS - Módulo de Autenticación Frontend
 * ============================================================================
 *
 * Archivo: assets/js/auth.js
 * Rol: 2 - Frontend JavaScript
 * Autor: [Tu nombre]
 *
 * DESCRIPCIÓN:
 * Este archivo conecta los formularios HTML de login y registro con la API
 * del backend usando fetch(). No contiene lógica PHP, solo JavaScript puro.
 *
 * FUNCIONALIDADES:
 * - Manejo del formulario de login (login.php)
 * - Manejo del formulario de registro (register.php)
 * - Validación de campos vacíos en el cliente
 * - Comunicación con la API mediante fetch() con método POST
 * - Redirección automática a index.php si la autenticación es exitosa
 * - Visualización de mensajes de error en el DOM
 *
 * ENDPOINTS QUE CONSUME:
 * - POST /api/auth_login.php    → Para iniciar sesión
 * - POST /api/auth_register.php → Para crear una nueva cuenta
 *
 * ELEMENTOS HTML REQUERIDOS (creados por Rol 1):
 * En login.php:
 *   - form#login-form         → Formulario de login
 *   - input#login-email       → Campo de email
 *   - input#login-password    → Campo de contraseña
 *   - div#login-error         → Contenedor para mensajes de error
 *
 * En register.php:
 *   - form#register-form      → Formulario de registro
 *   - input#register-nombre   → Campo de nombre
 *   - input#register-email    → Campo de email
 *   - input#register-password → Campo de contraseña
 *   - div#register-error      → Contenedor para mensajes de error
 * ============================================================================
 */

/**
 * Evento principal que se ejecuta cuando el DOM está completamente cargado.
 * Esto garantiza que todos los elementos HTML estén disponibles antes de
 * intentar acceder a ellos.
 */
document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // SECCIÓN: MANEJO DEL LOGIN
    // ========================================================================

    /**
     * Obtiene referencia al formulario de login.
     * Si el formulario no existe en la página actual, loginForm será null
     * y el bloque if no se ejecutará (esto ocurre en register.php).
     */
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        /**
         * Manejador del evento submit del formulario de login.
         *
         * @param {Event} e - Evento del formulario
         *
         * FLUJO:
         * 1. Previene el envío tradicional del formulario
         * 2. Oculta mensajes de error previos
         * 3. Obtiene y valida los valores de los campos
         * 4. Envía petición POST a la API
         * 5. Procesa la respuesta JSON
         * 6. Redirige a index.php si ok:true, o muestra error si ok:false
         */
        loginForm.addEventListener('submit', async (e) => {
            // Previene que el formulario se envíe de forma tradicional (recarga de página)
            e.preventDefault();

            // Obtiene referencia al div donde se mostrarán los errores
            const errorDiv = document.getElementById('login-error');

            // Oculta cualquier mensaje de error anterior agregando la clase Bootstrap d-none
            errorDiv.classList.add('d-none');

            // ----------------------------------------------------------------
            // PASO 1: Obtener valores de los campos de entrada
            // ----------------------------------------------------------------
            // .value obtiene el texto ingresado por el usuario
            // .trim() elimina espacios en blanco al inicio y final
            const email    = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            // ----------------------------------------------------------------
            // PASO 2: Validación en el cliente (frontend)
            // ----------------------------------------------------------------
            // Verifica que ambos campos tengan contenido antes de enviar al servidor
            // Esto mejora la experiencia de usuario al dar feedback inmediato
            if (!email || !password) {
                errorDiv.textContent = 'Completa todos los campos';
                errorDiv.classList.remove('d-none'); // Muestra el div de error
                return; // Detiene la ejecución, no se envía al servidor
            }

            // ----------------------------------------------------------------
            // PASO 3: Enviar petición a la API usando fetch()
            // ----------------------------------------------------------------
            try {
                /**
                 * fetch() realiza una petición HTTP asíncrona al servidor.
                 *
                 * Configuración:
                 * - method: 'POST' → Método HTTP para enviar datos
                 * - headers → Indica que enviamos JSON
                 * - body → Datos en formato JSON (email y password)
                 *
                 * JSON.stringify() convierte el objeto JavaScript a string JSON
                 */
                const res = await fetch('api/auth_login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                /**
                 * res.json() parsea la respuesta del servidor de JSON a objeto JavaScript.
                 * La API siempre devuelve: {"ok": true/false, ...}
                 */
                const data = await res.json();

                // ----------------------------------------------------------------
                // PASO 4: Procesar respuesta de la API
                // ----------------------------------------------------------------
                if (data.ok) {
                    // Login exitoso: redirige a la página principal de comentarios
                    window.location.href = 'index.php';
                } else {
                    // Login fallido: muestra el mensaje de error devuelto por la API
                    // Por ejemplo: "Email o contraseña incorrectos"
                    errorDiv.textContent = data.error;
                    errorDiv.classList.remove('d-none');
                }
            } catch {
                // ----------------------------------------------------------------
                // MANEJO DE ERRORES DE RED
                // ----------------------------------------------------------------
                // Si fetch() falla (sin conexión, servidor caído, etc.)
                // muestra un mensaje genérico de error
                errorDiv.textContent = 'Error de conexión';
                errorDiv.classList.remove('d-none');
            }
        });
    }

    // ========================================================================
    // SECCIÓN: MANEJO DEL REGISTRO
    // ========================================================================

    /**
     * Obtiene referencia al formulario de registro.
     * Similar al login, solo se ejecuta si el formulario existe en la página.
     */
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        /**
         * Manejador del evento submit del formulario de registro.
         *
         * @param {Event} e - Evento del formulario
         *
         * FLUJO:
         * 1. Previene el envío tradicional del formulario
         * 2. Oculta mensajes de error previos
         * 3. Obtiene y valida los valores de los campos
         * 4. Valida longitud mínima de contraseña (6 caracteres)
         * 5. Envía petición POST a la API de registro
         * 6. Procesa la respuesta JSON
         * 7. Redirige a index.php si ok:true, o muestra error si ok:false
         */
        registerForm.addEventListener('submit', async (e) => {
            // Previene el comportamiento por defecto del formulario
            e.preventDefault();

            // Obtiene referencia al div de errores del registro
            const errorDiv = document.getElementById('register-error');

            // Oculta errores anteriores
            errorDiv.classList.add('d-none');

            // ----------------------------------------------------------------
            // PASO 1: Obtener valores de los campos de entrada
            // ----------------------------------------------------------------
            const nombre   = document.getElementById('register-nombre').value.trim();
            const email    = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;

            // ----------------------------------------------------------------
            // PASO 2: Validación de campos vacíos
            // ----------------------------------------------------------------
            if (!nombre || !email || !password) {
                errorDiv.textContent = 'Completa todos los campos';
                errorDiv.classList.remove('d-none');
                return;
            }

            // ----------------------------------------------------------------
            // PASO 3: Validación de longitud de contraseña
            // ----------------------------------------------------------------
            // Se requiere mínimo 6 caracteres por seguridad
            if (password.length < 6) {
                errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
                errorDiv.classList.remove('d-none');
                return;
            }

            // ----------------------------------------------------------------
            // PASO 4: Enviar petición a la API de registro
            // ----------------------------------------------------------------
            try {
                /**
                 * Envía los datos del nuevo usuario al backend.
                 * El backend (Rol 3) se encargará de:
                 * - Verificar que el email no exista
                 * - Hashear la contraseña con password_hash()
                 * - Insertar el usuario en la base de datos
                 */
                const res = await fetch('api/auth_register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, password }),
                });

                // Parsea la respuesta JSON
                const data = await res.json();

                // ----------------------------------------------------------------
                // PASO 5: Procesar respuesta de la API
                // ----------------------------------------------------------------
                if (data.ok) {
                    // Registro exitoso: el backend también inicia sesión automáticamente
                    // Redirige a la página principal
                    window.location.href = 'index.php';
                } else {
                    // Registro fallido: muestra el error (ej: "El email ya está registrado")
                    errorDiv.textContent = data.error;
                    errorDiv.classList.remove('d-none');
                }
            } catch {
                // Error de conexión (sin internet, servidor caído, etc.)
                errorDiv.textContent = 'Error de conexión';
                errorDiv.classList.remove('d-none');
            }
        });
    }
});
