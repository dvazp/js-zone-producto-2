//Para las operaciones CRUD comunes en todas las paginas

export function obtenerUsuarioActivo() { // Obtiene el Usuario Activo y lo Devuelve.
    const usuarioActivo = localStorage.getItem("UsuarioActivo");
    return usuarioActivo;
}