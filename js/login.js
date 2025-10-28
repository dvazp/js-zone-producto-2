// Importa la lista de usuarios simulados desde datos.js
import {usuarios} from './datos.js';

// Índice por nombre de usuario para búsqueda O(1)
const usuariosByName = new Map(usuarios.map(u => [u.user, u]));

// Referencias a elementos del DOM usados por el formulario de login
const formLogin = document.getElementById("login_form");
const user = document.getElementById("user");
const password = document.getElementById("password");
const userHeader = document.getElementById("user_header");

// Registra el manejador del evento submit del formulario (con guard)
formLogin?.addEventListener("submit", LoginUser);

/**
 * Manejador del envío del formulario de login.
 * - Previene el envío por defecto.
 * - Valida campos vacíos.
 * - Busca usuario en mapa y verifica contraseña.
 * - Actualiza el header si es correcta.
 * @param {SubmitEvent} event
 */
function LoginUser(event){
    event.preventDefault();

    const inputUser = user.value.trim();
    const inputPassword = password.value;

    if(!inputUser || !inputPassword){
        alert("Introduce todos los campos");
        return;
    }

    const foundUser = usuariosByName.get(inputUser);
    if(!foundUser){
        alert("El usuario no existe");
        return;
    }

    if(foundUser.password !== inputPassword){
        alert("La contraseña no coincide");
        return;
    }

    // Credenciales correctas
    userHeader.textContent = inputUser; // evita innerHTML
    alert("Inicio de sesión correcto");
}