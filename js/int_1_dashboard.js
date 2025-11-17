import { voluntariados as voluntariadosFuente } from './datos.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("Dashboard cargado correctamente");

  const usuarioActivoSpan = document.getElementById('usuarioActivo');
  const usuarioLogueado = localStorage.getItem('usuarioActivo') || '';

  if (usuarioLogueado && usuarioActivoSpan) {
    usuarioActivoSpan.textContent = usuarioLogueado;
  } else if (usuarioActivoSpan) {
    usuarioActivoSpan.textContent = '-no login-';
  }

  const voluntariadosDashboard = voluntariadosFuente.map((v, index) => {
    let tipoNormalizado = 'oferta';
    const tipoLower = (v.tipo || '').toLowerCase();
    if (tipoLower.includes('pet')) {
      tipoNormalizado = 'peticion';
    }

    return {
      id: index + 1,                 
      titulo: v.titulo,
      descripcion: v.descripcion,
      fecha: v.fecha,
      tipo: tipoNormalizado,         
      autor: v.usuario || '',        
      esPropio: usuarioLogueado && v.usuario === usuarioLogueado
    };
  });

  const seleccionados = [];

  const CLAVE_SELECCION = usuarioLogueado
    ? `seleccionDashboard_${usuarioLogueado}`
    : 'seleccionDashboard_anonimo';

  function guardarSeleccionEnStorage() {
    try {
      const ids = seleccionados.map(v => v.id);
      localStorage.setItem(CLAVE_SELECCION, JSON.stringify(ids));
    } catch (e) {
      console.warn('No se ha podido guardar la selección en localStorage', e);
    }
  }

  function cargarSeleccionDesdeStorage() {
    try {
      const texto = localStorage.getItem(CLAVE_SELECCION);
      if (!texto) return [];
      const ids = JSON.parse(texto);
      if (!Array.isArray(ids)) return [];
      return ids;
    } catch (e) {
      console.warn('No se ha podido leer la selección de localStorage', e);
      return [];
    }
  }

  const listaVoluntariadosDiv = document.getElementById('listaVoluntariados');
  const zonaSeleccionDiv = document.getElementById('zonaSeleccion');
  const mensajeSeleccionVacia = document.getElementById('mensajeSeleccionVacia');
  const btnFiltroOtros = document.getElementById('btnFiltroOtros');
  const btnFiltroPropios = document.getElementById('btnFiltroPropios');

  console.log({
    usuarioActivoSpan,
    listaVoluntariadosDiv,
    zonaSeleccionDiv,
    mensajeSeleccionVacia,
    btnFiltroOtros,
    btnFiltroPropios
  });

  function crearTarjetaVoluntariado(vol) {
    const tarjeta = document.createElement('article');
    tarjeta.classList.add('tarjeta-voluntariado', 'efectoCard');
    tarjeta.classList.add(vol.tipo === 'peticion' ? 'peticion' : 'oferta');
    tarjeta.setAttribute('draggable', 'true');
    tarjeta.dataset.id = String(vol.id);

    const titulo = document.createElement('p');
    titulo.classList.add('titulo');
    titulo.textContent = vol.titulo;

    const descripcion = document.createElement('p');
    descripcion.classList.add('descripcion');
    descripcion.textContent = vol.descripcion;

    const meta = document.createElement('p');
    meta.classList.add('meta');
    const autorTexto = vol.autor ? ` · Publicado por ${vol.autor}` : '';
    meta.textContent = `${vol.fecha || ''}${autorTexto}`;

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(meta);

    tarjeta.addEventListener('dragstart', (event) => {
      tarjeta.classList.add('dragging');
      event.dataTransfer.setData('text/plain', String(vol.id));
      event.dataTransfer.effectAllowed = 'move';
    });

    tarjeta.addEventListener('dragend', () => {
      tarjeta.classList.remove('dragging');
    });

    return tarjeta;
  }

  function pintarVoluntariados(lista) {
    if (!listaVoluntariadosDiv) return;

    listaVoluntariadosDiv.innerHTML = '';

    if (!lista || lista.length === 0) {
      const aviso = document.createElement('p');
      aviso.classList.add('text-muted');
      aviso.textContent = "No hay voluntariados para mostrar.";
      listaVoluntariadosDiv.appendChild(aviso);
      return;
    }

    lista.forEach(vol => {
      const tarjeta = crearTarjetaVoluntariado(vol);
      listaVoluntariadosDiv.appendChild(tarjeta);
    });
  }

  function actualizarMensajeSeleccion() {
    if (!mensajeSeleccionVacia || !zonaSeleccionDiv) return;

    const hayTarjetasSeleccionadas = zonaSeleccionDiv.querySelectorAll('.tarjeta-voluntariado').length > 0;

    if (hayTarjetasSeleccionadas) {
      mensajeSeleccionVacia.style.display = 'none';
    } else {
      mensajeSeleccionVacia.style.display = 'block';
    }
  }

  if (zonaSeleccionDiv) {
    zonaSeleccionDiv.addEventListener('dragover', (event) => {
      event.preventDefault();
      zonaSeleccionDiv.classList.add('drag-over');
    });

    zonaSeleccionDiv.addEventListener('dragleave', () => {
      zonaSeleccionDiv.classList.remove('drag-over');
    });

    zonaSeleccionDiv.addEventListener('drop', (event) => {
      event.preventDefault();
      zonaSeleccionDiv.classList.remove('drag-over');

      const idTexto = event.dataTransfer.getData('text/plain');
      const id = Number(idTexto);
      if (!id) return;

      const voluntariado = voluntariadosDashboard.find(v => v.id === id);
      if (!voluntariado) return;

      const yaSeleccionado = seleccionados.some(v => v.id === id);
      if (yaSeleccionado) return;

      seleccionados.push(voluntariado);

      const tarjetaSeleccion = crearTarjetaVoluntariado(voluntariado);
      zonaSeleccionDiv.appendChild(tarjetaSeleccion);

      guardarSeleccionEnStorage();

      actualizarMensajeSeleccion();
    });
  }

  if (btnFiltroOtros) {
    btnFiltroOtros.addEventListener('click', () => {
      const otros = voluntariadosDashboard.filter(v => !v.esPropio);
      pintarVoluntariados(otros);
    });
  }

  if (btnFiltroPropios) {
    btnFiltroPropios.addEventListener('click', () => {
      const propios = voluntariadosDashboard.filter(v => v.esPropio);
      pintarVoluntariados(propios);
    });
  }

  pintarVoluntariados(voluntariadosDashboard);

   if (zonaSeleccionDiv) {
    const idsGuardados = cargarSeleccionDesdeStorage();
    idsGuardados.forEach(id => {
      const voluntariado = voluntariadosDashboard.find(v => v.id === id);
      if (!voluntariado) return;

      seleccionados.push(voluntariado);

      const tarjetaSeleccion = crearTarjetaVoluntariado(voluntariado);
      zonaSeleccionDiv.appendChild(tarjetaSeleccion);
    });
  }

  actualizarMensajeSeleccion();
});
