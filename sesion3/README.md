# Sesión 3 — Estructuras de control en JavaScript

Guía paso a paso para agregar **estructuras de control** a `js/app.js`, usando los datos que ya existen en el portafolio (`localProjects`, `devProfile`, `allTechs`, `currentFilter`, `updatedProfile`).

```
sesion3/
├── index.html        ← carga js/app.js como módulo
├── css/
│   └── styles.css
└── js/
    ├── app.js        ← aquí agregarás los ejemplos
    └── utils.js
```

**Cómo probar cada paso:** abre `index.html` con Live Server (los módulos `type="module"` no funcionan con doble clic, es decir con `file://`) y mira la **consola** del navegador (F12 → Console).

> Trabaja siempre **al final** de `app.js`, debajo del arreglo `localProjects`. Después de cada paso, guarda el archivo y revisa la consola antes de seguir con el siguiente.

---

## Paso 0 — Antes de empezar: corrige un dato

En `localProjects`, el proyecto 1 tiene la categoría mal escrita:

```js
category: 'fronend',
```

Cámbiala a:

```js
category: 'frontend',
```

Si no la corriges, los pasos 3 y 10 no van a reconocer ese proyecto como frontend.

---

## Paso 1 — Título de la sección

Al final del archivo agrega un comentario que marque dónde empiezan los ejemplos:

```js
// ==========================================================
// ESTRUCTURAS DE CONTROL
// ==========================================================
```

---

## Paso 2 — `if / else if / else`

Sirve para **tomar decisiones** según una condición.

```js
// --- if / else if / else ---
const totalProjects = localProjects.length;

if (totalProjects === 0) {
    console.log('Aún no hay proyectos');
} else if (totalProjects < 5) {
    console.log(`Tienes ${totalProjects} proyectos, ¡sigue sumando!`);
} else {
    console.log(`Portafolio completo con ${totalProjects} proyectos`);
}
```

**Resultado esperado:** `Portafolio completo con 5 proyectos`

🧪 **Prueba:** comenta uno o dos proyectos de `localProjects` y fíjate cómo cambia el mensaje.

---

## Paso 3 — Operador ternario `? :`

Es un `if/else` **en una sola línea**. Se usa cuando quieres elegir entre dos valores.

```js
// --- Operador ternario ---
const disponibleTxt = updatedProfile.disponible ? 'Disponible para trabajar' : 'No disponible';
console.log(disponibleTxt);
```

**Resultado esperado:** `Disponible para trabajar`

🧪 **Prueba:** cambia `disponible: true` por `false` en `updatedProfile`.

---

## Paso 4 — `switch`

Compara **un valor** contra varios casos posibles. `default` se ejecuta si ningún caso coincide.

```js
// --- switch ---
const getCategoryLabel = (category) => {
    switch (category) {
        case 'frontend':
            return '🎨 Frontend';
        case 'backend':
            return '⚙️ Backend';
        case 'fullstack':
            return '🚀 Full Stack';
        default:
            return '❓ Sin categoría';
    }
};
console.log(getCategoryLabel('backend'));   // '⚙️ Backend'
console.log(getCategoryLabel('mobile'));    // '❓ Sin categoría'
```

> Dentro de una función, `return` ya sale del `switch`. Si **no** usas `return`, cada `case` tiene que terminar con `break;`. Si lo olvidas, el código sigue ejecutando los casos siguientes.

---

## Paso 5 — `for` clásico

Úsalo cuando necesitas el **índice** (`i`).

```js
// --- for clásico ---
for (let i = 0; i < localProjects.length; i++) {
    console.log(`${i + 1}. ${localProjects[i].title}`);
}
```

**Resultado esperado:** la lista numerada del 1 al 5 con los títulos.

---

## Paso 6 — `for...of`

Recorre los **valores** de un array y es más legible que el `for` clásico.

```js
// --- for...of ---
for (const tech of allTechs) {
    console.log('Tecnología:', tech);
}
```

---

## Paso 7 — `for...in`

Recorre las **claves (propiedades)** de un objeto.

```js
// --- for...in ---
for (const key in devProfile) {
    console.log(`${key}: ${devProfile[key]}`);
}
```

**Resultado esperado:** `full_name: Hebert Cussi`, `role: ...`, `location: ...`, `skills: ...`

> Regla práctica: usa **`for...of` para arrays** y **`for...in` para objetos**.

---

## Paso 8 — `while` y `do...while`

`while` repite **mientras** la condición se cumpla. `do...while` se ejecuta **al menos una vez**, porque revisa la condición al final.

```js
// --- while ---
let intentos = 0;
while (intentos < 3) {
    console.log(`Intento de conexión #${intentos + 1}`);
    intentos++;
}

// --- do...while ---
let pagina = 0;
do {
    console.log(`Cargando página ${pagina}`);
    pagina++;
} while (pagina < 2);
```

> ⚠️ Si olvidas `intentos++`, el ciclo **nunca termina** y el navegador se congela.

---

## Paso 9 — `break` y `continue`

- `continue` → **salta** a la siguiente vuelta del ciclo.
- `break` → **detiene** el ciclo por completo.

```js
// --- break y continue ---
for (const project of localProjects) {
    if (project.category === 'backend') continue;     // salta los backend
    if (project.title === 'GeoWeather App') break;    // detiene el ciclo
    console.log('Proyecto (sin backend):', project.title);
}
```

**Resultado esperado:** App de Tareas, EcoShop y Dashboard Analytics. No aparecen ni el proyecto backend ni GeoWeather.

---

## Paso 10 — Métodos de array (la alternativa moderna a los ciclos)

| Método | Para qué sirve |
|---|---|
| `filter` | Devuelve un nuevo array solo con los elementos que cumplen la condición |
| `map` | Transforma cada elemento y devuelve un nuevo array |
| `forEach` | Recorre el array (no devuelve nada) |
| `some` | `true` si **al menos uno** cumple la condición |

```js
// --- Métodos de array ---
const filterProjects = (filter) =>
    filter === 'all'
        ? localProjects
        : localProjects.filter(p => p.category === filter);

console.log('Filtro actual:', currentFilter, filterProjects(currentFilter).length);
console.log('Fullstack:', filterProjects('fullstack').map(p => p.title));

localProjects.forEach((p, index) => {
    console.log(`#${index} → ${getCategoryLabel(p.category)} – ${p.title}`);
});

const usaReact = localProjects.some(p => p.techs.includes('React'));
console.log('¿Algún proyecto usa React?', usaReact);
```

> `filterProjects` es la base de los **botones de filtro** del portafolio: más adelante solo hay que llamarla con la categoría del botón que se presionó.

---

## Paso 11 — `try / catch / finally`

Sirve para **controlar errores** sin que el programa se detenga.

```js
// --- try / catch / finally ---
const parseJSON = (texto) => {
    try {
        return JSON.parse(texto);
    } catch (error) {
        console.error('JSON inválido:', error.message);
        return null;
    } finally {
        console.log('Intento de parseo terminado');
    }
};
console.log(parseJSON('{"ok": true}'));
console.log(parseJSON('esto no es JSON'));
```

**Resultado esperado:** la primera llamada devuelve `{ ok: true }` y la segunda muestra el error y devuelve `null`. En los dos casos se ejecuta el `finally`.

> Esto lo vas a usar mucho con `fetch` y las APIs (`API_BASE`, `POKE_API`).

---

## Resumen

| Estructura | Úsala cuando… |
|---|---|
| `if / else` | Hay que decidir entre caminos según una condición |
| Ternario `? :` | Hay que elegir entre **dos valores** en una línea |
| `switch` | Un mismo valor se compara contra muchos casos |
| `for` | Necesitas el índice o un número exacto de repeticiones |
| `for...of` | Recorres los valores de un array |
| `for...in` | Recorres las claves de un objeto |
| `while` / `do...while` | No sabes cuántas veces se va a repetir |
| `break` / `continue` | Quieres cortar o saltar vueltas de un ciclo |
| `filter` / `map` / `forEach` / `some` | Trabajas con arrays de forma declarativa |
| `try / catch / finally` | Algo puede fallar (parseo, red, APIs) |

## Ejercicios propuestos

1. Con un `if`, muestra en consola **"Proyecto destacado"** si un proyecto tiene más de 2 tecnologías.
2. Agrega el caso `'mobile'` al `switch` con el emoji 📱.
3. Con `for...of`, cuenta cuántos proyectos hay de cada categoría.
4. Con `filter` + `map`, obtén los títulos de los proyectos que usan `'React'`.
5. Con `while`, simula `pokemonPage` avanzando de 0 a 3.
