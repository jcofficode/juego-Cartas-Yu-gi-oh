<div align="center">

# 🃏 Buscador de Cartas — Yu-Gi-Oh!

Aplicación web para buscar cartas de Yu-Gi-Oh! en tiempo real desde la **API de YGOPRODeck**, guardarlas en una colección local con estructura **FIFO** y consultarlas mediante filtros por tipo.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![IndexedDB](https://img.shields.io/badge/IndexedDB-Web_Storage-4DB33D?style=flat&logo=database&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=flat&logo=jquery&logoColor=white)
![License](https://img.shields.io/badge/licencia-MIT-blue?style=flat)

</div>

---

## 📑 Tabla de contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Demo del flujo](#-demo-del-flujo)
- [Stack tecnológico](#-stack-tecnológico)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Cómo funciona](#-cómo-funciona)
- [Arquitectura de datos](#-arquitectura-de-datos)
- [API utilizada](#-api-utilizada)
- [Licencia](#-licencia)

---

## 📖 Descripción

**Buscador de Cartas Yu-Gi-Oh!** es una *Single Page-style* web app construida con **JavaScript vanilla orientado a objetos**, que permite a los usuarios consultar información detallada de cualquier carta del universo Yu-Gi-Oh!. La aplicación consume la **API pública de YGOPRODeck**, renderiza la carta con un estilo visual acorde a su tipo y la persiste en el navegador mediante **IndexedDB**.

El núcleo del proyecto gira en torno al manejo de **estructuras de datos**: las cartas guardadas se almacenan y eliminan siguiendo una política **FIFO (First In, First Out)**, aprovechando un índice temporal en IndexedDB.

---

## ✨ Características

| Categoría | Detalle |
|-----------|---------|
| 🔍 **Búsqueda por nombre** | Consulta cualquier carta por su nombre directamente contra la API de YGOPRODeck. |
| 🎨 **Render dinámico por tipo** | Cada carta se colorea según su tipo (Monstruo, Trampa, Mágica, Fusión, XYZ, Link, Token, etc.) mediante un mapeo de más de 25 categorías. |
| 💾 **Guardado en IndexedDB** | Las cartas se almacenan localmente en la base de datos `infoCarta`, evitando duplicados. |
| 🔁 **Estructura FIFO** | Las cartas guardadas se ordenan e eliminan por orden de llegada usando un índice temporal (`ordenCartasFifo`). |
| 🏷️ **Filtros por tipo** | Botones para filtrar la colección guardada: Monstruos, Trampas, Mágicas, Tokens y Todas. |
| 🔎 **Ver detalles y variantes** | Modal con estadísticas completas (atributo, raza, frame type) y cartas relacionadas/variantes obtenidas de la API. |
| 🗑️ **Descarte y eliminación** | Descarta la carta buscada antes de guardarla o elimina cartas ya almacenadas. |
| 🔐 **Registro e inicio de sesión** | Sistema de autenticación con usuarios persistidos en IndexedDB y control de sesión vía `sessionStorage`. |
| ⏳ **Animaciones de carga** | Spinners durante las peticiones a la API y transiciones entre vistas. |
| 📱 **Responsive** | Menú adaptativo con **jQuery** + **Headroom.js**. |

---

## 🎬 Demo del flujo

```
┌──────────────┐     ┌──────────────┐     ┌─────────────────────────┐
│  Registro    │ ──▶ │   Login      │ ──▶ │   Buscador de Cartas    │
│ registrarse  │     │  index.html  │     │     app/index.html      │
│  .html       │     │  (raíz)      │     │                         │
└──────────────┘     └──────────────┘     └─────────────────────────┘
                                                      │
                                  ┌───────────────────┼───────────────────┐
                                  ▼                    ▼                   ▼
                          1. Busca carta        2. Guarda (IndexedDB)  3. Filtra/Ver más
                             (API YGOPRODeck)       cola FIFO              · detalles
                                                                          · variantes
                                                                          · eliminar (FIFO)
```

> **Página adicional:** `app/vision.html` describe el objetivo y alcance del proyecto.

---

## 🛠️ Stack tecnológico

- **HTML5** — estructura semántica y elementos nativos `<dialog>`.
- **CSS3** — hojas de estilo por vista (`main`, `vision`, `login`, `InicioSesion`), animaciones y spinners.
- **JavaScript ES6+** — Módulos (`import`/`export`), **Clases (POO)**, `async/await` y `Promises`.
- **IndexedDB** — persistencia de cartas (`infoCarta`) y usuarios (`ListaUsuariosDB`).
- **Fetch API** — consumo de la API REST de YGOPRODeck.
- **jQuery** + **Headroom.js** — menú responsivo y header dinámico.
- **Font Awesome** + **Google Fonts** — iconografía y tipografía.

---

## 📂 Estructura del proyecto

```
PROYECTO StructJs_JC/
├── index.html                 # Punto de entrada — Inicio de sesión
├── .vscode/
│   └── settings.json          # Live Server
├── app/
│   ├── index.html             # Buscador de cartas (vista principal)
│   ├── vision.html            # Objetivo del proyecto
│   ├── css/
│   │   ├── main.css           # Estilos del buscador
│   │   └── vision.css         # Estilos de la página de visión
│   ├── img/                   # Imágenes, GIFs e iconos
│   └── js/
│       ├── main.js            # Orquestador: sesión, búsqueda, render y filtros
│       ├── app.js             # Clases (API, Animación…), IndexedDB y lógica FIFO
│       └── js_Menu/
│           ├── headroom.min.js
│           ├── jquery.min.js
│           └── menu.js        # Menú responsivo
└── login/
    ├── registrarse.html       # Formulario de registro
    ├── css/
    │   ├── InicioSesion.css
    │   └── login.css
    └── js/
        ├── loginOff.js        # Listeners de los formularios de auth
        └── loginRegister.js   # Registro y login con IndexedDB
```

---

## 🚀 Instalación y ejecución

> El proyecto usa **ES Modules** (`import` / `export`), por lo que **debe servirse desde un servidor HTTP**. Abrir el `index.html` con `file://` provocará errores de CORS en los módulos.

### Opción A — Live Server (recomendada)

1. Abre la carpeta del proyecto en **VS Code**.
2. Instala la extensión **Live Server**.
3. Haz clic derecho sobre `index.html` (raíz) → **Open with Live Server**.

### Opción B — Servidor estático con Python

```bash
python3 -m http.server 5500
# Abre http://localhost:5500/
```

### Opción C — Servidor estático con Node

```bash
npx serve
# o
npx http-server
```

> **Primer paso de uso:** crea una cuenta en el registro, inicia sesión y comienza a buscar cartas. ✨

---

## ⚙️ Cómo funciona

### Autenticación (`loginRegister.js` + `loginOff.js`)
- **Registro:** valida los campos, comprueba duplicados (usuario, cédula, correo) recorriendo un *cursor* de IndexedDB y guarda el usuario en el almacén `usuariosRegistrados` de la base `ListaUsuariosDB`.
- **Login:** verifica las credenciales contra IndexedDB y, si coinciden, crea la sesión en `sessionStorage`.
- **Guardia de sesión:** si no existe sesión activa, `main.js` redirige automáticamente al registro.

### Búsqueda y render (`main.js`)
1. La clase `API_JC` realiza un `fetch` a YGOPRODeck por nombre de carta.
2. Se desestructuran los datos (`id`, `name`, `type`, `atk`, `def`, `level`, `desc`, `card_images`).
3. Se asigna color de fondo y texto según el tipo de carta y se renderiza la tarjeta.
4. Botones **Guardar** (persistir en IndexedDB) y **Descartar** (eliminar de la vista).

### Persistencia y FIFO (`app.js`)
- `abrirDBCartas_JC` crea/abre la base `infoCarta` con el almacén `cartas` y el índice `ordenCartasFifo`.
- Al guardar, `ordenCartasFifo_JC` marca la carta con `Date.now()`, definiendo su orden en la cola.
- `BuscarCartas_JC` recupera las cartas guardadas, las filtra por tipo y permite **Ver Detalles** (estadísticas + variantes consultadas en la API).
- `BorradoCartaFiltro_JC` elimina **la carta más antigua** del tipo filtrado, respetando la política **FIFO**.

### Clases principales

| Clase | Responsabilidad |
|-------|-----------------|
| `API_JC` | Consultar la API por nombre de carta. |
| `APIVerDetalles_JC` | Obtener variantes y cartas relacionadas. |
| `Animacion_JC` | Mostrar/ocultar el spinner de carga. |
| `DescarteDeCarta_JC` | Eliminar la carta renderizada del DOM. |
| `mensajeCartaborrada_JC` | Modal de confirmación de eliminación. |

---

## 🗃️ Arquitectura de datos

**Base de datos `infoCarta` → almacén `cartas`** (clave: `id`)

```js
{
  id: 89631139,
  name: "Blue-Eyes White Dragon",
  type: "Normal Monster",
  atk: 3000,
  def: 2500,
  level: 8,
  desc: "This legendary dragon is a powerful engine of destruction...",
  card_images: [ { image_url_cropped, image_url_small, ... } ],
  ordenCartasFifo: 1722367200000   // timestamp → orden FIFO
}
```

- **Índice `ordenCartasFifo`** → permite recuperar y eliminar las cartas por orden de inserción (cola FIFO).
- **Base `ListaUsuariosDB` → almacén `usuariosRegistrados`** → almacena las credenciales de los usuarios.

---

## 🌐 API utilizada

[**YGOPRODeck API v7**](https://ygoprodeck.com/api-guide/) — base de datos pública de cartas de Yu-Gi-Oh!

```
GET https://db.ygoprodeck.com/api/v7/cardinfo.php?name={nombre}
```

---

## 📄 Licencia

Distribuido bajo licencia **MIT**.

<div align="center">

Hecho con ❤️, JavaScript y el corazón de las cartas 🃏

</div>
