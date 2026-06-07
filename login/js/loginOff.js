'use strict';

//IMPORTACION DE LAS FUNCIONES Y MODALES 
import { formularioRegistro_JC, formularioIngreso_JC, nombreUsuario_JC, nombreReal_JC, apellido_JC, telefono_JC, cedula_JC, correo_JC, clave_JC, iniciar_JC, registrarse_JC, registrarUsuario_JC, evaluarIniciarSesion_JC, editConfirmado_JC, errorCampos_JC, errorRegistro_JC, errorDatos_JC, errorDatosVacios_JC, mostrarAnimacionCarga_JC,mostrarAnimacionCarga2_JC } from "./loginRegister.js";

//EVENTOS
//SE REALIZAN IF DEPENDIENDO DEL FORMULARIO QUE SE ENCUENTRE Y LUEGO SE EJECUTAN LOS EVENTOS JUNTOS CON LAS FUNCIONES, ASI COMO TAMBIEN LAS ANIMACIONES DE CARGA Y CAMBIO 
if (formularioRegistro_JC) {
  formularioRegistro_JC.addEventListener('submit', (e) => {
    e.preventDefault();
    registrarUsuario_JC(nombreUsuario_JC.value, nombreReal_JC.value, apellido_JC.value, telefono_JC.value, cedula_JC.value, correo_JC.value, clave_JC.value, editConfirmado_JC, errorCampos_JC, errorRegistro_JC);
    formularioRegistro_JC.reset();
  });
}

if (formularioIngreso_JC) {
  formularioIngreso_JC.addEventListener('submit', (e) => {
    e.preventDefault();
    evaluarIniciarSesion_JC(nombreUsuario_JC.value, clave_JC.value, errorCampos_JC, errorDatos_JC, errorDatosVacios_JC);
    formularioIngreso_JC.reset();
  });
}

if (formularioRegistro_JC) {
  const loginCambio_JC = document.getElementById('loginCambio');
  loginCambio_JC.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarAnimacionCarga2_JC()
    setTimeout(() => {
      window.location.href = '../index.html';
      
    }, 2000);
  });
}

if (formularioIngreso_JC) {
  const cambio_JC = document.getElementById('cambio');
  cambio_JC.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarAnimacionCarga2_JC();
    setTimeout(() => {
      window.location.href = './login/registrarse.html';
      
    }, 2000);
  });
}
