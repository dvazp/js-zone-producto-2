import { usuariosBase } from "./datos.js"; 

// Funcion que obtiene el usuario activo del localStorage.
export function obtenerUsuarioActivo() {
    const usuarioActivo = localStorage.getItem("UsuarioActivo");
    return usuarioActivo;
}

// Funcion que guarda el usuario logueado como usuario activo.
export function loguearUsuario(usuario) {
    localStorage.setItem("UsuarioActivo", usuario);
}

// CRUD de localStorage para usuarios
const USERS_KEY = 'AppUsers';

export function obtenerUsuarios() {
    const storedData = localStorage.getItem(USERS_KEY);
    let storedUsers = storedData ? JSON.parse(storedData) : [];
    const uniqueUsersMap = new Map();

    usuariosBase.forEach(user => {
        uniqueUsersMap.set(user.email, user);
    });
    storedUsers.forEach(user => {
        uniqueUsersMap.set(user.email, user);
    });

    const combinedUsers = Array.from(uniqueUsersMap.values());
    guardarUsuarios(combinedUsers);

    return combinedUsers;
}

export function guardarUsuarios(usuarios) {
    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
}

export function obtenerUsuarioPorEmail(email) {
    const usuarios = obtenerUsuarios();
    return usuarios.find(u => u.email === email) || null;
}

export function agregarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    if (obtenerUsuarioPorEmail(usuario.email)) {
        throw new Error('Ya existe un usuario con este email.');
    }
    usuarios.push(usuario);
    guardarUsuarios(usuarios);
}

export function borrarUsuario(email) {
    const usuarios = obtenerUsuarios();
    const index = usuarios.findIndex(u => u.email === email);
    if (index > -1) {
        usuarios.splice(index, 1);
        guardarUsuarios(usuarios);
    }
}
