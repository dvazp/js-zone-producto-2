import { obtenerUsuarioActivo, obtenerVoluntariados, agregarVoluntariado, borrarVoluntariado } from './almacenaje.js';

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
async function displayVoluntariados() {
    const listaDiv = document.getElementById("lista");
    listaDiv.innerHTML = '';

    let voluntariados = await obtenerVoluntariados();
    voluntariados.forEach((voluntariado) => {
        let divVoluntario = document.createElement("div");
        listaDiv.appendChild(divVoluntario);
        divVoluntario.classList.add("grab", "card", "col-12", "mb-3", "col-lg-3", "rounded" ,"p-5", "bg-success", "d-flex","align-items-start","efectoCard","mx-2","mx-3");
        divVoluntario.style.width = "auto";
        divVoluntario.id = `voluntariado-${voluntariado.id}`;

        // Arrastrable
        divVoluntario.draggable = true;
        divVoluntario.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);

            setTimeout(() => {
                e.target.style.opacity = '0.5';
            }, 0);
        });

        divVoluntario.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
        });

        // Creamos los datos de los voluntarios
        let titulo = document.createElement("p");
        let usuario = document.createElement("p");
        let fecha = document.createElement("p");
        let descripcion = document.createElement("p");

        // Los añadimos al html
        divVoluntario.appendChild(titulo);
        divVoluntario.appendChild(fecha);
        divVoluntario.appendChild(descripcion);
        divVoluntario.appendChild(usuario);

        // Le añadimos el contenido
        titulo.innerHTML = voluntariado.titulo;
        usuario.innerHTML = `Publicado por : ${voluntariado.usuario}`;
        fecha.innerHTML =  `Fecha : ${voluntariado.fecha}`;
        descripcion.innerHTML = voluntariado.descripcion;

        titulo.classList.add("textoNormal");
        fecha.classList.add("fecha");
        descripcion.classList.add("textoNormal");
        usuario.classList.add("textoNormal");

        // Revisamos el tipo para ver si es peticion o oferta
        let tipo = voluntariado.tipo;
        if(tipo == "Peticion"){
            divVoluntario.classList.add("peticion");
            divVoluntario.classList.remove("bg-success") 
        }
    });

    //Añadir funcionalidad a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            eliminarVoluntariado(id);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarUsuarioActivo();
    displayVoluntariados();

    const destino = document.getElementById('contenedor-seleccion');
    destino.addEventListener('dragover', (e) => {
        e.preventDefault();
        destino.classList.add('drag-over');
    });

    destino.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const tarjetaArrastrable = document.getElementById(id);
        console.log(tarjetaArrastrable);
        
        if (tarjetaArrastrable) {
            destino.appendChild(tarjetaArrastrable);
        }
    });
});