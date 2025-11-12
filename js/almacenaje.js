//Para las operaciones CRUD comunes en todas las paginas

export function obtenerUsuarioActivo() { // Obtiene el Usuario Activo y lo Devuelve.
    const usuarioActivo = localStorage.getItem("UsuarioActivo");
    return usuarioActivo;
}

// IndexedDB de usuarios
export let db;
export const DB_NAME = 'UsersDB';
export const DB_VERSION = 1;
export const STORE_NAME = 'users';

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const dbInst = event.target.result;
            if (!dbInst.objectStoreNames.contains(STORE_NAME)) {
                const store = dbInst.createObjectStore(STORE_NAME, { keyPath: 'email' });
                store.createIndex('nombre', 'nombre', { unique: false });
            }
        };
    });
};

