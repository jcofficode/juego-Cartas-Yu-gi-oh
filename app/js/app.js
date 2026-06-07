'use strict';

// FUNCIONES
//Clase que consulta la Api de yu gi oh
class API_JC {

  constructor(carta) {
      this.carta = carta;
  }

  // Método  para consultar la API
  async consultarAPI_JC() {
      try {
        //Se Realiza una solicitud HTTP GET a la URL de la Api
          const url_JC = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${this.carta}`);
            //Se Convierte la respuesta de la solicitud  a un objeto JSON para poder se leida
          const respuesta_JC = await url_JC.json();
          
          //Se Devuelve el objeto JSON resultante
          return respuesta_JC;
      } catch (error) {
        //Si no se obtiene respuesta se coloca un mensaje de error
          console.error('Error al consultar la API:', error);
          throw error;
      }
  }
}

//Clase que muestra u oculta una animacion de carga dependiendo de la situacion
class Animacion_JC {
    constructor(selector) {
        this.animacionMostrarOcultar_JC = document.querySelector(selector);
    }
// Método que muestra la animacion, cambiando su estilo 'display' a 'block'
    mostrar() {
        this.animacionMostrarOcultar_JC.style.display = 'block';
    }
// Método que oculta la animacion, cambiando su estilo 'display' a 'none'
    ocultar() {
        this.animacionMostrarOcultar_JC.style.display = 'none';
    }
}

//Clase que descarta la carta cuando se le da al boton descartar
class DescarteDeCarta_JC {
    descartarCarta() {
        const cardElement = document.querySelector('.card');
        if (cardElement) {
            cardElement.remove();
        }
    }
}


let DB_Cartas_JC;

const abrirDBCartas_JC = () => { // Función que crea una DB llamada infoCarta en IndexedDB y la abre
  return new Promise((resolve, reject) => {
    const crearDB_JC = indexedDB.open('infoCarta', 1); // Se abre la base de datos infoCarta

    crearDB_JC.onerror = (e) => {
      console.log('Error en la base de datos:', e.target.errorCode);
      reject(e.target.errorCode); //Si ocurre un error se rechaza la promesa si hay un error
    };

    crearDB_JC.onsuccess = (e) => {
      DB_Cartas_JC = e.target.result; //Se asigna la base de datos si se abre con éxito 
      resolve(DB_Cartas_JC); // Se resuelve la promesa con la base de datos abierta
    };

    crearDB_JC.onupgradeneeded = (e) => {
      let db_JC = e.target.result; // Se obtiene la referencia a la base de datos

      const store = db_JC.createObjectStore('cartas', { keyPath: 'id' }); // Se crea un almacén de objetos llamado cartas con el  id como clave principal
      store.createIndex('ordenCartasFifo', 'ordenCartasFifo', { unique: false }); // Se Crea un índice llamado 'ordenCartasFifo' que para ordenar las cartas tipo FIFO segun  la fecha que se guardaron

      console.log("Base de datos cartas asignada correctamente!!!");
    };
  });
};

const ordenCartasFifo_JC = (carta) => {
  carta.ordenCartasFifo = Date.now(); // Guarda Cada carta de manera FIFO (Primero que entra,Primero que sale) por orden de tiempo 
  return carta;
};

//Funcion asincrona para guardar cartas yu gi oh en indexedDB
const guardarCartaEnIndexedDB_JC = async (carta) => {
  const divMensajes_JC = document.getElementById('mensajes_JC');

  try {
    const db_JC = await abrirDBCartas_JC(); //Se abre la base de datos para poder guardar la carta 

    const cartaExistente_JC = await new Promise((resolve, reject) => {
      const transaccion_JC = db_JC.transaction(['cartas'], 'readonly'); // Se lee  en IndexedDB el almacén 'cartas'
      const objetoGuardado_JC = transaccion_JC.objectStore('cartas'); //Se Obtiene el almacén de objetos 'cartas'
      const solicitud_JC = objetoGuardado_JC.get(carta.id);  // Se intenta obtener la carta por su id

      solicitud_JC.onsuccess = () => resolve(solicitud_JC.result);
      //Si la solicitud tiene exito se resuelve la promesa sino no
      solicitud_JC.onerror = () => reject(solicitud_JC.error);
    });

    if (cartaExistente_JC) { //Se verifica si la carta ya existe en la base de datos
      divMensajes_JC.innerHTML = 'La carta ya está guardada <i class="fa-solid fa-exclamation-circle"></i>';
      divMensajes_JC.classList.add('error_JC');
      setTimeout(() => {
        divMensajes_JC.innerHTML = '';
        divMensajes_JC.classList.remove('error_JC');
      }, 3000);
      return;
    }

    await new Promise((resolve, reject) => {
      const transaccion_JC = db_JC.transaction(['cartas'], 'readwrite'); //Se Inicia una transacción de lectura/escritura en el almacén 'cartas'
      const objetoGuardado_JC = transaccion_JC.objectStore('cartas');
      const cartaConOrdenFifo_JC = ordenCartasFifo_JC(carta); //Se Ordena la carta usando la función ordenCartasFifo_JC
      console.log('Guardando carta:', cartaConOrdenFifo_JC);
      const solicitud_JC = objetoGuardado_JC.put(cartaConOrdenFifo_JC);  //Se Intenta guardar la carta en el almacén ordenCartasFifo


      solicitud_JC.onsuccess = () => resolve(); // Resuelve la promesa si la solicitud tiene éxito sino no
      solicitud_JC.onerror = (e) => reject(e.target.error);

      transaccion_JC.oncomplete = () => {
        console.log('Carta guardada en IndexedDB');
        divMensajes_JC.innerHTML = 'Carta guardada correctamente <i class="fa-solid fa-check"></i>';
        divMensajes_JC.classList.add('guardado_JC');
        setTimeout(() => {
          divMensajes_JC.innerHTML = '';
          divMensajes_JC.classList.remove('guardado_JC');
        }, 3000);
      }; //Si todo sale bien y se guarda se muestra un mesaje de exito

      transaccion_JC.onerror = (e) => {
        console.log('Error en la transacción:', e.target.error);
        reject(e.target.error); //Se Rechaza la promesa si la transacción falla
      };
    });
  } catch (error) {
    console.log('Error al guardar la carta:', error);
  }
};
//Se crean los objetos como en el main.js  para traer los colores de las cartas dependiendo de su tipo
const colores_JC = {
    'Effect Monster': 'rgba(232, 105, 14, 0.9)',
    'Flip Effect Monster': 'rgba(232, 105, 14, 0.9)',
    'Flip Tuner Effect Monster': 'rgba(232, 105, 14, 0.9)',
    'Gemini Monster': 'rgba(232, 105, 14, 0.9)',
    'Normal Monster': 'rgba(255, 255, 0, 0.9)',
    'Normal Tuner Monster': 'rgba(255, 255, 0, 0.9)',
    'Pendulum Effect Monster': 'rgba(19, 213, 242,0.8)',
    'Pendulum Effect Ritual Monster': 'rgba(173, 216, 230, 1)',
    'Pendulum Flip Effect Monster': 'rgba(19, 213, 242,0.8)',
    'Pendulum Normal Monster': 'rgba(255, 245, 48, 0.8)',
    'Pendulum Tuner Effect Monster': 'rgba(255, 141, 48, 1)',
    'Pendulum Effect Fusion Monster': 'rgba(143, 52, 235, 1)',
    'Ritual Effect Monster': 'rgba(173, 216, 230, 1)',
    'Ritual Monster': 'rgba(173, 216, 230, 1)',
    'Skill Card': 'rgba(9, 7, 138, 0.8)',
    'Spell Card': 'rgba(0, 128, 128, 0.7)',
    'Spirit Monster': 'rgba(255, 165, 0, 1)',
    'Toon Monster': 'rgba(255, 165, 0, 1)',
    'Trap Card': 'rgba(255, 192, 203, 1)',
    'Tuner Monster': 'rgba(255, 165, 0, 1)',
    'Union Effect Monster': 'rgba(255, 165, 0, 1)',
    'Fusion Monster': 'rgba(128, 0, 128, 0.9)',
    'Link Monster': 'rgba(0, 0, 255, 0.6)',
    'Synchro Monster': 'rgba(255, 255, 255, 0.9)',
    'Synchro Pendulum Effect Monster': 'rgba(255, 255, 255, 0.9)',
    'Synchro Tuner Monster': 'rgba(255, 255, 255, 0.9)',
    'XYZ Monster': 'rgba(0, 0, 0, 0.9)',
    'XYZ Pendulum Effect Monster': 'rgba(0, 0, 0, 0.9)',
    'Token': 'rgba(128, 128, 128, 1)'
};

const coloresTextoCartas_JC = {
    'Effect Monster': '#000000',
    'Flip Effect Monster': '#000000',
    'Flip Tuner Effect Monster': '#000000',
    'Gemini Monster': '#000000',
    'Normal Monster': '#000000',
    'Normal Tuner Monster': '#000000',
    'Pendulum Effect Monster': '#000000',
    'Pendulum Effect Ritual Monster': '#000000',
    'Pendulum Flip Effect Monster': '#000000',
    'Pendulum Normal Monster': '#000000',
    'Pendulum Tuner Effect Monster': '#000000',
    'Pendulum Effect Fusion Monster': '#FFFFFF',
    'Ritual Effect Monster': '#000000',
    'Ritual Monster': '#000000',
    'Skill Card': '#FFFFFF',
    'Spell Card': '#FFFFFF',
    'Spirit Monster': '#000000',
    'Toon Monster': '#000000',
    'Trap Card': '#333333',
    'Tuner Monster': '#000000',
    'Union Effect Monster': '#000000',
    'Fusion Monster': '#FFFFFF',
    'Link Monster': '#FFFFFF',
    'Synchro Monster': '#000000',
    'Synchro Pendulum Effect Monster': '#000000',
    'Synchro Tuner Monster': '#000000',
    'XYZ Monster': '#FFFFFF',
    'XYZ Pendulum Effect Monster': '#FFFFFF',
    'Token': '#000000'
};

//Clase creada para que aparezca el mensaje de carta guardada correctamente
class mensajeCartaborrada_JC {
  constructor() {
    this.dialog = document.getElementById('cartaborrada_JC');
  }

  mostrar() {
    this.dialog.showModal();
  }

  ocultar() {
    this.dialog.close();
  }
}

//Funcion asincrona para buscar la carta guardada en ordenCartasFifo utilizando un filtro por tag
const BuscarCartas_JC = async (filtro) => {
  const NombreDB_JC = "infoCarta";
  const nombreBaseDeDatos_JC = "cartas";
  const nombreAlmacen_JC = "ordenCartasFifo";

  try {
    // Se Abre la base de datos de cartas
    const db_JC = await abrirDBCartas_JC();

      //Se Obtienen todas las cartas guardadas en la base de datos
    const cartas_JC = await new Promise((resolve, reject) => {
      const transaccion_JC = db_JC.transaction(nombreBaseDeDatos_JC, 'readonly');
      const guardado_JC = transaccion_JC.objectStore(nombreBaseDeDatos_JC);
      const almacenDB_JC = guardado_JC.index(nombreAlmacen_JC);
      const solicitud_JC = almacenDB_JC.getAll();

      solicitud_JC.onsuccess = () => resolve(solicitud_JC.result);
      solicitud_JC.onerror = () => reject(solicitud_JC.error);
    });

    const divFiltro_JC = document.querySelector('.filtro_JC');
    divFiltro_JC.innerHTML = '';

    // Si no hay cartas guardadas, muestra un mensaje de no hay cartas guardadas
    if (cartas_JC.length === 0) {
      divFiltro_JC.innerHTML = `<p class="nada_JC">No hay cartas guardadas</p>`;
      return;
    }

    //Se Filtran las cartas según el tipo seleccionado
    let cartasFiltradas_JC;
    switch (filtro) {
      case 'Monstruo':
        cartasFiltradas_JC = cartas_JC.filter(carta => carta.type.includes('Monster'));
        break;
      case 'Trampa':
        cartasFiltradas_JC = cartas_JC.filter(carta => carta.type.includes('Trap'));
        break;
      case 'Magica':
        cartasFiltradas_JC = cartas_JC.filter(carta => carta.type.includes('Spell'));
        break;
      case 'Token':
        cartasFiltradas_JC = cartas_JC.filter(carta => carta.type.includes('Token'));
        break;
      case 'Todas':
        cartasFiltradas_JC = cartas_JC;
        break;
      default:
        cartasFiltradas_JC = [];
        divFiltro_JC.innerHTML = `<p class="nada_JC">No hay cartas de tipo ${filtro} guardadas </p>`;
        return;
    }
     // Si no hay cartas filtradas en tal tipo, se muestra un mensaje de que no hay cartas en ese tipo de carta
    if (cartasFiltradas_JC.length === 0) {
       // Si hay cartas filtradas, se muestran en el div 'filtro_JC'
      divFiltro_JC.innerHTML = `<p class="nada_JC">No hay cartas de tipo ${filtro} guardadas  </p>`;
    } else {
      cartasFiltradas_JC.forEach(carta => {
        const colorFondo_JC = colores_JC[carta.type] || 'gray';
        const colorTexto_JC = coloresTextoCartas_JC[carta.type] || 'black';
        //Se crea la esctuctura y se muestran las estadisticas de la carta
        let infoCarta_JC = `
          <div class="xd" style="border: 2px solid ${colorTexto_JC}; border-radius:5px; background-color: ${colorFondo_JC}; color: ${colorTexto_JC};">
            <div class="card-header">
              <p class="card-id">${carta.id}</p>
              <h3 class="card-name">${carta.name}</h3>
            </div>
            <img class="card-image" src="${carta.card_images[0].image_url_cropped}" style="border: 2px solid ${colorTexto_JC};" alt="${carta.name}">
            <div class="card-details">
              <p class="card-type"><strong>Tipo:</strong> ${carta.type}</p>
        `;
        //Se hace un validador dependiendo del tipo de la carta ya que hay cartas que poseen diferentes estadisticas
        if (carta.type === 'Link Monster') {
          infoCarta_JC += `<p class="card-atk atk-link_JC"><strong>Ataque:</strong> ${carta.atk}</p>`;
        } else if (carta.type.includes('Monster') || carta.type.includes('Token')) {
          infoCarta_JC += `
            <p class="card-atk"><strong>Ataque:</strong> ${carta.atk}</p>
            <p class="card-def"><strong>Defensa:</strong> ${carta.def}</p>
            <p class="card-level"><strong>Nivel/Rango:</strong> ${carta.level}</p>
          `;
        }

        infoCarta_JC += `
            <p class="card-desc"><strong>Descripción:</strong><br> ${carta.desc}</p>
          </div>
          <button id="verMas_${carta.id}" class="ver-mas-btn">Ver Detalles <i class="fa-solid fa-eye"></i></button>
        </div>
        `;

        const cartaOff_JC = document.createElement('div');
        cartaOff_JC.classList.add('card-wrapper-jc');
        cartaOff_JC.innerHTML = infoCarta_JC;
        divFiltro_JC.appendChild(cartaOff_JC);

        // Al darle click al botón 'Ver más' se inova la funcion verMas_JC y se muestran mas detalles de la carta como sus variantes y cartas relacionadas

        const verDetalles_JC = document.getElementById(`verMas_${carta.id}`);
        verDetalles_JC.addEventListener('click', () => verMas_JC(carta.id));
      });

      //Se crea un botón Eliminar que al darle click invoca la funcion BorradoCartaFiltro_JC y elimina la carta de la base de datos de inxedDB y se elimina la carta del filtro
      const eliminarBtn_JC = document.createElement('button');
      eliminarBtn_JC.id = 'eliminarCartaFiltro_JC';
      eliminarBtn_JC.innerHTML = 'Eliminar Carta <i class="fa-solid fa-ban" style="color: #ffffff;"></i>';
      eliminarBtn_JC.addEventListener('click', async () => {
        await BorradoCartaFiltro_JC(db_JC, nombreBaseDeDatos_JC, filtro);
         // Muestra un mensaje de confirmación de eliminación de la carta 
        const mensajeBorrada_JC = new mensajeCartaborrada_JC();
        mensajeBorrada_JC.mostrar();
        setTimeout(() => {
          mensajeBorrada_JC.ocultar();
        }, 2000);
      });
      divFiltro_JC.appendChild(eliminarBtn_JC);
    }
  } catch (error) {
    //Si no encuentra la base de datos se muestra el siguiente error
    console.log('Error al buscar las cartas:', error);
  }
};

  const BorradoCartaFiltro_JC = async (db, storeName, filtro) => {
    //Se Inicia una transacción que puede leer y escribir en la base de datos y se obtiene el objeto almacenado para poder ser eliminado
    const transaccion_JC = db.transaction(storeName, 'readwrite');
    const objetoGuardado_JC = transaccion_JC.objectStore(storeName);
    const almacenDB_JC = objetoGuardado_JC.index('ordenCartasFifo');

    //Se obtienen todas las cartas almacenadas
    const cartasBorrar_JC = await new Promise((resolve, reject) => {
        const solicitud_JC = almacenDB_JC.getAll();

        solicitud_JC.onsuccess = () => {
            resolve(solicitud_JC.result);
        };

        solicitud_JC.onerror = () => {
            reject(solicitud_JC.error);
        };
    });
    // Se Filtran las cartas según el tipo proporcionado para poder ser eliminadas
    let cartasFiltradasBorrar_JC;
    switch (filtro) {
        case 'Monstruo':
            cartasFiltradasBorrar_JC = cartasBorrar_JC.filter(carta => carta.type.includes('Monster'));
            break;
        case 'Trampa':
            cartasFiltradasBorrar_JC = cartasBorrar_JC.filter(carta => carta.type.includes('Trap'));
            break;
        case 'Magica':
            cartasFiltradasBorrar_JC = cartasBorrar_JC.filter(carta => carta.type.includes('Spell'));
            break;
        case 'Token':
            cartasFiltradasBorrar_JC = cartasBorrar_JC.filter(carta => carta.type.includes('Token'));
            break;
        case 'Todas':
            cartasFiltradasBorrar_JC = cartasBorrar_JC;
            break;
        default:
            return;
    }
    // Si hay cartas filtradas se procede a eliminar la primera carta en el metodo FIFO
    if (cartasFiltradasBorrar_JC.length > 0) {
        const primeraCartaFifo_JC = cartasFiltradasBorrar_JC[0];

        await new Promise((resolve, reject) => {
            const borrarSolicitud_JC = objetoGuardado_JC.delete(primeraCartaFifo_JC.id);

            borrarSolicitud_JC.onsuccess = () => {
                resolve();
            };

            borrarSolicitud_JC.onerror = () => {
                reject(borrarSolicitud_JC.error);
            };
        });

        
        const divFiltro_JC = document.querySelector('.filtro_JC');
        const cartaOff_JC = divFiltro_JC.querySelectorAll('.card-wrapper-jc'); // Usar la nueva clase
        if (cartaOff_JC.length > 0) {
            divFiltro_JC.removeChild(cartaOff_JC[0]);
        }

        // Si no hay más cartas en el filtro,se elimina el botón de eliminar
        if (divFiltro_JC.querySelectorAll('.card-wrapper-jc').length === 0) { // Usar la nueva clase
            const eliminarBtn_JC = document.getElementById('eliminarCartaFiltro_JC');
            if (eliminarBtn_JC) {
                divFiltro_JC.removeChild(eliminarBtn_JC);
            }
        }
    }
};


//Clase creada para poder ver las variantes de la carta haciendo un fetch a la API para encontrar la informacion
  class APIVerDetalles_JC {
    constructor(carta) {
      this.carta = carta;
    }
  
    async consultarAPI_JC() {
      try {
        const url_JC = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php`);
        const respuesta_JC = await url_JC.json();
        return respuesta_JC.data || []; // Asegurarse de devolver un array
      } catch (error) {
        console.error('Error al consultar la API:', error);
        throw error;
      }
    }
  }
  
  

  const verMas_JC = async (cartaId) => {
    const NombreDB_JC = "infoCarta";
    const dbBuscada_JC = "cartas";
  
    try {
      const db_JC = await abrirDBCartas_JC(); // Se Abre la base de datos cartas

      //Se Obtiene la carta con el ID especificado
      const cartaVerDetalles_JC = await new Promise((resolve, reject) => {
        const transaccion_JC = db_JC.transaction(dbBuscada_JC, 'readonly'); //Se Inicia una transacción en modo de solo lectura a la base de datos
        const objetoGuardado_JC = transaccion_JC.objectStore(dbBuscada_JC); //Se Obtiene el almacén de objetos
        const solicitud_JC = objetoGuardado_JC.get(cartaId); // Solicita la carta con el ID especificado

  
        solicitud_JC.onsuccess = (e) => resolve(e.target.result); //Se Resuelve la promesa si la solicitud es exitosa sino no
        solicitud_JC.onerror = (e) => reject(e.target.errorCode);
      });
  
      if (cartaVerDetalles_JC) {
        //Se Crea el diálogo modal
        const dialogCreado_JC = document.createElement('dialog');
        dialogCreado_JC.className = 'dialog-jc';
  
        // Contenido del diálogo
        const contenidoDialog_JC = document.createElement('div');
        contenidoDialog_JC.className = 'content';
  
        // Contenido de las cartas
        const cartaContenido_JC = document.createElement('div');
        cartaContenido_JC.className = 'carta-container';
  
        // Contenido de la primera carta
        const carta1Dialog_JC = document.createElement('div');
        carta1Dialog_JC.className = 'carta-jc';
        let carta1Off_JC = `
          <h1><u>Carta</u></h1>
          <p><strong>ID:</strong> ${cartaVerDetalles_JC.id}</p>
          <p><strong>Nombre:</strong> ${cartaVerDetalles_JC.name}</p>
          <img src="${cartaVerDetalles_JC.card_images[0].image_url_cropped}" alt="${cartaVerDetalles_JC.name}" />
          <p><strong>Tipo:</strong> ${cartaVerDetalles_JC.type}</p>
        `;
  
        if (!cartaVerDetalles_JC.type.includes("Trap Card") && !cartaVerDetalles_JC.type.includes("Spell Card")) {
          carta1Off_JC += `<p><strong>Ataque:</strong> ${cartaVerDetalles_JC.atk}</p>`;
          if (!cartaVerDetalles_JC.type.includes("Link Monster")) {
            carta1Off_JC += `
              <p><strong>Defensa:</strong> ${cartaVerDetalles_JC.def}</p>
              <p><strong>Nivel/Rango:</strong> ${cartaVerDetalles_JC.level}</p>
            `;
          }
        }
  
        carta1Off_JC += `<p><strong>Descripción:</strong> ${cartaVerDetalles_JC.desc}</p>`;
        carta1Dialog_JC.innerHTML = carta1Off_JC;
  
        // Contenido de la segunda carta
        const carta2Dialog_JC = document.createElement('div');
        carta2Dialog_JC.className = 'carta-jc';
        let carta2Off_JC = ` <h1><u>Estadísticas</u></h1>
          <img class="small" src="${cartaVerDetalles_JC.card_images[0].image_url_small}" alt="${cartaVerDetalles_JC.name}" />
        `;
  
        if (!cartaVerDetalles_JC.type.includes("Trap Card") && !cartaVerDetalles_JC.type.includes("Spell Card")) {
          carta2Off_JC += `<p><strong>Atributo:</strong> ${cartaVerDetalles_JC.attribute}</p>`;
        }
  
        carta2Off_JC += `
          <p><strong>Tipo:</strong> ${cartaVerDetalles_JC.type}</p>
          <p><strong>Raza:</strong> ${cartaVerDetalles_JC.race}</p>
          <p><strong>Frame Type:</strong> ${cartaVerDetalles_JC.frameType}</p>
        `;
  
        carta2Dialog_JC.innerHTML = carta2Off_JC;
  
        //Se abre la API para Buscar cartas relacionadas o variantes
        const apiVerD_JC = new APIVerDetalles_JC(cartaVerDetalles_JC.name);
        const variantesCartas_JC = await apiVerD_JC.consultarAPI_JC();
  
        //Se Filtran cartas que mencionen el nombre de la carta actual en la descripción (variantes)
        const cartasFiltradasVariantes_JC = variantesCartas_JC.filter(cartaVariante => 
          cartaVariante.desc.includes(cartaVerDetalles_JC.name) &&
          (cartaVariante.name !== cartaVerDetalles_JC.name || cartaVariante.desc !== cartaVerDetalles_JC.desc)
        );
  
        // Contenido de la tercera carta
        const carta3Dialog_JC = document.createElement('div');
        carta3Dialog_JC.className = 'carta-jc';
  
        let carta3Off_JC = `<h1><u>Variantes</u></h1>`;
        if (cartasFiltradasVariantes_JC.length > 0) {
          cartasFiltradasVariantes_JC.forEach(cartaVariante => {
            carta3Off_JC += `
              <img class="small" src="${cartaVariante.card_images[0].image_url_small}" alt="${cartaVariante.name}" />
            `;
          });
        } else {
          carta3Off_JC += '<p>No hay variantes de la carta.</p>';
        }
  
        carta3Dialog_JC.innerHTML = carta3Off_JC;
  
        //Se Añaden cartas al contenedor
        cartaContenido_JC.appendChild(carta1Dialog_JC);
        cartaContenido_JC.appendChild(carta2Dialog_JC);
        cartaContenido_JC.appendChild(carta3Dialog_JC);
  
        //Se  Añade el contenedor de cartas al contenido del diálogo
        contenidoDialog_JC.appendChild(cartaContenido_JC);
  
        //Se crea el Botón de cierre para cerrar el modal
        const cerrarDialogBtn_JC = document.createElement('button');
        cerrarDialogBtn_JC.className = 'close-btn';
        cerrarDialogBtn_JC.innerText = 'Cerrar';
        cerrarDialogBtn_JC.addEventListener('click', () => {
          dialogCreado_JC.close();
          document.body.removeChild(dialogCreado_JC);
        });
  
        contenidoDialog_JC.appendChild(cerrarDialogBtn_JC);
  
        //Se Añade el contenido al diálogo
        dialogCreado_JC.appendChild(contenidoDialog_JC);
  
        
        document.body.appendChild(dialogCreado_JC);
        dialogCreado_JC.showModal();
      } else {
        console.log('No se encontró la carta en la base de datos');
        alert('No se encontró la carta en la base de datos');
      }
    } catch (error) {
      console.error("Error al obtener la información de la carta:", error);
    }
  };
  
  
  




export { API_JC, Animacion_JC, DescarteDeCarta_JC, guardarCartaEnIndexedDB_JC, BuscarCartas_JC };
