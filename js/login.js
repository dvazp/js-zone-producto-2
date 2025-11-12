document.addEventListener('DOMContentLoaded', () => {
    // Registra el manejador del evento submit del formulario (con guard)
    formLogin?.addEventListener("submit", LoginUser); 
    // Mostramos el usuario activo
    mostrarUsuarioActivo();
})
// Importa la lista de usuarios simulados desde datos.js
import { usuarios } from './datos.js';
import { obtenerUsuarioActivo } from './almacenaje.js';

// Índice por nombre de usuario para búsqueda O(1)
const usuariosByName = new Map(usuarios.map(u => [u.email, u]));

// Referencias a elementos del DOM usados por el formulario de login
const formLogin = document.getElementById("login_form");
const correo = document.getElementById("user");
const password = document.getElementById("password");
const userHeader = document.getElementById("user_header");


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

    const inputUser = correo.value.trim();
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
    alert("Inicio de sesión correcto");
    localStorage.setItem("UsuarioActivo", correo.value) // Guardamos en localStorage el correo del usuario cuando hace login.
}

// Funcion que MuestraUsuarioActivo
function mostrarUsuarioActivo() {
    let usuarioActivo = obtenerUsuarioActivo();
    if (usuarioActivo) {
        userHeader.textContent = usuarioActivo;
    } else {
        userHeader.textContent = "-no login-";
    }
}

