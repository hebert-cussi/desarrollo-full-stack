# Guía de `ejemplos/sesion2.html` — Portafolio con CSS Grid, Responsive y Animaciones

Esta es la versión de referencia del portafolio de la sesión 2. Parte de lo visto en la sesión 1 (HTML semántico, variables CSS, Flexbox) y agrega:

- **CSS Grid** (`grid-template-columns`, `grid-template-areas`, `repeat(auto-fill, minmax())`).
- **Diseño responsive** con varios *breakpoints* (`@media`).
- **Animaciones** con `@keyframes`, `transition` y `transform`.
- **Meta etiquetas SEO y Open Graph**.
- **Inputs modernos de HTML5**: `date`, `range`, `search` + `<datalist>`.

A diferencia de la sesión 1, aquí el CSS está en un **archivo externo**:

| Parte | Dónde está | Para qué sirve |
|---|---|---|
| HTML | `ejemplos/sesion2.html` | Estructura y contenido |
| CSS | `ejemplos/assets/css/styles.css` (15 bloques numerados) | Presentación |
| JavaScript | `<script>` al final del `<body>` (líneas 322–331) | Muestra el valor del presupuesto mientras se mueve el *slider* |

Para verla, abre `ejemplos/sesion2.html` en el navegador (la carpeta `assets/` debe estar junto al HTML).

---

## 1. Cómo está construida

1. **Documento HTML5** con `lang="es"`, UTF-8 y `viewport`.
2. **Meta etiquetas** para buscadores (SEO) y redes sociales (Open Graph).
3. **CSS externo** enlazado con `<link rel="stylesheet">`, organizado en 15 bloques:
   1. Variables CSS
   2. Reset y estilos globales
   3. Contenedor
   4. Header / navbar (Flexbox)
   5. Hero (Grid de 2 columnas)
   6. Acerca de (Grid con áreas nombradas)
   7. Proyectos (Grid `auto-fill`)
   8. Encabezados de sección (reutilizable)
   9. Botones
   10. Contacto (Grid sidebar + formulario)
   11. Footer (Grid de 2 columnas)
   12. Responsive *mobile first* (`min-width`)
   13. Responsive colapso móvil (`max-width`)
   14. Animaciones adicionales
   15. Utilidades (aparición de elementos y brillo en tarjetas)
4. **HTML semántico**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<form>`, `<footer>`.
5. **Accesibilidad**: `aria-label` en secciones y menús, `aria-hidden="true"` en elementos decorativos, `<label for>` en cada campo.

---

## 2. El `<head>`

```html
<title>Hebert Cussi – Desarrollador Full Stack</title>
<meta name="description" content="Portafolio de Hebert Cussi Cuentas, ..." />
<meta name="keywords" content="desarrollador, full stack, react, ..." />
<meta name="author" content="Hebert Cussi Cuentas" />

<meta property="og:title" content="Hebert Cussi – Desarrollador Full Stack" />
<meta property="og:description" content="Portafolio profesional de Hebert Cussi Cuentas." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://hebertcussi.dev" />
<meta property="og:image" content="https://hebertcussi.dev/preview.png" />

<link rel="stylesheet" href="assets/css/styles.css" />
```

### 2.1 SEO

| Etiqueta | Qué hace |
|---|---|
| `<title>` | Texto de la pestaña y título principal en los resultados de Google. |
| `<meta name="description">` | Resumen que aparece bajo el título en los buscadores. Ideal: 120–160 caracteres. |
| `<meta name="keywords">` | Palabras clave. Hoy Google **ya no la usa** para posicionar, pero es común verla. |
| `<meta name="author">` | Autor de la página. |

### 2.2 Open Graph (redes sociales)

El protocolo **Open Graph** (`og:`) controla cómo se ve el enlace al compartirlo en WhatsApp, Facebook, LinkedIn, etc.

| Propiedad | Qué define |
|---|---|
| `og:title` | Título de la tarjeta compartida. |
| `og:description` | Texto de la tarjeta. |
| `og:type` | Tipo de contenido (`website`, `article`, `profile`…). |
| `og:url` | URL oficial de la página. |
| `og:image` | Imagen de vista previa (recomendado 1200×630 px). |

> Nota: Open Graph usa el atributo `property`, no `name`.

### 2.3 CSS externo

`<link rel="stylesheet" href="assets/css/styles.css">` carga los estilos desde otro archivo. Ventajas frente al `<style>` interno de la sesión 1:

- El HTML queda más limpio.
- Varias páginas pueden compartir el mismo CSS.
- El navegador guarda el archivo en caché y no lo descarga de nuevo.

---

## 3. El HTML (`<body>`)

Estructura general:

```
<header>          → logo + menú
<main>
  <section #inicio>     → hero (presentación)
  <section #acercade>   → biografía + habilidades
  <section #servicios>  → proyectos
  <section #contacto>   → info + formulario
</main>
<footer>          → marca + redes sociales
<script>          → valor del range
```

### 3.1 Header

```html
<header>
  <div class="container">
    <div class="navbar">
      <div class="logo">Hebert Cussi Cuentas</div>
      <nav aria-label="Navegación principal">
        <ul>
          <li><a href="#inicio">Inicio</a></li>
          ...
        </ul>
      </nav>
    </div>
  </div>
</header>
```

| Elemento | Qué hace |
|---|---|
| `<nav aria-label="...">` | Indica a los lectores de pantalla qué menú es. Útil cuando hay más de un `<nav>` (aquí también hay uno en el footer). |
| `href="#servicios"` | Salta a la sección con ese `id`. Gracias a `scroll-behavior: smooth` el desplazamiento es suave. |

### 3.2 Hero (`#inicio`)

```html
<section id="inicio" aria-label="Presentación">
  <div class="container hero-grid">
    <div class="hero-content">
      <span class="hero-badge">Disponible para proyectos</span>
      <h1>Hola, soy<br><strong>Hebert Cussi</strong></h1>
      <p>...</p>
      <div class="hero-actions">
        <a href="#servicios" class="btn btn--primary">Ver proyectos</a>
        <a href="#contacto" class="btn btn--outline">Contáctame</a>
      </div>
    </div>
    <aside class="hero-visual" aria-hidden="true">
      <div class="floating-card card--a">React</div>
      <div class="floating-card card--b">Node.js</div>
      <div class="floating-card card--c">Python</div>
      <div class="avatar-ring"><div class="avatar-inner">HC</div></div>
    </aside>
  </div>
</section>
```

| Elemento | Qué hace |
|---|---|
| `.hero-grid` | Contenedor **Grid** con 2 columnas: texto (izquierda) y visual (derecha). |
| `.hero-badge` | Etiqueta tipo "píldora" sobre el título. |
| `<strong>` dentro del `<h1>` | Resalta el nombre; en CSS recibe un texto con degradado. |
| `btn btn--primary` / `btn btn--outline` | Nomenclatura **BEM**: `.btn` es el estilo base y `--primary` / `--outline` son **modificadores** (variantes). |
| `<aside aria-hidden="true">` | Contenido complementario y **solo decorativo**; `aria-hidden` lo oculta a lectores de pantalla. |
| `.floating-card` | Tarjetas que "flotan" con animación infinita. |
| `.avatar-ring` | Círculo con las iniciales y un anillo que "late" (animación `pulse`). |

### 3.3 Acerca de (`#acercade`)

```html
<div class="container about-grid">
  <header class="section-header">...</header>
  <div class="about-bio">...</div>
  <div class="skills-grid">
    <article class="skill-card skill--backend">
      <span class="skill-icon">⚙️</span>
      <h3>Back-End</h3>
      <ul><li>Node.js (NestJS, Express)</li> ...</ul>
    </article>
    <!-- Front-End y Bases de Datos -->
  </div>
</div>
```

- `.about-grid` es un Grid con **áreas nombradas** (`header`, `bio`, `skills`).
- Un `<header>` puede usarse **dentro de una sección** como encabezado de esa sección (no solo para la cabecera de la página).
- Cada habilidad es un `<article>` porque es un bloque independiente.
- Las clases `skill--backend`, `skill--frontend`, `skill--db` son modificadores que cambian el color del título.

### 3.4 Proyectos (`#servicios`)

```html
<div class="projects-grid">
  <article class="project-card">
    <div class="project-img" aria-hidden="true">📱</div>
    <div class="project-info">
      <h3>App de Tareas</h3>
      <p>...</p>
      <footer class="project-tags">
        <span class="tech-badge">React</span> ...
      </footer>
    </div>
  </article>
  <!-- 2 tarjetas más -->
</div>
```

- `.projects-grid` usa `repeat(auto-fill, minmax(300px, 1fr))`: las columnas se acomodan solas según el ancho disponible.
- Un `<article>` puede tener su propio `<footer>`; aquí contiene las etiquetas de tecnologías.
- `&amp;` es la **entidad HTML** del carácter `&` (en "drag &amp; drop").

> El `id` de esta sección es `servicios` aunque su contenido sea "Proyectos". Funciona, pero lo ideal es que el `id` describa el contenido (`#proyectos`).

### 3.5 Contacto (`#contacto`)

```html
<div class="contact-layout">
  <aside class="contact-info">
    <div class="contact-item">📧 Email ...</div>
    <div class="contact-item">📍 Ubicación ...</div>
    <div class="contact-item">⏱️ Respuesta ...</div>
  </aside>
  <div class="contact-form">
    <form action="#" method="post" novalidate>...</form>
  </div>
</div>
```

#### Atributos del `<form>`

| Atributo | Qué hace |
|---|---|
| `action="#"` | URL a la que se enviarían los datos (aquí no hay servidor todavía). |
| `method="post"` | Envía los datos en el cuerpo de la petición, no en la URL. |
| `novalidate` | **Desactiva** la validación automática del navegador (los mensajes emergentes). Se usa cuando se quiere validar con JavaScript propio. Los atributos `required`, `minlength`, etc. siguen activando `:invalid` en CSS. |

#### Campos del formulario

| Campo | Tipo | Atributos clave | Qué aporta |
|---|---|---|---|
| Nombre | `type="text"` | `required`, `minlength="3"`, `autocomplete="name"` | Obligatorio, mínimo 3 caracteres; el navegador puede autocompletar el nombre. |
| Correo | `type="email"` | `required`, `autocomplete="email"` | Valida formato de correo y en móvil muestra un teclado con `@`. |
| Fecha | `type="date"` | — | Muestra un **calendario** nativo. |
| Presupuesto | `type="range"` | `min="100"`, `max="5000"`, `step="100"`, `value="500"` | **Deslizador** de 100 a 5000 en saltos de 100. Su valor se muestra con JS. |
| Servicio | `type="search"` | `list="servicios-list"` | Campo de búsqueda con **sugerencias** del `<datalist>`. |
| Mensaje | `<textarea>` | `rows="4"`, `required`, `minlength="20"` | Texto largo, obligatorio, mínimo 20 caracteres. |

**`<datalist>`**: lista de opciones sugeridas. Se conecta con el input mediante `list="servicios-list"` ↔ `id="servicios-list"`. A diferencia de `<select>`, el usuario también puede escribir un valor que no esté en la lista.

```html
<input type="search" id="servicio" list="servicios-list" />
<datalist id="servicios-list">
  <option value="Desarrollo Web Full Stack">
  <option value="API REST / Back-End">
  ...
</datalist>
```

**`<label for="...">`**: el `for` coincide con el `id` del input. Así, al hacer clic en el texto se activa el campo, y los lectores de pantalla lo anuncian.

### 3.6 Footer

```html
<footer>
  <div class="container footer-grid">
    <div class="footer-brand">...</div>
    <nav class="social-links" aria-label="Redes sociales">
      <a href="https://github.com/..." target="_blank" rel="noopener noreferrer">GitHub</a>
      ...
    </nav>
  </div>
  <p class="footer-copy">&copy; 2025 Hebert Cussi Cuentas...</p>
</footer>
```

| Atributo | Qué hace |
|---|---|
| `target="_blank"` | Abre el enlace en una pestaña nueva. |
| `rel="noopener noreferrer"` | **Seguridad**: impide que la página abierta controle la nuestra (`window.opener`) y no envía la URL de origen. Úsalo siempre junto con `target="_blank"`. |
| `&copy;` | Entidad HTML del símbolo ©. |

---

## 4. El CSS (`assets/css/styles.css`)

### 4.1 Variables (bloque 1)

```css
:root {
  --accent:     #6366f1;
  --accent-2:   #a855f7;
  --card-shadow: 0 4px 24px -4px rgba(99,102,241,0.08), ...;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --section-py: 6rem;
  --gap:        2rem;
}
```

Además de colores, ahora hay variables para **sombra**, **transición**, **tipografía** y **espaciados**. Se usan con `var(--nombre)`. Cambiar `--section-py` modifica el espacio vertical de todas las secciones a la vez (se aprovecha en el breakpoint de 1280px).

### 4.2 Reset y globales (bloque 2)

| Regla | Qué hace |
|---|---|
| `*, *::before, *::after { box-sizing: border-box; }` | El `padding` y el `border` se incluyen en el ancho del elemento. |
| `html { scroll-behavior: smooth; }` | Desplazamiento suave al hacer clic en los enlaces `#...`. |
| `body { animation: pageFadeIn 0.6s ease both; }` | La página aparece con un fundido al cargar. |
| `img, svg { display: block; max-width: 100%; }` | Las imágenes nunca se salen de su contenedor. |

### 4.3 Header *sticky* (bloque 4)

```css
header {
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: slideDown 0.5s ease both;
}
```

- `position: sticky; top: 0`: el header se queda **pegado arriba** al hacer scroll.
- `backdrop-filter: blur(12px)`: desenfoca lo que pasa por detrás (efecto "vidrio").
- `z-index: 100`: queda por encima del resto del contenido.
- `.logo` y `h1 strong` usan `background-clip: text` + `color: transparent` para pintar el **texto con un degradado**.

### 4.4 CSS Grid — conceptos clave

| Propiedad | Qué hace | Ejemplo en el archivo |
|---|---|---|
| `display: grid` | Convierte el elemento en contenedor Grid. | Todos los `*-grid` |
| `grid-template-columns` | Define las columnas. | `1fr 1fr` (hero), `1fr 2fr` (contacto) |
| `fr` | "Fracción" del espacio libre. `1fr 2fr` = 1/3 y 2/3. | `.contact-layout` |
| `grid-template-areas` | Dibuja el layout con nombres. | `"content visual"` (hero) |
| `grid-area` | Coloca un hijo en un área nombrada. | `.hero-content { grid-area: content; }` |
| `grid-template-rows` | Define las filas. | `180px 1fr` (tarjeta de proyecto) |
| `gap` | Espacio entre filas y columnas. | `gap: 4rem` |
| `repeat(auto-fill, minmax(300px, 1fr))` | Crea **tantas columnas como quepan**, cada una de mínimo 300px. | `.projects-grid` |

**Grid vs Flexbox**: Grid organiza en **dos dimensiones** (filas y columnas) y es ideal para el layout general; Flexbox organiza en **una dimensión** y es ideal para alinear elementos dentro de un componente. En este archivo se combinan: Grid para las secciones y Flexbox para el navbar, botones, `.project-info`, `.contact-item` y etiquetas.

### 4.5 Hero (bloque 5)

```css
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "content visual";
  align-items: center;
  gap: 4rem;
}
.hero-content { grid-area: content; }
.hero-visual  { grid-area: visual; }
```

- `clamp(2rem, 5vw, 3.5rem)` en el `h1`: tamaño **fluido**; mínimo 2rem, ideal 5% del ancho de la ventana, máximo 3.5rem. Evita usar media queries solo para la tipografía.
- Cada elemento del hero usa `animation: fadeUp 0.6s <retraso> ease both` con retrasos de 0.2s, 0.35s, 0.45s y 0.55s → aparecen **uno tras otro** (efecto escalonado).
- Las tarjetas flotantes usan `position: absolute` dentro de `.hero-visual` (`position: relative`) y la animación `float` con distintos `animation-delay` para que no se muevan sincronizadas.
- `.avatar-ring` se centra con `inset: 50% auto auto 50%` + `transform: translate(-50%, -50%)`.

### 4.6 Acerca de (bloque 6)

```css
.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "bio"
    "skills";
}
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
```

- Las áreas se apilan en una columna.
- `.skill-card:nth-child(n) { animation-delay: ... }`: cada tarjeta aparece un poco después de la anterior.
- `.skill-card:hover { transform: translateY(-6px) scale(1.01); }`: la tarjeta se **eleva** y crece levemente.
- `li:last-child { border-bottom: none; }`: quita la línea punteada del último elemento.

### 4.7 Proyectos (bloque 7)

```css
.projects-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.project-card {
  display: grid;
  grid-template-rows: 180px 1fr;   /* imagen fija + info flexible */
  overflow: hidden;
}
.project-card:hover .project-img { transform: scale(1.05); }
```

- **Grid dentro de Grid**: la grilla de proyectos contiene tarjetas que a su vez son Grid.
- `overflow: hidden` + `scale(1.05)` en la imagen: produce un efecto de *zoom* sin que la imagen se salga de la tarjeta.
- `.project-info p { flex: 1; }` y `.project-tags { margin-top: auto; }`: empujan las etiquetas al **fondo** de la tarjeta, para que queden alineadas aunque los textos tengan distinta longitud.

### 4.8 Botones (bloque 9) — metodología BEM

```css
.btn          { /* estilos comunes */ }
.btn--primary { background: var(--accent); color: #fff; }
.btn--outline { background: transparent; border-color: var(--accent); }
```

**BEM** (*Block, Element, Modifier*): `.bloque`, `.bloque__elemento`, `.bloque--modificador`. Permite crear variantes sin repetir código.

### 4.9 Contacto (bloque 10)

```css
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-areas: "info form";
  gap: 3rem;
  align-items: start;
}
```

| Selector | Qué hace |
|---|---|
| `.contact-item:hover` | `translateX(6px)`: se desplaza a la derecha al pasar el cursor. |
| `input[type="range"]` | **Selector de atributo**: estiliza solo los inputs de tipo range. `accent-color` cambia el color del control nativo. |
| `input:focus, textarea:focus` | Borde y sombra de color al escribir. `outline: none` quita el borde por defecto (siempre reemplazarlo por otro indicador visible). |
| `.btn-submit:active` | `scale(0.98)`: el botón se "hunde" al hacer clic. |

### 4.10 Footer (bloque 11)

- `.footer-grid`: `grid-template-columns: 1fr auto` → la marca ocupa todo el espacio libre y las redes solo lo que necesitan.
- **Subrayado animado** con un pseudo-elemento:

```css
.social-links a::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 2px;
  background: var(--accent);
  transition: width 0.3s ease;
}
.social-links a:hover::after { width: 100%; }
```

La línea empieza con ancho 0 y crece hasta 100% al pasar el cursor.

### 4.11 Responsive (bloques 12 y 13)

**Breakpoints usados**

| Media query | Dispositivo | Cambios |
|---|---|---|
| `(min-width: 640px)` | Tablet | Habilidades en 2 columnas. |
| `(min-width: 768px)` | Tablet grande / laptop | Ajusta `.about-grid` y `.contact-layout`. |
| `(min-width: 1024px)` | Desktop | Hero `1.1fr 0.9fr`, habilidades en 3 columnas. |
| `(min-width: 1280px)` | Pantalla grande | `--section-py: 7rem`, proyectos en 3 columnas fijas. |
| `(max-width: 767px)` | Móvil | Apila hero, contacto y footer en 1 columna; centra textos. |

- **Mobile first** (`min-width`): se escribe primero el estilo para móvil y se **amplía** para pantallas más grandes.
- **Desktop first** (`max-width`): se escribe para escritorio y se **reduce** para pantallas pequeñas.
- El archivo combina ambos enfoques. En móvil, `grid-template-areas: "form" "info"` muestra el **formulario primero**: con áreas nombradas se puede reordenar el contenido sin tocar el HTML.

### 4.12 Animaciones (bloques 2, 4, 5, 14 y 15)

| `@keyframes` | Efecto | Dónde se usa |
|---|---|---|
| `pageFadeIn` | Fundido + leve subida | `body` |
| `slideDown` | Baja desde arriba | `header` |
| `fadeUp` | Aparece subiendo 24px | Hero, tarjetas, encabezados |
| `pulse` | Anillo que "late" | `.avatar-ring` |
| `float` | Sube y baja 10px | `.floating-card` |
| `shake` | Vibra a los lados | Inputs inválidos |
| `rotateSlow`, `shimmer` | Rotación / brillo | Definidas pero **no usadas** (para practicar) |

**Sintaxis abreviada de `animation`**:

```css
animation: fadeUp   0.6s     0.2s    ease     both;
/*         nombre  duración retraso  curva   fill-mode */
animation: float 4s ease-in-out infinite;
/*                                ↑ repetición infinita */
```

- `both` (*fill-mode*): el elemento toma el estado `from` **antes** de empezar (evita un parpadeo durante el retraso) y conserva el `to` al terminar.
- `transition` vs `animation`: `transition` anima un cambio de estado (ej. `:hover`); `animation` + `@keyframes` se ejecuta sola, puede repetirse y tener varios pasos.

**Validación visual con `shake`**:

```css
input:invalid:not(:placeholder-shown),
textarea:invalid:not(:placeholder-shown) {
  border-color: #f87171;
  animation: shake 0.4s ease;
}
```

Se aplica cuando el campo es inválido **y** el usuario ya escribió algo (el placeholder ya no se muestra). Así no aparece en rojo un formulario recién abierto.

**Brillo en tarjetas de proyecto** (bloque 15): `.project-card::before` es una capa con degradado e `opacity: 0` que pasa a `opacity: 1` en `:hover`. `pointer-events: none` evita que la capa bloquee los clics.

---

## 5. El JavaScript (valor del presupuesto)

```js
const range = document.getElementById('presupuesto');
const val   = document.getElementById('presupuesto-val');
if (range && val) {
  range.addEventListener('input', () => {
    val.textContent = '$' + Number(range.value).toLocaleString();
  });
}
```

| Parte | Qué hace |
|---|---|
| `getElementById('presupuesto')` | Obtiene el slider. |
| `getElementById('presupuesto-val')` | Obtiene el `<span>` donde se muestra el valor. |
| `if (range && val)` | Comprueba que ambos existan antes de usarlos (evita errores). |
| `addEventListener('input', ...)` | Se ejecuta **mientras** se mueve el slider (el evento `change` solo se dispara al soltarlo). |
| `range.value` | El valor del input siempre es un **texto** (`"1500"`). |
| `Number(...).toLocaleString()` | Lo convierte a número y lo formatea con separador de miles según el idioma del navegador (`1,500` o `1.500`). |

---
## 6. Ejercicios propuestos

1. Cambia `minmax(300px, 1fr)` por `minmax(220px, 1fr)` en `.projects-grid` y observa cuántas columnas aparecen al redimensionar la ventana.
2. Agrega una cuarta tarjeta de proyecto y verifica que la grilla se reacomoda sola.
3. Usa la animación `shimmer` (ya definida) en el `.hero-badge`.
4. En `.about-grid` (≥ 768px), cambia las áreas a `"header header" "bio skills"` para poner la biografía y las habilidades lado a lado.
5. Muestra el presupuesto con formato boliviano: `Number(range.value).toLocaleString('es-BO')` y el prefijo `Bs`.
6. Corrige las observaciones 1 y 2 de la sección anterior.
