# Guía de `ejemplos/sesion1.html` — Portafolio completo (HTML5 + CSS3 + JS)

Esta es la versión de referencia completa del portafolio de la sesión 1. A diferencia de `sesion1/index.html`, aquí todo está en **un solo archivo**:

| Parte | Dónde está | Para qué sirve |
|---|---|---|
| HTML | `<body>` | Estructura y contenido |
| CSS | `<style>` dentro del `<head>` (líneas 9–432) | Presentación |
| JavaScript | `<script>` al final del `<body>` (líneas 568–623) | Botón para cambiar entre tema claro y oscuro |

Para verla, abre `ejemplos/sesion1.html` en el navegador.

---

## 1. Cómo está construida

1. **Documento HTML5** con `lang="es"`, codificación UTF-8 y `viewport` para móviles.
2. **CSS interno** organizado en 10 bloques numerados:
   1. Variables (tema claro y oscuro)
   2. Reset y estilos globales
   3. Selectores avanzados
   4. Header y navegación (Flexbox)
   5. Hero (Flexbox en columna)
   6. Proyectos (tarjetas con Flexbox)
   7. Habilidades (Flexbox con `wrap`)
   8. Contacto (formulario)
   9. Footer
   10. Responsive (`@media`) y animación (`@keyframes`)
3. **HTML semántico**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<form>` y `<footer>`.
4. **Modo oscuro automático** según la configuración del sistema operativo (`prefers-color-scheme`).
5. **Modo oscuro manual** con un botón 🌓 y un pequeño script que cambia las variables CSS.

---

## 2. El `<head>`

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="description" content="...">
<meta name="theme-color" content="#6366f1">
<title>Hebert Cussi Cuentas | Portafolio</title>
```

| Etiqueta | Qué hace |
|---|---|
| `<!DOCTYPE html>` | Declara el documento como HTML5. |
| `<html lang="es">` | Idioma del contenido (accesibilidad, SEO, traductores). |
| `<meta charset="UTF-8">` | Codificación de caracteres; permite tildes, ñ y emojis. |
| `<meta name="viewport" ...>` | Necesaria para el diseño responsive. `width=device-width` usa el ancho real del dispositivo, `initial-scale=1.0` evita zoom inicial y `viewport-fit=cover` aprovecha toda la pantalla en celulares con "notch". |
| `<meta name="description">` | Resumen que muestran los buscadores. |
| `<meta name="theme-color">` | Color de la barra del navegador en móviles (Chrome Android). |
| `<title>` | Texto de la pestaña. |
| `<style>` | Bloque de CSS interno (en lugar de un archivo `.css` externo). |

---

## 3. El HTML (`<body>`)

### 3.1 Header

```html
<header>
  <div class="container">
    <div class="navbar">
      <div class="logo">Hebert Cussi Cuentas</div>
      <nav><ul><li><a href="#inicio">Inicio</a></li> ...</ul></nav>
      <button class="theme-toggle" id="themeToggle" aria-label="Cambiar tema claro/oscuro">🌓</button>
    </div>
  </div>
</header>
```

| Elemento | Qué hace |
|---|---|
| `<header>` | Cabecera semántica. |
| `<nav>` + `<ul>` + `<li>` + `<a>` | Menú de navegación como lista de enlaces. `href="#inicio"` salta a la sección con `id="inicio"`. |
| `<button>` | Botón real (accesible con teclado). `id="themeToggle"` permite encontrarlo desde JavaScript; `aria-label` describe la acción para lectores de pantalla, ya que el botón solo muestra un emoji. |

### 3.2 `<main>` y secciones

**Inicio (hero)**

```html
<section id="inicio">
  <div class="container hero">
    <div class="hero-content">
      <h1>Diseño y desarrollo <br>con propósito</h1>
      <p>Especialista en frontend...</p>
      <a href="#proyectos" class="btn">Ver proyectos →</a>
    </div>
  </div>
</section>
```

| Elemento | Qué hace |
|---|---|
| `class="container hero"` | Un elemento puede tener **varias clases** separadas por espacio; recibe los estilos de ambas. |
| `<h1>` | Título principal de la página (debe haber uno solo). |
| `<a class="btn">` | Enlace con apariencia de botón (llamado a la acción, *CTA*). |

**Proyectos**

```html
<div class="projects-grid">
  <article class="project-card">
    <div class="project-img">📱</div>
    <div class="project-info">
      <h3>App de Tareas</h3>
      <p>...</p>
      <div><span class="tech-badge">React</span> ...</div>
    </div>
  </article>
  <!-- 2 tarjetas más -->
</div>
```

- `.projects-grid` es el **contenedor** flex.
- Cada `<article class="project-card">` es una **tarjeta** independiente (3 en total).
- `<span class="tech-badge">` son las etiquetas de tecnologías.

**Habilidades**: un `<div class="skills-container">` con 8 `<div class="skill-item">`.

**Contacto (formulario HTML5)**

```html
<form action="#" method="post">
  <div class="form-group">
    <label for="nombre">Nombre completo</label>
    <input type="text" id="nombre" name="nombre" required placeholder="Tu nombre">
  </div>
  <div class="form-group">
    <label for="email">Correo electrónico</label>
    <input type="email" id="email" name="email" required placeholder="tú@ejemplo.com">
  </div>
  <div class="form-group">
    <label for="mensaje">Mensaje</label>
    <textarea id="mensaje" name="mensaje" rows="4" required placeholder="..."></textarea>
  </div>
  <button type="submit" class="btn-submit">Enviar mensaje →</button>
</form>
```

| Elemento / atributo | Qué hace |
|---|---|
| `<form>` | Agrupa los campos que se envían juntos. |
| `action="#"` | URL a donde se envían los datos (`#` = misma página, de momento no se procesa). |
| `method="post"` | Envía los datos en el cuerpo de la petición (no en la URL). |
| `<label for="nombre">` | Texto del campo. `for` lo vincula con el `input` de `id="nombre"`: al hacer clic en la etiqueta se enfoca el campo, y los lectores de pantalla lo leen. |
| `<input type="text">` | Campo de texto de una línea. |
| `<input type="email">` | Campo de correo: el navegador **valida** que tenga formato de email y en móviles muestra el teclado con `@`. |
| `<textarea rows="4">` | Campo de texto multilínea, 4 líneas de alto inicial. |
| `name` | Nombre con el que se envía el dato al servidor. |
| `required` | Campo obligatorio: el navegador no deja enviar el formulario si está vacío. |
| `placeholder` | Texto de ayuda gris que desaparece al escribir. |
| `<button type="submit">` | Envía el formulario. |
| `style="..."` (en el `<p>` final) | **Estilo en línea**: CSS escrito directo en la etiqueta. Útil para algo puntual, pero es mejor usar una clase. |

### 3.3 Footer

Enlaces sociales con `aria-label` (nombre accesible) y párrafo de copyright.

---

## 4. El CSS explicado

### 4.1 Variables y modo oscuro automático

```css
:root {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --accent: #6366f1;
  --accent-hover: #4f46e5;
  --border: #e2e8f0;
  --card-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.02);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-color-scheme: dark) {
  :root { --bg-primary: #0f172a; --bg-secondary: #1e293b; ... }
}
```

| Concepto | Explicación |
|---|---|
| `:root` | Selector del elemento `<html>`; aquí se guardan variables globales. |
| `--nombre: valor` | Declara una **variable CSS** (custom property). Se usa con `var(--nombre)`. |
| `--card-shadow` | Dos sombras separadas por coma. Formato: `x y desenfoque expansión color`. |
| `--transition` | `all` = anima todas las propiedades, `0.3s` = duración, `cubic-bezier(...)` = curva de velocidad (rápido al inicio, suave al final). |
| `@media (prefers-color-scheme: dark)` | Se activa si el sistema operativo del usuario está en **modo oscuro**. Solo redefine las variables; como todo el CSS usa `var(...)`, toda la página cambia de colores automáticamente. |

### 4.2 Reset y globales

| Regla | Propiedad | Qué hace |
|---|---|---|
| `*` | `margin: 0; padding: 0` | Quita márgenes y rellenos por defecto del navegador. |
| `*` | `box-sizing: border-box` | El ancho/alto incluye padding y borde (cajas más predecibles). |
| `body` | `font-family` | Fuentes del sistema en orden de preferencia, con `sans-serif` de respaldo. |
| `body` | `background-color`, `color` | Fondo y color de texto desde las variables. |
| `body` | `line-height: 1.6` | Interlineado de 1.6 veces el tamaño de letra. |
| `body` | `transition: background-color 0.2s, color 0.2s` | Al cambiar de tema, los colores cambian con animación. |
| `html` | `scroll-behavior: smooth` | Desplazamiento suave al hacer clic en enlaces `#seccion`. |
| `.container` | `max-width: 1200px` | Ancho máximo del contenido. |
| `.container` | `margin: 0 auto` | Centra el bloque horizontalmente. |
| `.container` | `padding: 0 24px` | Aire a los lados. |

### 4.3 Selectores avanzados

```css
a[target="_blank"]::after { content: "↗"; display: inline-block; margin-left: 4px; font-size: 0.8em; }
```

- **Selector de atributo** `a[target="_blank"]`: selecciona solo los enlaces que se abren en otra pestaña.
- `::after` + `content: "↗"`: agrega automáticamente una flechita después del texto, para avisar que es un enlace externo.
- `font-size: 0.8em`: `em` es relativo al tamaño de letra **del propio elemento** (80 % del texto del enlace), a diferencia de `rem`, que es relativo a la raíz.

```css
a:focus-visible, button:focus-visible, input:focus-visible {
  outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px;
}
```

- **Lista de selectores** separados por coma: la misma regla aplica a los tres.
- `:focus-visible`: se activa cuando el elemento recibe el foco **con el teclado** (tecla Tab), no con clic. Es clave para la accesibilidad.
- `outline`: contorno que no ocupa espacio (a diferencia de `border`). `outline-offset` lo separa 2px del elemento.

```css
.skill-tag { background: var(--accent); color: white; padding: 4px 12px; border-radius: 30px; ... }
.skill-tag:hover { transform: translateY(-2px); background: var(--accent-hover); }
```

Etiqueta de color sólido que sube 2px al pasar el mouse. (Ver observaciones: no se usa en el HTML.)

```css
nav > ul { display: flex; gap: 2rem; list-style: none; }
```

- **Selector de hijo directo** `>`: solo los `<ul>` que son hijos inmediatos de `<nav>` (no nietos).
- `list-style: none`: quita las viñetas de la lista.

```css
.section-title { position: relative; display: inline-block; margin-bottom: 2rem; font-size: 2rem; }
.section-title::after { content: ''; position: absolute; bottom: -8px; left: 0; width: 60px; height: 4px; background: var(--accent); border-radius: 2px; }
```

Subrayado decorativo bajo cada título:

- `position: relative` en el título lo vuelve la **referencia** del pseudo-elemento.
- `display: inline-block` hace que el título ocupe solo el ancho de su texto.
- `::after` con `content: ''` crea una barra vacía; `position: absolute` + `bottom: -8px` + `left: 0` la coloca 8px debajo, a la izquierda, con 60×4px.

### 4.4 Header y navegación

| Regla | Propiedad | Qué hace |
|---|---|---|
| `header` | `backdrop-filter: blur(8px)` | Desenfoca lo que queda detrás del header (efecto vidrio; se nota solo con fondo semitransparente). |
| `header` | `border-bottom: 1px solid ...` | Línea inferior. |
| `header` | `position: sticky; top: 0` | El header se queda pegado arriba al hacer scroll. |
| `header` | `z-index: 100` | Lo coloca por encima del resto del contenido. |
| `.navbar` | `display: flex` | Logo, menú y botón en una fila. |
| `.navbar` | `justify-content: space-between` | Reparte el espacio: logo a la izquierda, botón a la derecha y menú en medio. |
| `.navbar` | `align-items: center` | Centrado vertical. |
| `.navbar` | `flex-wrap: wrap; gap: 1rem` | Permite saltar de línea y deja 16px de espacio entre elementos. |
| `.logo` | `font-size: 1.5rem; font-weight: 700` | Tamaño 24px y negrita. |
| `.logo` | `background: linear-gradient(135deg, ...)` | Degradado diagonal índigo → violeta. |
| `.logo` | `background-clip: text` (+ `-webkit-`) | El fondo solo se ve dentro de las letras. |
| `.logo` | `color: transparent` | Texto transparente para que se vea el degradado. |
| `nav ul li a` | `text-decoration: none` | Quita el subrayado. |
| `nav ul li a` | `border-bottom: 2px solid transparent` | Reserva una línea invisible que se colorea en hover (así el texto no se mueve). |
| `nav ul li a:hover` | `color`, `border-bottom-color` | Al pasar el mouse, el texto y la línea se pintan del color de acento. |

**Botón de tema**

| Propiedad | Qué hace |
|---|---|
| `border-radius: 50px` | Forma de píldora/círculo. |
| `padding: 8px 12px` | Espacio interior. |
| `cursor: pointer` | Muestra la "manito" al pasar el mouse (indica que es clicable). |
| `:hover` → `transform: scale(1.05)` | Lo agranda un 5 %. |
| `:hover` → `background: var(--border)` | Oscurece un poco el fondo. |

### 4.5 Hero

| Regla | Propiedad | Qué hace |
|---|---|---|
| `.hero` | `padding: 5rem 0 4rem` | Tres valores: 80px arriba, 0 a los lados, 64px abajo. |
| `.hero` | `text-align: center` | Centra el texto. |
| `.hero-content` | `display: flex; flex-direction: column` | Flexbox en **columna**: título, párrafo y botón uno debajo de otro. |
| `.hero-content` | `align-items: center` | En columna, `align-items` centra **horizontalmente**. |
| `.hero-content` | `gap: 1.5rem` | 24px entre elementos. |
| `.hero h1` | `font-size: 3rem` + degradado + `background-clip: text` | Título grande con texto en degradado (igual técnica que el logo). |
| `.hero p` | `max-width: 600px` | Limita el ancho del párrafo para que sea fácil de leer. |
| `.btn` | `display: inline-block` | Permite darle padding vertical al enlace. |
| `.btn` | `padding: 12px 28px; border-radius: 40px` | Botón con forma de píldora. |
| `.btn` | `border: none; cursor: pointer` | Sin borde y con manito. |
| `.btn:hover` | `transform: translateY(-3px)` | Sube 3px. |
| `.btn:hover` | `box-shadow: 0 10px 20px -5px rgba(99,102,241,0.4)` | Sombra de color índigo que da efecto de "flotar". |

### 4.6 Proyectos

| Regla | Propiedad | Qué hace |
|---|---|---|
| `.projects-grid` | `display: flex; flex-wrap: wrap` | Las tarjetas se ponen en fila y bajan de línea si no caben. |
| `.projects-grid` | `gap: 2rem; justify-content: center` | 32px entre tarjetas, centradas. |
| `.project-card` | `border-radius: 20px; overflow: hidden` | Esquinas redondeadas; `overflow: hidden` recorta la imagen para que respete esas esquinas. |
| `.project-card` | `box-shadow: var(--card-shadow)` | Sombra suave. |
| `.project-card` | `flex: 1 1 300px` | `flex-grow: 1` (puede crecer), `flex-shrink: 1` (puede encoger), `flex-basis: 300px` (tamaño base). |
| `.project-card` | `max-width: 350px` | No crece más de 350px. |
| `.project-card:hover` | `transform: translateY(-8px)` + sombra más fuerte | La tarjeta se eleva al pasar el mouse. |
| `.project-img` | `height: 180px` | Alto fijo del área de imagen. |
| `.project-img` | `display: flex; align-items: center; justify-content: center` | Centra el emoji en ambos ejes. |
| `.project-img` | `font-size: 3rem` | Emoji grande. |
| `.project-info` | `padding: 1.5rem` | Relleno interior del texto. |
| `.project-info p` | `color: var(--text-secondary); font-size: 0.95rem` | Descripción en gris y algo más pequeña. |
| `.tech-badge` | `display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem` | Etiquetas tipo píldora pequeñas. |
| `.tech-badge` | `margin-right / margin-bottom: 0.5rem` | Separación entre etiquetas y entre filas. |

> Aquí está la diferencia clave con `sesion1/index.html`: el **contenedor** (`.projects-grid`) tiene `display: flex`, y cada **tarjeta** (`.project-card`) tiene `flex: 1 1 300px`. La propiedad `flex` solo funciona en los **hijos** de un contenedor flex.

### 4.7 Habilidades

| Regla | Propiedad | Qué hace |
|---|---|---|
| `.skills-container` | `display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center` | Píldoras en fila, centradas y con salto de línea. |
| `.skill-item` | `border-radius: 50px; padding: 0.75rem 1.5rem` | Forma de píldora. |
| `.skill-item` | `cursor: default` | Flecha normal (no es clicable). |
| `.skill-item:hover` | `transform: scale(1.05)` | Se agranda un 5 %. |
| `.skill-item:hover` | `border-color; color` | Borde y texto en color de acento. |

### 4.8 Formulario de contacto

| Regla | Propiedad | Qué hace |
|---|---|---|
| `.contact-form` | `max-width: 600px; margin: 2rem auto` | Caja de máximo 600px centrada. |
| `.contact-form` | `padding: 2rem; border-radius: 24px; border` | Tarjeta con relleno, esquinas y borde. |
| `.form-group` | `margin-bottom: 1.5rem` | Separa cada campo. |
| `label` | `display: block` | La etiqueta ocupa su propia línea, encima del campo. |
| `input, textarea` | `width: 100%` | Ocupan todo el ancho disponible. |
| `input, textarea` | `padding: 12px 16px; border-radius: 12px` | Campos cómodos y redondeados. |
| `input, textarea` | `font-family: inherit` | Usan la misma fuente que la página (por defecto los campos usan otra). |
| `input:focus, textarea:focus` | `outline: none` | Quita el contorno por defecto… |
| `input:focus, textarea:focus` | `border-color` + `box-shadow: 0 0 0 3px rgba(...)` | …y lo reemplaza por un borde de acento y un "halo" de 3px (sombra sin desplazamiento ni desenfoque). |
| `input:valid:not(:placeholder-shown)` | `border-color: #10b981` | Borde verde cuando el campo es **válido** y el usuario **ya escribió algo** (`:placeholder-shown` es verdadero mientras el campo está vacío; `:not()` lo invierte). |
| `.btn-submit` | `width: 100%; border-radius: 40px; cursor: pointer` | Botón ancho tipo píldora. |
| `.btn-submit:hover` | `background: var(--accent-hover)` | Color más oscuro al pasar el mouse. |

### 4.9 Footer

| Regla | Propiedad | Qué hace |
|---|---|---|
| `footer` | `border-top; padding: 2rem 0; margin-top: 4rem` | Línea superior, relleno y separación del contenido. |
| `footer` | `text-align: center; color` | Texto centrado y gris. |
| `.social-links` | `display: flex; justify-content: center; gap: 1.5rem` | Enlaces sociales en fila, centrados. |
| `.social-links a:hover` | `color; transform: translateY(-3px)` | Cambian de color y suben 3px. |

### 4.10 Responsive y animación

```css
@media (max-width: 768px) {
  .navbar { flex-direction: column; text-align: center; }
  nav ul { justify-content: center; gap: 1rem; }
  .hero h1 { font-size: 2.2rem; }
  .section-title { font-size: 1.8rem; }
  .container { padding: 0 20px; }
}
```

- `@media (max-width: 768px)`: estas reglas solo se aplican en pantallas de **768px o menos** (tablets y celulares).
- El navbar pasa a **columna** (logo, menú y botón apilados), se reducen los tamaños de título y el padding lateral.

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
section { animation: fadeUp 0.6s ease-out; }
```

- `@keyframes fadeUp`: define una animación que va de invisible y 20px más abajo a visible y en su sitio.
- `animation: fadeUp 0.6s ease-out`: cada `<section>` aparece "subiendo" en 0.6 s al cargar la página. `ease-out` = empieza rápido y termina suave.
- `opacity`: transparencia (0 = invisible, 1 = opaco).

---

## 5. El JavaScript (botón de tema)

```js
(function() {
  const toggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  ...
})();
```

| Parte | Qué hace |
|---|---|
| `(function() { ... })();` | **IIFE** (función que se ejecuta inmediatamente). Evita que las variables queden globales. |
| `document.getElementById('themeToggle')` | Obtiene el botón por su `id`. |
| `document.documentElement` | El elemento `<html>` (el mismo que `:root` en CSS). |
| `root.style.setProperty('--bg-primary', '#0f172a')` | Cambia el valor de una variable CSS desde JS. Como todo usa `var(...)`, la página entera cambia de color. |
| `root.style.removeProperty('--bg-primary')` | Borra el valor puesto por JS y la variable vuelve a su valor del CSS (y, por tanto, al modo automático). |
| `let currentTheme = 'auto'` | Guarda el estado actual: `auto`, `light` o `dark`. |
| `toggleBtn.addEventListener('click', () => { ... })` | Ejecuta la función cada vez que se hace clic en el botón. |
| `window.matchMedia('(prefers-color-scheme: dark)').matches` | Devuelve `true` si el sistema está en modo oscuro (la misma condición del `@media` del CSS). |
| `toggleBtn.textContent = '🌙'` | Cambia el emoji del botón según el tema. |

**Ciclo del botón**:

- Si el sistema está en **claro**: `auto (claro)` → `oscuro` → `auto (claro)` …
- Si el sistema está en **oscuro**: `auto (oscuro)` → `claro` → `oscuro` → `auto (oscuro)` …

---

