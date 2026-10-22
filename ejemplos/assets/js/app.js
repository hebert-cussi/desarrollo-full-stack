// ============================================================
//  app.js  –  Portafolio Hebert Cussi
//  Sesión 3: JavaScript Esencial (ES6+, DOM, Eventos, Storage)
//  Sesión 4: JavaScript Asíncrono y APIs (Fetch, Promesas, async/await)
// ============================================================


// ============================================================
// SESIÓN 3 – BLOQUE A: VARIABLES let & const
// ============================================================
const SITE_AUTHOR   = 'Hebert Cussi';          // const: valor fijo
const API_BASE      = 'https://jsonplaceholder.typicode.com';
const POKE_API      = 'https://pokeapi.co/api/v2';
const COUNTRIES_API = 'https://countries.dev';    // gratis y sin API key

let currentFilter  = 'all';   // let: cambia según filtro activo
let pokemonPage    = 0;
let projectsData   = [];      // se llenará desde la API


// ============================================================
// SESIÓN 3 – BLOQUE B: MÓDULOS ES6
//   → En este ejemplo app.js se carga como script clásico (<script src>),
//     sin import/export, para que funcione incluso abriendo el HTML con doble clic.
//   → En la carpeta sesion3/ se carga con type="module": ahí sí se puede
//     usar import/export, pero necesita Live Server.
// ============================================================



// ============================================================
// SESIÓN 3 – BLOQUE C: ARROW FUNCTIONS + TEMPLATE LITERALS
// ============================================================

/** Saludo dinámico en la consola usando template literals */
const greet = (name) => `¡Hola desde el portafolio de ${name}! 🚀`;
console.log(greet(SITE_AUTHOR));

/** Formatea precio con template literal */
const formatPrice = (amount) => `$${Number(amount).toLocaleString('es-BO')}`;

/** Escapa caracteres especiales antes de insertar texto externo con innerHTML */
const escapeHTML = (text) =>
  String(text).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);


// ============================================================
// SESIÓN 3 – BLOQUE D: DESTRUCTURING + SPREAD & REST
// ============================================================

// Destructuring de objeto
const devProfile = {
  name:     'Hebert Cussi',
  role:     'Full Stack Developer',
  location: 'La Paz, Bolivia',
  skills:   ['JavaScript', 'React', 'Node.js', 'Python'],
};

const { name, role, skills } = devProfile;            // object destructuring
const [mainSkill, ...otherSkills] = skills;            // array destructuring + rest

console.log(`${name} – ${role}`);
console.log('Skill principal:', mainSkill);            // 'JavaScript'
console.log('Otras skills:', otherSkills);             // ['React', 'Node.js', 'Python']

// Spread: combinar arrays de tecnologías
const frontEnd  = ['React', 'Angular', 'TypeScript'];
const backEnd   = ['Node.js', 'Express', 'Django'];
const allTechs  = [...frontEnd, ...backEnd];           // spread operator
console.log('Stack completo:', allTechs);

// Spread: clonar y extender un objeto sin mutarlo
const updatedProfile = { ...devProfile, available: true };
console.log('Perfil actualizado:', updatedProfile);


// ============================================================
// SESIÓN 3 – BLOQUE E: CLASES ES6 + OBJETOS
// ============================================================

class Project {
  #id;                                      // campo privado ES2022

  constructor({ id, title, description, techs, emoji, category }) {
    this.#id         = id;
    this.title       = title;
    this.description = description;
    this.techs       = techs;
    this.emoji       = emoji;
    this.category    = category;
  }

  get id() { return this.#id; }

  // Template literal en método
  toHTML() {
    const badges = this.techs
      .map(t => `<span class="tech-badge">${escapeHTML(t)}</span>`)
      .join('');

    // escapeHTML: title y description pueden venir de una API
    return `
      <article class="project-card" data-id="${this.#id}" data-category="${this.category}">
        <div class="project-img" aria-hidden="true">${this.emoji}</div>
        <div class="project-info">
          <h3>${escapeHTML(this.title)}</h3>
          <p>${escapeHTML(this.description)}</p>
          <footer class="project-tags">${badges}</footer>
        </div>
      </article>`;
  }
}

// Datos de proyectos con objetos literales
const localProjects = [
  new Project({
    id: 1, category: 'frontend', emoji: '📱',
    title: 'App de Tareas',
    description: 'Aplicación web con drag & drop, almacenamiento local y modo oscuro.',
    techs: ['React', 'CSS Modules', 'Flexbox'],
  }),
  new Project({
    id: 2, category: 'frontend', emoji: '🌿',
    title: 'EcoShop',
    description: 'E-commerce sostenible con sistema de filtros y carrito de compras.',
    techs: ['HTML5', 'CSS Grid', 'JavaScript'],
  }),
  new Project({
    id: 3, category: 'fullstack', emoji: '📊',
    title: 'Dashboard Analytics',
    description: 'Panel con gráficas en tiempo real, filtros dinámicos y exportación.',
    techs: ['Node.js', 'PostgreSQL', 'Chart.js'],
  }),
  new Project({
    id: 4, category: 'backend', emoji: '🔧',
    title: 'REST API – Inventario',
    description: 'API REST completa con autenticación JWT y documentación Swagger.',
    techs: ['Express', 'MySQL', 'JWT'],
  }),
  new Project({
    id: 5, category: 'fullstack', emoji: '🌍',
    title: 'GeoWeather App',
    description: 'Consulta clima en tiempo real usando la API de OpenWeather y países.',
    techs: ['React', 'Fetch API', 'OpenWeather'],
  }),
];


// ============================================================
// SESIÓN 3 – BLOQUE F: MÉTODOS DE ARRAY
// ============================================================

/** Proyectos locales + los de la API (si ya se cargaron) */
const getAllProjects = () => (projectsData.length ? projectsData : localProjects);

/** Filtra proyectos por categoría */
const filterProjects = (category) =>
  category === 'all'
    ? getAllProjects()
    : getAllProjects().filter(p => p.category === category); // .filter()

/** Extrae solo los títulos */
const getTitles = () => localProjects.map(p => p.title);    // .map()

/** Cuenta proyectos por categoría */
const countByCategory = localProjects.reduce((acc, p) => {  // .reduce()
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});

/** Busca proyecto por ID */
const findProject = (id) => localProjects.find(p => p.id === id);  // .find()

console.log('Títulos:', getTitles());
console.log('Por categoría:', countByCategory);


// ============================================================
// SESIÓN 3 – BLOQUE G: SELECCIÓN DOM + MANIPULACIÓN
// ============================================================

/** querySelector / querySelectorAll */
const projectsGrid   = document.querySelector('.projects-grid');
const filterButtons  = document.querySelectorAll('.filter-btn');
const themeToggle    = document.getElementById('theme-toggle');
const pokeSection    = document.getElementById('poke-section');
const pokeGrid       = document.getElementById('poke-grid');
const pokeBtnNext    = document.getElementById('poke-next');
const countryInput   = document.getElementById('country-search');
const countryResult  = document.getElementById('country-result');
const contactForm    = document.querySelector('#contacto form');
const toastEl        = document.getElementById('toast');


// ============================================================
// SESIÓN 3 – BLOQUE H: RENDERIZADO DOM
// ============================================================

/** Renderiza los proyectos en el DOM */
function renderProjects(category = 'all') {
  if (!projectsGrid) return;

  const filtered = filterProjects(category);

  // innerHTML: reconstruye el grid con template literals
  projectsGrid.innerHTML = filtered
    .map(p => p.toHTML())
    .join('');

  // classList: activa estado de los filtros
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });

  // Actualizar contador en el DOM usando textContent
  const counter = document.getElementById('project-count');
  if (counter) counter.textContent = `${filtered.length} proyectos`;
}

// Renderizado inicial
renderProjects('all');


// ============================================================
// SESIÓN 3 – BLOQUE I: EVENTOS
// ============================================================

/** Un listener por cada botón de filtro */
filterButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    currentFilter = e.currentTarget.dataset.filter;
    renderProjects(currentFilter);
  });
});

/** Evento: tema oscuro / claro con classList.toggle */
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    // setAttribute para cambiar el ícono del botón
    themeToggle.setAttribute('aria-label', isDark ? 'Modo claro' : 'Modo oscuro');
    themeToggle.textContent = isDark ? '☀️' : '🌙';

    // Guardar preferencia en Local Storage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

/** Scroll suave con evento global */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();                               // preventDefault
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});


// ============================================================
// SESIÓN 3 – BLOQUE J: LOCAL STORAGE
// ============================================================

/** Guarda y recupera el tema desde localStorage */
function initTheme() {
  const saved = localStorage.getItem('theme');       // getItem
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) {
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-label', 'Modo claro');
    }
  }
}
initTheme();

/** Guarda el último mensaje del formulario */
function saveFormDraft(data) {
  localStorage.setItem('form-draft', JSON.stringify(data));  // stringify
}

function loadFormDraft() {
  const raw = localStorage.getItem('form-draft');
  return raw ? JSON.parse(raw) : null;               // parse
}


// ============================================================
// SESIÓN 4 – BLOQUE A: PROMESAS (Promise)
// ============================================================

/**
 * Simula una validación asíncrona con Promise
 * Estado: pending → fulfilled / rejected
 */
function validateEmail(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (valid) resolve({ ok: true, email });
      else reject(new Error(`Email inválido: ${email}`));
    }, 500);
  });
}

// .then() y .catch()
validateEmail('hebert@ejemplo.com')
  .then(({ email }) => console.log(`✅ Email válido: ${email}`))
  .catch(err => console.error('❌', err.message));


// ============================================================
// SESIÓN 4 – BLOQUE B: async / await + try / catch / finally
// ============================================================

/**
 * Wrapper genérico para fetch con manejo de errores
 * Usamos async/await en lugar de .then() encadenado
 */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
  return await res.json();              // res.json() devuelve una Promesa
}


// ============================================================
// SESIÓN 4 – BLOQUE C: FETCH GET – JSONPlaceholder
//   API Pública: https://jsonplaceholder.typicode.com
// ============================================================

async function fetchProjects() {
  const loader = document.getElementById('projects-loader');
  if (loader) loader.classList.remove('hidden');

  try {
    // Fetch GET: obtiene posts como "proyectos de ejemplo"
    const posts = await fetchJSON(`${API_BASE}/posts?_limit=3`);

    // Destructuring en el map + template literal
    const extra = posts.map(({ id, title, body }) => new Project({
      id: id + 100,
      category: 'api',
      emoji: '🌐',
      title: title.slice(0, 40) + '…',
      description: body.slice(0, 100) + '…',
      techs: ['Fetch API', 'JSONPlaceholder', 'REST'],
    }));

    // Spread: combinar proyectos locales + los de la API
    projectsData = [...localProjects, ...extra];

    // Volver a pintar respetando el filtro que esté activo
    renderProjects(currentFilter);
    showToast('Proyectos de API cargados ✅');

  } catch (err) {
    console.error('Error al cargar proyectos:', err);
    
  } finally {
    // finally: se ejecuta SIEMPRE, haya error o no
    if (loader) loader.classList.add('hidden');
  }
}


// ============================================================
// SESIÓN 4 – BLOQUE D: FETCH GET – PokeAPI
//   API Pública: https://pokeapi.co
// ============================================================

async function fetchPokemons(offset = 0) {
  if (!pokeGrid) return;

  pokeGrid.innerHTML = '<p class="loading-text">Cargando Pokémon...</p>';

  try {
    // Fetch GET con parámetros en la URL
    const data = await fetchJSON(`${POKE_API}/pokemon?limit=6&offset=${offset}`);

    // Promise.all: carga los detalles de los 6 pokémon EN PARALELO
    const details = await Promise.all(
      data.results.map(p => fetchJSON(p.url))       // map() + Promise.all
    );

    // Manipulación DOM: construir tarjetas con innerHTML
    pokeGrid.innerHTML = details.map(({ name, id, sprites, types }) => {
      const type = types[0].type.name;
      const img  = sprites.other['official-artwork'].front_default
                || sprites.front_default;
      return `
        <div class="poke-card poke--${escapeHTML(type)}">
          <img src="${escapeHTML(img)}" alt="${escapeHTML(name)}" loading="lazy" />
          <p class="poke-name">${escapeHTML(name)}</p>
          <span class="poke-type">${escapeHTML(type)}</span>
        </div>`;
    }).join('');

  } catch (err) {
    pokeGrid.innerHTML = `<p class="error-text">Error: ${escapeHTML(err.message)}</p>`;
  }
}

// Evento: cargar más pokémon
if (pokeBtnNext) {
  pokeBtnNext.addEventListener('click', () => {
    pokemonPage += 6;
    fetchPokemons(pokemonPage);
  });
}


// ============================================================
// SESIÓN 4 – BLOQUE E: FETCH GET – countries.dev
//   API Pública: https://countries.dev (sin API key)
// ============================================================

/** Busca información de un país por nombre */
async function fetchCountry(query) {
  if (!countryResult || !query.trim()) return;
  countryResult.innerHTML = '<p class="loading-text">Buscando...</p>';

  try {
    const [country] = await fetchJSON(
      `${COUNTRIES_API}/name/${encodeURIComponent(query)}?fields=name,capital,population,flags,region`
    );

    // Destructuring del objeto country
    const {
      name,
      capital = 'N/A',
      population,
      flags: { svg: flag },
      region,
    } = country;

    // Template literal para construir el HTML
    countryResult.innerHTML = `
      <div class="country-card">
        <img src="${escapeHTML(flag)}" alt="Bandera de ${escapeHTML(name)}" class="country-flag" />
        <div class="country-info">
          <h4>${escapeHTML(name)}</h4>
          <p>🏛 Capital: <strong>${escapeHTML(capital)}</strong></p>
          <p>🌍 Región: <strong>${escapeHTML(region)}</strong></p>
          <p>👥 Población: <strong>${population.toLocaleString()}</strong></p>
        </div>
      </div>`;

  } catch (err) {
    countryResult.innerHTML = `<p class="error-text">País no encontrado.</p>`;
  }
}

// Evento: buscar país al escribir (debounce simple)
let searchTimer;
if (countryInput) {
  countryInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => fetchCountry(e.target.value), 600);
  });
}


// ============================================================
// SESIÓN 4 – BLOQUE F: FETCH POST – JSONPlaceholder
//   Envío del formulario de contacto
// ============================================================

async function initContactForm() {
  if (!contactForm) return;

  // Cargar borrador guardado en localStorage (todos los campos)
  const draft = loadFormDraft();
  if (draft) {
    Object.entries(draft).forEach(([fieldName, value]) => {
      const field = contactForm.elements[fieldName];   // busca el campo por su name
      if (field) field.value = value;
    });

    // Avisar al slider para que actualice el texto "$..." del presupuesto
    const range = contactForm.elements.presupuesto;
    if (range) range.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Guardar borrador mientras se escribe
  contactForm.addEventListener('input', () => {
    const formData = new FormData(contactForm);
    saveFormDraft(Object.fromEntries(formData));
  });

  // Envío del formulario con Fetch POST
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();                                   // evita recarga

    const btnSubmit = contactForm.querySelector('.btn-submit');
    btnSubmit.textContent = 'Enviando...';
    btnSubmit.disabled = true;

    // Destructuring de FormData
    const { nombre, email, mensaje } = Object.fromEntries(
      new FormData(contactForm)
    );

    try {
      // Validar email con Promesa
      await validateEmail(email);

      // Fetch POST: envía los datos como JSON
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, mensaje, title: nombre, body: mensaje }),
      });

      if (!res.ok) throw new Error('No se pudo enviar el mensaje');

      const data = await res.json();   // JSON.parse automático

      // Limpiar borrador del localStorage tras envío exitoso
      localStorage.removeItem('form-draft');

      contactForm.reset();
      showToast(`✅ Mensaje enviado, ${nombre}! (ID: ${data.id})`);

    } catch (err) {
      showToast(`❌ ${err.message}`, 'error');
    } finally {
      btnSubmit.textContent = 'Enviar mensaje →';
      btnSubmit.disabled = false;
    }
  });
}


// ============================================================
// SESIÓN 4 – BLOQUE G: Promise.all – carga paralela de APIs
// ============================================================

/**
 * Carga datos del hero desde múltiples APIs en paralelo.
 * Promise.all espera que TODAS las promesas se resuelvan.
 */
async function loadDashboardData() {
  const statsEl = document.getElementById('hero-stats');
  if (!statsEl) return;

  try {
    // Promise.all: las 2 tareas corren al mismo tiempo
    const [, users] = await Promise.all([
      fetchProjects(),                       // promesa 1: llena projectsData
      fetchJSON(`${API_BASE}/users`),        // promesa 2: "clientes" de ejemplo
    ]);

    // Stats calculados con datos reales
    const projects   = getAllProjects();
    const techsCount = new Set(projects.flatMap(p => p.techs)).size;   // Set: sin repetidos
    const apisCount  = document.querySelectorAll('.api-table tbody tr').length;

    const stats = [
      { label: 'Proyectos',   value: projects.length },
      { label: 'Tecnologías', value: techsCount },
      { label: 'Clientes',    value: users.length },
      { label: 'APIs usadas', value: apisCount },
    ];

    statsEl.innerHTML = stats
      .map(({ label, value }) => `
        <div class="stat-item">
          <strong>${value}</strong>
          <span>${label}</span>
        </div>`)
      .join('');

    console.log('Dashboard cargado:', stats);

  } catch (err) {
    console.warn('Error cargando stats:', err.message);
  }
}


// ============================================================
// UTILIDAD: Toast de notificaciones (DOM + CSS classes)
// ============================================================

function showToast(msg, type = 'success') {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.className = `toast toast--${type} toast--show`;

  // Remover clase después de 3s con setTimeout (Event Loop)
  setTimeout(() => {
    toastEl.classList.remove('toast--show');
  }, 3000);
}


// ============================================================
// INICIALIZACIÓN: punto de entrada cuando carga el DOM
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  loadDashboardData();

  // Cargar Pokémon solo si la sección existe en el DOM
  if (pokeSection) fetchPokemons(0);

  console.log(`%c${greet(SITE_AUTHOR)}`, 'color: #6366f1; font-weight: bold;');
});
