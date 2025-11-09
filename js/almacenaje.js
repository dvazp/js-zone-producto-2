//Para las operaciones CRUD comunes en todas las paginas

export function obtenerUsuarioActivo() { // Obtiene el Usuario Activo y lo Devuelve.
    const usuarioActivo = localStorage.getItem("UsuarioActivo");
    return usuarioActivo;
}

// Funcion que guarda el usuario logueado como usuario activo.
export function loguearUsuario(usuario) {
    localStorage.setItem("UsuarioActivo", usuario);
}