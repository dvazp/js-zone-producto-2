//Importamos todas las funciones de almacenaje.js
import { obtenerUsuarioActivo, obtenerVoluntariados, guardarVoluntariados, agregarVoluntariado, borrarVoluntariado } from './almacenaje.js';

// Primero mostramos el usuario activo
function mostrarUsuarioActivo() {
    const userHeader = document.getElementById("user_header");
    let usuarioActivo = obtenerUsuarioActivo();
    if (!usuarioActivo) {
        userHeader.textContent = "-no login-";
    } else {
        userHeader.textContent = usuarioActivo;
    }
}

//Funcion para mostrar los voluntariados en el div "lista"
function displayVoluntariados() {
    const listaDiv = document.getElementById("lista");
    listaDiv.innerHTML = '';

    let voluntariados = obtenerVoluntariados();
    voluntariados.forEach((voluntariado, index) => {
        const voluntariadoDiv = document.createElement('div');
        voluntariadoDiv.classList.add('voluntariado-item');
        voluntariadoDiv.innerHTML = `
            <div class="voluntariado-card">
                <p><strong>Título:</strong> ${voluntariado.titulo}</p>
                <p><strong>Usuario:</strong> ${voluntariado.usuario}</p>
                <p><strong>Fecha:</strong> ${voluntariado.fecha}</p>
                <p><strong>Descripción:</strong> ${voluntariado.descripcion}</p>
                <p><strong>Tipo:</strong> ${voluntariado.tipo}</p>
                <button class="delete-btn" data-id="${voluntariado.id}" type="button">Eliminar</button>
            </div>
        `;
        
        listaDiv.appendChild(voluntariadoDiv);
    });

    //Añadir funcionalidad a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            eliminarVoluntariado(id);
        });
    });
}

//Añadir un nuevo voluntariado
function getFieldValue(id, promptText) {
    const el = document.getElementById(id);
    if (el) return el.value.trim();
    const v = window.prompt(promptText);
    return v ? v.trim() : '';
}

function addVoluntariado() {
    const titulo = getFieldValue('titulo', 'Título:');
    const usuario = getFieldValue('usuario', 'Usuario:');
    const fecha = getFieldValue('fecha', 'Fecha (ej. 16-10-2025):');
    const descripcion = getFieldValue('descripcion', 'Descripción:');
    const tipo = getFieldValue('tipo', 'Tipo:');
    const id = new Date().getTime(); // Esto genera un ID único basado en la marca de tiempo, muy dificilmente se generarán ids repetidos

    if (titulo == "" || usuario == "" || fecha == "" || descripcion == "" || tipo == "") {
        window.alert("No puede haber ningún campo en blanco.");
        return;
    }

    const nuevo = { titulo, usuario, fecha, descripcion, tipo, id };

    try {
        agregarVoluntariado(nuevo);

        ['titulo', 'usuario', 'fecha', 'descripcion', 'tipo'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        displayVoluntariados();
    } catch (error) {
        console.error('Error al añadir un nuevo usuario:', error);
        window.alert(error.message);
    }

}

function eliminarVoluntariado(id) {
    try {
        borrarVoluntariado(id);
        displayVoluntariados();
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarUsuarioActivo();
    displayVoluntariados();

    const addBtn = document.getElementById('addVoluntariado_button');
    if (addBtn) addBtn.addEventListener('click', addVoluntariado);
});


