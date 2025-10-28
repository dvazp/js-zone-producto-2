import { voluntariados } from './datos.js';

//Funcion para mostrar los voluntariados en el div "lista"
function displayVoluntariados() {
    const listaDiv = document.getElementById("lista");
    listaDiv.innerHTML = '';

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
                <button class="delete-btn" data-index="${index}">Eliminar</button>
            </div>
        `;
        
        listaDiv.appendChild(voluntariadoDiv);
    });

    //Añadir funcionalidad a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            voluntariados.splice(index, 1);
            displayVoluntariados();
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

    const nuevo = { titulo, usuario, fecha, descripcion, tipo };

    voluntariados.push(nuevo);

    ['titulo','usuario','fecha','descripcion', 'tipo'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    displayVoluntariados();
}

document.addEventListener('DOMContentLoaded', () => {
    displayVoluntariados();

    const addBtn = document.getElementById('addVoluntariado_button');
    if (addBtn) addBtn.addEventListener('click', addVoluntariado);
});


