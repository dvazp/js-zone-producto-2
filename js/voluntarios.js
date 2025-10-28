import {voluntariados} from './datos.js';

// Tenemos los voluntarios

function construirOfertas(){

    const contenedorOfertas = document.getElementById("ofertas"); // Cogemos el div con las ofertas

    voluntariados.forEach(voluntario => {
        let divVoluntario = document.createElement("div");
        contenedorOfertas.appendChild(divVoluntario);
        divVoluntario.classList.add("card", "col-12", "mb-3", "col-lg-3", "rounded" ,"p-5", "bg-success", "d-flex","align-items-start","efectoCard","mx-2","mx-3");

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
        titulo.innerHTML = voluntario.titulo;
        usuario.innerHTML = `Publicado por : ${voluntario.usuario}`;
        fecha.innerHTML =  `Fecha : ${voluntario.fecha}`;
        descripcion.innerHTML = voluntario.descripcion;

        titulo.classList.add("textoNormal");
        fecha.classList.add("fecha");
        descripcion.classList.add("textoNormal");
        usuario.classList.add("textoNormal");

        // Revisamos el tipo para ver si es peticion o oferta
        let tipo = voluntario.tipo;
        if(tipo == "Peticion"){
            divVoluntario.classList.add("peticion");
            divVoluntario.classList.remove("bg-success") 
        }
    });
}
construirOfertas()