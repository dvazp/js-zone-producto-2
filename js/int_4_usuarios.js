// IndexedDB
let db;
const DB_NAME = 'UsersDB';
const DB_VERSION = 1;
const STORE_NAME = 'users';

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'email' });
                store.createIndex('nombre', 'nombre', { unique: false });
            }
        };
    });
};

// Funciones de mostrar y borrar los usuarios
async function listaUsuarios() {
    const consultaUser_form = document.getElementById("consultaUser_form");
    consultaUser_form.innerHTML = '';

    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
        const usuarios = request.result;
        usuarios.forEach(u => {
            let contorno = document.createElement("div");
            contorno.classList.add('user-card');
            let divUsuario = document.createElement("div");

            let nombre = document.createElement("p");
            let email = document.createElement("p");
            let password = document.createElement("p");
            let acciones = document.createElement("button");

            nombre.innerHTML = `Nombre: ${u.nombre}`;
            email.innerHTML = `Email: ${u.email}`;
            password.innerHTML = `Contraseña: ${u.password}`;
            acciones.innerHTML = `Borrar`;
            acciones.setAttribute('id', u.email);
            acciones.setAttribute('class', 'delButton btn btn-success px-4')
            acciones.setAttribute('type', 'button');

            divUsuario.appendChild(nombre);
            divUsuario.appendChild(email);
            divUsuario.appendChild(password);
            divUsuario.appendChild(acciones);

            [nombre, email, password, acciones].forEach(child => {
                child.classList.add("textoNormal");
            });

            contorno.appendChild(divUsuario);
            consultaUser_form.appendChild(contorno);
        });

        const delBtns = document.getElementsByClassName('delButton');
        for (const btn of delBtns) {
            btn.addEventListener('click', function() {
                removeUsuario(this.id); 
            });
        }
    };

    request.onerror = () => {
        console.error("Error al cargar usuarios:", request.error);
    };
}

function getFieldValue(id, promptText) {
    const el = document.getElementById(id);
    if (el) return el.value.trim();
    const v = window.prompt(promptText);
    return v ? v.trim() : '';
}

// Añadir usuario
async function addUsuario() {
    const nombre = getFieldValue('nombre');
    const email = getFieldValue('email');
    const password = getFieldValue('password');

    if (nombre == "" || email == "" || password == "") {
        window.alert("No puede haber ningún campo en blanco.");
        return;
    }

    const usuario = { nombre, email, password };

    // Nos aseguramos que la DBse inicialicie para evitar errores
    if (!db) await initDB();

    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    try {
        await new Promise((resolve, reject) => {
            const request = store.put(usuario);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        ['nombre', 'email', 'password'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        await listaUsuarios();
    } catch (error) {
        console.error('Error adding user:', error);
        if (error.name === 'ConstraintError') {
            window.alert('Ya existe un usuario con este email.');
        }
    }
}

async function removeUsuario(email) {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    try {
        await new Promise((resolve, reject) => {
            const request = store.delete(email);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        await listaUsuarios();
    } catch (error) {
        console.error('Error removing user:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        await listaUsuarios();

        const addBtn = document.getElementById('addUser_button');
        if (addBtn) addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addUsuario();
        });
        const consultaForm = document.getElementById('consultaUser_form');
        if (consultaForm) consultaForm.addEventListener('submit', (e) => e.preventDefault());
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});