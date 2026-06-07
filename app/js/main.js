'use strict';
//IMPORTACION DE CLASES Y FUNCIONES
import { API_JC, Animacion_JC , DescarteDeCarta_JC ,guardarCartaEnIndexedDB_JC, BuscarCartas_JC } from './app.js';

// CODIGO DEL SESSIONSTORAGE
let session_string_JC = sessionStorage.getItem('Session');

// Constantes para MODAL
const sesionCerrada_JC = document.getElementById("sesionCerrada");
const sesionCerradaVision_JC = document.getElementById("sesionCerradaVision");


// CODIGO DE SESSIONSTORAGE
let cerrarSesion_JC = document.getElementById("cerrar");
let cerrarSesionVision_JC = document.getElementById("cerrarvision");

//Se verifica si la variable de sesion existo, si existe te mantienes en la pagina del proyecto sino lo expulsas al login
if (session_string_JC == null) {
    location.href = '../login/registrarse.html';
} else {
    if (cerrarSesion_JC) {
        cerrarSesion_JC.addEventListener("click", e => {
            e.preventDefault();
            sessionStorage.removeItem("Session");
            sesionCerrada_JC.showModal();
            setTimeout(() => {
                sesionCerrada_JC.close();
                location.href = '../index.html';
            }, 3500);
        });
    }
    if (cerrarSesionVision_JC) {
        cerrarSesionVision_JC.addEventListener("click", e => {
            e.preventDefault();
            sessionStorage.removeItem("Session");
            sesionCerradaVision_JC.showModal();
            setTimeout(() => {
                sesionCerradaVision_JC.close();
                location.href = '../index.html';
            }, 3500);
        });
    }
}

//  instancias de las clases que muestran una animacion de carga y la otra descarta la carta dependiendo su eleccion
const animacion_JC = new Animacion_JC('.contenidoAnimacion_JC');
const cartaDescartada_JC = new DescarteDeCarta_JC();

//declaracion de la variable del formulario del buscador
let formulario_JC =  document.getElementById('formulario-buscar_JC');
//Declaracion de variable que al ser clickeada inicia la peticion a la API y busca la carta
const botonBuscadorJC = document.getElementById('boton-buscar_JC');


//EVENTO QUE INICIA LA BUSQUEDA DE LA CARTA CON SUS DATOS DE LA API DE YU GI OH 
if (cerrarSesion_JC){
botonBuscadorJC.addEventListener('click', (e) => {
    e.preventDefault();
    filtroSection_JC.innerHTML = '';

    //DECLARACION DE LAS VARIABLES, NECESARIAS PARA LA VISTA Y CONTENEDOR DE LA CARTA BUSCADA
    const carta_JC = document.getElementById('carta').value;
    const divMensajes_JC = document.getElementById('mensajes_JC');
    const divResultado_JC = document.getElementById('resultado_JC');

    //SE VERIFICA QUE EL CAMPO DEL NOMBRE DE LA CARTA ESTE VACIO O NO
    if (carta_JC === '') {
        divMensajes_JC.innerHTML = 'Error... Todos los campos son obligatorios';
        divMensajes_JC.classList.add('error_JC');
        setTimeout(() => {
            divMensajes_JC.innerHTML = '';
            divMensajes_JC.classList.remove('error_JC');
        }, 3000);
    } else {
        //SINO SE COMIENZA LA BUSQUEDA DE LA CARTA PERO ANTES SE MUESTRA LA ANIMACION DE CARGA
        animacion_JC.mostrar();
        cartaDescartada_JC.descartarCarta();
        //SE REALIZA LA PETICION A LA API
        const api_JC = new API_JC(carta_JC);
        api_JC.consultarAPI_JC()
            .then(data_JC => {
                if (data_JC.data) {
                    //SE ASIGNAN LAS ESTADISTICAS QUE SE BUSCARAN DE LA CARTA MEDIANTE UN OBJETO LLAMADO CARTA_JC
                    const carta_JC = data_JC.data[0];
                    const { id, name, type, atk, def, level, desc, card_images } = carta_JC;

                    //SE CREAN 2 OBJETOS CO TODAS LA POSIBLES COMBIANACIONES DE COLORES CON EL OBJETIVO DE PONER LOS COLORES ADECUADOS A LA CARTA DEPENDIENDO DE SU TIPO
                    const coloresCartas_JC = {
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
                    //ASIGNACION DE LOS COLORES DE LAS CARTAS SEGUN SU TIPO
                    const colorFondo_JC = coloresCartas_JC[type] || 'gray';
                    const colorTexto_JC = coloresTextoCartas_JC[type] || 'black';
                    //SE MUESTRAN LAS ESTADISTICAS DE LA CARTA OBTENIDA
                    let infoCarta_JC = `
                        <div class="card" style="border: 2px solid ${colorTexto_JC}; background-color: ${colorFondo_JC}; color: ${colorTexto_JC};">
                            <div class="card-header">
                                <p class="card-id">${id}</p>
                                
                                <h3 class="card-name">${name}</h3>
                            </div>
                            <img class="card-image" src="${card_images[0].image_url_cropped}" style="border: 2px solid ${colorTexto_JC};" alt="${name}">
                            <div class="card-details">
                                <p class="card-type"><strong>Tipo:</strong> ${type}</p>
                    `;
                    //SE HACEN VERIFICACIONES SEGUN EL TIPO DE LA CARTA YA QUE ALGUNAS NO POSEEN CIERTAS ESTADISTICAS DEBIDO A SU TIPO
                    if (type === 'Link Monster') {
                        infoCarta_JC += `
                            <p class="card-atk atk-link_JC"><strong>Ataque:</strong> ${atk}</p>
                        `;
                    } else if (type.includes('Monster')) {
                        infoCarta_JC += `
                            <p class="card-atk"><strong>Ataque:</strong> ${atk}</p>
                            <p class="card-def"><strong>Defensa:</strong> ${def}</p>
                            <p class="card-level"><strong>Nivel/Rango:</strong> ${level}</p>
                        `;
                    }

                    if (type.includes('Token')) {
                        infoCarta_JC += `
                            <p class="card-atk"><strong>Ataque:</strong> ${atk}</p>
                            <p class="card-def"><strong>Defensa:</strong> ${def}</p>
                            <p class="card-level"><strong>Nivel/Rango:</strong> ${level}</p>
                        `;
                    }
                    //ASIGNACION DE LOS BOTONES DE LA CARTA GUARDAR Y DESCARTAR
                    infoCarta_JC += `
                            <p class="card-desc"><strong>Descripción</strong><br> ${desc}</p>
                        </div>
                        <div class="card-buttons">
                            <button id="guardar-${id}" class="guardar">Guardar <i class="fa-solid fa-floppy-disk" style="color: #ffffff;"></i></button>
                            <button id="descartar" class="descartar">Descartar <i class="fa-solid fa-x" style="color: #ffffff;"></i></button>
                        </div>
                    </div>
                    `;
                    //SE MUESTRA LA CARTA FINAL OBTENIDA
                    divResultado_JC.innerHTML = infoCarta_JC;

                    

                   formulario_JC.reset();
                    animacion_JC.ocultar();
                    //DECALARACION DE LAS VARIABLES GUARDAR Y DESCARTAR
                    const botonGuardarCarta_JC = document.getElementById(`guardar-${id}`);
                    const botonDescartarCarta_JC = document.getElementById(`descartar`);

                    //EVENTOS AL DARLE CLICK AL BOTON GUARDAR, LA CARTA SE GUARDA EN INDEXEDDB ESPECIFICAMENTE EN INFOCARTA
                    botonGuardarCarta_JC.addEventListener('click', async () => {
                        await guardarCartaEnIndexedDB_JC(carta_JC);
                        cartaDescartada_JC.descartarCarta();
                        filtroSection_JC.innerHTML='';
                        
                    });
                    //EVENTO AL DARLE CLICK A DESCARTAR SE ELIMINA LA CARTA BUSCADA
                    botonDescartarCarta_JC.addEventListener('click', () => {
                        cartaDescartada_JC.descartarCarta();
                        filtroSection_JC.innerHTML = '';
                    });

                } else {
                    //SINO SE CONSIGUE LA CARTA SE DA UN ERROR DE QUE LA CARTA NO ESTA DISPONIBLE 
                    divMensajes_JC.innerHTML = 'Carta no disponible por los momentos. <i class="fa-solid fa-triangle-exclamation fa-lg" style="color: #ffffff;"></i>  ';
                    divMensajes_JC.classList.add('error_JC');
                    formulario_JC.reset();
                    setTimeout(() => {
                        divMensajes_JC.innerHTML = '';
                        divMensajes_JC.classList.remove('error_JC');
                    }, 3000);
                    animacion_JC.ocultar();
                }
            })
    }
});

// DECLARACION DE VARIABLES PARA LOS Botones QUE buscaN cartas según el tipo
let filtroSection_JC = document.getElementById('filtroSec_JC');
const botonMonstruos_JC = document.getElementById('boton-monstruos_JC');
const botonTrampas_JC = document.getElementById('boton-trampas_JC');
const botonHechizos_JC = document.getElementById('boton-hechizos_JC');
const botonTokens_JC = document.getElementById('boton-tokens_JC');
const botonTodas_JC = document.getElementById('tipoTodas_JC');

//EVENTOS (FILTRO POR TAG) AL DARLE CLICK A UN BOTON SE INVOCA LAF FUNCION BUSCARCARTAS_JC Y DEPENDIENDO EL TIPO DE LA CARTA SE BUSCA TODAS LAS CARTAS DE ESE TIPO
botonMonstruos_JC.addEventListener('click', () => BuscarCartas_JC('Monstruo'));
botonTrampas_JC.addEventListener('click', () => BuscarCartas_JC('Trampa'));
botonHechizos_JC.addEventListener('click', () => BuscarCartas_JC('Magica'));
botonTokens_JC.addEventListener('click', () => BuscarCartas_JC('Token'));
botonTodas_JC.addEventListener('click', () => BuscarCartas_JC('Todas'));
}