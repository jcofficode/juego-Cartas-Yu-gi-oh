'use strict';
// Declaracion de Variables 
const formularioRegistro_JC = document.getElementById("formRegistro"); //Varible del formulario registrarse.html
const formularioIngreso_JC = document.getElementById("formIngreso"); //Varible del formulario IngresarLogin.html
const nombreUsuario_JC = document.getElementById("usuario"); //Variables para el registro del usuario en el IndexedDB
const nombreReal_JC = document.getElementById("nombre");
const apellido_JC = document.getElementById("apellido");
const telefono_JC = document.getElementById("numero");
const cedula_JC = document.getElementById("cedula");
const correo_JC = document.getElementById("correo");
const clave_JC = document.getElementById("clave");
const iniciar_JC = document.getElementById("iniciar");
const registrarse_JC = document.getElementById("registrarse");
const editConfirmado_JC = document.getElementById('editConfirmado_JC'); //Modales para mostrar mensajes de exito o error
const errorCampos_JC = document.getElementById('errorCampos_JC');
const errorRegistro_JC = document.getElementById('registerror_JC');
const errorDatos_JC = document.getElementById('errorDatos_JC');
const errorDatosVacios_JC = document.getElementById('errorDatosVacios_JC');
let DB_JC;

//DECLARACION DE FUNCIONES DEL LOGIN

const abrirDB_JC = () => { //funcion que crea una DB llamada ListaUsuariosDB en indexedDB
  return new Promise((resolve, reject) => {
     // Crear la base de datos praticando promesas
    
    const crearDB_JC = indexedDB.open('ListaUsuariosDB', 1);  //  Se Abre la base de datos

    // Si hay un error se muestra en  la consola
    crearDB_JC.onerror = (e) => {
      console.log('Error en la base de datos:', e.target.errorCode);
      reject(e.target.errorCode);
    };

    // Si todo está bien entonces muestra en consola, y asignar la base de datos
    crearDB_JC.onsuccess = (e) => {
      DB_JC = e.target.result; // Asigna la base de datos si se abre con éxito
      resolve(DB_JC);
     
    };

    // Este método solo corre una vez y se crea el Schema de la DB
    crearDB_JC.onupgradeneeded = (e) => {
      // El evento es la misma base de datos.
      let db_JC = e.target.result;

       // Definir el objectStore, toma 2 parámetros el nombre de la base de datos y segundo su keypath 
      db_JC.createObjectStore('usuariosRegistrados', { keyPath: 'usuario' }); // Crea un objectStore para usuariosRegistrados
      console.log("Base de datos asiganda correctamente!!!");
    };
  });
};


const agregarDatosUsuario_JC = (usuario_JC) => { //Funcion para agregar los datos del usuario en usuariosRegistrados de IndexedDB
  return new Promise((resolve, reject) => {
    const transaccion_JC = DB_JC.transaction(['usuariosRegistrados'], 'readwrite'); // Inicia una transacción de lectura/escritura
    const objectStore_JC = transaccion_JC.objectStore('usuariosRegistrados'); //Se Obtiene el objectStore antes creado
    const peticion_JC = objectStore_JC.add(usuario_JC); // Agrega el usuario al objectStore

    peticion_JC.onsuccess = () => {
      
      resolve();
      console.log('usuario agregado Correctamente a la BD!!!');
    };

    transaccion_JC.oncomplete = () => {
      console.log('Agregado Correcto');
      
  }
  transaccion_JC.onerror = () => {
      console.log('Hubo un error!');
  }

    peticion_JC.onerror = (e) => {
      console.log('Hubo un error al agregar al usuario!');
      reject(e.target.errorCode);
    };
  });
};


const obtenerUsuario_JC = (usuario_JC) => { //Funcion para obtener los datos del usuario
  return new Promise((resolve, reject) => {
    const transaccion_JC = DB_JC.transaction(['usuariosRegistrados'], 'readonly'); //Se Inicia una transacción de solo lectura
    const store_JC = transaccion_JC.objectStore('usuariosRegistrados'); //Se Obtiene el objectStore
    const solicitud_JC = store_JC.get(usuario_JC); //Se  Obtiene el usuario del objectStore

    solicitud_JC.onsuccess = (e) => {
      resolve(e.target.result);  // Resuelve con los datos del usuario gracias a la promesa 
      console.log('DB existe!!!'); //Se muestra en consola si se obtuvieron los datos exitosamente
    };

    solicitud_JC.onerror = (e) => {
      reject(e.target.errorCode); // Rechaza si hay un error
      console.log('Error al obtener los datos'); //Se muestra en consola si hubo un error al obtener los datos del usuario
    };
  });
};


//Funcion que revisa si hay datos repetidos por parte del usuario que quiere registrarse
const verificarDatosExistentes_JC = (telefono_JC, cedula_JC, correo_JC) => {
  return new Promise((resolve, reject) => {
    const transaccion_JC = DB_JC.transaction(['usuariosRegistrados'], 'readonly'); //Se inicia una transacción de solo lectura
    const objectStoreOff_JC = transaccion_JC.objectStore('usuariosRegistrados'); // Obtiene el objectStore
    const abrirCursor_JC = objectStoreOff_JC.openCursor(); //Se abre un cursor para recorrer los datos del usuario registrado (buscado en la clase 10 y en vídeos)
    let verificarDatosRepetidos_JC = false; //Bandera para verificar si hay datos repetidos a la hora del registro

    abrirCursor_JC.onsuccess = (e) => { // Se ejecuta cuando la operación de abrir cursor es exitosa
      const cursorResultado_JC = e.target.result; // Se Obtiene el cursor del resultado onsucess (cuando es exitoso es decir cuando se ejecuta onsuccess )
      if (cursorResultado_JC) {
        const usuario = cursorResultado_JC.value;  //Se Obtiene el valor del registro actual del cursor (datos registrados del usuario en la DB)
        if (usuario.telefono === telefono_JC || usuario.cedula === cedula_JC || usuario.correo === correo_JC) {  // Verifica si el teléfono, la cédula o el correo del nuevo usuario  coinciden con los almecenados en lla DB usuariosRegistrados
          verificarDatosRepetidos_JC = true; //Se cambia a verdadero la bandera cuando consigue uno de esos datos repetidos
        }
        cursorResultado_JC.continue(); //Se Avanza al siguiente registro en la base de datos (Buscado en videos para su utilizacion)
      } else {
        resolve(verificarDatosRepetidos_JC); // Si no hay mas registros y no hay datos repetidos se resuelve la promesa 
      }
    };

    abrirCursor_JC.onerror = (e) => { // Esto se ejecuta  cuando hay un error al abrir el cursor
      reject(e.target.errorCode); // Rechaza la promesa con el código de error
      console.log('Error al abrir cursor')
    };
  });
};

const mostrarAnimacionCarga_JC = () => { //Funcion para la para la aparicion de la animacion de cambio de pagina
  const loaderBg_JC = document.createElement('div');
  loaderBg_JC.classList.add('loader-bg');

  const spinner_JC = document.createElement('div');
  spinner_JC.classList.add('spinner');
  spinner_JC.innerHTML = `
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
  `;

  loaderBg_JC.appendChild(spinner_JC);
  document.body.appendChild(loaderBg_JC);
  loaderBg_JC.style.display = 'flex';
};

const mostrarAnimacionCarga2_JC = () => { //Funcion para la para la aparicion de la animacion de carga 
  let loaderBg_JC = document.createElement('div');
  loaderBg_JC.classList.add('loader-bg');
  
  let loader_JC = document.createElement('div');
  loader_JC.classList.add('sk-folding-cube');
  loader_JC.innerHTML = `
      <div class="sk-cube1 sk-cube"></div>
      <div class="sk-cube2 sk-cube"></div>
      <div class="sk-cube4 sk-cube"></div>
      <div class="sk-cube3 sk-cube"></div>
  `;
  
  loaderBg_JC.appendChild(loader_JC);
  document.body.appendChild(loaderBg_JC);
  loaderBg_JC.style.display = 'flex';
}

//FUNCION que registra al usuario en IndexedDB  
const registrarUsuario_JC = async (nombreUsuario_JC, nombreReal_JC, apellido_JC, telefono_JC, cedula_JC, correo_JC, clave_JC, editConfirmado_JC, errorCampos_JC, errorRegistro_JC) => {
  if (!nombreUsuario_JC || !nombreReal_JC || !apellido_JC || !telefono_JC || !cedula_JC || !correo_JC || !clave_JC) { //Verifica que los campos no estan vacios 
    errorCampos_JC.showModal();
    setTimeout(() => {
      errorCampos_JC.close();
    }, 3500);
  } else {
    const nombreModif_JC = nombreReal_JC.toLowerCase().trim();
    await abrirDB_JC();
    const usuarioExistente_JC = await obtenerUsuario_JC(nombreUsuario_JC); // Se obtiene el usuario existente con sus datos 
    const datosExistentes_JC = await verificarDatosExistentes_JC(telefono_JC, cedula_JC, correo_JC); //Se Verifica si los datos existen y estan reptidos

    if (usuarioExistente_JC || datosExistentes_JC) { //Si existen estas funciones se ejecutan los modales de error
      errorRegistro_JC.showModal();
      setTimeout(() => {
        errorRegistro_JC.close();
      }, 3500);
    } else {
      //Si no, se procede a registrar al usuario con sus datos al IndexedDB
      await agregarDatosUsuario_JC({ usuario: nombreUsuario_JC, nombre: nombreModif_JC, apellido: apellido_JC, telefono: telefono_JC, cedula: cedula_JC, correo: correo_JC, clave: clave_JC });
      editConfirmado_JC.showModal();
      setTimeout(() => {
        editConfirmado_JC.close();
      }, 2500);
    }
  }
};

//Funcion que verifica si el usuario o no puede entrar a la aplicacion Yu Gi Oh
const evaluarIniciarSesion_JC = async (nombreUsuario_JC, clave_JC, errorCampos_JC, errorDatos_JC, errorDatosVacios_JC) => {
  if (!nombreUsuario_JC || !clave_JC) { //Verifica que los campos no estan vacios
    errorCampos_JC.showModal();
    setTimeout(() => {
      errorCampos_JC.close();
    }, 3500);
  } else {
    //Se procede a abrir la DB donde estan los datos almacenados del usuario
    await abrirDB_JC();
    const usuario_JC = await obtenerUsuario_JC(nombreUsuario_JC);
    if (usuario_JC && usuario_JC.clave === clave_JC) { //Se verifica que los datos coincidan con los de la DB para poder ingresar a la aplicacacion
      sessionStorage.setItem('Session', JSON.stringify(usuario_JC));
      mostrarAnimacionCarga_JC();
      setTimeout(() => {
        location.href = "./app/index.html";
      }, 2000);
    } else {
      errorDatos_JC.showModal();
      setTimeout(() => {
        errorDatos_JC.close();
      }, 3500);
    }
  }
};

//EXPORTACION DE LAS FUNCIONES Y MODALES
export {
  formularioRegistro_JC, formularioIngreso_JC, nombreUsuario_JC, nombreReal_JC, apellido_JC, telefono_JC, cedula_JC, correo_JC, clave_JC, iniciar_JC,
  registrarse_JC, registrarUsuario_JC, evaluarIniciarSesion_JC, editConfirmado_JC, errorCampos_JC, errorRegistro_JC, errorDatos_JC, errorDatosVacios_JC, mostrarAnimacionCarga_JC,mostrarAnimacionCarga2_JC
};
