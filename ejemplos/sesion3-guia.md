# Guía de `ejemplos/sesion3.html` — Portafolio con JavaScript (ES6+, DOM, Eventos y Storage)

Esta es la versión de referencia del portafolio de la sesión 3. Mantiene todo lo de las sesiones 1 y 2 (HTML semántico, variables CSS, Flexbox, Grid, responsive y animaciones) y agrega **JavaScript**:

- **ES6+**: `let`/`const`, arrow functions, template literals, destructuring, spread y rest.
- **Clases ES6** con campo privado (`#id`) y *getter*.
- **Métodos de array**: `filter`, `map`, `reduce`, `find`, `forEach`.
- **DOM**: selección (`querySelector`, `getElementById`) y manipulación (`innerHTML`, `textContent`, `classList`, `setAttribute`, `dataset`).
- **Eventos**: `addEventListener`, `click`, `input`, `e.currentTarget`, `preventDefault()`.
- **Local Storage**: guardar el tema y un borrador del formulario.
- Un **adelanto de la sesión 4** (Promesas, `async/await`, Fetch y APIs públicas), que ya funciona en la página.

| Parte | Dónde está | Para qué sirve |
|---|---|---|
| HTML | `ejemplos/sesion3.html` | Estructura; trae contenedores **vacíos** que JS llena (`#projects-grid`, `#hero-stats`, `#poke-grid`…) |
| CSS | `ejemplos/assets/css/sesion3.css` | Los 15 bloques de la sesión 2 + estilos para los componentes JS (al final del archivo) |
| JS | `ejemplos/assets/js/app.js` | Lógica, organizada en bloques `SESIÓN 3 – BLOQUE A…J` y `SESIÓN 4 – BLOQUE A…G` |
| JS inline | `<script>` al final del `<body>` | El valor del *slider* de presupuesto (igual que en la sesión 2) |

**Para verla:** abre `ejemplos/sesion3.html` en el navegador y abre la **consola** (F12 → Console) para ver los `console.log`. Las secciones de APIs necesitan **conexión a internet**. Se recomienda usar **Live Server** de VS Code.

---

## 1. Qué cambió respecto a la sesión 2

| Zona de la página | Antes (sesión 2) | Ahora (sesión 3) |
|---|---|---|
| Navbar | Logo + menú | + botón 🌙 / ☀️ de **modo oscuro**, que se recuerda con `localStorage` |
| Hero | Texto fijo | + `#hero-stats`: estadísticas que inserta JS |
| Proyectos | 3 tarjetas escritas en el HTML | **Barra de filtros** + contador + tarjetas **generadas con JS** desde un array |
| APIs | — | Sección nueva `#apis`: Pokémon, buscador de países y tabla de APIs (sesión 4) |
| Contacto | Formulario que no hace nada | Guarda un **borrador** mientras escribes y lo envía con Fetch POST |
| Notificaciones | — | `#toast`: mensaje flotante abajo a la derecha |

> Idea clave de la sesión: **el HTML deja "huecos" con un `id` y JavaScript los rellena.** Por eso `#projects-grid` aparece vacío en el HTML.

---

## 2. El HTML: lo nuevo

### 2.1 Cómo se carga el JavaScript

```html
<script>
  const range = document.getElementById('presupuesto');
  ...
</script>

<script src="assets/js/app.js"></script>
</body>
```

| Detalle | Por qué importa |
|---|---|
| Los `<script>` van **al final del `<body>`** | Cuando se ejecutan, el HTML ya está cargado y `getElementById` encuentra los elementos. Si los pones en el `<head>`, devuelven `null`. |
| `src="assets/js/app.js"` | Carga el JavaScript desde un archivo externo, como se hace con el CSS. |
| Sin `type="module"` | `app.js` no usa `import`/`export`, así que se carga como **script clásico** y funciona incluso con doble clic (`file://`). En la carpeta `sesion3/` del curso sí se usa `type="module"` (ver sección 6). |

### 2.2 Botón de tema

```html
<button id="theme-toggle" class="theme-btn" aria-label="Modo oscuro">🌙</button>
```

- Se usa `<button>` y no `<div>`, porque un botón se puede usar con teclado (Tab + Enter) y los lectores de pantalla lo reconocen.
- `aria-label` describe el botón, ya que su único contenido es un emoji. JS lo cambia a "Modo claro" cuando el tema es oscuro.

### 2.3 Filtros de proyectos con atributos `data-*`

```html
<div class="filter-bar" role="group" aria-label="Filtrar proyectos">
  <button class="filter-btn active" data-filter="all">Todos</button>
  <button class="filter-btn" data-filter="frontend">Front-End</button>
  <button class="filter-btn" data-filter="backend">Back-End</button>
  <button class="filter-btn" data-filter="fullstack">Full Stack</button>
  <button class="filter-btn" data-filter="api">API</button>
</div>
<p class="projects-meta"><span id="project-count"></span></p>
<div class="projects-grid" id="projects-grid"></div>
```

| Elemento / atributo | Qué hace |
|---|---|
| `data-filter="frontend"` | **Atributo personalizado**. Guarda un dato en el HTML que JS lee con `boton.dataset.filter`. Cualquier atributo que empiece con `data-` es válido. |
| `class="... active"` | Marca el botón seleccionado. JS mueve esta clase al botón en el que se hizo clic. |
| `role="group"` | Indica a los lectores de pantalla que los botones forman un conjunto. |
| `data-filter="api"` | Muestra solo los proyectos que llegan de JSONPlaceholder (sesión 4). |
| `#project-count` | JS escribe aquí "5 proyectos", "2 proyectos"… |
| `#projects-grid` | **Vacío a propósito**: JS inserta las tarjetas. |

### 2.4 Otros contenedores que llena JavaScript

| Elemento | Lo llena… | Sesión |
|---|---|---|
| `#hero-stats` | `loadDashboardData()` | 4 |
| `#projects-loader` (clase `hidden`) | Se muestra mientras corre un `fetch` | 4 |
| `#poke-grid` + botón `#poke-next` | `fetchPokemons()` | 4 |
| `#country-search` + `#country-result` | `fetchCountry()` | 4 |
| `#toast` (`role="status"`, `aria-live="polite"`) | `showToast()`; `aria-live` hace que el lector de pantalla **lea el mensaje** cuando cambia | 3 / 4 |

---

## 3. El JavaScript (`assets/js/app.js`), bloque por bloque

### Bloque A — `let` y `const`

```js
const SITE_AUTHOR = 'Hebert Cussi';
const API_BASE    = 'https://jsonplaceholder.typicode.com';

let currentFilter = 'all';
let pokemonPage   = 0;
```

| Palabra | Cuándo usarla |
|---|---|
| `const` | El valor **no se reasigna**. Úsala por defecto. |
| `let` | El valor **va a cambiar** (`currentFilter` cambia con cada clic en un filtro). |
| `var` | **No se usa**: tiene alcance de función y genera errores difíciles de encontrar. |

> Convención: las constantes de configuración se escriben en `MAYÚSCULAS_CON_GUION_BAJO`.
>
> `const` no hace inmutable un objeto o array. `const lista = []; lista.push(1);` funciona, porque lo que no se puede hacer es **reasignar** la variable (`lista = otra`).

### Bloque C — Arrow functions y template literals

```js
const greet = (name) => `¡Hola desde el portafolio de ${name}! 🚀`;
const formatPrice = (amount) => `$${Number(amount).toLocaleString('es-BO')}`;
```

- `(name) => ...` es una **función flecha**. Si el cuerpo es una sola expresión, devuelve el resultado sin escribir `return`.
- Las **comillas invertidas** `` ` `` permiten insertar variables con `${...}` y escribir texto en varias líneas (se aprovecha para generar HTML).
- En `` `$${...}` `` el primer `$` es texto (el símbolo de dólar) y `${...}` es la interpolación.

### Bloque D — Destructuring, spread y rest

```js
const devProfile = { name: 'Hebert Cussi', role: 'Full Stack Developer', location: 'La Paz, Bolivia',
                     skills: ['JavaScript', 'React', 'Node.js', 'Python'] };

const { name, role, skills } = devProfile;          // destructuring de objeto
const [mainSkill, ...otherSkills] = skills;          // destructuring de array + rest

const allTechs = [...frontEnd, ...backEnd];          // spread: une arrays
const updatedProfile = { ...devProfile, available: true };  // spread: copia + agrega
```

| Sintaxis | Nombre | Qué hace |
|---|---|---|
| `const { a, b } = obj` | Destructuring de objeto | Saca propiedades a variables **por nombre**. |
| `const [x, y] = arr` | Destructuring de array | Saca elementos **por posición**. |
| `...resto` (al **recibir**) | Rest | Junta "lo que sobra" en un array: `otherSkills = ['React', 'Node.js', 'Python']`. |
| `...arr` (al **crear**) | Spread | "Desparrama" los elementos dentro de un array u objeto nuevo. |

> `updatedProfile` es un objeto **nuevo**; `devProfile` no se modifica. Copiar en lugar de modificar el original es una práctica que vas a usar mucho en React.

### Bloque E — Clases ES6

```js
class Project {
  #id;                               // campo privado

  constructor({ id, title, description, techs, emoji, category }) {
    this.#id = id;
    this.title = title;
    ...
  }

  get id() { return this.#id; }     // getter: se usa como propiedad → p.id

  toHTML() {
    const badges = this.techs.map(t => `<span class="tech-badge">${t}</span>`).join('');
    return `<article class="project-card" data-id="${this.#id}" ...> ... </article>`;
  }
}

const localProjects = [
  new Project({ id: 1, category: 'frontend', emoji: '📱', title: 'App de Tareas', ... }),
  ...
];
```

| Concepto | Qué hace |
|---|---|
| `class` | Es un **molde** para crear objetos con la misma forma y comportamiento. |
| `constructor({ ... })` | Se ejecuta con `new`. Recibe **un objeto** y lo desestructura, así que el orden de los datos no importa. |
| `#id` | **Campo privado**: solo se puede leer dentro de la clase. `proyecto.#id` desde afuera da error. |
| `get id()` | Permite **leer** el id (`proyecto.id`) pero no cambiarlo. |
| `toHTML()` | **Método**: cada proyecto sabe generar su propia tarjeta HTML. |
| `.map(...).join('')` | Convierte `['React', 'Flexbox']` en `'<span>React</span><span>Flexbox</span>'`. Sin `join('')`, el array se uniría con comas visibles. |

🧪 **Prueba en la consola:** escribe `localProjects[0].id` y luego `localProjects[0].toHTML()`.

### Bloque F — Métodos de array

```js
const getAllProjects = () => (projectsData.length ? projectsData : localProjects);

const filterProjects = (category) =>
  category === 'all' ? getAllProjects() : getAllProjects().filter(p => p.category === category);

const getTitles = () => localProjects.map(p => p.title);

const countByCategory = localProjects.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});

const findProject = (id) => localProjects.find(p => p.id === id);
```

| Método | Devuelve | Ejemplo en el archivo |
|---|---|---|
| `filter` | Un array **nuevo** con los elementos que cumplen la condición | Proyectos de una categoría |
| `map` | Un array **nuevo** del mismo tamaño, con cada elemento transformado | Títulos; tarjetas HTML |
| `reduce` | **Un solo valor** que se va acumulando (aquí, un objeto) | `{ frontend: 2, fullstack: 2, backend: 1 }` |
| `find` | El **primer** elemento que cumple la condición, o `undefined` | `findProject(3)` |
| `forEach` | Nada (`undefined`); solo recorre | Recorrer los botones de filtro |

**Cómo funciona `reduce` paso a paso**: `acc` empieza como `{}` (el segundo argumento). En cada vuelta suma 1 a la categoría del proyecto. `(acc[x] || 0)` usa 0 si la categoría todavía no existe.

> `findProject` usa `p.id`, que funciona gracias al **getter** del bloque E.
>
> `getAllProjects()` devuelve `projectsData` (locales + API) cuando ya se cargó la API, y si no, `localProjects`. Así los filtros funcionan **antes y después** del `fetch`.

### Bloque G — Selección del DOM

```js
const projectsGrid  = document.querySelector('.projects-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle   = document.getElementById('theme-toggle');
const contactForm   = document.querySelector('#contacto form');
```

| Método | Devuelve | Selector |
|---|---|---|
| `getElementById('x')` | Un elemento o `null` | Solo el id, **sin** `#` |
| `querySelector('css')` | El **primer** elemento que coincide, o `null` | Cualquier selector CSS (`.clase`, `#id`, `#contacto form`) |
| `querySelectorAll('css')` | Una `NodeList` (puede estar vacía) | Igual; se recorre con `forEach` |

> Los elementos se buscan **una sola vez** al inicio y se guardan en constantes. Buscarlos en cada clic sería más lento y repetiría código.

### Bloque H — Renderizado en el DOM

```js
function renderProjects(category = 'all') {
  if (!projectsGrid) return;

  const filtered = filterProjects(category);

  projectsGrid.innerHTML = filtered.map(p => p.toHTML()).join('');

  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });

  const counter = document.getElementById('project-count');
  if (counter) counter.textContent = `${filtered.length} proyectos`;
}

renderProjects('all');
```

| Línea | Qué hace |
|---|---|
| `category = 'all'` | **Parámetro por defecto**: si no se pasa nada, vale `'all'`. |
| `if (!projectsGrid) return;` | **Cláusula de guarda**: si el elemento no existe, sale sin dar error. |
| `innerHTML = ...` | **Reemplaza** todo el contenido del grid por el HTML generado. |
| `classList.toggle('active', condición)` | Con segundo argumento: **agrega** la clase si la condición es `true` y la **quita** si es `false`. Así solo el botón elegido queda activo. |
| `btn.dataset.filter` | Lee el atributo `data-filter` del HTML. |
| `textContent` | Escribe **texto plano** (no interpreta etiquetas HTML). |

**`innerHTML` vs `textContent`**

| | `innerHTML` | `textContent` |
|---|---|---|
| Interpreta etiquetas | Sí | No |
| Úsalo para | HTML que **tú** generaste | Texto, sobre todo si lo escribió el **usuario** o viene de una API |
| Riesgo | Si insertas texto del usuario, puede inyectar código (**XSS**) | Ninguno |

Cuando hay que armar HTML con texto que viene de afuera (una API, un formulario), el archivo usa `escapeHTML()` (bloque C). Esa función cambia `<`, `>`, `&`, `"` y `'` por sus entidades HTML, así el texto se **muestra** en pantalla en vez de **ejecutarse**:

```js
const escapeHTML = (text) =>
  String(text).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);

escapeHTML('<img src=x onerror=alert(1)>');   // '&lt;img src=x onerror=alert(1)&gt;'
```

Se aplica en `Project.toHTML()` (el título y la descripción pueden venir de JSONPlaceholder), en las tarjetas de Pokémon y en el resultado del buscador de países.

### Bloque I — Eventos

**Filtros:**

```js
filterButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    currentFilter = e.currentTarget.dataset.filter;
    renderProjects(currentFilter);
  });
});
```

- `addEventListener('click', función)`: ejecuta la función **cada vez** que se hace clic.
- `e` es el **objeto evento**. `e.currentTarget` es el elemento que tiene el *listener* (el botón). `e.target` sería el elemento exacto que se tocó, que podría ser un hijo del botón.
- El flujo completo es: **clic → leer `data-filter` → `filter()` → `map()` → `innerHTML` → `classList`**.

> Aquí se agrega **un listener a cada botón**. La alternativa es la **delegación de eventos**: un solo listener en el contenedor padre (ver ejercicio 1).

**Modo oscuro:**

```js
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');

  themeToggle.setAttribute('aria-label', isDark ? 'Modo claro' : 'Modo oscuro');
  themeToggle.textContent = isDark ? '☀️' : '🌙';

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
```

| Método | Qué hace |
|---|---|
| `classList.toggle('x')` | Sin segundo argumento: si la clase está, la quita; si no está, la pone. |
| `classList.contains('x')` | `true` / `false` según si el elemento tiene la clase. |
| `setAttribute('nombre', 'valor')` | Cambia cualquier atributo HTML. |
| `condición ? a : b` | **Ternario**: elige entre dos valores en una línea. |

**Scroll suave:**

```js
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
```

- `a[href^="#"]`: **selector de atributo**; `^=` significa "empieza con". Selecciona todos los enlaces internos.
- `e.preventDefault()`: **cancela el comportamiento por defecto** (saltar de golpe y cambiar la URL) para hacer el desplazamiento con JS.
- El valor del `href` (`"#contacto"`) ya es un selector válido, así que se pasa directo a `querySelector`.

### Bloque J — Local Storage

```js
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) {
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-label', 'Modo claro');
    }
  }
}
initTheme();

function saveFormDraft(data) {
  localStorage.setItem('form-draft', JSON.stringify(data));
}
function loadFormDraft() {
  const raw = localStorage.getItem('form-draft');
  return raw ? JSON.parse(raw) : null;
}
```

| Método | Qué hace |
|---|---|
| `localStorage.setItem(clave, valor)` | Guarda un dato que **sobrevive** a recargar o cerrar el navegador. |
| `localStorage.getItem(clave)` | Lo lee; devuelve `null` si no existe. |
| `localStorage.removeItem(clave)` | Lo borra. |
| `JSON.stringify(obj)` | Objeto → texto. **localStorage solo guarda texto.** |
| `JSON.parse(texto)` | Texto → objeto. |

🧪 **Mira lo guardado:** F12 → pestaña **Application** (Chrome) o **Almacenamiento** (Firefox) → Local Storage. Activa el modo oscuro, escribe en el formulario y recarga la página.

> No guardes contraseñas ni datos sensibles en `localStorage`: cualquier script de la página puede leerlos.

**Cómo se usa el borrador** (dentro de `initContactForm`):

```js
contactForm.addEventListener('input', () => {
  const formData = new FormData(contactForm);
  saveFormDraft(Object.fromEntries(formData));
});
```

- El evento `input` se dispara en el `<form>` cada vez que cambia **cualquier** campo, porque los eventos **suben** (*bubbling*) desde el campo hasta el formulario.
- `new FormData(form)` lee todos los campos que tengan atributo `name`.
- `Object.fromEntries(...)` lo convierte en un objeto `{ nombre: '...', email: '...', ... }`.

**Cómo se restaura el borrador** al cargar la página:

```js
const draft = loadFormDraft();
if (draft) {
  Object.entries(draft).forEach(([fieldName, value]) => {
    const field = contactForm.elements[fieldName];   // busca el campo por su name
    if (field) field.value = value;
  });

  const range = contactForm.elements.presupuesto;
  if (range) range.dispatchEvent(new Event('input', { bubbles: true }));
}
```

| Parte | Qué hace |
|---|---|
| `Object.entries(draft)` | Convierte `{ nombre: 'Ana', email: '...' }` en `[['nombre', 'Ana'], ['email', '...']]`. |
| `([fieldName, value]) =>` | **Destructuring** de cada par `[clave, valor]` directamente en los parámetros. |
| `contactForm.elements[fieldName]` | Busca el campo del formulario por su atributo `name`. |
| `dispatchEvent(new Event('input'))` | **Dispara un evento a mano**. Cambiar `.value` desde JS no dispara `input`, así que se avisa al slider para que actualice el texto "$…" del presupuesto. |

---

## 4. Adelanto de la sesión 4 (ya incluido en `app.js`)

Estos bloques se verán en detalle la próxima sesión. Por ahora basta con reconocerlos:

| Bloque | Función | Concepto |
|---|---|---|
| A | `validateEmail()` | Crear una **Promesa** con `new Promise((resolve, reject) => ...)` y usarla con `.then()` / `.catch()` |
| B | `fetchJSON(url)` | `async/await` + `fetch`; si `res.ok` es `false`, lanza un error con `throw` |
| C | `fetchProjects()` | GET a JSONPlaceholder + `try / catch / finally` para mostrar y ocultar el *loader*; al terminar vuelve a llamar a `renderProjects(currentFilter)` |
| D | `fetchPokemons()` | **`Promise.all`**: 6 peticiones **en paralelo** |
| E | `fetchCountry()` | Buscador de países con [countries.dev](https://countries.dev) (sin API key), *debounce* (`setTimeout` + `clearTimeout`) y destructuring con valor por defecto y renombrado (`flags: { svg: flag }`) |
| F | `initContactForm()` | Envío con **Fetch POST** (`method`, `headers`, `body: JSON.stringify(...)`) |
| G | `loadDashboardData()` | `Promise.all` que corre `fetchProjects()` y pide `/users` **a la vez**; con eso calcula los stats del hero (proyectos, tecnologías únicas con `new Set(...)`, clientes y filas de la tabla de APIs) |

Punto de entrada:

```js
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  loadDashboardData();
  if (pokeSection) fetchPokemons(0);
});
```

`DOMContentLoaded` se dispara cuando el HTML terminó de cargarse. Es una garantía extra de que los elementos existen antes de usarlos. `fetchProjects()` no aparece aquí porque la llama `loadDashboardData()` dentro de su `Promise.all`.

**Así quedan los stats del hero:**

```js
const [, users] = await Promise.all([
  fetchProjects(),                   // promesa 1: llena projectsData
  fetchJSON(`${API_BASE}/users`),    // promesa 2: "clientes" de ejemplo
]);

const projects   = getAllProjects();
const techsCount = new Set(projects.flatMap(p => p.techs)).size;
```

- `const [, users]`: la **coma inicial** salta el primer resultado (`fetchProjects()` no devuelve nada) y guarda solo el segundo.
- `flatMap(p => p.techs)`: une los arrays de tecnologías de todos los proyectos en **uno solo**.
- `new Set(...)`: un `Set` no admite repetidos, así que `.size` da la cantidad de tecnologías **distintas**.

**Toast** (utilidad compartida):

```js
function showToast(msg, type = 'success') {
  toastEl.textContent = msg;
  toastEl.className = `toast toast--${type} toast--show`;
  setTimeout(() => toastEl.classList.remove('toast--show'), 3000);
}
```

Muestra el mensaje agregando la clase `toast--show` y la quita a los 3 segundos. La animación la hace el CSS, con una `transition` sobre `transform` y `opacity`.

---

## 5. El CSS nuevo (`assets/css/sesion3.css`, sección "SESIÓN 3 y 4")

Los bloques 1 a 15 son los mismos de la sesión 2 (ver `sesion2-guia.md`). Al final del archivo se agregaron los estilos de los componentes que maneja JS.

### 5.1 Modo oscuro con variables CSS

```css
body.dark-mode {
  --bg-primary:   #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --border:       #334155;
  ...
}
```

Este es el truco principal: **no se reescribe ningún componente**. Como todo el CSS usa `var(--bg-primary)`, `var(--text-primary)`, etc., basta con **redefinir las variables** dentro de `body.dark-mode` para que toda la página cambie. JS solo pone o quita **una clase**.

> Por eso en la sesión 1 se insistió en usar variables en lugar de colores escritos a mano.

### 5.2 Estado visual controlado por clases

| Clase que pone o quita JS | CSS | Resultado |
|---|---|---|
| `.filter-btn.active` | Fondo `--accent`, texto blanco, `translateY(-2px)` | Botón seleccionado |
| `.loader.hidden` | `display: none` | Oculta el *loader* |
| `.toast--show` | `transform: translateY(0); opacity: 1` | El toast **sube** desde abajo (por defecto está en `translateY(120%)` con `opacity: 0`) |
| `.toast--success` / `.toast--error` | Verde / rojo | Tipo de mensaje |
| `.poke--fire`, `.poke--water`… | Color de borde y etiqueta | Clase armada con template literal: `` `poke--${type}` `` |

**Regla de oro:** JS **cambia clases** y CSS **decide cómo se ve**. Evita escribir `elemento.style.color = ...` desde JS.

### 5.3 Otros detalles

| Selector | Qué hace |
|---|---|
| `.theme-btn:hover` | `rotate(20deg) scale(1.1)`: el botón gira un poco. |
| `.stat-item strong` | Número con **texto degradado** (`background-clip: text`), igual que el logo. |
| `.loader span:nth-child(2/3)` | Tres puntos con la animación `bounce` y distinto `animation-delay`, para que "salten" uno tras otro. |
| `.apis-grid` | Grid con `repeat(auto-fill, minmax(40%, 1fr))` → 2 paneles lado a lado. |
| `.toast` | `position: fixed` + `z-index: 999`: queda flotando sobre todo, aunque hagas scroll. |
| `@media (max-width: 600px)` | En móvil: Pokémon en 2 columnas, paneles apilados y toast a todo el ancho. |

---

## 6. Relación con la carpeta `sesion3/` del curso

| | `ejemplos/sesion3.html` (esta guía) | `sesion3/` (tu proyecto) |
|---|---|---|
| Propósito | Versión **terminada** de referencia | Donde **tú** escribes el código paso a paso |
| Carga de JS | `<script src>` clásico | `<script type="module">`: necesita **Live Server** |
| Guía | Este archivo | `sesion3/README.md` (estructuras de control) |

Recomendación: sigue `sesion3/README.md` en tu proyecto y usa esta página para ver **cómo queda todo integrado**.

---

## 7. Correcciones aplicadas al código (para analizar en clase)

La primera versión del ejemplo tenía estos problemas. Ya están corregidos; compara el **antes** y el **después** para entender por qué fallaba cada uno.

| # | Problema | Antes | Después |
|---|---|---|---|
| 1 | Los proyectos de la API **nunca aparecían** | `fetchProjects()` no se llamaba y `filterProjects` solo usaba `localProjects` | `loadDashboardData()` llama a `fetchProjects()`; `filterProjects` usa `getAllProjects()`; al terminar el `fetch` se vuelve a renderizar; nuevo botón **API** |
| 2 | Al recargar en modo oscuro, el lector de pantalla decía "Modo oscuro" | `initTheme()` solo cambiaba el emoji | También hace `setAttribute('aria-label', 'Modo claro')` |
| 3 | Del borrador **solo volvía el mensaje** | Se leía solo `draft.mensaje` | Se recorren todos los campos con `Object.entries(draft).forEach(...)` y se actualiza el texto del slider con `dispatchEvent` |
| 4 | Los stats del hero eran **datos fijos** (`'10+'`, `'5+'`) | `Promise.all` pedía 3 APIs y no usaba las respuestas | Los stats se calculan con datos reales: proyectos, tecnologías únicas (`Set`), usuarios de la API y filas de la tabla |
| 5 | Texto de APIs insertado con `innerHTML` **sin escapar** (riesgo XSS) | `${this.title}`, `${name}`… | `escapeHTML()` en `toHTML()`, Pokémon y países |
| 6 | Comentarios que decían que `app.js` era un **módulo ES6** | "type=\"module\" habilita import/export" | Los comentarios explican que aquí es un script clásico y que en `sesion3/` sí se usa `type="module"` |
| 7 | El buscador de países **dejó de funcionar** | REST Countries v3.1 fue dada de baja (ahora pide API key) | Se cambió a [countries.dev](https://countries.dev), gratis y sin clave; la constante pasó de `WEATHER_API` a `COUNTRIES_API` |

> Lección general: un código puede **no dar ningún error en la consola** y aun así estar mal (puntos 1, 3 y 4). Prueba siempre lo que el usuario ve, no solo que no haya errores rojos.

---

## 8. Ejercicios propuestos

1. Reemplaza los 5 listeners de los filtros por **delegación de eventos**: un solo `addEventListener` en `.filter-bar` usando `e.target.closest('.filter-btn')`.
2. Usa `findProject(id)`: al hacer clic en una tarjeta, lee su `data-id` y muestra su título con `showToast()`. *(Ojo: `findProject` busca en `localProjects`; cámbialo para que use `getAllProjects()`.)*
3. Muestra en `#project-count` "1 proyecto" en **singular** cuando haya un solo resultado (pista: ternario).
4. Agrega un campo de búsqueda que filtre los proyectos por título mientras escribes (evento `input` + `filter` + `title.toLowerCase().includes(...)`).
5. Haz que el tema respete la preferencia del sistema la primera vez, con `window.matchMedia('(prefers-color-scheme: dark)').matches`.
6. En el buscador de países, muestra también la **moneda** (pista: agrega `currencies` a `fields` y usa `currencies[0].name`).
7. Prueba `escapeHTML`: en la consola, crea `new Project({ id: 99, title: '<b>Hola</b>', description: 'x', techs: [], emoji: '🧪', category: 'frontend' })` y compara su `toHTML()` con y sin `escapeHTML`.
8. Usa `Promise.allSettled` en lugar de `Promise.all` en `loadDashboardData()` para que los stats se muestren aunque falle la petición de `/users`.
